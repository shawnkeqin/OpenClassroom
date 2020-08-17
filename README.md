# Open Classroom Project (Front-end Vue app server)

## Development
See `package.json`:
```
"scripts": {
    "stage": "env vue-cli-service serve --mode staging",
    "serve": "vue-cli-service serve --mode development",
    "build": "vue-cli-service build --mode staging",
    "build-staging": "vue-cli-service build --mode staging",
    "build-staging-test": "vue-cli-service build --mode staging-test",
    "serve-staging-test":"sudo DEBUG=express:* VUE_APP_MODE=staging-test node index.js 2>&1 | tee \"./logs/deployment_$(date +'%d_%m__%H_%M').log\" &",
    "lint": "vue-cli-service lint",
    "apollo": "vue-cli-service apollo:dev --generate-schema",
    "apollo:schema:generate": "vue-cli-service apollo:schema:generate",
    "apollo:schema:publish": "vue-cli-service apollo:schema:publish",
    "apollo:start": "vue-cli-service apollo:start"
  }
```
### Config vars and sensitive info
Place sensitive variables like secrets, client id's, passwords etc in an `.env.local` file, which will automatically be ignored by git. Request for this file from the team. 


### Recommended Tools
- VSCode extensions
  - ES-Lint auto-fixing on save (super satisfying) https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
   - Change this setting:;
   ```
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    }
   ```  
  - Import filepath autocomplete. https://github.com/ChristianKohler/PathIntellisense if your filepaths aren't autocompleting.
  - https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd/related

## Deployment 


### Deployment Environments
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


### Frontend Deployment
1. Connect to NUS VPN.
2. `ssh -i ~/.ssh/open-classroom/id_rsa -xvv jeremy@172.25.20.25`, enter passcode. 
3. Add all env variables, including JWT secret.
4. Run these commands. 
```bash
# Install exact versino of NPM. 
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
nvm install 12.18.2
npm install -g npm@latest
# Pull project repo. 
git clone https://github.com/devtoohard/OpenClassroom.git
cd OpenClassroom
# Install dependencies, build and serve frontend distribution. 
npm install
npm run build-staging-test
sudo lsof -iTCP -sTCP:LISTEN -P
sudo kill -9 1505
npm run serve-staging-test
```

### Backend Deployment (Docker)
- https://hasura.io/docs/1.0/graphql/manual/getting-started/docker-simple.html#docker-simple
- https://docs.docker.com/engine/install/ubuntu/
- https://docs.docker.com/compose/install/
- https://github.com/docker/for-linux/issues/281


Remember to set admin secret and DB password in docker-compose file manually! And also hasura project files if you're using.
```bash
# Install and setup postgres DB.
sudo apt-get install postgresql
sudo service postgresql start
sudo -u postgres psql
#  Configure DB. 
# Try logging in.
psql "postgres://hasurauser:<>@localhost/open_classroom"
# Install Docker.
sudo apt-get update
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo apt-key fingerprint 0EBFCD88
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
sudo apt-get install docker-ce docker-ce-cli containerd.io
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker 
sudo docker run hello-world
# Load hasura docker image from tar file in repo. 
docker load < hasura-graphql-engine.tar.gz
# Run docker image using script from repo and check that it's running. 
chmod +x ./docker-run.sh
./docker-run.sh
docker ps
```

Allow remote access to postgres DB container temporarily (connecting with GUI for importing data):
- https://www.cyberciti.biz/faq/postgresql-remote-access-or-connection/#:~:text=First%20make%20sure%20PostgreSQL%20server%20has%20been%20started%20to%20remote%20server.&text=If%20it%20is%20running%20and,the%20local%20machine%20or%20localhost.
```
nano /var/lib/postgresql/data/pg_hba.conf
nano /var/lib//data/postgresql.conf
```


