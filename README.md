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
3. Add all env variables, including JWT secret.
4. Run these commands. 
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
nvm install 12.18.2
npm install -g npm@latest
git clone https://github.com/devtoohard/OpenClassroom.git
cd OpenClassroom
npm install
npm run build-staging-test
sudo lsof -iTCP -sTCP:LISTEN -P
sudo kill -9 1505
sudo DEBUG=express:* VUE_APP_MODE=staging-test node index.js 2>&1 | tee "./logs/deployment_$(date +'%d_%m__%H_%M').log" 
```
## Backend Deployment
```


```


## Environments
See https://cli.vuejs.org/guide/mode-and-env.html#modes.

The `vue-cli-service` mode used in `vue-cli-service serve` or `vue-cli-service build` will load the corresponding env file of the same name, ONLY during build time/while `vue-cli-service` is serving. It also automatically sets `NODE_ENV` unless it is declared explicitly in the env file. `NODE_ENV` determines webpack config (only recognizes "development, "production", or "test"), its not meant for custom modes. So we just let `vue-cli-service` set it for us. We also set `VUE_APP_MODE` as the same value as the mode for the client to access. 
**Therefore we should use `VUE_APP_MODE` since it will always correspond to our own custom environment name, whereas `NODE_ENV` might not.**

The custom environment file (as well as the automatically set `NODE_ENV`) was only loaded during the building phase. When running `index.js` after building, we need to again load the correct env file, therefore we use `custom-env`. But we need to tell it which env file, and since there is no concept of 'mode' and `NODE_ENV` is not set, we bootstrap by explicitly setting `VUE_APP_MODE`. 

| Purpose               | Environments    | Vue-cli-service mode | Production build?  | Email notifications active? | Login server connection? | `VUE_APP_BASE_URL` | `VUE_APP_AUTH_ENDPOINT` |  `VUE_APP_GRAPHQL_HTTP` |
| --------------------- | --------------- | -------------- | ------------------ | --------------------------- | ------------------------ | ------------------------ | ------------------------ | ------------------------ |
| Development           | Local machine   | "development"  | :x:                | :x:                         | :x:                      |`http://localhost:8080`|`http://localhost:8080/api/login`|`https://open-classroom-hasura-test.herokuapp.com/v1/graphql`|
| Demo app              | Heroku platform | "staging"      | :x:                | :x:                         | :x:                      |`https://open-classroom-app-demo.herokuapp.com`|`https://open-classroom-app-demo.herokuapp.com/api/login`|`https://open-classroom-hasura-test.herokuapp.com/v1/graphql`|
| Test deployment       | NUS test server | "staging-test" | :x:                | :x:                         | :white_check_mark:       | `http://172.25.20.25`                           |`http://172.25.20.25/api/login`|`https://open-classroom-hasura-test.herokuapp.com/v1/graphql`|
| Production deployment | NUS live server | "production"   | :white_check_mark: | :white_check_mark:          | :white_check_mark:       |`http://<>`|`http://<>/api/login`|`https://open-classroom-hasura-test.herokuapp.com/v1/graphql`|

