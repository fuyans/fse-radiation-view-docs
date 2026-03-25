# FSE Radiation View Docs

This repository contains the standalone VitePress documentation site for FSE Radiation View.

The default local base path is `/`. GitHub Pages deployment overrides it to `/<repo-name>/` via the `DOCS_BASE` environment variable.

## Local development

Install dependencies:

```bash
npm install
```

Start the local docs server:

```bash
npm run docs:dev
```

Preview GitHub Pages base path locally (PowerShell):

```powershell
$env:DOCS_BASE = "/radiation-view-docs/"; npm run docs:dev
```

Build the site:

```bash
npm run docs:build
```

Preview the production build locally:

```bash
npm run docs:preview
```

## GitHub Pages publishing

This repository is configured to deploy automatically to GitHub Pages from the [`main`](README.md) branch using [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

The published site base path is configured for the GitHub project site:

```text
/<repo-name>/
```

The VitePress base is controlled through the `DOCS_BASE` environment variable in [`.vitepress/config.mts`](.vitepress/config.mts:3) and the GitHub Actions workflow sets it to the correct project path during deployment.

## Repository structure

```text
.
├─ .github/workflows/deploy.yml
├─ .vitepress/config.mts
├─ images/
├─ public/
├─ tutorial_files/
├─ index.md
├─ user-manual.md
├─ user-interface-and-interaction.md
├─ tutorial.md
├─ verification.md
├─ package.json
├─ README.md
└─ .gitignore
```

## Notes

- Generated output is written to [`.vitepress/dist/`](.vitepress/dist) and is ignored by [`.gitignore`](.gitignore).
- Static assets under [`public/`](public) are copied directly into the built site.
- Images and tutorial media remain in this repository and are bundled as part of the docs site.

