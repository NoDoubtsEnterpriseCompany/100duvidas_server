#!bin/bash

#Install nodejs
sudo apt-get update
echo -e "Instaling nodejs..."
sudo apt-get install nodejs

sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
echo -e "Installing mongodb"
echo 'deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install -y mongodb-org

echo -e "Starting mongodb..."
sudo service mongod start

echo -e "Installing project 100_duvidas_server dependencies..."
sudo apt-get intsall npm
npm install

echo -e "Done\n To begin run: npm start"
