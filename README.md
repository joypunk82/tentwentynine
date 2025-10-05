# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Guest notes (optional persistence)

The home page accepts a `?guest` URL parameter which shows a notecard where visitors can leave a birthday note for Taylor. Notes are accepted via `POST /api/notes`.

By default (no storage configured), the endpoint returns 202 and logs the note to the server console without persistence.

To persist notes on Vercel via Blob storage:

1. Ensure the project uses the Vercel adapter (already configured).
2. In your Vercel project settings, add an environment variable named `BLOB_READ_WRITE_TOKEN` with a token that has read/write access.
3. Deploy. When set, notes are written to private keys under `notes/` in Blob Storage.
