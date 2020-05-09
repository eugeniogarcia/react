Ver guía de [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/)

# Instalación

Instala pm2

```ps
npm install pm2@latest -g
```

## Arranca una aplicación

Arranca el servidor:

```ps
pm2 start index.js
```

Hay varios comandos en línea. Con este hacemos que cualquier cambio en el fuente se compile en tiempo real:

```ps
pm2 start index.js --watch
```

Podemos también elegir el puerto:

```ps
pm2 start index.js --watch --port 3002
```

Otros argumentos que podemos usar en la línea de comandos:

```ps
# Specify an app name
--name <app_name>

# Watch and Restart app when files change
--watch

# Set memory threshold for app reload
--max-memory-restart <200MB>

# Specify log file
--log <log_path>

# Pass extra arguments to the script
-- arg1 arg2 arg3

# Delay between automatic restarts
--restart-delay <delay in ms>

# Prefix logs with time
--time

# Do not auto restart app
--no-autorestart

# Specify cron for forced restart
--cron <cron_pattern>

# Attach to application log
--no-daemon
```

## Gestiona los procesos

Rearranca, para, borra, recarga:

```ps
pm2 restart index.js

pm2 reload index.js

pm2 stop index.js

pm2 delete index.js
```

También podemos actuar sobre todos los procesos:

```ps
pm2 restart all
```

## Lista las aplicaciones

El estado de los procesos

```ps
pm2 [list|ls|status]
```

## Logs

Lista los logs. Funciona en modo streaming:

```ps
pm2 logs
```

Muestr las últimas líneas del log

```ps
pm2 logs --lines 200
```

## Dashboard

```ps
pm2 monit
```

## Cluster Mode

[Nos permite aprovechar](https://pm2.keymetrics.io/docs/usage/cluster-mode/) todos los cores de la máquina, lanzando un proceso node en cada uno de ellos. Con este comando se lanza automáticamente el proceso en tantos cores como tenga la máquina:

```ps
pm2 start index.js -i max
```

Podemos también especificar cuantos, por ejemplo, aqui especificamos que se usen dos:

```ps
pm2 start index.js -i 2
```

## Ecosystem file

[El ecosystem file](ttps://pm2.keymetrics.io/docs/usage/application-declaration/) nos permite controlar las variables de entorno, y la configuración con la que se ejecutaran los procesos. Creamos el archivo de configuración como sigue:

```ps
pm2 ecosystem

File C:\Users\Eugenio\Downloads\react\movies-app\client\ecosystem.config.js generated
```

Genera un archivo llamado `ecosystem.config.js`:

```json
module.exports = {
  apps : [{
    script: 'index.js',
    watch: '.'
  }, {
    script: './service-worker/',
    watch: ['./service-worker']
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
```

y podemos usarlo como:

```ps
pm2 [start|restart|stop|delete] ecosystem.config.js
```

Podemos actuar sobre una aplicación concreta:

```ps
pm2 start   ecosystem.config.js --only api-app
pm2 restart ecosystem.config.js --only api-app
pm2 reload  ecosystem.config.js --only api-app
pm2 delete  ecosystem.config.js --only api-app
```

Podemos cambiar de entorno:

```ps
pm2 start process.json --env production
```
