---
layout: default
title: Advanced Features
name: Advanced Features
parent: i18n
nav_order: 2
---

# Advanced Features in i18n

## Placeholder in XML Views

It is also possible to use the parameters directly in the XML view.
There are several things to be aware of here.
When [`getText("title", [parameter])`](https://sapui5.hana.ondemand.com/sdk/#/api/module:sap/base/i18n/ResourceBundle%23methods/getText) is called in the controller to the RessourceModel, the method [`sap/base/strings/formatMessage`](https://sapui5.hana.ondemand.com/sdk/#/api/module:sap/base/strings/formatMessage) is used to implement the parameter.
Since formatter can be used in certain UI5 controls, we can use this method in XML view as well.
However, in order to call the method in the control, it must be declared beforehand.

Since version `1.69` this is possible directly in the XML view, before that the declaration must still be made in the controller.
The Documentation for this is found here: [Require Modules in XML View and Fragment](https://sapui5.hana.ondemand.com/#/topic/b11d853a8e784db6b2d210ef57b0f7d7)

### Usage in 1.69 and above

Instead of a custom formatter, the standard `formatMessage` is used here.

The `xmlns="sap.m"` and `xmlns:core="sap.ui.core"` can also be decleared in the mcv:View directly.

```xml
<Title xmlns="sap.m" xmlns:core="sap.ui.core"
  core:require="{ formatMessage: 'sap/base/strings/formatMessage' }"
  text="{
    parts: [
      'i18n>testString',
      'i18n>testString2'
    ],
    formatter: 'formatMessage'
  }"
/>
```

### Usage in 1.68 and below

Here you have to point the formatter to the Controller where you point to the required `formatMessage` module.

```xml
<Title text="{
  parts: [
    'i18n>testString',
    'i18n>testString2'
  ],
  formatter: '.formatMessage'
}"/>
```

```javascript
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/base/strings/formatMessage",
  // ...
], function(Controller, formatMessage/*, ...*/) {
  "use strict";

  return Controller.extend("...", {
    formatMessage: formatMessage,
    // ...
  });
})
```

### Result

![Usage of Placeholder in i18n in XML Views](img/i18n_PlaceholderXMLViews.png)
:--: 
*Usage of Placeholder in i18n in XML Views*

![Usage of Placeholder in i18n in XML Views](img/i18n_PlaceholderXMLViewsScreenshot.png)
:--: 
*Screenshot of Placeholder in i18n in XML Views*

Ressoures:
- [Stackoverflow Comment](https://stackoverflow.com/a/55587775/4743935)
- [Openui5 Issue with Change to use declaration in XML View](https://github.com/SAP/openui5/issues/2475)