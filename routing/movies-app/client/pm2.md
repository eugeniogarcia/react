# Introducción

Arrancamos la app usando la app estática que se creo al compilar:

```ps
pm2 serve --spa
```

Podemos arrancar el servidor con diferentes setups usando el ecosystem.config.js:

```ps
pm2 delete app

pm2 start ecosystem.config.js --only app --env produccion
```
