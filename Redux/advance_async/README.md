# Instalación/Setup

Crea el esqueleto para una aplicación React:

```js
npx create-react-app advance_async

cd advance_async

npm install --save react-redux redux-logger babel-polyfill cross-fetch redux-thunk

npm start
```

# Async Action Creators

Finally, how do we use the synchronous action creators we defined earlier together with network requests? The standard way to do it with Redux is to use the Redux Thunk middleware. It comes in a separate package called redux-thunk. We'll explain how middleware works in general later; for now, there is just one important thing you need to know: by using this specific middleware, an action creator can return a function instead of an action object. This way, the action creator becomes a thunk.

When an action creator returns a function, that function will get executed by the Redux Thunk middleware. This function doesn't need to be pure; it is thus allowed to have side effects, including executing asynchronous API calls. The function can also dispatch actions—like those synchronous actions we defined earlier.
