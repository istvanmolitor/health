# Egészségnapló – Django tanuló projekt

Egyszerű Django alkalmazás napi egészség-bejegyzések (súly, alvás, hangulat) rögzítésére.
Docker-ben fut, Postgres adatbázissal, hogy később élesbe is ki lehessen tenni ugyanazzal a képpel.

## Projekt felépítés

- `config/` – Django projekt beállítások (settings, urls, wsgi)
- `healthlog/` – az app: modellek, view-k, admin, template-ek
- `Dockerfile` – az alkalmazás image-e (gunicorn-nal fut prod módban)
- `docker-compose.yml` – fejlesztői összeállítás (Django `runserver`, élő kód-mount, `DEBUG=True`)
- `docker-compose.prod.yml` – éles override (`gunicorn`, nincs kód-mount, `DEBUG=False`)
- `entrypoint.sh` – induláskor lefuttatja a migrációkat (élesben a `collectstatic`-ot is)

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
docker compose exec web python manage.py createsuperuser   # admin felhasználó létrehozása
docker compose exec web python manage.py shell              # Django shell
docker compose down                                          # leállítás (adat megmarad a volume-ban)
```

Admin felület: http://localhost:8000/admin/

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
- **Admin** (`healthlog/admin.py`): hogyan regisztrálj modellt admin felületre
- **Form** (`healthlog/forms.py`): `ModelForm` – validáció automatikusan a modellből
- **View-k** (`healthlog/views.py`): function-based view-k, CRUD (lista, létrehozás, szerkesztés, törlés)
- **URL routing** (`healthlog/urls.py`, `config/urls.py`): app-szintű URL-ek `include()`-dal
- **Template-ek**: öröklés (`{% extends %}`), `{% for %}`, `{% url %}`
- **Docker**: multi-stage nélküli, de production-ready image; `entrypoint.sh` migrációhoz;
  dev/prod compose overlay minta
