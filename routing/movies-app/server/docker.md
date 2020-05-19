# Construir la imagen

Construimos la imagen como sigue:

```ps
docker build -t api-pelis .
```

En la imagen hemos expuesto el puerto 3001.Con este comando abriríamos el shell:

```ps
docker run -it -p 3001:3001 api-pelis sh
```

Con este comando arrancamos el servidor node:

```ps
docker run -dt -p 3001:3001 api-pelis
```

## MongoDB

Para acceder la base de datos - mongodb - desde el contenedor en docker nos referimos a la dirección de nuestro host, en mi caso `mongodb://192.168.1.133:27017`. Por defecto cuando instalamos mongodb solo admite conexiones hechas desde localhost. Para cambiar esta configuración, en `C:\Program Files\MongoDB\Server\4.2\bin\mogodb.cfg`, comentamos la línea que sigue:

```txt
# network interfaces
net:
  port: 27017
#  bindIp: 127.0.0.1
  bindIp: 192.168.1.133
```

## Instalar curl en la imagen de alpine

Nos conectamos a la imagen:

```ps
docker run -it -p 3001:3001 api-pelis sh
```

y ejecutamos:

```ps
apk --no-cache add curl
```