# client

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Recommended Tools
### VSCode extensions
- ES-Lint auto-fixing on save (super satisfying) https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
   - Change this setting:
   ```
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    }
   ```  
- Import filepath autocomplete. https://github.com/ChristianKohler/PathIntellisense if your filepaths aren't autocompleting.

### Vue Devtools
- https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd/related

### Config vars and sensitive info
Put non-sensitive env specific variables in `.env.development` or  `.env.staging` or `.env.production`.

Place sensitive variables like secrets, client id's, passwords etc in an `.env.local` file, which will automatically be ignored by git. Request for this file from the team. 