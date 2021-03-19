---
layout: default
title: Error Handling Overview
name: Overview
parent: Error Handling
nav_order: 2
---

# Error Handling Overview
Error handling is probably the most important issue that is regularly neglected. It should be considered a cornerstone of the app: It is the communication basis between the app and the user. 

## Two Different Kinds of Errors
Errors to be dealt with can be classified into two categories: 

1. Errors that affect the interface logic.
2. Errors affecting application logic or data processing in the backend.

The crucial difference between the two categories: The errors from category 1 are caught and output in the controller, the message text for them is stored in the i18n file. The errors from category 2, on the other hand, come from the backend. The message text is transmitted via the gateway service.

As far as category 1 is concerned, the corresponding logic must be mapped in the controller and messages must be output at the appropriate place.

As far as category 2 is concerned, the logic for displaying the messages can be centralised in the SAPUI5 app. For this purpose, an error handler class is created in a separate JavaScript file, in whose constructor an event handler for the RequestFailed event of the OData model is created. The event handler will display the message from the gateway service.