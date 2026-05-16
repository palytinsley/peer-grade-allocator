# AGENTS.md — Peer Grade Allocator

## Project
GAS Web App where students allocate 100% contribution across a group of 4 and justify each allocation. Responses write to a Google Sheet.

## Stack
- Frontend: single `index.html` served via GAS `HtmlService`
- Backend: `Code.gs` (Google Apps Script)
- Database: Google Sheets
- No GitHub Pages, no clasp required for basic edits — paste-and-deploy via script editor

## IDs
- GAS Script ID: [17ivR4wMXsyVZ4kFmSwjRCXQ5BNFgZCX9BzbBjQCkCL18D7BgY1SFky82]
- Spreadsheet ID: 1_xOjYXh_PQzXERVyp-k_lyge9jAxiWTPAedS6lOdl0c
- Sheet tab: Responses

## Sheet Schema (stable — do not modify)
Row 1 headers:
Timestamp | Submitter Name | Period | Country | Peer1 Name | Peer1 % | Peer1 Justification | Peer2 Name | Peer2 % | Peer2 Justification | Peer3 Name | Peer3 % | Peer3 Justification | Peer4 Name | Peer4 % | Peer4 Justification

## Hard Rules
- Do not modify Code.gs unless explicitly instructed
- Do not modify sheet tab name or row 1 headers
- Do not replace google.script.run with fetch — this is GAS-served HTML
- All validation is inline — no browser alerts
- No frameworks, no build tools, no npm

## Design System
Editorial Utility (see DESIGN.md in repo). Playfair Display + Hanken Grotesk. Terracotta primary, lavender secondary, mint tertiary. Off-white paper background. No dark mode.

## Icons
Tabler Icons via jsDelivr CDN only.

## Deployment
Script editor → Deploy → Manage Deployments → New Version. Deploy as Web App, access: Anyone.