---
layout: default
title: Data Binding
name: Overview
parent: Model View Controller
nav_order: 2
---

# Make use of Data Binding

Instead of manipulating the behavior of your control

```xml
<Title text="Hello {/recipient/firstName} {/recipient/lastName}" id="myControl123" />
```

by its id, like so,

```js
var oTitle = this.getView().byId("myControl123");
oTitle.setText("Hello John Doe");
```

better make use of data binding

```xml
<Title text="Hello {DisplayModel>/recipient/firstName} {DisplayModel>/recipient/lastName}"/>
```

and work on the data model:

```js
var oDisplayModel = this.getView().getModel("DisplayModel");
oDisplayModel.setProperty("/firstName", "John");
oDisplayModel.setProperty("/lastName", "Doe");
```

This pays off especially when working with dynamic arrays being visualized by lists or tables! You feed the model with updated data and data binding will re-render the controls for you automatically.
