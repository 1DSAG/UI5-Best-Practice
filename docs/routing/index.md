---
layout: default
title: Routing and Navigation
permalink: /routing/
has_children: true
nav_order: 1
---

## Routing and Navigation

SAPUI5 offers hash-based navigation, which allows you to build single-page apps where the navigation is done by changing the hash. In this way the browser does not have to reload the page; instead there is a callback to which the app and especially the affected view can react. A hash string is parsed and matched against patterns which will then inform the handlers [(1)](#reference1).

> **_NOTE:_** SAPUI5 uses [Crossroads.js](https://millermedeiros.github.io/crossroads.js/) for parsing the hash and the Hasher framework for manipulating the hash.

In SAPUI5, navigation and routing is implemented using a “router” (`sap.m.routing.Router` or `sap.ui.core.routing.Router`) to forward the hash change and the data in the hash to one or more views of the app [(2)](#reference1).

You use **routes** to notify your application that the hash has changed to a certain value. For each route, you define the **pattern** that can be used in the app implementation.

With **targets**, you define where a view or a component is loaded and where the view or component is shown on the UI. By referring to one or multiple targets in a route's definition, you can load and show the views or components once the route's pattern matches the current hash [(3)](#reference3).

### References

<a href="https://help.sap.com/saphelp_snc700_ehp04/helpdata/de/3d/18f20bd2294228acb6910d8e8a5fb5/content.htm?no_cache=true" name="reference1">(1) SAP Help: Routing and Navigation</a>  
<a href="https://help.sap.com/doc/saphelp_nw75/7.5.5/en-US/3d/18f20bd2294228acb6910d8e8a5fb5/content.htm?no_cache=true" name="reference2">(2) SAP Help: Routing and Navigation</a>  
<a href="https://sapui5.hana.ondemand.com/sdk/#/topic/2366345a94f64ec1a80f9d9ce50a59ef" name="reference3">(3) UI5 Doc: Routing with Parameters</a>  
