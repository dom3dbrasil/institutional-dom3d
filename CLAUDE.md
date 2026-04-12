# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project
Static 3D portfolio site. Plain HTML, CSS, and JavaScript only — no build tool, no package manager, no bundler.

## Stack rules
- No external dependencies: no npm packages, no CDN-loaded libraries
- 3D effects via pure CSS transforms (`transform-style: preserve-3d`, `perspective`, `rotateX/Y/Z`) — not via any JS 3D library
- Vanilla JS only; use ES module syntax (`import`/`export`) with `type="module"` script tags

## Code style
- Mobile-first responsive: base styles target small screens, use `min-width` media queries to scale up
- Semantic HTML: use `section`, `article`, `nav`, `header`, `footer`, `main`, `figure`, etc. — not generic divs
- No framework conventions (no JSX, no component files, no `.vue`/`.svelte`)

## File structure
- Entry point: `index.html` at the repo root
- CSS in a `/styles/` directory, JS in a `/scripts/` directory
