# Construir la imagen

Construimos la imagen como sigue:

```ps
docker build -t app-pelis .
```

En la imagen hemos expuesto el puerto 3002. Podemos mapear el puerto a cualquier otro del host, por ejemplo, al 8080. Con este comando abriríamos el shell:

```ps
docker run -it -p 8080:3002 app-pelis sh
```

Con este comando arrancamos la app react:

```ps
docker run -it -p 8080:3002 app-pelis
```

O podemos lanzar la imagen detachada

```ps
docker run -dt -p 8080:3002 app-pelis
```

## Ejemplo

Arrancamos el servidor de apis, el servidor node, en el puerto 3003:

```ps
cd server

$env:PORT=3003

pm2 start .\index.js

[PM2] Starting C:\Users\Eugenio\Downloads\react\Routing\movies-app\server\index.js in fork_mode (1 instance)
[PM2] Done.
┌─────┬──────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name     │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼──────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ index    │ default     │ 1.0.0   │ fork    │ 15784    │ 0s     │ 0    │ online    │ 0%       │ 31.2mb   │ Eugenio  │ disabled │
└─────┴──────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

Arrancamos el contenedor de docker para que trabaje con el puerto 3003:

```ps
docker run -it -e REACT_APP_BD='http://localhost:3003/api' -p 8080:3002 app-pelis
```

También podemos ejecutarlo detached:

```ps
docker run -di -e REACT_APP_BD='http://localhost:3003/api' -p 8080:3002 app-pelis
```