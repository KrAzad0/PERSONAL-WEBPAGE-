# Add and update current projects

**Your main editing file is [`content/projects.json`](https://github.com/KrAzad0/PERSONAL-WEBPAGE-/edit/main/content/projects.json).** It is a list of project records. The build turns every record into a project card, including its status, tools, progress, next step and links.

## The simplest update: use GitHub

1. Sign in to GitHub and open [Edit projects.json](https://github.com/KrAzad0/PERSONAL-WEBPAGE-/edit/main/content/projects.json).
2. Find the project by its `id` or `title`.
3. Update its description, progress, next step or links. Change the status when the work reaches a different stage.
4. Select **Commit changes** and save to `main`. If the repository requires a pull request, create one and merge it after its checks pass.
5. Open the repository’s **Actions** tab and check the **Build and deploy portfolio** workflow. Once GitHub Pages is configured with **Source: GitHub Actions**, a successful run publishes the rebuilt page.

The website does not save edits made in your browser. Commit the source change in GitHub to make it permanent. A local build alone does not update the hosted website.

For meaningful updates, also change the `updated` date in [`content/profile.json`](https://github.com/KrAzad0/PERSONAL-WEBPAGE-/edit/main/content/profile.json) using `YYYY-MM-DD`. That date supplies the footer’s month/year and the sitemap’s modification date.

## Add a new project

Duplicate one complete object in `content/projects.json` and edit its fields. Put a comma between adjacent objects. Keep the outer square brackets, use double quotes around keys and strings, and do not add comments or a trailing comma.

| Field | What to enter |
| --- | --- |
| `id` | A unique lowercase slug beginning with a letter, such as `oscillator-benchmark`; use letters, numbers and hyphens. Keep it stable after publication so project anchors remain useful. |
| `title` | A concise, descriptive project title. |
| `category` | Exactly `quantum`, `mathematics` or `open-source`. |
| `status` | One supported status from the table below, matching capitalization. |
| `featured` | `true` or `false`, without quotes. At most one project may be featured. |
| `summary` | The scientific question or purpose, preferably in one or two sentences. |
| `methods` | A nonempty list of tools or methods, such as `["Python", "Finite differences"]`. |
| `progress` | What exists now, with limits where relevant. Keep planned work out of claims of completed progress. |
| `nextStep` | The next concrete calculation, check or deliverable. This is still required for an available or completed project; a documented maintenance or follow-up step is suitable. |
| `links` | A nonempty list of objects with `label` and a real public HTTPS `url`. Link to notes, code, a notebook, a report or another relevant project artifact. |

All text fields must be nonempty. Links must use `https://` and must not contain a username/password. Put ordinary text in the fields; the build escapes HTML markup.

### Categories

| Stored value | Displayed category |
| --- | --- |
| `quantum` | Quantum physics |
| `mathematics` | Mathematics |
| `open-source` | Open learning |

### Supported statuses

| Exact value | Appropriate use |
| --- | --- |
| `Scoping` | Defining a question, choosing a model or selecting benchmarks. |
| `In development` | Actively building a derivation, model, implementation or research record. |
| `Study` | Learning, literature synthesis or reproduction of established results. |
| `Available` | A public artifact exists, such as learning notes or an interactive tool. State precisely what is available. |
| `Preprint` | A manuscript is publicly available as a preprint. |
| `Completed` | The stated project scope is complete and its described outputs have been checked. This does not itself imply publication, novelty or peer review. |

Cards retain the order of the JSON file, except that the featured project is placed first. To feature another project, set the previous one to `false`. The toroidal-hydrogen project has its own geometry illustration. Featuring a different project gives it a wide text card, without attaching an unrelated illustration. For routine additions, keep `featured` set to `false`.

### Illustrative template

The following is **an example for learning the format**, not a claim that this research has been done. Replace the example title, description and repository link with your own accurate project details before publishing it. The supplied URL is the actual portfolio repository, used only to demonstrate a valid link format.

```json
{
  "id": "example-oscillator-study",
  "title": "Example: harmonic-oscillator study plan",
  "category": "quantum",
  "status": "Scoping",
  "featured": false,
  "summary": "Illustrative plan to compare a numerical oscillator spectrum with the analytical solution.",
  "methods": ["Python", "Finite differences", "Eigenvalue problems"],
  "progress": "Example only: no calculation or numerical result is claimed.",
  "nextStep": "Replace this sample with a real project question, its present progress and a checkable next step.",
  "links": [
    {
      "label": "Portfolio repository (example link)",
      "url": "https://github.com/KrAzad0/PERSONAL-WEBPAGE-"
    }
  ]
}
```

If a new investigation has no public output yet, first add an honest project-planning note to a repository and link to it. Do not invent a paper URL, claim an unavailable notebook exists, or use a private link that visitors cannot open.

## Update your profile

Edit [`content/profile.json`](https://github.com/KrAzad0/PERSONAL-WEBPAGE-/edit/main/content/profile.json) for your public email, location, availability, biography, interests, education, training, skills and CV destination.

- `shortBio` follows “I’m Kumar Azad,” in the hero, so write it as the continuation of that sentence; the current value begins “an M.Sc. Physics student…”.
- `about` is the longer background paragraph.
- `education`, `training`, `interests` and `skills` are lists. Keep each existing object’s field names when adding another entry.
- `email` supplies the contact and CV-request buttons. Use a public professional contact you want visitors to see.
- `links` contains social profiles. The visible contact section currently shows entries labelled exactly `GitHub`, `LinkedIn` and `ResearchGate`; other profile links may still appear in structured metadata. Change `scripts/build.mjs` if you want to change that visible selection.
- `updated` must use `YYYY-MM-DD`.

The page also contains permanent section copy and metadata in `src/index.html`. Edit that template if you change the site’s overall identity or research focus. The intended site URL is defined in the template/build output; update it there if you move the website to another repository or domain.

## Add or replace your CV

The default is:

```json
"cvUrl": null
```

With `null`, the page displays **Request CV** and opens an email request to your public email address. It is a working contact action, not an empty download link.

To publish a PDF:

1. Add your current CV to the repository as **`assets/kumar-azad-cv.pdf`**. On GitHub, open `assets`, choose **Add file → Upload files**, upload the PDF, and commit it.
2. Edit `content/profile.json` to contain:

   ```json
   "cvUrl": "assets/kumar-azad-cv.pdf"
   ```

3. Update the `updated` date and commit the profile change to `main`.
4. After the deployment succeeds, open **View CV** on the website and confirm the correct document appears.

For future CV updates, replace the file at the same path. The build also accepts a public HTTPS URL if you host the CV elsewhere. A repository PDF path must start with `assets/`, end in `.pdf`, and contain no `..` path components. Avoid a leading slash: the site is hosted under a GitHub Pages project path.

## Build and verify before publishing

With Node.js 20 or newer installed, run these commands from the repository directory:

```bash
npm run build
npm run check
```

There are no third-party dependencies to install. `npm run build` validates the JSON content, combines it with `src/index.html`, copies assets and browser files, and writes the deployable website to `dist/`. `npm run check` then checks that the generated page contains every project, working local references, unique anchors and required basic markup.

Do not edit `dist/` to maintain the site: each build replaces it. Edit `content/`, `src/` or `assets/` and rebuild.

## If an update does not appear

| Symptom | Check |
| --- | --- |
| Build fails while parsing JSON | Look for missing commas, extra trailing commas, unescaped double quotes or comments. JSON does not permit comments. |
| “Unknown category” or “Unknown status” | Copy an exact supported value from the tables above. Values are case-sensitive. |
| Duplicate/project ID error | Give each entry a distinct lowercase slug beginning with a letter. |
| Featured-project error | Keep at most one `featured: true` entry. |
| URL validation error | Use a complete real `https://` URL, without embedded credentials. |
| Local-asset check fails | Confirm the file exists with exactly the same capitalization and path, especially for a CV. |
| Build succeeds but deployment fails | Confirm **Settings → Pages → Source: GitHub Actions**, then inspect the deployment-job message in Actions. |
| The hosted page looks unchanged | Confirm the change reached `main` and its deployment succeeded, then refresh the page. Editing a branch or running a local build alone does not publish the change. |

The initial profile and project evidence are recorded in [CONTENT-SOURCES.md](CONTENT-SOURCES.md). Update those notes when you substantially change a credential, project claim or source destination.
