---
layout: default
title: async / await
name: Overview
parent: Performance
nav_order: 2
---

## async / await

[async / await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await) is not compatible with IE 11!

I suggest reading the [Promise](promise.md) chapter first.

### Get the Promisified OData call ES6 ready

You could use the [Promisified OData call](promise.html#promisified-odata-call), but why not use modern syntax? 😎

Documentation of the used features:

* [Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
* [Default parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters)
* [Spread Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
* [Arrow function expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
* [Shorthand property names](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#new_notations_in_ecmascript_2015)

```js
/** 
 * Returns the result of the OData call
 * @param {object} payload - The payload which equals to the entity
 * @param {object} parameters - The parameters like Filters added to the OData call
 * @returns {Promise} Promise object represents result of the OData call
 */
function readMyEntity({ payload, parameters = {} }) {
  const model = this.getView().getModel()
  return model.metadataLoaded()
    .then(() => {
      return new Promise((resolve, reject) => {
        const key = model.createKey('/MyEntitySet', payload)
        // prevent success / error callbacks to be overwritten
        const params = {
          ...parameters,
          success: (data, response) => {
            // prevent accidently change of response data for subsequent calls
            resolve({ data: { ...data }, response });
          },
          error: error => {
            // additional error handling when needed
            reject(error)
          },
        }
        model.read(key, params)
        // update could look like this:
        // model.update(key, payload, params)
        // create could look like this:
        // model.create('/MyEntitySet', payload, params)
        // delete could look like this:
        // model.remove(key, params)
      })
    })
}
```

### async / await syntax sugar

```js
async function init() {
  try {
    const { data, response } = await readMyEntity({ id: 12345 })
    console.log(data, response)
  } catch (error) {
    console.error(error)
  }
}
```

### Run multiple Promises in parallel

#### Promise.all

Breaks with the first Promise that is rejected.

<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all>

```js
async function init() {
  try {
    const [result1, result2] = await Promise.all([
      readMyEntity({ id: 12345 }),
      readMyEntity({ id: 67890 }),
    ])
    console.log(result1, result2)
  } catch (error) {
    console.error(error)
  }
}
```

#### Promise.allSettled

Waits until all Promises are fullfilled and tells the status as well as the result.

<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled>

```js
async function init() {
  try {
    const [result1, result2] = await Promise.allSettled([
      readMyEntity({ id: 12345 }),
      readMyEntity({ id: 67890 }),
    ])
    console.log(result1, result2)
  } catch (error) {
    console.error(error)
  }
}
```
