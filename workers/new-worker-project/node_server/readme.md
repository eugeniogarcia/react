# Writing middleware for use in Express apps

## Overview

Middleware functions are functions that have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle. The next function is a function in the Express router which, when invoked, executes the middleware succeeding the current middleware.

Middleware functions can perform the following tasks:

- Execute any code.
- Make changes to the request and the response objects.
- End the request-response cycle.
- Call the next middleware in the stack.

If the current middleware function does not end the request-response cycle, it must call next() to pass control to the next middleware function. Otherwise, the request will be left hanging.

## Example

Here is an example of a simple “Hello World” Express application. The remainder of this article will define and add three middleware functions to the application: one called myLogger that prints a simple log message, one called requestTime that displays the timestamp of the HTTP request, and one called validateCookies that validates incoming cookies.

```js
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000)
```

### Middleware function myLogger

Here is a simple example of a middleware function called “myLogger”. This function just prints “LOGGED” when a request to the app passes through it. The middleware function is assigned to a variable named myLogger.

```js
const myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}
```

__Notice the call above to next()__. Calling this function invokes the next middleware function in the app. The next() function is not a part of the Node.js or Express API, but is the third argument that is passed to the middleware function. The next() function could be named anything, but by convention it is always named “next”. To avoid confusion, always use this convention.

__To load the middleware function, call app.use()__, specifying the middleware function. For example, the following code loads the myLogger middleware function before the route to the root path (/).

```js
const express = require('express')
const app = express()

const myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}

app.use(myLogger)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000)
```

Every time the app receives a request, it prints the message “LOGGED” to the terminal.

__The order of middleware loading is important__: middleware functions that are loaded first are also executed first.

If myLogger is loaded after the route to the root path, the request never reaches it and the app doesn’t print “LOGGED”, because the route handler of the root path terminates the request-response cycle.

The middleware function myLogger simply prints a message, then passes on the request to the next middleware function in the stack by calling the next() function.

### Middleware function requestTime

Next, we’ll create a middleware function called “requestTime” and add a property called requestTime to the request object.

```js
const requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next()
}
```

The app now uses the requestTime middleware function. Also, the callback function of the root path route uses the property that the middleware function adds to req (the request object).

```js
const express = require('express')
const app = express()

const requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next()
}

app.use(requestTime)

app.get('/', (req, res) => {
  let responseText = 'Hello World!<br>'
  responseText += `<small>Requested at: ${req.requestTime}</small>`
  res.send(responseText)
})

app.listen(3000)
```

When you make a request to the root of the app, the app now displays the timestamp of your request in the browser.

### Middleware function validateCookies

Finally, we’ll create a middleware function that validates incoming cookies and sends a 400 response if cookies are invalid.

Here’s an example function that validates cookies with an external async service.

```js
async function cookieValidator (cookies) {
  try {
    await externallyValidateCookie(cookies.testCookie)
  } catch {
    throw new Error('Invalid cookies')
  }
}
```

Here we use the cookie-parser middleware to parse incoming cookies off the req object and pass them to our cookieValidator function. The validateCookies middleware returns a Promise that upon rejection will automatically trigger our error handler.

```js
const express = require('express')
const cookieParser = require('cookie-parser')
const cookieValidator = require('./cookieValidator')

const app = express()

async function validateCookies (req, res, next) {
  await cookieValidator(req.cookies)
  next()
}

app.use(cookieParser())

app.use(validateCookies)

// error handler
app.use((err, req, res, next) => {
  res.status(400).send(err.message)
})

app.listen(3000)
```

Note how next() is called after await cookieValidator(req.cookies). This ensures that if cookieValidator resolves, the next middleware in the stack will get called. If you pass anything to the next() function (except the string 'route' or 'router'), Express regards the current request as being an error and will skip any remaining non-error handling routing and middleware functions.

Because you have access to the request object, the response object, the next middleware function in the stack, and the whole Node.js API, the possibilities with middleware functions are endless.

For more information about Express middleware, see: Using Express middleware.

## Configurable middleware

If you need your middleware to be configurable, export a function which accepts an options object or other parameters, which, then returns the middleware implementation based on the input parameters.

`File: my-middleware.js`

```js
module.exports = function (options) {
  return function (req, res, next) {
    // Implement the middleware function based on the options object
    next()
  }
}
```

The middleware can now be used as shown below.

```js
const mw = require('./my-middleware.js')

app.use(mw({ option1: '1', option2: '2' }))
```

## Using middleware

If the current middleware function does not end the request-response cycle, it must call next() to pass control to the next middleware function. Otherwise, the request will be left hanging.

