# AikiBudo

Site-ul Academiei de Arte Marțiale AikiBudo — Aikido, Ju-Jutsu, Self-Defence,
Combat MMA și Kobudō, în trei dojo-uri din București.

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
| `./install.sh --build` | construiește versiunea de producție în `dist/` |

Echivalentul direct, dacă ai deja dependențele: `npm run dev`, `npm run build`,
`npm run lint`.

## Cum modifici conținutul

### Din browser, cu editorul

Cu serverul de dezvoltare pornit, deschide **http://localhost:5173/admin** — sau
apasă butonul „Editează" din colțul paginii. De acolo modifici textele, orarul,
ordinea secțiunilor de pe prima pagină, și încarci imagini. Salvarea scrie
direct în `public/content.json`.

Editorul există **doar în dezvoltare**. Nu ajunge în build și nu e accesibil pe
site-ul publicat: ruta e eliminată la compilare, iar endpoint-ul care scrie
fișierul trăiește în serverul Vite. Ca să publici modificările, tot un commit și
un push îți trebuie.

Dacă lași editorul deschis într-un tab și fișierul se schimbă între timp — alt
tab, un script, o schimbare de ramură — salvarea e refuzată, ca să nu suprascrie
în tăcere versiunea mai nouă. Butonul „Reîncarcă" din bară aduce versiunea
curentă.

### Direct în fișier

Totul se află în **`public/content.json`**.

| Cheie | Ce conține |
|---|---|
| `site` | nume, slogan, hero, contact, date bancare, rețele sociale |
| `home` | ordinea secțiunilor de pe prima pagină, cu titlurile lor |
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

Textul din JSON e **text simplu, nu HTML**: un `<br>` scris acolo se afișează ca
atare. Pentru rând nou folosește `\n`. Pentru paragrafe separate există deja
liste de șiruri (`sections[].body`, `site.mission`), câte un paragraf per element.

### Fișiere

- **Documente** (fișe de înscriere, programe de examinare) →
  `public/documente/aikido/` sau `.../ju-jitsu/`, apoi adaugi intrarea în
  `resources.documents` cu calea `/documente/...`
- **Poze de instructori** → `public/instructori/`, apoi pui calea pe instructor:
  `"photo": "/instructori/nume.jpg"`
- **Imagini încărcate din editor** → ajung singure în `public/imagini/`

Căile încep cu `/` și nu includ `public` — acel folder devine rădăcina site-ului.
Fișierele noi trebuie adăugate la commit (`git add`), altfel calea ajunge pe site
fără imaginea din spate.

## Publicare

Repo-ul e conectat la Vercel. Fiecare push pe `main` declanșează un deploy.

`vercel.json` declară doar ce nu se poate deduce: rescrierea rutelor către
`index.html`, ca React Router să primească toate adresele, și antetele de cache —
asset-urile au hash în nume și pot fi cache-uite pe termen lung, `content.json`
nu. Comanda de build și folderul de ieșire vin din `framework: "vite"`.

## Structura

```
public/          content.json, documente, poze — servite ca atare
src/
  admin/         editorul de conținut (doar în dezvoltare)
  api/           citirea fișierului de conținut
  context/       conținutul încărcat o dată, disponibil în toate paginile
  features/      orar, săli, discipline, instructori, prețuri, resurse, hartă
  layout/        antet, meniu, subsol
  pages/         câte un fișier per pagină
  ui/            butoane, carduri, secțiuni — piesele comune
vercel.json      configurația de publicare
install.sh       instalare și pornire
```
