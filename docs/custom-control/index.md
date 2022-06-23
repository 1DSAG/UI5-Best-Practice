---
layout: default
title: Custom Controls
permalink: /custom-controls/
has_children: true
nav_order: 8
---

# Custom Controls

In SAP UI5 it is possible that you extend existing controls. If the normal functionalities of a control are no longer sufficient. Likewise, completely new controls can be created to cope with the growing difficulties of requirements.

The first place that can help in developing custom controls is the detailed official documentation: [Developing Controls](https://sapui5.hana.ondemand.com/#/topic/8dcab0011d274051808f959800cabf9f)

Various [metadata can be defined](https://sapui5.hana.ondemand.com/#/topic/7b52540d9d8c4e00b9723151622bbb64.html) in a UI5 custom control:

- properties
- aggregations
- associations
- events

## library.js vs. Single Control

### Advantages library.js

- one source for (some/all) applications containing custom controls and libraries
