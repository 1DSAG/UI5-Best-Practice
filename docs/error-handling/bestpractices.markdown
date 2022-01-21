---
layout: default
title: Error Handling Best Practices
name: Best Practices
parent: Error Handling
nav_order: 3
---

# Error Handling Best Practices

The following points should be observed with regard to error handling:

## Use a separate ErrorHandler.js file for error output

A separate ErrorHandler.js file should at least display all error messages of the integrated OData service.
The event "error", what is thrown by manual constructed oData queries, should only be used for a further processing of the error, not for displaying the error.

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
this.getModel().read("/Entity('key')", {
    error: function () {
        this.getView().setBusy(false);
    }
});
```

A sample for a separate error handler file can be found in the section [Sample Error Handler](sampleerrorhandler.markdown).

## Consider the SAP Fiori Guidelines

The SAP Fiori Guidelines deal with error handling in several articles. The article [Error, Warning and Info Messages](https://sapui5.hana.ondemand.com/#/topic/62b1481d3e084cb49dd30956d183c6a0) serves as the basis.

An important first step is the selection of the right control: Error messages, warnings and information to be confirmed are displayed in a [Message Box](https://experience.sap.com/fiori-design-web/message-box/). Success messages should be displayed in an automatically disappearing [Message Toast](https://experience.sap.com/fiori-design-web/message-toast/). Don't display an error message in a message toast!

If you need to display multiple messages, use a [Message View](https://experience.sap.com/fiori-design-web/message-view/).

Make sure that message boxes and messages views use the correct content density class. When calling a message box, the style class must always be transferred. If this does not happen, the controls in the view and in the message box may be in different style classes, which does not look very professional.

## Send application-related messages from the frontend and technical or business messages from the backend

It should be noted that verifications should be made at the right place and thus error messages should be thrown at the appropriate place.

Error messages from the SAPUI5 application should only concern the application logic and not contain any business logic. Example for a message from the frontend: Before a form is submitted, it is checked whether all mandatory fields are filled and the postcode entered is in the correct format (five digits). If this is not the case, an error message is sent from the controller and no request is sent against the backend.

Subject-specific verifications, on the other hand, should take place in the backend and subject-specific error messages should be issued accordingly via the OData service. Example for a message from the backend: When data is entered via a form, a check is made to see whether the postcode entered exists. If the postcode does not exist, an error message will be thrown by the service.

## Also display several error messages at once

An OData service can send a response with several error messages as a result of a request. It is also possible that several requests are made in parallel and that error messages from two different requests are sent to the frontend app. Likewise, it is also possible that an error message is displayed originating from the controller and at that moment an error message from the backend reaches the frontend app. To summarise briefly: It is possible that several relevant messages exist at the same time.

In the literature or in instructions on the internet, similar variants like the following for the output of service errors can be found (don't use that):

```js
_showServiceError: function(sDetails) {
    if (this._bMessageOpen){
        return;
    }
    this._bMessageOpen = true;
    MessageBox.error("An ErrorOccurred", {
        details: sDetails,
        actions: [MessageBox.Action.CLOSE],
        onClose: function(){
            this._bMessageOpen = false;
        }.bind(this)
    });
}
```

If you need to display multiple messages, use a [Message View](https://experience.sap.com/fiori-design-web/message-view/).

Message boxes and message views can be a stumbling block when it comes to setting the correct content density class. When calling a message box, the content density class must always be transferred. If this does not happen, the controls in the view and in the message box may be in different style classes, which does not look very professional.

## Send application related messages from the frontend and technical or business messages from the backend

It should be noted that verifications should be made at the right place and thus error messages should be thrown at the appropriate place.

Error messages from the SAPUI5 application should only concern the application logic and not contain any business logic. Example for a message from the frontend: Before a form is submitted, it is checked whether all mandatory fields are filled and the postcode entered is in the correct format (five digits). If this is not the case, an error message is sent from the controller and no request is sent against the backend.

Subject-specific verifications, on the other hand, should take place in the backend and subject-specific error messages should be issued accordingly via the OData service. Example for a message from the backend: When data is entered via a form, a check is made to see whether the postcode entered exists. If the postcode does not exist, an error message will be thrown by the service.

## display several error messages at once

An OData service can send a response with several error messages as a result of a request. It is also possible that several requests are made in parallel and that error messages from two different requests are sent to the frontend app. Last but not least, it is also possible that an error message is displayed from the controller and at that moment an error message from the backend reaches the frontend app. To summarise briefly: It is possible that several relevant messages exist at the same time.

In the literature or in instructions on the internet, the following variant for the output of service errors is often found (don't use that):

```js
_showServiceError: function(sDetails) {
    if (this._bMessageOpen){
        return;
    }
    this._bMessageOpen = true;
    MessageBox.error("An ErrorOccurred", {
        details: sDetails,
        actions: [MessageBox.Action.CLOSE],
        onClose: function(){
            this._bMessageOpen = false;
        }.bind(this)
    });
}
```

This form of error output ensures that only one error is displayed and all other errors are ignored. Instead, in the case of multiple errors, you should use a message view instead of the message box.

An example for a smarter implementation can be found in the [Sample Error Handler](sampleerrorhandler.markdown).
