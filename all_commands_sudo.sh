sudo /usr/bin/lsof -iTCP -sTCP:LISTEN -P
sudo /bin/kill -9 1505
sudo /usr/bin/apt-key add -
sudo /usr/bin/apt-get install postgresql-12
sudo /usr/bin/tee /etc/apt/sources.list.d/
sudo /usr/bin/pg_createcluster 12 main --start
sudo /usr/bin/pg_ctlcluster 12 main start
sudo -u postgres /usr/bin/psql
sudo /usr/bin/apt-get update
sudo /usr/bin/apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
sudo /usr/bin/apt-key fingerprint 0EBFCD88
sudo /usr/bin/add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo usr/bin/apt-get install docker-ce docker-ce-cli containerd.io
sudo /usr/sbin/groupadd docker
sudo /usr/sbin/usermod -aG docker $USER
sudo /bin/systemctl stop postgresql@12-main

/usr/bin/npm *, /usr/local/bin/npm *, /bin/ls, /usr/bin/apt-get install postgresql-12, /usr/bin/tee /etc/apt/sources.list.d/, /usr/bin/lsof, /usr/bin/apt-key *, /usr/bin/pg_createcluster, /usr/bin/pg_ctlcluster, /usr/sbin/groupadd docker, /bin/systemctl * postgresql@12-main, /usr/bin/apt-get install apt-transport-https, /usr/bin/apt-get install ca-certificates, /usr/bin/apt-get install gnupg-agent, /usr/bin/apt-get install curl, /usr/bin/apt-get install docker*, /usr/bin/apt-get install containerd.io, /usr/sbin/groupadd docker, /usr/bin/apt-get install containerd.io, /usr/bin/add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable", /usr/sbin/usermod -aG docker jeremy, usr/bin/pkill node, sudo nano /etc/apt/sources.list.d/postgresql.list, /usr/bin/apt-get install software-properties-common


