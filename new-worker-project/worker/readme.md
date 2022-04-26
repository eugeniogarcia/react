[Artículo](https://www.smashingmagazine.com/2020/10/tasks-react-app-web-workers/)

Tenemos tres paginas que permiten calcular números de Fibonnaci.

En `index.html` calculamos el número de fibonaci con un script tradicional.En `w-index.html` calculamos el número de fibonaci desde un worker (esto es, desde un thread diferente al que alimenta la página; La página responde a peticiones mientras el número de fibonnaci se calcula).En `mw-index.html` calculamos el número de fibonaci también con un worker, pero con la diferencia de que con cada click creamos un nuevo worker (esto es, podemos lanzar varios threads en paralelo haciendo el cálculo de fibonnaci).
