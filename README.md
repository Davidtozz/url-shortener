
<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h2 align="center">URL Shortener</h2>

  <p align="center">
    Semplice webapp per la creazione di shortlink, creata per l'esame del corso <i>"Applicazioni Web Mobile e Cloud"</i>. Fruibile sia da desktop che mobile.
    <br />
  </p>
</div>

<!-- ABOUT THE PROJECT -->
## Il progetto

![ProjectFlowchart](https://raw.githubusercontent.com/Davidtozz/url-shortener/refs/heads/master/flow-chart.png)

Applicazione web minimale per la creazione di shortlink a partire da link più lunghi.

### Funzionalità
* Autenticazione cookie based con nome utente e password
* Generazione di shortlink, sia da utenti anonimi che autenticati
* Visualizzazione della lista di shortlink creati dall'utente autenticato (gli utenti anonimi non hanno una lista)
* Redirect all'URL originale quando si visita uno shortlink

### Scelte progettuali
L'applicazione è stata sviluppata con le seguenti tecnologie:


* [![Docker][Docker.com]][Docker-url]
* [![PostgreSQL-url][PostgreSQL.org]][PostgreSQL-url]
* [![DrizzleORM][DrizzleORM.com]][DrizzleORM-url]
* [![Svelte][Svelte.dev]][Svelte-url]
* [![Tailwindcss][Tailwindcss.com]][Tailwindcss-url]

Docker per facilitare l'installazione e l'esecuzione del progetto in locale, anche nell'ottica di voler migliorare il progetto con nuove funzionalità e per il deploy in un ambiente cloud-native;

PostgreSQL come database relazionale per la mia conoscenza pregressa con esso;

DrizzleORM principalmente per la possibilità di creare file di migratione, permettendo il tracking dello schema del database in version control e per una semplice interfaccia per l'esecuzione di query al database;

SvelteKit e TailwindCSS per via della mia conoscenza pregressa con quest'ultimi e soprattutto per la loro semplicità d'uso.



## Prerequisiti

Per eseguire il progetto in locale, assicurati di avere [`pnpm`](https://pnpm.io/installation) e [`docker`](https://docs.docker.com/desktop/) installato nel tuo sistema.

### Installazione

1. Clona il repository
   ```sh
   git clone https://github.com/Davidtozz/url-shortener.git
   ```
2. Installa le dipendenze con `pnpm`:
   ```sh
   pnpm i # oppure pnpm install
   ```
3. Per lo svilippo, esegui:
   ```sh
    pnpm dev
   ```
4. In alternativa, puoi eseguire l'applicazione tramite `docker-compose`:
  ```sh
    docker-compose up --build
  ```
5. Esegui le migrazioni di DrizzleORM per creare le tabelle nel database PostgreSQL:
   ```sh
   pnpm db:migrate
   ```
6. Visita `http://localhost:3000` nel tuo browser per vedere l'app in azione oppure `http://localhost:5173` se hai avviato l'app tramite `pnpm dev`.

<!-- LICENSE -->
## Licenza

Distribuito sotto la licenza MIT. Vedi `LICENSE` per maggiori dettagli.


[DrizzleORM.com]: https://img.shields.io/badge/DrizzleORM-000000?style=for-the-badge&logo=drizzle-orm&logoColor=white
[DrizzleORM-url]: https://orm.drizzle.team/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[PostgreSQL.org]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/
[Tailwindcss.com]: https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwindcss-url]: https://tailwindcss.com/
[Docker.com]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/