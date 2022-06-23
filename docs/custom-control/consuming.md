---
layout: default
title: Consuming Custom Control
name: Links
parent: Custom Controls
nav_order: 1
---

# Consuming Custom Controls

Depending on the control, you can consum a custom control in several ways.  
If you try to consum a control setup with the UI5 AMD Style, it works out of the box. If it´s written like a standard JavaScript Class you can use the [ui5-tooling-modules](https://www.npmjs.com/package/ui5-tooling-modules) which will convert it to AMD Style automatically for you.

As an example we use the [ui5-cc-errorhandler](https://www.npmjs.com/package/@marianfoo/ui5-cc-errorhandler), because this package contains both examples.  
The two options are in [UI5 style ErrorHandler](https://github.com/marianfoo/ui5-errorhandler/blob/main/ErrorHandler.js) and [js class style ErrorHandler](https://github.com/marianfoo/ui5-errorhandler/blob/main/ErrorHandlerClass.js).  
Additionally, there are two sample apps that have implemented the respective option of consumption [here](https://github.com/marianfoo/ui5-errorhandler-sample).

## UI5 AMD Style

### NPM Package

In npm package of `ui5-cc-errorhandler` in the [ui5.yaml](https://github.com/marianfoo/ui5-errorhandler/blob/main/ui5.yaml) file, the ressource path is defined as:

```yaml
resources:
  configuration:
    paths:
      "/resources/cc/errorhandler/": "./"
```

### Consume in UI5 App

In the [`package.json`](https://github.com/marianfoo/ui5-errorhandler-sample/blob/main/package.json) file of the sample app, we have the following entries:

```json
    "dependencies": {
        "@marianfoo/ui5-errorhandler": "^0.0.1"
    },
```

```json
    "ui5": {
        "dependencies": [
            "@marianfoo/ui5-errorhandler"
        ]
    }
```

Consume it in the UI5 app with the resource path as defined in the npm package ([Component.js](https://github.com/marianfoo/ui5-errorhandler-sample/blob/main/uimoduleui5/webapp/Component.js)):

```js
sap.ui.define(
    ["sap/ui/core/UIComponent", "sap/ui/Device", "de/marianzeis/npmpackagesample/model/models", 
    "cc/errorhandler/ErrorHandler"
    ],
    function (UIComponent, Device, models, ErrorHandler) {
        "use strict";

        return UIComponent.extend("de.marianzeis.npmpackagesample.Component", {
            metadata: {
                manifest: "json",
            },
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                this._oErrorHandler = new ErrorHandler(this);
            },
        });
    }
);
```

## Standard JavaScript Class

Since ui5-tooling-modules can not only convert single controls automatically, but with it any kind of NPM packages can be used.  
The development of the tool is still in progress. In case of bugs or suggestions for improvement, it is best to create an issue [here](https://github.com/ui5-community/ui5-ecosystem-showcase) oder read the [readme here](https://github.com/ui5-community/ui5-ecosystem-showcase/tree/main/packages/ui5-tooling-modules#readme).

In the [ui5.yaml](https://github.com/marianfoo/ui5-errorhandler-sample/blob/main/uimodulenonui5/ui5.yaml) file, we have the following entries:

```yaml
server:
    customMiddleware:
        ...
        - name: ui5-tooling-modules-middleware
          afterMiddleware: compression
builder:
  customTasks:
  - name: ui5-tooling-modules-task
    afterTask: replaceVersion
```

In [package.json](https://github.com/marianfoo/ui5-errorhandler-sample/blob/main/package.json):

```json
    "devDependencies": {
        "ui5-tooling-modules": "^0.1.2",
        "@marianfoo/ui5-errorhandler": "^0.0.1"
    },
    "ui5": {
        "dependencies": [
            "ui5-tooling-modules"
        ]
    }
```

We consume it in [Component.js](https://github.com/marianfoo/ui5-errorhandler-sample/blob/main/uimodulenonui5/webapp/Component.js) with the npm package name:

```js
sap.ui.define(
    ["sap/ui/core/UIComponent", "sap/ui/Device", "de/marianzeis/npmpackagesample/model/models", 
    "@marianfoo/ui5-cc-errorhandler/ErrorHandlerClass"],
    function (UIComponent, Device, models, ErrorHandler) {
        "use strict";

        return UIComponent.extend("de.marianzeis.npmpackagesample.Component", {
            metadata: {
                manifest: "json",
            },
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                this._oErrorHandler = new ErrorHandler(this);
            },
        });
    }
);
```

Now the javaScript class is wrapped:

### Before

```js
var BaseObject = require('sap/ui/base/Object');
var MessageBox = require('sap/m/MessageBox');

module.exports = class ErrorHandler extends BaseObject {
// ************************************************************************************************************
  // Constructor
  // ************************************************************************************************************

  /**
   * Constructor Method of the error handler. Initialises the error handler for the default model of the component.
   * @public
   * @constructor
   * @param {sap.ui.core.UIComponent} oComponent Reference to the component of the app
   * @method module:controller/ErrorHandler#constructor
   */
   constructor(oComponent) {
   ........
```

### After (how the ui5 app is consuming it)

```js
sap.ui.define(['sap/ui/base/Object', 'sap/m/MessageBox'], (function (require$$0, require$$1) { 'use strict';

 function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

 var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
 var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);

 var BaseObject = require$$0__default["default"];
 var MessageBox = require$$1__default["default"];

 var ErrorHandlerClass = class ErrorHandler extends BaseObject {
 // ************************************************************************************************************
   // Constructor
   // ************************************************************************************************************

   /**
    * Constructor Method of the error handler. Initialises the error handler for the default model of the component.
    * @public
    * @constructor
    * @param {sap.ui.core.UIComponent} oComponent Reference to the component of the app
    * @method module:controller/ErrorHandler#constructor
    */
    constructor(oComponent) {
    ........
```
