---
layout: default
title: Titles in Targets
name: titles
parent: Routing and Navigation
nav_order: 5
---

## Titles in Targets

Routing in SAPUI5 allows you to define titles declaratively in the configuration. The title can be set with valid binding syntax which is then resolved under the scope of the target to which it belongs. This means that the title can be translated when it’s bound to the i18n model or resolved dynamically under the current binding context.

### Using a translated Target Title

```json
{
    ...,
    "routes": [{
        "pattern": "products/overview",
        "name": "ProductsOverview",
        "target": "products"
    }],
    "targets": {
        "products": {
            "type": "View",
            "path": "shop.products",
            "title": "{i18n>products.overview}"

        }
    },
    ...
}
```

### Using a bound Target Title dynamically

```json
{
    ...,
    "routes": [{
        "pattern": "products/{id}",
        "name": "Product",
        "target": "product"
    }],
    "targets": {
        "product": {
            "type": "View",
            "path": "shop.products",
            "title": "{ 
                parts: ['helperModel>/PRODUCTS_TITLE', 'myModel>productName'], 
                formatter: '.myFormatterFunction' 
            }"
        }
    },
    ...
}
```
