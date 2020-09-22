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
sudo /usr/bin/lsof -iTCP -sTCP:LISTEN -P
sudo /bin/kill -9 1505
npm run serve-staging-test

# BACKEND HASURA DOCKER IMAGE + POSTGRES SETUP
# Install and setup postgres DB.
echo "deb http://apt.postgresql.org/pub/repos/apt/ bionic-pgdg main" | sudo tee /etc/apt/sources.list.d/postgresql.list
wget -q https://www.postgresql.org/media/keys/ACCC4CF8.asc -O- | sudo /usr/bin/apt-key add -
sudo apt-get install postgresql-12
sudo pg_createcluster 12 main --start
sudo pg_ctlcluster 12 main start
#sudo -u postgres psql
sudo su - postgres
psql
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
   bionic \
   stable"
sudo apt-get install docker-ce docker-ce-cli containerd.io
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker 
docker run hello-world
# Load hasura docker image from tar file in repo. 
docker load < hasura-graphql-engine.tar.gz
# Run docker image using script from repo and check that it's running. 
chmod +x ./docker-run.sh
./docker-run.sh
docker ps




# Install Hasura CLI for migrating metadata + schema. 
curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash
cd open-classroom-hasura
hasura init
# Update admin secret and endpoint in config.yaml to point to where you are applying migrations/pulling migrations from.
# Create new. 
hasura migrate create
hasura migrate status
hasura migrate apply --version 1597913678545 --envfile ../.env.local --log-level debug
hasura metadata apply --envfile ../.env.local --log-level debug

# Dump from pg_dump archive from demo app.
pg_restore --verbose --clean --no-acl --no-owner -h localhost -U hasurauser -d open_classroom data/1fb44c77-68e8-4f07-b987-f368025bc02b

### DB cluster management 
pg_lsclusters
sudo systemctl stop postgresql@12-main
sudo pg_dropcluster 12 main 
## type "y"
sudo pg_createcluster 12 main --start
pg_lsclusters
sudo -u postgres psql

# Docker management 
docker stop <>
docker container rm $(docker container ps –aq)



Set up nginx on 443, point to 83 node server
ping openclassroom.yale-nus.edu.sg PING openclassroom.yale-nus.edu.sg (172.25.20.77) 56(84) bytes of data. 64 bytes from 172.25.20.77 (172.25.20.77): icmp_seq=1 ttl=63 time=1.51 m nslookup openclassroom.yale-nus.edu.sg Server:		8.8.8.8 Address:	8.8.8.8#53Non-authoritative answer: Name:	openclassroom.yale-nus.edu.sg@Address: 172.25.20.77