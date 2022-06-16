---
layout: default
title: Configuration
name: configuration
parent: Routing and Navigation
nav_order: 2
---

## Routes

Each route defines a name, a pattern, and optionally one or more targets to which to navigate when the route has been matched. In the routes section, you define which patterns are available for navigation.

Targets and routes should match view file to easily track the flow of the navigation [(1)](#reference1).

## Targets

A target defines the view or component that is displayed. It is associated with one or more routes or it can be displayed manually from within the app. Whenever a target is displayed, the corresponding view or component is loaded and added to the aggregation configured with the controlAggregation option of the control.

Route names should be descriptive by itself. Prefer plural form for routes if applicable [(2)](#reference2).

<div class="goodExample" markdown=1>

### Good example

- `home`
- `productDetails`

</div>

<div class="badExample" markdown=1>

### Bad example

- `page1`
- `itemDetail`

</div>

## Config

The config section contains the global router configuration and default values that apply for all routes and targets. Provide the following as minimal settings for targets:

- `routerClass`: Either `sap.ui.core.routing.Router` or `sap.m.routing.Router` (recommended)

   Compared to `sap.ui.core.routing.Router`, the `sap.m.routing.Router` is optimized for mobile apps and adds the properties `viewLevel`, `transition`, and `transitionParameters` which can be specified for each route or target created by the `sap.m.routing.Router`. The `transitionParameters` can also be used for custom transitions.

- `bypassed`: Fail safe target for unmatched routes.

- `async`: Defines whether targets are loaded asynchronously. The default value is `false`. We recommend setting this parameter to `true` to improve performance [(3)](#reference3).

## Example Manifest

```json
{
  "_version": "1.12.0",
  "sap.app": {...},
  "sap.ui": {...},
  "sap.ui5": {
    "rootView": {
      "viewName": "dsag.example.view.App",
      "type": "XML",
      "async": true,
      "id": "app"
    },
    "dependencies": {...},
    "models": {...},
    "routing": {
      "config": {
        "routerClass": "sap.m.routing.Router",
        "viewType": "XML",
        "viewPath": "dsag.example.view",
        "controlId": "app",
        "controlAggregation": "pages",
        "transition": "slide",
        "async": true,
        "bypassed": {
            "target": "notFound"
         },
      },
      "routes": [
        {
          "pattern": "",
          "name": "appHome",
          "target": "home"
        }, {
          "pattern": "employee",
          "name": "employee",
          "target": "employee"
        }
      ],
      "targets": {
        "home": {
          "viewId": "home",
          "viewName": "Home",
          "viewLevel": 1
        },
        "employee": {
          "viewId": "employee",
          "viewName": "Employee",
          "viewLevel": 2,
          "transition": "flip"
        },
        "notFound": {
          "viewId": "notFound",
           "viewName": "NotFound",
           "transition": "show"
         }
      }
    }
  }
}
```

#### References

<a href="https://help.sap.com/doc/saphelp_nw75/7.5.5/en-US/90/2313063d6f45aeaa3388cc4c13c34e/content.htm?no_cache=true" name="reference1">(1) SAP Help: Routing Configuration</a>  
<a href="https://sapui5.hana.ondemand.com/sdk/#/topic/902313063d6f45aeaa3388cc4c13c34e.html" name="reference2">(2) UI5 Doc: Routing Configuration</a>  
<a href="https://ui5.sap.com/#/topic/cf3c57c89ef0491793d1ce327ab4f9b2" name="reference3">(3) UI5 Doc: Enable Routing</a>  