An Express application can use the following types of middleware:

- Application-level middleware
- Router-level middleware
- Error-handling middleware
- Built-in middleware
- Third-party middleware

You can load application-level and router-level middleware with an optional mount path. You can also load a series of middleware functions together, which creates a sub-stack of the middleware system at a mount point.

### Application-level middleware

Bind application-level middleware to an instance of the app object by using the `app.use()` and `app.METHOD()` functions, where `METHOD` is the HTTP method of the request that the middleware function handles (such as `GET`,`PUT`, or`POST`) in lowercase.

This example shows a middleware function with no mount path. The function is executed every time the app receives a request.

```js
const express = require('express')
const app = express()

app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})
```

This example shows a middleware function mounted on the `/user/:id path`. The function is executed for `any type of HTTP` request on the`/user/:id path`.

```js
app.use('/user/:id', (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
})
```

This example shows a route and its handler function (middleware system). The function handles `GET` requests to the `/user/:id path`.

```js
app.get('/user/:id', (req, res, next) => {
  res.send('USER')
})
```

Here is an example of loading a __series of middleware__ functions at a mount point, with a mount path. It illustrates a middleware sub-stack that prints request info for `any type of HTTP` request to the `/user/:id` path.

```js
app.use('/user/:id', (req, res, next) => {
  console.log('Request URL:', req.originalUrl)
  next()
}, (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
})
```

Route handlers enable you to define multiple routes for a path. The example below defines two routes for GET requests to the `/user/:id path`. __The second route will not cause any problems, but it will never get called because the first route ends the request-response cycle__.

This example shows a middleware sub-stack that handles GET requests to the `/user/:id` path.

```js
app.get('/user/:id', (req, res, next) => {
  console.log('ID:', req.params.id)
  next()
}, (req, res, next) => {
  res.send('User Info')
})

// handler for the /user/:id path, which prints the user ID
app.get('/user/:id', (req, res, next) => {
  res.send(req.params.id)
})
```

__To skip the rest of the middleware functions from a router middleware stack, call `next('route')`__ to pass control to the next route. NOTE: `next('route')` will work only in middleware functions that were loaded by using the app.METHOD() or router.METHOD() functions.

This example shows a middleware sub-stack that handles `GET` requests to the`/user/:id` path.

```js
app.get('/user/:id', (req, res, next) => {
  // if the user ID is 0, skip to the next route
  if (req.params.id === '0') next('route')
  // otherwise pass the control to the next middleware function in this stack
  else next()
}, (req, res, next) => {
  // send a regular response
  res.send('regular')
})

// handler for the /user/:id path, which sends a special response
app.get('/user/:id', (req, res, next) => {
  res.send('special')
})
```

Middleware can also be declared in an array for reusability.

This example shows an array with a middleware sub-stack that handles GET requests to the `/user/:id` path:

```js
function logOriginalUrl (req, res, next) {
  console.log('Request URL:', req.originalUrl)
  next()
}

function logMethod (req, res, next) {
  console.log('Request Type:', req.method)
  next()
}

const logStuff = [logOriginalUrl, logMethod]
app.get('/user/:id', logStuff, (req, res, next) => {
  res.send('User Info')
})
```

### Router-level middleware

Router-level middleware works in the same way as application-level middleware, except it is bound to an instance of express.Router().

```js
const router = express.Router()
```

Load router-level middleware by using the `router.use()` and `router.METHOD()` functions.

The following example code replicates the middleware system that is shown above for application-level middleware, by using router-level middleware:

```js
const express = require('express')
const app = express()
const router = express.Router()

// a middleware function with no mount path. This code is executed for every request to the router
router.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})

// a middleware sub-stack shows request info for any type of HTTP request to the /user/:id path
router.use('/user/:id', (req, res, next) => {
  console.log('Request URL:', req.originalUrl)
  next()
}, (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
})

// a middleware sub-stack that handles GET requests to the /user/:id path
router.get('/user/:id', (req, res, next) => {
  // if the user ID is 0, skip to the next router
  if (req.params.id === '0') next('route')
  // otherwise pass control to the next middleware function in this stack
  else next()
}, (req, res, next) => {
  // render a regular page
  res.render('regular')
})

// handler for the /user/:id path, which renders a special page
router.get('/user/:id', (req, res, next) => {
  console.log(req.params.id)
  res.render('special')
})

// mount the router on the app
app.use('/', router)
```

To skip the rest of the router’s middleware functions, call `next('router')` to pass control back out of the router instance.

This example shows a middleware sub-stack that handles GET requests to the `/user/:id` path.

