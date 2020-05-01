# Instalación/Setup

Crea el esqueleto para una aplicación React:

```js
npx create-react-app persistencia

cd persistencia

npm start
```

Instalamos persistencia de redux:

```ps
npm install --save redux-persist
```

# Implementación

## Configuración del Store

Para crear un store, pasamos un persistReducer en lugar de un reducer. El persistReducer es un wrapper del root reducer. `persistReducer` devuelve un reducer con esteroides.

```js
const persistConfig = {
 key: 'root',
 storage: storage,
 stateReconciler: autoMergeLevel2
};

const pReducer = persistReducer(persistConfig, rootReducer);
```

y creamos el store:

```js
export const store = createStore(pReducer);
```

State reconcilers define como será "mergeado" un un estado de "entrada" con el estado inicial. Hay tres opciones:

- hardSet (import hardSet from 'redux-persist/lib/stateReconciler/hardSet') This will hard set incoming state. This can be desirable in some cases where persistReducer is nested deeper in your reducer tree, or if you do not rely on initialState in your reducer.
    - incoming state: { foo: incomingFoo }
    - initial state: { foo: initialFoo, bar: initialBar }
    - reconciled state: { foo: incomingFoo } // note bar has been dropped

- autoMergeLevel1 (default) This will auto merge one level deep. Auto merge means if the some piece of substate was modified by your reducer during the REHYDRATE action, it will skip this piece of state. Level 1 means it will shallow merge 1 level deep.
    - incoming state: { foo: incomingFoo }
    - initial state: { foo: initialFoo, bar: initialBar }
    - reconciled state: { foo: incomingFoo, bar: initialBar } // note incomingFoo overwrites initialFoo

- autoMergeLevel2 (import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2') This acts just like autoMergeLevel1, except it shallow merges two levels
    - incoming state: { foo: incomingFoo }
    - initial state: { foo: initialFoo, bar: initialBar }
    - reconciled state: { foo: mergedFoo, bar: initialBar } // note: initialFoo and incomingFoo are shallow merged

Una vez hemos creado el store, se lo pasamos a la funcion persistStore, que es la que se encarga de que el estado redux se guarde en el almacenamiento persistente cuando cambie.

```js
export const persistor = persistStore(store);
```

El objeto `persistor` tiene los siguientes métodos:

- .purge(). Borra el estado del almacenamiento - persistente. Es asíncrono, devuelve una Promise
- .flush(). Escribe cualquier dato que estuviera pendiente. Es asíncrono, devuelve una Promise
- .pause(). Para la persistencia
- .persist(). Retoma la persistencia

## Configuración de React

Usamos un componente llamado PersistGate para wrappear la aplicacón. Esto hace que el rendering se retrase hasta que el estado no se haya leido desde el almacenamento. Se pueden especificar valores por defecto a utilizar mientras se hace la carga.

```js
const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingView />} persistor={persistor}>
        <RootComponent />
      </PersistGate>
    </Provider>
  );
};
```

## Configurar que se lleva al almacenamiento

Si hay una parte del estado que no queremos almacenar, la incluimos en el __blacklist__:

```js
const persistConfig = {
  key: 'root',
  storage: storage,
  blacklist: ['navigation']
};

const pReducer = persistReducer(persistConfig, rootReducer);
```

El blacklist es un array de strings. Cada string se debe corresponder con una parte del estado de los gestionados por el reducer. En el caso anterior, por ejemplo, _navigation_ debería ser uno de los componentes del estado que se combinan en el reducer:

```js
combineReducers({ 
  auth: AuthReducer,
  navigation: NavReducer, 
  notes: NotesReducer
});
```

La __whitelist__ funciona similar:

```js
const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['auth', 'notes']
};
```

Si queremos hacer un blacklisting más fino, sino queremos bloquear todo auth, pero una parte, por ejemplo, un atributo llamado isLoggingIn. Entonces tendremos que convertir AuthReducer en un persistentReducer, y hacer el blacklisting aqui:

```js
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const INITIAL_STATE = {
  currentUser: null,
  isLoggingIn: false
};

const AuthReducer = (state = INITIAL_STATE, action) => {
  // reducer implementation
};

const persistConfig = {
  key: 'auth',
  storage: storage,
  blacklist: ['isLoggingIn']
};

export default persistReducer(persistConfig, AuthReducer);
```

También se puede hacer:

```js
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

import { authReducer, navReducer, notesReducer } from './reducers'

const rootPersistConfig = {
  key: 'root',
  storage: storage,
  blacklist: ['navigation']
};

const authPersistConfig = {
  key: 'auth',
  storage: storage,
  blacklist: ['isLoggingIn']
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  navigation: navReducer,
  notes: notesReducer
});

export default persistReducer(rootPersistConfig, rootReducer);
```

## Proceso de Merge

Cuando la aplicacón se arranca, redux fija el estado inicial, y tras un lapso de tiempo Redux Persist recupera los datos desde el almacenamiento persistente, sobre-escribiendo el estado inicial. Sino hacemos nada este es el comportamiento por defecto, pero podemos personalizar el comportamiento. Para ellos podemos gestonar la acción REHYDRATE en el reducer, y actualizando el estado. Por ejemplo:

```js
import { REHYDRATE } from 'redux-persist';

const INITIAL_STATE = {
  currentUser: null,
  isLoggingIn: false
};

const AuthReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case REHYDRATE:
      return {
        ...state,
        currentUser: action.payload.currentUser
      };

    // ...handle other cases
```

La acción REHYDRATE la emite Redux Persist inmediatamente después de que se haya leido el estado desde el almacenamiento persistente. Lo que quiera que retornemos al gestionar la acción REHYDRATE será el estado final.

## Referencias

[The Definitive Guide to Redux Persist](https://blog.reactnativecoach.com/the-definitive-guide-to-redux-persist-84738167975)