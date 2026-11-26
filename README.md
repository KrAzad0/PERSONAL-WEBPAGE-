# Kumar Azad · Physics portfolio

A clean academic portfolio for theoretical physics, mathematical physics and scientific computing, designed to present current projects, academic background and research-internship interests.

The website is generated from two small JSON files. **To add a project, edit [`content/projects.json`](https://github.com/KrAzad0/PERSONAL-WEBPAGE-/edit/main/content/projects.json), then commit the change.** You do not need to edit the page layout.

## Update the portfolio

| What to change | File |
| --- | --- |
| Add a project, update its progress, change its status or add a real artifact link | [`content/projects.json`](content/projects.json) |
| Biography, email, availability, education, training, tools or CV destination | [`content/profile.json`](content/profile.json) |
| Layout and permanent section copy | [`src/index.html`](src/index.html) |
| Colours, typography and responsive layout | [`src/styles.css`](src/styles.css) |
| Project filtering, mobile navigation and email-copy interaction | [`src/app.js`](src/app.js) |

For an existing project, change `summary`, `status`, `progress`, `nextStep`, `methods` or `links` as needed. To add a new one, duplicate an entry and give it a unique lowercase `id`. Keep the JSON valid and set `featured` to `false` for ordinary entries.

Read **[the step-by-step project update guide](docs/UPDATE-PROJECTS.md)** for the exact fields, supported categories/statuses, an illustrative example and CV instructions. [Content sources](docs/CONTENT-SOURCES.md) record the basis for the initial profile and project descriptions.

## Publish with GitHub Pages

The intended GitHub Pages address is:

**https://krazad0.github.io/PERSONAL-WEBPAGE-/**

This is the configured destination, not a statement that deployment has already succeeded. To enable hosting:

1. Open this repository’s **Settings → Pages**.
2. Under **Build and deployment**, select **GitHub Actions** as the source.
3. Open **Actions → Build and deploy portfolio** and run the workflow on `main`, or commit an update to `main`.
4. Check that both the build and deployment jobs succeed. The deployment provides the actual website URL.

The included [deployment workflow](.github/workflows/deploy.yml) builds and checks the page whenever changes reach `main`, then deploys `dist/`. Pull requests run the build and checks without deployment. If repository rules require a pull request, merge it into `main` after the checks pass.

## Build and check locally

Use **Node.js 20 or newer**. The workflow uses Node.js 22. There are no third-party build dependencies, so no `npm install` step is required.

```bash
npm run build
npm run check
```

The build reads the content and templates, validates project fields and URLs, and creates the finished website in **`dist/`**. The check command needs that build output; it verifies project rendering, page anchors, local assets and several basic accessibility/metadata conditions. It does not prove the scientific claims or test the availability of every external link.

To inspect the result with a local web server, if Python is available:

```bash
python3 -m http.server 8000 --directory dist
```

Then visit `http://localhost:8000/`. Make changes in the source files and rebuild; `dist/` is generated and is replaced on each build.

## CV behaviour

`"cvUrl": null` keeps a working **Request CV** button that opens an email addressed to the public contact in `content/profile.json`.

To offer a PDF, upload the current file as `assets/kumar-azad-cv.pdf`, set `"cvUrl": "assets/kumar-azad-cv.pdf"`, and commit both changes. The button becomes **View CV**. The build also accepts a public HTTPS CV URL. Use a document suitable for publication and keep its destination current.

## Project structure

| Directory | Purpose |
| --- | --- |
| `content/` | Editable profile and project records |
| `src/` | HTML template, CSS and browser interactions |
| `assets/` | Local diagrams, favicon and any published CV PDF |
| `scripts/` | Dependency-free Node build/check scripts; optional figure-generation helper |
| `docs/` | Maintenance instructions and initial content provenance |
| `.github/workflows/` | Build, check and GitHub Pages deployment |
| `dist/` | Generated, deployable website |

The visitor page is static: it has no account system, database or in-browser editor. Content changes take place in GitHub and become part of the version history. The core project and academic content is present in the generated HTML, so it remains readable without JavaScript.

## Accurate research records

Keep working ideas, educational studies, preliminary outputs and completed work clearly identified. A project entry is not evidence of publication, institutional employment or a validated result. Link to actual public notes, source, notebooks or reports when available. The toroidal project is an ongoing study; the Quantum Mechanics From Scratch entry currently describes the available interactive atlas.

## License

Repository code is provided under the [MIT License](LICENSE). Linked papers and third-party materials retain their own rights and access conditions.
