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

## Deployment to NUS test server 
1. Connect to NUS VPN.
2. `ssh -i ~/.ssh/open-classroom/id_rsa -xvv jeremy@172.25.20.25`, enter passcode. 
3. Add all env variables, including `NODE_ENV=staging`.
4. Run these commands. 
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
export NVM_DIR="$HOME/.nvm" 
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" 
nvm install 12.18.2
npm install -g npm@latest
git clone https://github.com/devtoohard/OpenClassroom.git
cd OpenClassroom
npm install
npm run build
sudo lsof -iTCP -sTCP:LISTEN -P
sudo kill -9 1505
sudo NODE_ENV=staging node index.js
```
5. Check other ports. `sudo lsof -iTCP -sTCP:LISTEN -P`