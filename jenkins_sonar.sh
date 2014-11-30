#!bin/bash

#adding the key
echo -e "installing jenkins"
wget -q -O - https://jenkins-ci.org/debian/jenkins-ci.org.key | sudo apt-key add -
sudo sh -c 'echo deb http://pkg.jenkins-ci.org/debian binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt-get update
sudo apt-get install jenkins


#downloading sonar
echo -e "downloading sonarqube"
sudo wget http://dist.sonar.codehaus.org/sonarqube-4.5.1.zip
sudo apt-get install unzip
sudo unzip sonarqube-4.5.1.zip
sudo mv sonarqube-4.5.1 /usr/local

#downloading sonar-runner
echo -e "downloading sonar-runner"
sudo wget http://repo1.maven.org/maven2/org/codehaus/sonar/runner/sonar-runner-dist/2.4/sonar-runner-dist-2.4.zip
sudo unzipt sonar-runner-dist-2.4.zip
sudo mv sonar-runner-2.4 /usr/local


echo -e "Sonar and sonar-runner can be found in /usr/local dir"

#to set sonar as a service follow those steps 
###Create the file /etc/init.d/sonar with the Vim or Nano editor:

###sudo nano /etc/init.d/sonar
###Append the following lines and save it:

###  #! /bin/sh
###  /usr/bin/sonar $*
###Open a terminal and enter the following commands:

#check your linux version and select the folder according to that
###sudo ln -s /usr/local/sonarqube-4.5.1/bin/linux-x86-32/sonar.sh /usr/bin/sonar
###sudo chmod 755 /etc/init.d/sonar
###sudo update-rc.d sonar defaults
