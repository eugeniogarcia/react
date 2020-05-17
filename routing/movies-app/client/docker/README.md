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

Podemos especificar una variable de entorno:

```ps
docker run -it -e REACT_APP_BD='http://localhost:3001/api' -p 8080:3002 app-pelis
```
