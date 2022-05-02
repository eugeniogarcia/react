// Generating content based on the template
const template = `<article>
  <img src='data/img/placeholder.png' data-src='data/img/SLUG.jpg' alt='NAME'>
  <h3>#POS. NAME</h3>
  <ul>
  <li><span>Author:</span> <strong>AUTHOR</strong></li>
  <li><span>Twitter:</span> <a href='https://twitter.com/TWITTER'>@TWITTER</a></li>
  <li><span>Website:</span> <a href='http://WEBSITE/'>WEBSITE</a></li>
  <li><span>GitHub:</span> <a href='https://GITHUB'>GITHUB</a></li>
  <li><span>More:</span> <a href='http://js13kgames.com/entries/SLUG'>js13kgames.com/entries/SLUG</a></li>
  </ul>
</article>`;

let content = '';
for (let i = 0; i < games.length; i++) {
  let entry = template.replace(/POS/g, (i + 1)) //busca todas las ocurrencias de POS, en lugar de solo la primera
    .replace(/SLUG/g, games[i].slug)
    .replace(/NAME/g, games[i].name)
    .replace(/AUTHOR/g, games[i].author)
    .replace(/TWITTER/g, games[i].twitter)
    .replace(/WEBSITE/g, games[i].website)
    .replace(/GITHUB/g, games[i].github);
  entry = entry.replace('<a href=\'http:///\'></a>', '-');
  content += entry;
}
document.getElementById('content').innerHTML = content;

// Registering Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/js13kpwa/sw.js');
}

var notificaciones=false;

// Requesting permission for Notifications after clicking on the button
const buttonStop = document.getElementById('stop');
buttonStop.addEventListener('click', () => {
  notificaciones = false;
  button.disabled = false;
  buttonStop.disabled = true;

});

const button = document.getElementById('notifications');
button.addEventListener('click', () => {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
    return;
  }
  if (Notification.permission === "granted") {
    notificaciones = true;
    button.disabled = true;
    buttonStop.disabled = false; 
    randomNotification();
    return;
  }
  if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      alert("granted");
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        notificaciones = true;
        button.disabled = true;
        buttonStop.disabled = false;
        randomNotification();
      }
    });
  }

});

// Setting up random Notification
function randomNotification() {
  if (!notificaciones) return;

  const randomItem = Math.floor(Math.random() * games.length);
  const notifTitle = games[randomItem].name;
  const notifBody = `Created by ${games[randomItem].author}.`;
  const notifImg = `data/img/${games[randomItem].slug}.jpg`;
  const options = {
    body: notifBody,
    icon: notifImg,
  };
  new Notification(notifTitle, options); //Crea una notificación
  setTimeout(randomNotification, 60000); //Programamos que cada 30 segs se publique una notificación
}

// Progressive loading images
const imagesToLoad = document.querySelectorAll('img[data-src]'); //Recuperamos todas las imagenes que tienen un atributo data-src

const loadImages = (image) => { //lambda que procesa una imagen
  image.setAttribute('src', image.getAttribute('data-src')); //cambia el valor del atrobuto src con el valor del atributo data-src
  image.onload = () => { //cuando la imagen se ha cargado podemos borrar el atributo data-src
    image.removeAttribute('data-src');
  };
};

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((items) => {//Definimos el callback y la opciones de observabilidad. En este caso no hemos especificado ninguna opción de observavilidad, así que se disparará el callback en cuanto alguno de los items observados "aparezca en el viewport"
    items.forEach((item) => {
      if (item.isIntersecting) {
        loadImages(item.target);
        observer.unobserve(item.target); //dejamos de observar este item
      }
    });
  });
  imagesToLoad.forEach((img) => {
    observer.observe(img);  //Indicamos que queremos observar cada una de las imagenes
  });
} else {
  imagesToLoad.forEach((img) => {
    loadImages(img);
  });
}
