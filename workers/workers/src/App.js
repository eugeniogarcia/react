import React, { useEffect, useReducer, useState } from 'react';

import CalcFib from './CalcFib';
import CalcFib2 from './CalcFib2';

//Un componente React stateless que sin embargo va a utilizar el estado
const App = () => {
  //Hook para usar el estado. Crea un estado llamado contador
  const [contador, informaContador] = useState(35);

  //Hook que utiliza un reducer para crear un estado. El primer argumento es un dispatcher del tipo
  //que usaríamos con Redux - funcion final que toma un estado y una acción, y retorna otro estado
  //El segundo argumento es el argumento inicial
  const [modo, cambiaModo] = useReducer((m) => (m === 'normal' ? 'worker' : 'normal'), 'worker');

  //Otro Hook. Este se engancha al DidMount, DidUpdate
  useEffect(() => {
    const timer = setTimeout(() => {
      if (contador % 2) {
        informaContador(contador + 1);
      } else {
        informaContador(contador - 1);
      }
    }, 200);
    return () => clearTimeout(timer);
  });

  return (
    <React.StrictMode>
      <div style={{ marginTop: 60 }}>
        <button type="button" onClick={cambiaModo}>Toggle Mode</button>
        //Visualiza una cosa u otra dependiendo del modo
        {modo === 'worker' && (
          <div>
            <h3>Trabajando con un web worker</h3>
            fib({contador})
            <CalcFib count={contador} />
          </div>
        )}
        {modo === 'normal' && (
          <div>
            <h3>Trabajando en el thread principal</h3>
            fib({contador})
            <CalcFib2 count={contador} />
          </div>
        )}
      </div>
    </React.StrictMode>
  );
};

export default App;

