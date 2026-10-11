# Site (etapa 1): login cu Discord, profiluri publice, dashboard

Ce face acum:
- **Login cu Discord** (doar scope `identify`: nume, avatar, ID)
- **Alegerea username-ului** la prima intrare (3-20 caractere, nu se mai schimbă)
- **Dashboard:** nume afișat, bio, culoare de accent, până la 8 linkuri
- **Pagina publică** `domeniu/username` cu numărător de vizualizări
- Validări: linkurile pot fi doar http/https, textele sunt curățate, nu se numără vizitele proprii

Tehnologie: Next.js + PostgreSQL. Tabela se creează singură la prima pornire.

---

## 1. GitHub
Creează un repository **nou** (ex: `site`, Private) și urcă **conținutul** arhivei, astfel încât `package.json` să fie la prima pagină a repository-ului.
(Recomand repository separat de cel al botului, ca să nu încurci „Root Directory".)

## 2. Railway
În același proiect în care ai botul:
1. **New → GitHub Repo** → alege repository-ul `site` (devine un serviciu nou).
2. **New → Database → Add PostgreSQL**.
3. La serviciul `site` → **Variables** adaugă:
   - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}` (se scrie exact așa; dacă baza ta se numește altfel, folosește numele ei)
   - `DISCORD_CLIENT_ID` = Application ID (același ca la bot)
   - `DISCORD_CLIENT_SECRET` = vezi pasul 3
   - `SESSION_SECRET` = un text aleatoriu lung (40+ caractere, generat cu un password manager)
   - `SITE_NAME` = numele platformei (ex: `clwn.wtf`)
   - `SITE_URL` = adresa publică, **fără `/` la final** (vezi pasul de mai jos)
4. **Settings → Networking → Generate Domain** → copiază adresa `https://ceva.up.railway.app` și pune-o în `SITE_URL`.

## 3. Discord Developer Portal
Aplicația ta → **OAuth2**:
- **Client Secret** → Reset Secret → copiază-l în `DISCORD_CLIENT_SECRET` (nu-l da nimănui).
- **Redirects** → Add Redirect → `https://ceva.up.railway.app/api/auth/callback` (exact `SITE_URL` + `/api/auth/callback`) → Save.

Dacă `SITE_URL` și redirect-ul nu se potrivesc exact, loginul dă eroare.

## 4. Test
Deschide adresa → **Continue with Discord** → alege username → completează profilul → **Save** → **View my page**.

## Limite ale etapei 1 (urmează în etapele următoare)
- 8 linkuri, fără drag & drop
- Avatarul vine din Discord; nu există încărcare de imagini, teme, efecte sau badge-uri
- Username-ul nu se poate schimba
- Fără pagini de termeni/confidențialitate, panou de admin sau raportare de profiluri
- Limitarea vizualizărilor e în memorie (se resetează la repornire)
- Nu pune plăți sau utilizatori reali înainte de etapele de securitate și legal
