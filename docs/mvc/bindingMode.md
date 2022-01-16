---
layout: default
title: Binding Mode
name: Overview
parent: Model View Controller
nav_order: 3
---

# One-Way-Binding vs Two-Way-Binding

See [Step 4](https://sapui5.hana.ondemand.com/#/topic/c72b922fdb59422496661000165d7ff1) and [Step 5](https://sapui5.hana.ondemand.com/#/topic/88756c08fe144ba08ff1762ad92fc07c) of the _Data Binding Tutorial_ to see the practical difference between the two binding modes!

- One-way binding means a binding from the model to the view. Any value changes in the model update all corresponding bindings and the view.
- Two-way binding means a binding from the model to the view and from the view to the model. Any changes in the model or the view fire events that automatically trigger updates of all corresponding bindings and both the view and the model.
- Two-way binding is currently only supported for property bindings.
- When using formatter functions, the binding is automatically switched to "one-way". So you can’t use a formatter function for "two-way" scenarios, but you can use [Data Types](https://sapui5.hana.ondemand.com/#/topic/07e4b920f5734fd78fdaa236f26236d8.html#loio07e4b920f5734fd78fdaa236f26236d8/section_DataTypes).
