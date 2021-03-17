---
layout: default
title: Base Controllers
name: Overview
parent: Model View Controller
nav_order: 1
---

# Use base controllers

Keep commonly used methods such as

- getResourceBundle
- getRouter
- getModel
- setModel
- onNavBack
- _or whatever method or property is being actively re-used inside your project_

inside a base controller:

    |-+ webapp
      |-+ controller
        |-- BaseController.js

**webapp/controller/BaseController.js:**

    sap.ui.define([
      "sap/ui/core/mvc/Controller",
      "sap/ui/core/routing/History",
      "sap/ui/core/UIComponent"
    ], function(Controller, History, UIComponent) {

      "use strict";
      return Controller.extend("com.myCompany.myProduct.controller.BaseController", {

        getRouter : function () {
          return UIComponent.getRouterFor(this);
        },
        ...
        onNavBack: function () {
          var oHistory, sPreviousHash;
          oHistory = History.getInstance();
          sPreviousHash = oHistory.getPreviousHash();
          if (sPreviousHash !== undefined) {
            window.history.go(-1);
          } else {
            this.getRouter().navTo("appHome", {}, true /*no history*/);
          }
        }

      });
    });

All view controllers should use the _BaseController.js_ as their parent controller like so:

**webapp/controller/App.controller.js:**

    sap.ui.define([
      "com/myCompany/myProduct/controller/BaseController"
    ], function (Controller) {
      "use strict";
      return Controller.extend("com.myCompany.myProduct.controller.App", {
        onInit: function () {
          ...
    		}
      });
    });
