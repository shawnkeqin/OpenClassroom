# FRONTEND NODE APP 
# Install exact version of NPM. 
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
#-------------------------------------------------------------

# BACKEND HASURA DOCKER IMAGE + POSTGRES SETUP
# Install and setup postgres DB.
wget -q https://www.postgresql.org/media/keys/ACCC4CF8.asc -O- | sudo apt-key add -
sudo apt-get install postgresql-12
echo "deb http://apt.postgresql.org/pub/repos/apt/ bionic-pgdg main" | sudo tee /etc/apt/sources.list.d/postgresql.list
sudo service postgresql start
sudo -u postgres psql
#  Configure DB - add users and permissions.
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

# Install Hasura CLI for migrating metadata + schema. 
curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash
hasura migrate apply
hasura metadata apply
# Dump from pg_dump archive from demo app.
pg_restore --verbose --clean --no-acl --no-owner -h localhost -U hasurauser -d open_classroom data/1fb44c77-68e8-4f07-b987-f368025bc02b


