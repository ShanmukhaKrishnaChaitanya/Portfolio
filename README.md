# Shanmukha Krishna Chaitanya Munagala — personal portfolio

A responsive, multi-page portfolio covering machine learning projects, professional experience, research, education, and contact details. The supplied résumé is the primary source for the current content. The original portfolio remains available in the repository's Git history. A local-only backup of the original homepage is saved as `previous index.html`; it is excluded from commits and deployment.

## Preview locally

Use Node.js 20 or newer. No package installation is required.

```sh
npm run build
npm run check
npm start
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173). You can also preview the existing GitHub Pages prefix at [http://127.0.0.1:4173/Portfolio/](http://127.0.0.1:4173/Portfolio/). Stop the preview with Ctrl+C. The server binds to your own computer only; set the `PORT` environment variable to choose another port.

## Edit the site

- `src/content.mjs` contains the profile, project case studies, experience, education, publications, and other portfolio copy. Update these records to change the content.
- `scripts/build.mjs` contains the page templates and generates the finished HTML files. Run `npm run build` after editing content or templates. Direct edits to generated HTML will be overwritten by the next build.
- `assets/styles.css` controls the design and responsive layouts.
- `assets/site.js` handles interactive features.
- `assets/favicon.svg` is the site icon.
- `assets/Shanmukha-Munagala-Resume.pdf` is the downloadable résumé. Replace that file to update the download, retaining its filename or updating the corresponding template link.

Run `npm run check` after rebuilding. The checker verifies generated pages, titles, descriptions, language attributes, one H1 per page, main landmarks, unique IDs, local links and assets, fragment anchors, deployment path compatibility, and the résumé PDF. It does not make requests to external websites, so review external links separately when you change them.

## Pages and hosting

The main pages are `index.html`, `about.html`, `experience.html`, `projects.html`, `research.html`, and `contact.html`. Four project case studies live in `projects/`. A `404.html` page provides the missing-page experience.

The generated site is static HTML, CSS, and JavaScript with no external runtime dependencies. Node.js is used only to generate, check, and preview the site; a production server does not need Node.js.

Relative links work both at a domain root and beneath the existing GitHub Pages `/Portfolio/` path, including the nested project pages. When you are ready to publish, the generated HTML files, the `projects/` directory, and the `assets/` directory are the site output. Build before uploading or deploying them. There is no client-side router or fallback rewrite requirement.

The local preview serves generated HTML and assets only. It does not expose source files, scripts, `.git`, or temporary working files. For another hosting service, publish only the site output described above.

No deployment, commit, or push is performed by any of the available npm scripts.

The custom 404 page and canonical metadata are configured for the existing `/Portfolio/` GitHub Pages address. If you move to a custom domain or different path, update these URLs in `scripts/build.mjs` and rebuild.
