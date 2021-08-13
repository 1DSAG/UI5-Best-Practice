---
layout: default
title: Promise
name: Overview
parent: Performance
nav_order: 1
---

## Promise

With the help of Promises, you can easily

* handle asynchronous methods
* control the execution of async methods
  * in parallel
  * sequential
* control the flow of async methods in success / error cases
* enhance the UX with loading indicators
* ...

If you are new to Promises, please make yourself familiar before continuing:

<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise>

All OData calls used in this article refer to OData v2.

### Basic OData call

This is a very basic OData call where the key and the callbacks are hardcoded.

```js
var model = that.getView().getModel();
model.read("/MyEntitySet('12345')", {
  success: function (data, response) {
    // success handler
  },
  error: function (error) {
    // error handler
  }
});
```

### Promisified OData call

A wrapped version of the basic OData call.

The key is given as parameter and the wrapping method returns a promise. The `resolve` / `reject` methods are used in the `success` / `error` callbacks to resolve or reject the Promise.

As the `resolve` method takes only one parameter, data and response are passed as object.

```js
function readMyEntity(id) {
  return new Promise(function (resolve, reject) {
    var model = that.getView().getModel();
    model.read("/MyEntitySet('" + id + "')", {
      success: function (data, response) {
        resolve({ data: data, response: response });
      },
      error: function (error) {
        reject(error);
      }
    });
  });
}
```

The success and error handling can now be done after invoking the method. This is done by applying the [Promise Chain Pattern](#chaining-multiple-odata-calls-together).

```js
readMyEntity(12345)
  .then(function (result) {
    // success handler
    console.log(result.data, result.response);
  })
  .catch(function (error) {
    // error handler
    console.error(error);
  });
```

### Refactor the Promisified OData call

Now, let's make the OData call more robust for everyday usage:

* hand over the whole entity as object and construct the key from its data
* provide an option to add additional data like filters to the call (`mParameters` as described in the [documentation](https://ui5.sap.com/#/api/sap.ui.model.odata.v2.ODataModel%23methods/read))
* make sure its not possible to provide `success` / `error` callbacks with the parameters object as this would break the promise functionality

The UI5 framework detects when the same OData call is done multiple times. It does only one request and returns the same result object for every call. If this result object is being changed, it changes for all calls. To prevent this from happening, the result is being copied with `Object.assign()`.

If you plan to use this with IE11, make sure to provide the [Object.assign Polyfill](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#polyfill). In case the Polyfill is not option for you, a simple `JSON.parse(JSON.stringify(data))` could do the trick as well.

```js
/** 
 * Returns the result of the OData call
 * @param {object} payload - The payload which equals to the entity
 * @param {object} parameters - The parameters like Filters added to the OData call
 * @returns {Promise} Promise object represents result of the OData call
 */
function readMyEntity(payload, parameters) {
  var model = this.getView().getModel();
  parameters = parameters || {};
  return model.metadataLoaded()
    .then(function () {
      return new Promise(function (resolve, reject) {
        var key = model.createKey("/MyEntitySet", payload)
        // prevent success / error callbacks to be overwritten
        var params = Object.assign({}, parameters,
          {
            success: function (data, response) {
              // prevent accidently change of response data for subsequent calls
              var dataCopy = Object.assign({}, data);
              resolve({ data: dataCopy, response: response });
            },
            error: function (error) {
              // additional error handling when needed
              reject(error);
            }
          });
        model.read(key, params);
        // update could look like this:
        // model.update(key, payload, params);
        // create could look like this:
        // model.create("/MyEntitySet", payload, params);
        // delete could look like this:
        // model.remove(key, params);
      })
    })
}

readMyEntity({ id: 12345 })
  .then(function (result) {
    console.log(result.data, result.response);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Chaining multiple OData calls together

Breaks after the first Promise which does not resolve.  
The `finally` method is not supported by the Promise Polyfill for IE11.

<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#chaining>

```js
myElement.setBusy(true);
readMyEntity({ id: 12345 })
  .then(function (result) {
    console.log(result.data, result.response);
    return readMyEntity({ id: 67890 })
  })
  .then(function (result) {
    console.log(result.data, result.response);
    return readMyEntity({ id: 34567 })
  })
  .then(function (result) {
    console.log(result.data, result.response);
  })
  .catch(function (error) {
    console.error(error);
  })
  .finally(function () {
    myElement.setBusy(false);
  });
```

### Run multiple OData calls in parallel

#### Promise.all

Breaks with the first Promise that is rejected. The results are ordered the same way your promises where.

<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all>

```js
Promise.all([
  readMyEntity({ id: 12345 }),
  readMyEntity({ id: 67890 })
])
  .then(function (results) {
    console.log(results);
    // success handler
  })
  .catch(function (error) {
    console.error(error);
    // error handler
  });
```

#### Promise.allSettled

Waits until all Promises are fullfilled/rejected and tells the status as well as the result.  
For two Promises where the first resolves and the second gets rejected, this could like like this:

```js
// example result with two promises
[
  {status: "fulfilled", value: ...},
  {status: "rejected",  reason: ...}
]
```

<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled>

```js
Promise.allSettled([
  readMyEntity({ id: 12345 }),
  readMyEntity({ id: 67890 })
])
  .then(function (results) {
    console.log(results);
    // success / error handler
  });
```
