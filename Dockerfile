FROM java:8

MAINTAINER Kyle Kelley <rgbkrk@gmail.com>

EXPOSE 25565

ADD https://s3.amazonaws.com/Minecraft.Download/versions/1.8/minecraft_server.1.8.jar /srv/minecraft/minecraft.jar

WORKDIR /srv/minecraft

RUN chmod a+rwX /srv/minecraft/ -R
RUN echo "eula=true" > eula.txt

USER nobody

CMD ["java", "-Xmx1536M", "-Xms768M", "-jar", "/srv/minecraft/minecraft.jar", "nogui"]
