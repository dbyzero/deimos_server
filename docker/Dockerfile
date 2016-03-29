FROM debian:stable
MAINTAINER cyril@dbyzero.com

#Auth purpose
#COPY ./id_rsa /root/id_rsa

#Install packages needed
RUN apt-get update
RUN apt-get install -y nodejs npm git openssh-client vim
RUN apt-get install -y npm
RUN apt-get install -y git
RUN apt-get install -y openssh-client
RUN apt-get install -y vim
RUN ln -s /usr/bin/nodejs /bin/node

#Get and prepare server code
WORKDIR /root
RUN mkdir .ssh
COPY id_rsa .ssh
RUN chmod 600 /root/.ssh/id_rsa
RUN echo 'StrictHostKeyChecking=no ' >>  /etc/ssh/ssh_config
RUN git clone git@github.com:dbyzero/deimos_server.git
WORKDIR deimos_server
RUN npm install
RUN npm install -g nodemon

#VOLUME /data

#Run server
EXPOSE 80
CMD ["nodemon","app.js","--env=docker"]