```js
const express = require('express')
const app = express()
const router = express.Router()

// predicate the router with a check and bail out when needed
router.use((req, res, next) => {
  if (!req.headers['x-auth']) return next('router')
  next()
})

router.get('/user/:id', (req, res) => {
  res.send('hello, user!')
})

// use the router and 401 anything falling through
app.use('/admin', router, (req, res) => {
  res.sendStatus(401)
})
```

### Error-handling middleware

Define error-handling middleware __functions in the same way as other middleware functions, except with four arguments instead of three, specifically with the signature `(err, req, res, next)`__:

```js
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

#### Catching Errors

It’s important to ensure that Express catches all errors that occur while running route handlers and middleware.

__Errors that occur in synchronous code__ inside route handlers and middleware __require no extra work__. If synchronous code throws an error, then Express will catch and process it. For example:

```js
app.get('/', (req, res) => {
  throw new Error('BROKEN') // Express will catch this on its own.
})
```

For __errors returned from asynchronous functions__ invoked by route handlers and middleware, you must pass them to the next() function, where Express will catch and process them. For example:

```js
app.get('/', (req, res, next) => {
  fs.readFile('/file-does-not-exist', (err, data) => {
    if (err) {
      next(err) // Pass errors to Express.
    } else {
      res.send(data)
    }
  })
})
```

__Starting with Express 5, route handlers and middleware that return a Promise will call next(value) automatically when they reject or throw an error. For example:__

```js
app.get('/user/:id', async (req, res, next) => {
  const user = await getUserById(req.params.id)
  res.send(user)
})
```

f getUserById throws an error or rejects, _next will be called with either the thrown error or the rejected value_. If no rejected value is provided, next will be called with a default Error object provided by the Express router.

__If you pass anything to the next() function (except the string 'route'), Express regards the current request as being an error and will skip any remaining non-error handling routing and middleware functions__.

You must catch errors that occur in asynchronous code invoked by route handlers or middleware and pass them to Express for processing. For example:

```js
app.get('/', (req, res, next) => {
  setTimeout(() => {
    try {
      throw new Error('BROKEN')
    } catch (err) {
      next(err)
    }
  }, 100)
})
```

The above example uses a try...catch block to catch errors in the asynchronous code and pass them to Express. __If the try...catch block were omitted, Express would not catch the error since it is not part of the synchronous handler code__.

__Use promises to avoid the overhead of the try...catch block__ or when using functions that return promises. For example:

```js
app.get('/', (req, res, next) => {
  Promise.resolve().then(() => {
    throw new Error('BROKEN')
  }).catch(next) // Errors will be passed to Express.
})
```

#### The default error handler

Express comes with a built-in error handler that takes care of any errors that might be encountered in the app. __This default error-handling middleware function is added at the end of the middleware function stack__.

__If you pass an error to next() and you do not handle it__ in a custom error handler, it will be handled by the built-in error handler; the error will be written to the client with the stack trace. The stack trace is not included in the production environment.

When an error is written, the following information is added to the response:

- The `res.statusCode` is set from `err.status` (or `err.statusCode`). _If this value is outside the 4xx or 5xx range, it will be set to 500_.
- The `res.statusMessage` is set according to the status code.
- The body will be the HTML of the status code message when in production environment, otherwise will be err.stack.
- Any headers specified in an `err.headers` object.

#### Writing error handlers

Define error-handling middleware functions in the same way as other middleware functions, except error-handling functions have four arguments instead of three: (err, req, res, next). For example:

```js
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

You define error-handling middleware last, after other app.use() and routes calls; for example:


```js
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(methodOverride())

app.use((err, req, res, next) => {
  // logic
})
```

For organizational (and higher-level framework) purposes, you can define several error-handling middleware functions, much as you would with regular middleware functions. For example, to define an error-handler for requests made by using XHR and those without:

```js
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())
app.use(methodOverride())

app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)
```

In this example, the generic logErrors might write request and error information to stderr, for example:

```js
function logErrors (err, req, res, next) {
  console.error(err.stack)
  next(err)
}
```

Also in this example, clientErrorHandler is defined as follows; in this case, the error is explicitly passed along to the next one.

__Notice that when not calling “next” in an error-handling function, you are responsible for writing (and ending) the response__. Otherwise those requests will “hang” and will not be eligible for garbage collection.

```js
function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    next(err)
  }
}
```

Implement the “catch-all” errorHandler function as follows (for example):


```js
function errorHandler (err, req, res, next) {
  res.status(500)
  res.render('error', { error: err })
}
```