### Backend Deployment
See 
- https://github.com/hasura/graphql-engine/blob/master/server/CONTRIBUTING.md.
- https://tableplus.com/blog/2018/10/how-to-start-stop-restart-postgresql-server.html
- - https://github.com/haskell/cabal/issues/4898
```
sudo apt-get install postgresql
sudo apt install cabal-install
sudo apt install zlib1g-dev
curl https://sdk.cloud.google.com | bash
cabal install Cabal cabal-install
alias cabal="~/.cabal/bin/cabal"
cabal user-config update
cabal install
sudo service postgresql start
sudo -u postgres psql -c "CREATE DATABASE public;"
sudo -u postgres psql -c "CREATE USER admin;"
sudo -u postgres psql -c "ALTER USER admin PASSWORD '<>';"
cd ~
git clone https://github.com/hasura/graphql-engine.git
cd graphql-engine
cd console
sudo chown -R jeremy .
sudo npm install
sudo npm run server-build
cd ../server
DATABASE_URL=postgresql://admin:<>@localhost
cabal new-run -- exe:graphql-engine --database-url=$DATABASE_URL serve --enable-console --console-assets-dir=../console/static/dist
```

### Hasura DB Migration
See https://hasura.io/docs/1.0/graphql/manual/migrations/basics.html#migrations-basics. 
1. `hasura init`
2. `cd` into project directory. 
3. Add admin secret and endpoint to `config.yaml`.
4. `hasura console`
5. Create SQL migration files and heroku metadata.

```hasura migrate create <init-migration-name> --from-server --endpoint <endpoint>
hasura metadata export --endpoint <endpoint>
```


### DB config
```sql
CREATE USER hasurauser WITH PASSWORD 'hasurauser';
CREATE DATABASE open_classroom;
-- SWITCH TO open_classroom!
-- /connect open_classroom;
ALTER DATABASE oepn_classroom OWNER TO hasurauser;
-- create pgcrypto extension, required for UUID
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- create the schemas required by the hasura system
-- NOTE: If you are starting from scratch: drop the below schemas first, if they exist.
CREATE SCHEMA IF NOT EXISTS public;
CREATE SCHEMA IF NOT EXISTS hdb_catalog;
CREATE SCHEMA IF NOT EXISTS hdb_views;

-- make the user an owner of system schemas
ALTER SCHEMA hdb_catalog OWNER TO hasurauser;
ALTER SCHEMA hdb_views OWNER TO hasurauser;
ALTER SCHEMA public OWNER TO hasurauser;

-- grant select permissions on information_schema and pg_catalog. This is
-- required for hasura to query the list of available tables.
-- NOTE: these permissions are usually available by default to all users via PUBLIC grant
GRANT SELECT ON ALL TABLES IN SCHEMA information_schema TO hasurauser;
GRANT SELECT ON ALL TABLES IN SCHEMA pg_catalog TO hasurauser;

-- The below permissions are optional. This is dependent on what access to your
-- tables/schemas you want give to hasura. If you want expose the public
-- schema for GraphQL query then give permissions on public schema to the hasura user.
-- Be careful to use these in your production db. Consult the postgres manual or
-- your DBA and give appropriate permissions.

-- grant all privileges on all tables in the public schema. This can be customised:
-- For example, if you only want to use GraphQL regular queries and not mutations,
-- then you can set: GRANT SELECT ON ALL TABLES...
GRANT USAGE ON SCHEMA public TO hasurauser;
GRANT ALL ON ALL TABLES IN SCHEMA public TO hasurauser;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO hasurauser;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO hasurauser;

-- Similarly add these for other schemas as well, if you have any.
-- GRANT USAGE ON SCHEMA <schema-name> TO hasurauser;
-- GRANT ALL ON ALL TABLES IN SCHEMA <schema-name> TO hasurauser;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA <schema-name> TO hasurauser;
-- GRANT ALL ON ALL FUNCTIONS IN SCHEMA <schema-name> TO hasurauser;
```