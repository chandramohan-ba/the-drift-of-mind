# The Drift of Mind — book-style website (v5)

A book-style essays website with a realistic page-turn experience.
Each article is its own .html file — write directly in it.

## Folder structure
- index.html, style.css, app.js — the book site
- articles/ — one .html file per article
- articles/index.json — the list of article files

## Write or edit an article
1. Open the article's .html file in articles/ (e.g., the-misfits-club.html)
2. Edit the <meta> lines at the top:
   - title: the article title
   - group: a group name, or leave empty ("") for no group
   - order: a number — lower numbers come first
   - status: "published" or "draft" (draft shows "Coming soon")
3. Write your article between <article> and </article> using simple HTML:
   - <p>your paragraph</p>
   - <h3>Section heading</h3>
   - <em>italic text</em>
4. Save.

## Add a NEW article
1. Copy any existing .html file in articles/ and rename it (e.g., my-new-article.html).
2. Edit its <meta> lines (title, group, order, status).
3. Write your content between <article> and </article>.
4. Open articles/index.json and add one line inside "articles":
   { "file": "my-new-article.html" }
5. Save. The book and Table of Contents update automatically.

## Test locally
Browsers block loading local files when you double-click index.html.
Two options:
1. Test on GitHub Pages after deploying (recommended).
2. Local preview: in this folder run:  python -m http.server 8000
   then open http://localhost:8000

## Deploy to GitHub Pages
1. Create a GitHub repository and upload all files.
2. Repo Settings -> Pages -> deploy from main branch, root.
3. DNS: add CNAME record - host: thedriftofmind, value: <username>.github.io
4. GitHub Pages custom domain: thedriftofmind.kannadajourney.com
5. Enable HTTPS after DNS propagation.

## Files
- index.html, style.css, app.js — the book site
- articles/*.html — your articles (one file each)
- articles/index.json — the list of article files
