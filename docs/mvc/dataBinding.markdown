---
layout: default
title: Data Binding
name: Overview
parent: Model View Controller
nav_order: 2
---

# Make use Data Binding

Instead of manipulating the behavior of your control

    <Title text="Hello {/recipient/firstName} {/recipient/lastName}" id="myControl123" />

by its id, like so,

    var oTitle = this.getView().byId("myControl123");
    oTitle.setText("Hello John Doe");

better make use of data binding

    <Title text="Hello {DisplayModel>/recipient/firstName} {DisplayModel>/recipient/lastName}"/>

and work on the data model:

    var oDisplayModel = this.getView().getModel("DisplayModel");
    oDisplayModel.setProperty("/firstName", "Doe");
    oDisplayModel.setProperty("/lastName", "Doe");

This pays off especially when working with dynamic arrays being visualized by list or tables!
