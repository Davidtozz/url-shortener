# Progetto Applicazioni Web Mobile e Cloud - URL Shortener

Applicazione web minimale per creare URL brevi a partire da URL lunghi. Fornisce registrazione/login, creazione di short url per utenti autenticati e reindirizzamento con conteggio dei click.

## Tecnologie/Librerie principali

- **SvelteKit** - [link al sito web](https://svelte.dev/)
- **Drizzle ORM** - [link al sito web](https://orm.drizzle.team/)
- **PostgreSQL** - [link al sito web](https://www.postgresql.org/)
- **Tailwind CSS** - [link al sito web](https://tailwindcss.com/)
- **Docker** — [link al sito web](https://www.docker.com/)

## Struttura del progetto

- `src/lib/server/db`
  - [src/lib/server/db/index.ts](src/lib/server/db/index.ts) — contiene il client Drizzle usato in tutto il progetto.
  - [src/lib/server/db/schema.ts](src/lib/server/db/schema.ts) — definisce le tabelle e i relativi tipi TypeScript

- `src/lib/server/auth.ts`
  - Gestisce il ciclo di vita delle sessioni utente.

- `src/hooks.server.ts`
  - Middleware a supporto dell'autenticazione. Rende accessibile i dettagli dell'utente e della sessione in tutti i contesti client/server.

- `src/routes`
  - [src/routes/+page.svelte](src/routes/+page.svelte) — interfaccia utente principale: form di login/registrazione e UI per generare short URL.
  - [src/routes/+page.server.ts](src/routes/+page.server.ts) — logica server della pagina principale.

## Come eseguire il progetto

1. Assegna a `DATABASE_URL` l'URL della tua istanza di PostgreSQL (vedi [drizzle.config.ts](drizzle.config.ts) e [src/lib/server/db/index.ts](src/lib/server/db/index.ts)).
2. Avvia il DB (Docker) usando `start-db.sh`. Assicurati che il container del tuo DB abbia lo stesso nome specificato in `start-db.sh`.
3. Avvia il progetto con `pnpm`:

```bash
pnpm install
pnpm run dev
```

L'app sarà disponibile all'indirizzo `http://localhost:5173`.
