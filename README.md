# AikiBudo

Site-ul Academiei de Arte Marțiale AikiBudo — Aikido, Ju-Jitsu, Self-Defence și
Combat MMA, în trei dojo-uri din București.

Site static: React + Vite, fără backend. Tot conținutul stă într-un singur
fișier JSON, servit ca orice alt fișier din build.

## Rulare locală

```bash
./install.sh
```

Instalează dependențele dacă lipsesc și pornește serverul pe http://localhost:5173.

| Comandă | Ce face |
|---|---|
| `./install.sh` | instalează ce lipsește și pornește serverul de dezvoltare |
| `./install.sh --setup` | doar instalează |
| `./install.sh --build` | construiește versiunea de producție în `frontend/dist` |

## Cum modifici conținutul

Totul — texte, orar, prețuri, instructori, documente — se află în
**`frontend/public/content.json`**. Îl editezi, comiți, dai push. Vercel
republică automat în ~30 de secunde.

Structura fișierului:

| Cheie | Ce conține |
|---|---|
| `site` | nume, slogan, contact, date bancare, rețele sociale |
| `locations` | cele trei săli: adresă, coordonate hartă, descriere |
| `disciplines` | disciplinele, cu textul lung împărțit în secțiuni |
| `instructors` | instructori, grade, telefon, la ce săli predau |
| `schedule` | orarul: o intrare pe clasă, legată de sală și disciplină |
| `pricing` | abonamente per sală |
| `resources` | documente de descărcat și legături externe |

Orarul se leagă prin `id`-uri: fiecare intrare din `schedule` are un
`locationId` și un `disciplineId` care trebuie să existe în listele
corespunzătoare. Site-ul construiește singur, din aceste legături, orarul
fiecărei săli, orarul fiecărei discipline și lista de instructori care predau
efectiv acolo.

### Fișiere

- **Documente** (fișe de înscriere, programe de examinare) →
  `frontend/public/documente/aikido/` sau `.../ju-jitsu/`, apoi adaugi intrarea
  în `resources.documents` cu calea `/documente/...`
- **Poze de instructori** → `frontend/public/instructori/`, apoi pui calea pe
  instructor: `"photo": "/instructori/nume.jpg"`

Căile încep cu `/` și nu includ `public` — acel folder devine rădăcina site-ului.

## Publicare

Repo-ul e conectat la Vercel; `vercel.json` conține deja tot ce trebuie
(comandă de build, folder de ieșire, rescrierea rutelor React). Fiecare push
declanșează un deploy.

## Structura

```
frontend/
  public/          content.json, documente, poze — servite ca atare
  src/
    api/           citirea fișierului de conținut
    context/       conținutul încărcat o dată, disponibil în toate paginile
    features/      orar, săli, discipline, instructori, prețuri, resurse, hartă
    layout/        antet, meniu, subsol
    pages/         câte un fișier per pagină
    ui/            butoane, carduri, secțiuni — piesele comune
vercel.json        configurația de publicare
install.sh         instalare și pornire
```
