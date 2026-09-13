# Egészségnapló – Django tanuló projekt

Egyszerű Django alkalmazás napi egészség-bejegyzések (súly, alvás, hangulat) rögzítésére.
Docker-ben fut, Postgres adatbázissal, hogy később élesbe is ki lehessen tenni ugyanazzal a képpel.

## Projekt felépítés

- `config/` – Django projekt beállítások (settings, urls, wsgi)
- `healthlog/` – az app: modellek, view-k, API (DRF), template-ek
- `frontend/` – React + TypeScript + shadcn/ui admin SPA (Vite)
- `Dockerfile` – multi-stage image: 1. a frontend buildelése (node), 2. az alkalmazás image-e (gunicorn-nal fut prod módban)
- `docker-compose.yml` – fejlesztői összeállítás (Django `runserver`, élő kód-mount, `DEBUG=True`)
- `docker-compose.prod.yml` – éles override (`gunicorn`, nincs kód-mount, `DEBUG=False`)
- `entrypoint.sh` – induláskor lefuttatja a migrációkat (élesben a `collectstatic`-ot is)

## Oldalak

- `/` – nyitóoldal (sima Django template, `healthlog/views.home`), a designja
  még kidolgozás alatt van
- `/admin/` – a React SPA (lásd lent), bejelentkezés és regisztráció is ennek
  a része

## Admin felület (SPA)

A `/admin/` címen egy React + shadcn/ui admin felület fut (nem a Django beépített
admin site-ja – azt ez a projekt nem használja). A felület a `/api/entries/`
REST API-n (Django REST Framework) keresztül végzi a `HealthEntry` bejegyzések
listázását, létrehozását, szerkesztését és törlését. A bejelentkezés és a
regisztráció is a SPA része, a `/api/auth/` végpontokon (login, register,
logout, user) keresztül, Django session-alapú autentikációval.

A frontend forrása a `frontend/` mappában van. Buildelt kimenete a
`healthlog/static/admin/` alá kerül, amit Django statikus fájlként szolgál ki
egy egyszerű template (`healthlog/templates/healthlog/admin_spa.html`) mögött.

Ha a `frontend/` alatt módosítasz valamit, a Docker image újraépítésekor
(`docker compose up --build`) a build stage automatikusan újrafuttatja a
Vite build-et. Mivel a dev compose élőben mountolja a kódot (`.:/app`), helyi
fejlesztéshez a frontendet a hoston is buildelni kell, hogy a friss fájlok
látszódjanak a futó konténerben:

```bash
cd frontend
npm install       # csak első alkalommal / függőségváltozáskor
npm run build     # újraépíti a healthlog/static/admin/ tartalmát
```

Vagy standalone Vite dev szerverként, ami proxyzza az `/api` hívásokat a
`localhost:8000`-en futó Djangóra:

```bash
cd frontend
npm run dev       # http://localhost:5173
```

## Fejlesztés (dev)

```bash
docker compose up -d          # web + db elindítása
docker compose logs -f web    # naplók követése
```

Az app a http://localhost:8000/ címen érhető el. A kód élőben szinkronizálva van
(`runserver` automatikusan újratölt, ha fájlt módosítasz).

Gyakori parancsok:

```bash
docker compose exec web python manage.py makemigrations   # új migráció, ha modellt módosítasz
docker compose exec web python manage.py migrate           # migrációk lefuttatása
docker compose exec web python manage.py shell              # Django shell
docker compose down                                          # leállítás (adat megmarad a volume-ban)
```

Admin felület (React SPA): http://localhost:8000/admin/

## Éles kirakás (prod)

1. Másold az `.env.example` fájlt `.env` néven, és tölts ki valós `DJANGO_SECRET_KEY`,
   `DJANGO_ALLOWED_HOSTS`, `POSTGRES_*` értékeket.
2. Indítás:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Ez élesben `gunicorn`-nal fut, `DEBUG=False`-fal, a kód be van égetve az image-be
(nincs élő fájl-mount), és a `collectstatic` is lefut induláskor.

Reverse proxy (pl. nginx/Caddy) + TLS beállítása a `web` szolgáltatás elé még szükséges
– ez a compose csak magát a Django appot futtatja.

## Tanulási pontok ebben a projektben

- **Modell** (`healthlog/models.py`): mezők, `choices`, `Meta.ordering`
- **Form** (`healthlog/forms.py`): `UserCreationForm` – a regisztrációs form, amit az API is újrahasznosít
- **REST API** (`healthlog/serializers.py`, `healthlog/api.py`): DRF `ModelSerializer` + `ModelViewSet`
  a bejegyzésekhez, plusz `APIView`-k a session-alapú auth-hoz (login/register/logout/user),
  router-rel és sima `path()`-okkal bekötve (`config/urls.py`)
- **SPA admin** (`frontend/`): React + TypeScript + shadcn/ui, Vite build-elve és Django static-ból kiszolgálva;
  a login/regisztráció is ide tartozik, API-hívásokon keresztül
- **URL routing** (`healthlog/urls.py`, `config/urls.py`): app-szintű URL-ek `include()`-dal
- **Docker**: multi-stage image (node build stage + python runtime); `entrypoint.sh` migrációhoz;
  dev/prod compose overlay minta
