---
layout: default
title: Error Handling Overview
name: Overview
parent: Error Handling
nav_order: 2
---

# Error Handling Overview
Error handling is probably the most important issue that is regularly neglected. It should be considered a cornerstone of the app: It is the communication basis between the app and the user. 

## Two different kinds of errors

Errors to be dealt with can be classified into two categories: 

1. Errors that affect the interface logic.
2. Errors affecting application logic or data processing in the backend.

The crucial difference between the two categories: The errors from category 1 are caught and output in the controller, the message text for them is stored in the i18n file. The errors from category 2, on the other hand, come from the backend. The message text is transmitted via the gateway service.

As far as category 1 is concerned, the corresponding logic must be mapped in the controller and messages must be output at the appropriate place.

For category 2 errors, the SAPUI5 framework provides the [message manager](https://sapui5.hana.ondemand.com/#/api/sap.ui.core.message.MessageManager). This parses messages from the service responses and triggers an event when new messages are received. The message manager can be used for messages from OData V2 services as well as for messages from OData V4 services. 

## Sample ErrorHandler.js file

It is recommended to outsource the error handling to a separate ErrorHandler.js file. In the section [Sample Error Handler](sampleerrorhandler.markdown), a sample error handler is provided which outputs all messages parsed via the message handler and provides corresponding methods for displaying error, warning, information and success messages from the controller.
