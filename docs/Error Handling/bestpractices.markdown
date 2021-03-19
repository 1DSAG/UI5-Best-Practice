---
layout: default
title: Error Handling Best Practices
name: Best Practices
parent: Error Handling
nav_order: 3
---

# Error Handling Best Practices

The following points should be observed with regard to error handling:

## Consider the SAP Fiori Guidelines

The SAP Fiori Guidelines consider error handling in several articles. The article [Error, Warning and Info Messages](https://sapui5.hana.ondemand.com/#/topic/62b1481d3e084cb49dd30956d183c6a0) serves as the basis.

Above all, it is important to choose the right control: Error messages, warnings and information to be confirmed are displayed in a [Message Box](https://experience.sap.com/fiori-design-web/message-box/). Success messages should be displayed in an automatically disappearing [Message Toast](https://experience.sap.com/fiori-design-web/message-toast/). Don't display an error message in a message toast!

Message boxes can be a stumbling block when it comes to setting the correct content density class. When calling a message box, the content density class must always be transferred. If this does not happen, the controls in the view and in the message box may be in different style classes, which does not look very professional.

