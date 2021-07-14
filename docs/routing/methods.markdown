---
layout: default
title: Methods and Events
name: methods
parent: Routing and Navigation
nav_order: 4
---

## Methods

Navigation can be triggered by method the [navTo](https://sapui5.hana.ondemand.com/#/api/sap.ui.core.routing.Router%23methods/navTo){:target="_blank"} on `sap.ui.core.routing.Router`.

You can use a generic navTo method in your BaseController and call it from any controller within your applicataion:

**BaseController**:

```js
sap.ui.require([
    "sap/ui/core/mvc/Controller",
], function(Controller) {
    "use strict";

    return Controller.extend("myApp.controller.BaseController",

        navTo: function(sName, oParameters, oComponentTargetInfo, bReplace) {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo(sName, oParameters, oComponentTargetInfo, bReplace);
    });
});
```

**Main Controller**:

```js
sap.ui.require([
    "myApp/controller/BaseController",
], function(BaseController) {
    "use strict";

    return BaseController.extend("myApp.controller.Main",

        anyEvent: function() {
            this.navTo("productDetails", {
                productId: "5"
            });
    });
});
```

## Events

The events `routeMatched` on `sap.ui.core.routing.Router` and `matched` on `sap.ui.core.routing.Route` are fired when a hash matches a route or a pattern.

### RouteMatched

The routeMatched event is fired if a pattern of any route in the routing configuration is matched.

```js
sap.ui.require([
    "myApp/controller/BaseController",
], function(BaseController) {
    "use strict";

    return BaseController.extend("myApp.controller.Home", {

        onInit: function() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onRoutePatternMatched, this);
        },
    
        onRoutePatternMatched : function(oEvent) {
            // fired everytime a pattern of any route in the routing configuration is matched
        }
    });
});
```

### Matched

```js
sap.ui.require([
    "myApp/controller/BaseController",
], function(BaseController) {
    "use strict";

    return BaseController.extend("myApp.controller.Home", {

        onInit: function() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Home").attachMatched(this.onRouteMatched, this);
        },
    
        onRouteMatched : function(oEvent) {
            // fired everytime the Home route is matched
        }
    });
});
```
