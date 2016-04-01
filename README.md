bromine
=======

Minecraft server setup in Docker for my family and friends.

```
docker build -t bromine .
docker run -it \
           -p 25565:25565 \
           -p 8080:8080
           -e MINECRAFT_ADMIN_USER=steve \
           -e MINECRAFT_ADMIN_PASSWORD=totallylegit \
           bromine
```
