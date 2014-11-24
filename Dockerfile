FROM java:8

MAINTAINER Kyle Kelley <rgbkrk@gmail.com>

EXPOSE 25565
EXPOSE 8080

RUN apt-get update
RUN apt-get install nodejs-legacy npm -y

RUN mkdir -p /srv/minecraft

WORKDIR /srv/minecraft

ADD https://s3.amazonaws.com/Minecraft.Download/versions/1.8/minecraft_server.1.8.jar /srv/minecraft/minecraft_server.jar

ADD . /srv/minecraft/
RUN npm install

RUN chmod a+rwX /srv/minecraft/ -R
RUN echo "eula=true" > eula.txt

USER nobody

CMD ["node", "minecraft.js"]
