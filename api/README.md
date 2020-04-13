# Instalación/Setup

Crea el esqueleto para una aplicación React:

```js
npx create-react-app api

cd api

npm start
```

Instalamos las herramientas:

```ps
npm install --save-dev isomorphic-fetch js-cookie
```

## JSon server

```ps
npm install -g json-server
```

Arrancamos el servidor:

```ps
Start-Job -ScriptBlock {json-server --watch db.json}
```

# isomorphic-fetch

Usamos `isomorphic-fetch` para acceder a la api. Podemos ver en `http.js` una serie de métodos que demuestran como llamar a la API. El método central para llamar a la API es __fetch__. La llamada a fetch retorna un promise. Podemos ver como recuperar los datos, convertirlo a json, y luego acceder a las propiedades del json:

```js
recuperaComentario(val)
  .then(function (response) {
	if (response.status >= 400) {
	  throw new Error("Bad response from server");
	}
	return response.json();
  })
  .then(function (respuesta) {
	console.log(respuesta.body);
  })
  .catch((err) => {
	console.error(err);
  });
```