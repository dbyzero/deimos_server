FROM	debian:jessie

# Enable EPEL for Node.js
RUN     apt-get update
RUN     apt-get install -y nodejs npm

# Bundle app source
COPY . /src

EXPOSE	1337

CMD ["nodejs", "/src/main.js"]
