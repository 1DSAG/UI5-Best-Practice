---
layout: default
title: Error Handling Best Practices
name: Best Practices
parent: Error Handling
nav_order: 3
---

# Error Handling Best Practices

The following points should be observed with regard to error handling:

## Use a Separate ErrorHandler.js File for Error Output

A separate ErrorHandler.js file should at least display all error messages of the integrated OData service. 
In the case of a service query, the event "error" should only be used to implement further processing in the event of an error. The output of the error message, on the other hand, should be automated via the separate error handler.

Example: Don't do this:

```js
this.getModel().read("/Entity('key'", {
    error: function () {
        sap.m.MessageBox.error("Error!", {
            styleClass: this.getOwnerComponent().getContentDensityClass() 	
        });
        this.getView().setBusy(false);
    }
});
```

Instead do that in Component.js file:

```js
this._oErrorHandler = new ErrorHandler(this);
```

And only implement further processing in error function:

```js
this.getModel().read("/Entity('key'", {
    error: function () {
        this.getView().setBusy(false);
    }
});
```

A sample for a separate error handler file can be found in the section "Sample Error Handler". 

## Consider the SAP Fiori Guidelines

The SAP Fiori Guidelines consider error handling in several articles. The article [Error, Warning and Info Messages](https://sapui5.hana.ondemand.com/#/topic/62b1481d3e084cb49dd30956d183c6a0) serves as the basis.

Above all, it is important to choose the right control: Error messages, warnings and information to be confirmed are displayed in a [Message Box](https://experience.sap.com/fiori-design-web/message-box/). Success messages should be displayed in an automatically disappearing [Message Toast](https://experience.sap.com/fiori-design-web/message-toast/). Don't display an error message in a message toast!

If you need to display multiple messages, use a [Message View](https://experience.sap.com/fiori-design-web/message-view/).

Message boxes and message views can be a stumbling block when it comes to setting the correct content density class. When calling a message box, the content density class must always be transferred. If this does not happen, the controls in the view and in the message box may be in different style classes, which does not look very professional.