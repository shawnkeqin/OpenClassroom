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
   - Change this setting:;
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

## Frontend Deployment
1. Connect to NUS VPN.
2. `ssh -i ~/.ssh/open-classroom/id_rsa -xvv jeremy@172.25.20.25`, enter passcode. 
3. Add all env variables, including `NODE_ENV=staging`.
4. Run these commands. 
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
nvm install 12.18.2
npm install -g npm@latest
git clone https://github.com/devtoohard/OpenClassroom.git
cd OpenClassroom
npm install
npm run build
sudo lsof -iTCP -sTCP:LISTEN -P
sudo kill -9 1505
sudo DEBUG=express:* NODE_ENV=staging node index.js 2>&1 | tee "./logs/deployment_$(date +'%d_%m__%H_%M').log" 
```
## Backend Deployment
```


```


## Environments
| Purpose               | Environments    | Label          | Production build?  | Email notifications active? | Login server connection? |
| --------------------- | --------------- | -------------- | ------------------ | --------------------------- | ------------------------ |
| Development           | Local machine   | "development"  | :x:                | :x:                         | :x:                      |
| Demo app              | Heroku platform | "staging"      | :x:                | :x:                         | :x:                      |
| Test deployment       | NUS test server | "staging-test" | :x:                | :x:                         | :white_check_mark:       |
| Production deployment | NUS live server | "production"   | :white_check_mark: | :white_check_mark:          | :white_check_mark:       |
