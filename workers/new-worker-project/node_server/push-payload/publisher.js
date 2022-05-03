// Use the web-push library to hide the implementation details of the communication
// between the application server and the push service.
// For details, see https://tools.ietf.org/html/draft-ietf-webpush-protocol and
// https://tools.ietf.org/html/draft-ietf-webpush-encryption.
const webPush = require('web-push');

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  vapidKeys=webPush.generateVAPIDKeys();
  console.log(`Se han generado las keys ${vapidKeys}`);
  webPush.setVapidDetails(
    'https://serviceworke.rs/',
    vapidKeys.publicKey,
    vapidKeys.privateKey);
}
else{
  // Set the keys used for encrypting the push messages.
  webPush.setVapidDetails(
    'https://serviceworke.rs/',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

module.exports = function(app, route) {

  //end-point que devuelbe la clave publica
  app.get(route + 'vapidPublicKey', function(req, res) { 
    console.log(`Piden la clave publica ${process.env.VAPID_PUBLIC_KEY || vapidKeys.publicKey}`)

    res.send(process.env.VAPID_PUBLIC_KEY || vapidKeys.publicKey);
  });

  //end-point que registra un cliente
  app.post(route + 'register', function (req, res) { 

    console.log(`Piden que enviemos notificaciones a  ${req.body.subscription}`)

    res.sendStatus(201);
  });

  //end-point que inicia la publicación de mensajes desde el servidor
  app.post(route + 'sendNotification', function (req, res) { 
    
    console.log(`Piden que enviemos una notificacion con el siguiente valor: ${req.body.payload}`) 
    
    const subscription = req.body.subscription;
    const payload = req.body.payload;
    const options = {
      TTL: req.body.ttl
    };

    setTimeout(function() {
      webPush.sendNotification(subscription, payload, options) //publica un mensaje
      .then(function() {
        console.log('termino el push')
        res.sendStatus(201);
      })
      .catch(function(error) {
        console.log(error);
        res.sendStatus(500);
      });
    }, req.body.delay * 1000); //lo publica un segundo despues de recibir la petición desde el cliente
  });
};
