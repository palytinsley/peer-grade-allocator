# Peer Grade Allocator

Static GitHub Pages frontend for the Peer Grade Allocator. The page posts submissions to a deployed Google Apps Script web app, which writes rows to the `Responses` tab in the linked Google Sheet.

## Configuration

- GAS Script ID: `INSERT_SCRIPT_ID`
- Spreadsheet ID: `1_xOjYXh_PQzXERVyp-k_lyge9jAxiWTPAedS6lOdl0c`
- Sheet tab: `Responses`
- GAS exec URL: `YOUR_GAS_EXEC_URL`

Replace `YOUR_GAS_EXEC_URL` in `index.html` after redeploying the Apps Script project as a new web app version.

## Publish

```powershell
cd C:\Users\tinsl\Desktop\gas-projects\peer-grade-allocator
git init
git branch -M main
git add index.html gas/Code.gs .gitignore README.md
git commit -m "Migrate peer grade allocator frontend"
git remote add origin git@github.com:palytinsley/peer-grade-allocator.git
git push -u origin main
```

In GitHub, enable Pages for the `main` branch from the repository root.
