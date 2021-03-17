---
layout: default
title: Model Naming
name: Overview
parent: Naming Conventions
nav_order: 2
---

# Model Naming

The standard view model is very often unnamed in all the Walkthrough tutorials:

    var oData = {
      recipient : {
        firstName : "John",
        lastName : "Doe"
      }
    };
    var oModel = new JSONModel(oData);
    this.getView().setModel(oModel); // <-- No naming here!

Then, inside the corresponding view XML, model data may be referenced like so:

    <Title text="Hello {/recipient/firstName} {/recipient/lastName}" />

In large projects with diverse models inside many views and controllers, its often very helpful to quickly lookup the usage of a certain model. In such cases it would really save a lot time if the model had a proper naming:

    this.getView().setModel(oModel, "DisplayModel"); // <-- Example of a proper name

Then, inside the view XML, it would be:

    <Title text="Hello {DisplayModel>/recipient/firstName} {DisplayModel>/recipient/lastName}" />
