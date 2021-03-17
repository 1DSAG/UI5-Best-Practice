---
layout: default
title: Namespaces
name: Overview
parent: Naming Conventions
nav_order: 1
---

# XML Views

    <mvc:View
        xmlns:mvc="sap.ui.core.mvc"
        xmlns:layout="sap.ui.layout"
        xmlns:form="sap.ui.layout.form"
        xmlns="sap.m">
    </mvc:View>

One of the required namespaces can be defined as the default namespace (xmlns="..."). The control tags for this namespace do not need a prefix.

- Keep this un-prefixed control tag always to the very same library **sap.m** in all view XMLs of your project!
- Keep each named prefix constant throughout your project.
