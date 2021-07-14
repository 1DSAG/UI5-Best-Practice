---
layout: default
title: Patterns and Parameters
name: patterns
parent: Routing and Navigation
nav_order: 2
---

## Routing Patterns

Whenever a hash is added to a URL, the router checks whether there is a route with a matching pattern. The first matching route is taken and the corresponding target view is called. The data provided with the hash are passed on to the target.

You can use the following kinds of patterns:

* **Hard-coded pattern**:

   The pattern matches the hash exactly. For example, when a pattern is defined as `product/settings`, this pattern matches only if the hash is `product/settings` and no data is passed on to the events of the route.

* **Route with mandatory parameter**:

   You can define mandatory parameters for the pattern by placing the parameter in curly brackets (`{parameter ID}`).

   For example, if you define the pattern `product/{id}`, the hashes `product/5` and `product/3` (where 3 and 5 are product IDs) match the pattern. The matched event handler gets 5 or 3 passed on with the key id in its arguments. But hash `product/` does not match the pattern because the mandatory parameter is missing.

* **Route with optional parameter**:

   You can define optional parameters for the pattern by placing the parameter between colons (`:parameter ID:`).

   For example, if you define a pattern `product/{id}/detail/:detailId:`, the detailId parameter is optional, whereas id is mandatory. Both hashes `product/5/detail` and `product/3/detail/2` match the pattern.

* **Route with query parameter**:

   The query parameter allows you to pass on queries with any parameter. A query parameter starts with `?`, and you can either define it as mandatory (`product/{?query}`) or optional (`product/:?query:`).

   The matched value will be converted into an object saved with the parameter name as the key when passed to the event handler.

* **"rest as string" parameter**:

   A parameter that ends with an asterisk (`*`) is called a "rest as string" parameter. Such a parameter matches as much as possible. It can be combined with the syntax of mandatory or optional parameters.

   For example, a pattern `product/{id}/:detail*:` defines a mandatory parameter with the name id and an optional "rest as string" parameter with the name detail. It matches `product/5/3` and `product/5/detail/3/foo`. The event handler gets `3` or `detail/3/foo` passed on with the key detail in its arguments.

## Parameters

Routing parameters should be url safe, so stay away from unsafe characters as parameters like:

`{ } | \ ^ ~ [ ]`

Routing parameters will be URI encoded, so the following characters are reserved and will not be encoded:

`; , ? : @ & = + $`

Routing parametes should be named in singular form

<div class="goodExample" markdown=1>

### Good example

* `orders/{orderId}`
* `productDetails/{productId}`

</div>

<div class="badExample" markdown=1>

### Bad example

* `orders/{orderItems}`
* `itemDetails/{objectIds}`

</div>