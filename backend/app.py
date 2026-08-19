"""AikiBudo API — serves the club's content as JSON to the React frontend."""

import json
from functools import lru_cache
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS

DATA_FILE = Path(__file__).parent / "data" / "content.json"


@lru_cache(maxsize=1)
def _read_content(_mtime):
    with DATA_FILE.open(encoding="utf-8") as fh:
        return json.load(fh)


def load_content():
    """Cached, but keyed on the file's mtime so edits are picked up on save."""
    return _read_content(DATA_FILE.stat().st_mtime_ns)


def find_by(collection, **criteria):
    for item in collection:
        if all(item.get(k) == v for k, v in criteria.items()):
            return item
    return None


def not_found(what):
    return jsonify({"error": "not_found", "message": f"{what} nu a fost găsit."}), 404


def create_app():
    app = Flask(__name__)
    app.json.ensure_ascii = False
    CORS(app)

    @app.get("/api/health")
    def health():
        content = load_content()
        return jsonify(
            {
                "status": "ok",
                "counts": {
                    key: len(content[key])
                    for key in ("locations", "disciplines", "instructors", "schedule")
                },
            }
        )

    @app.get("/api/site")
    def site():
        return jsonify(load_content()["site"])

    @app.get("/api/locations")
    def locations():
        return jsonify(load_content()["locations"])

    @app.get("/api/locations/<slug>")
    def location(slug):
        content = load_content()
        item = find_by(content["locations"], slug=slug)
        if item is None:
            return not_found("Locația")

        # Bundle everything a location page needs into a single response.
        enriched = dict(item)
        enriched["schedule"] = [
            entry for entry in content["schedule"] if entry["locationId"] == item["id"]
        ]
        enriched["pricing"] = find_by(content["pricing"], locationId=item["id"])
        enriched["instructors"] = [
            person
            for person in content["instructors"]
            if item["id"] in person["dojos"]
        ]
        return jsonify(enriched)

    @app.get("/api/disciplines")
    def disciplines():
        return jsonify(load_content()["disciplines"])

    @app.get("/api/disciplines/<slug>")
    def discipline(slug):
        content = load_content()
        item = find_by(content["disciplines"], slug=slug)
        if item is None:
            return not_found("Disciplina")

        enriched = dict(item)
        enriched["schedule"] = [
            entry for entry in content["schedule"] if entry["disciplineId"] == item["id"]
        ]
        enriched["instructors"] = [
            person
            for person in content["instructors"]
            if item["id"] in person["disciplines"]
        ]
        return jsonify(enriched)

    @app.get("/api/instructors")
    def instructors():
        content = load_content()
        people = content["instructors"]
        dojo = request.args.get("location")
        discipline_id = request.args.get("discipline")
        if dojo:
            people = [p for p in people if dojo in p["dojos"]]
        if discipline_id:
            people = [p for p in people if discipline_id in p["disciplines"]]
        return jsonify(people)

    @app.get("/api/instructors/<instructor_id>")
    def instructor(instructor_id):
        item = find_by(load_content()["instructors"], id=instructor_id)
        if item is None:
            return not_found("Instructorul")
        return jsonify(item)

    @app.get("/api/schedule")
    def schedule():
        content = load_content()
        entries = content["schedule"]

        location_id = request.args.get("location")
        discipline_id = request.args.get("discipline")
        instructor_id = request.args.get("instructor")
        day = request.args.get("day", type=int)

        if location_id:
            entries = [e for e in entries if e["locationId"] == location_id]
        if discipline_id:
            entries = [e for e in entries if e["disciplineId"] == discipline_id]
        if instructor_id:
            entries = [e for e in entries if e["instructorId"] == instructor_id]
        if day is not None:
            entries = [e for e in entries if e["day"] == day]

        entries = sorted(entries, key=lambda e: (e["day"], e["start"]))
        return jsonify({"days": content["days"], "entries": entries})

    @app.get("/api/pricing")
    def pricing():
        content = load_content()
        plans = content["pricing"]
        location_id = request.args.get("location")
        if location_id:
            plans = [p for p in plans if p["locationId"] == location_id]
        return jsonify({"pricing": plans, "discounts": content["discounts"]})

    @app.get("/api/resources")
    def resources():
        content = load_content()
        data = content["resources"]
        category = request.args.get("category")
        if category:
            data = {
                "documents": [d for d in data["documents"] if d["category"] == category],
                "links": [l for l in data["links"] if l["category"] == category],
                "affiliations": data["affiliations"],
            }
        return jsonify(data)

    @app.get("/api/bootstrap")
    def bootstrap():
        """Everything the SPA needs on first paint, in one round trip."""
        content = load_content()
        return jsonify(
            {
                key: content[key]
                for key in (
                    "site",
                    "locations",
                    "disciplines",
                    "instructors",
                    "days",
                    "schedule",
                    "pricing",
                    "discounts",
                    "resources",
                    "cta",
                )
            }
        )

    @app.errorhandler(404)
    def handle_404(_):
        return jsonify({"error": "not_found", "message": "Ruta nu există."}), 404

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
