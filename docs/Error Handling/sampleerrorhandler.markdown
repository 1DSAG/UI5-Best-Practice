---
layout: default
title: Sample Error Handler
name: Sample
parent: Error Handling
nav_order: 4
---

# Sample Error Handler

At this point, a sample error handler is provided that takes into account the best practices described in this guide. 
If the error handler is correctly integrated, messages from an OData V2 or Odata V4 service are automatically output in the designated control: Error messages in a Message Box, success messages in a Message Toast and a collection of messages in a Message View.
For application-related messages from the controller, the methods displayError, displayWarning, displayInformation and displaySuccess are provided.

## Setup

 1. Add a new file called ErrorHandler.js in folder webapp/controller.<br>
   <img src="img/NewFile.gif"/>
 2. Insert the source code of the error handler. You can download the source code or copy it from the collapsed text.<br>
        [Error Handler (English comments)](DSAG_Sample_ErrorHandler_EN.js) <br>
        [Error Handler (German comments)](DSAG_Sample_ErrorHandler_DE.js)
    <br>
    <details>
    <summary>Open Error Handler Source Code</summary>
    <br>

    ```js
    /**
    * DSAG Sample Error Handler
    * --------------------------------------------------------------------------------------------------------
    * This error handler was developed as part of the DSAG SAPUI5 Best Practice Guide. It can be used as a basic error handler and optionally supplemented with further features. 
    * For example, we have an extended version in use at REWE Group, 
    * which, in addition to the parsing capabilities of the OData message parser provided by the SAPUI5 framework, parses additional error messages in XML format and 
    * as well as replace or ignore certain error messages.<br>
    * If this error handler is created when the component is initialised, 
    * it outputs all messages received via the Message Manager from the OData Service in the control that is intended by the SAP Fiori Guidelines. 
    * Thus, error messages are output in a message box and success messages via a message toast. 
    * If several messages are sent, a message view with all messages is displayed instead of the message box or message toast.<br>
    * Using the method {@link module:controller/ErrorHandler#addModelToHandle} it is possible 
    * to activate the error handling for further models in addition to the default model.<br>
    * The error handler recognises independently whether it is an OData V2 or V4 model, 
    * and processes the messages received by the SAPUI5 Message Handler for both OData Model types.<br>
    * In addition, the methods {@link module:controller/ErrorHandler#displayError}, {@link module:controller/ErrorHandler#displayWarning}, 
    * {@link module:controller/ErrorHandler#displayInformation} and {@link module:controller/ErrorHandler#displaySuccess} 
    * can be used to display messages from the application code. These are also output in the correct control and, in the case of multiple messages, in a message view.<br>
    * A prerequisite for the correct functioning of the error handler is that the getContentDensityClass method is defined in the Component.js (see the corresponding 
    * <a href="https://experience.sap.com/fiori-design-web/cozy-compact/">SAP Fiori Guidelines article</a>. 
    * and the Developer Guide to Content Density linked therein).
    * @module controller/ErrorHandler
    * @author Tobias Kessel <tobias.kessel@rewe-group.com>
    */

    sap.ui.define([
        "sap/ui/base/Object",
        "sap/m/MessageBox"
    ], function (UI5Object, MessageBox) {
        "use strict";

        return UI5Object.extend("[namespace].[component].controller.ErrorHandler", {

            // ************************************************************************************************************
            // Constructor
            // ************************************************************************************************************

            /**
            * Constructor Method of the error handler. Initialises the error handler for the default model of the component.
            * @public
            * @constructor
            * @param {sap.ui.core.UIComponent} oComponent Reference to the component of the app
            * @method module:controller/ErrorHandler#constructor
            */
            constructor: function (oComponent) {
                this._oComponent = oComponent;
                this._bMessageOpen = false;
                this._aMessages = [];
                this._oMessageViewDialog = null;
                this._oV4Model = null;

                if (oComponent) {
                    // Initialise the error handling for the component's default model: 
                    var oModel = oComponent.getModel();
                    if (oModel) {
                        this.addModelToHandle(oModel);
                    }
                }
            },

            // ************************************************************************************************************
            // Public Methods
            // ************************************************************************************************************

            /**
            * The method addModelToHandle activates the error handling for the OData V2 or V4 model oModel.
            * @public
            * @param {object} oModel OData V2 or V4 Model
            * @method module:controller/ErrorHandler#addModelToHandle
            */
            addModelToHandle: function (oModel) {
                if (oModel) {
                    var oMessageManager = sap.ui.getCore().getMessageManager();
                    if (oMessageManager) {
                        // Depending on the model type (OData V2 or V4), initialise the message handling via the Message Manager:
                        // OData V2:
                        if (oModel.toString().indexOf("sap.ui.model.odata.v2.ODataModel") !== -1) {
                            // The Message Manager method registerMessageProcessor is used to activate the Message Handler in the model:
                            oMessageManager.registerMessageProcessor(oModel);
                            // After activation, the messageChange event is triggered when a new message is received from the service.
                            // We link the event handler method _onNewMessageFromV2Service to this event:
                            oModel.attachMessageChange(this._onNewMessageFromV2Service.bind(this));
                        }
                        // OData V4:
                        if (oModel.toString().indexOf("sap.ui.model.odata.v4.ODataModel") !== -1) {
                            // OData V4 message handling only needs to be initialised once for all V4 models.
                            // So first check whether this has already been done:
                            if (!this._oV4Model) {
                                // It does not exist yet.
                                // In the Message Model of the Message Manager we create a List Binding, 
                                // which will then trigger the event change for new messages:
                                var oMessageModel = oMessageManager.getMessageModel();
                                var oMessageModelBinding = oMessageModel.bindList("/", undefined, [],
                                    new sap.ui.model.Filter("technical", sap.ui.model.FilterOperator.EQ, true));
                                // We link the event handler method _onNewMessageFromV4Service to this event:
                                oMessageModelBinding.attachChange(this._onNewMessageFromV4Service, this);
                                this._oV4Model = oMessageModel;
                            }
                        }
                    }
                }
            },

            /**
            * The method displayError can be used to display an error message from the application. 
            * The message will be displayed in the correct control with the correct content density class and, in the case of several messages, in a message view.
            * @public
            * @param {string} sMessage The error message to be output
            * @method module:controller/ErrorHandler#displayError
            */
            displayError: function (sMessage) {
                this._displayTextMessage(sMessage, "Error");
            },

            /**
            * The method displayWarning can be used to display a warning message from the application. 
            * The message will be displayed in the correct control with the correct content density class and, in the case of several messages, in a message view.
            * @public
            * @param {string} sMessage Die auszugebende Warnungsmeldung
            * @method module:controller/ErrorHandler#displayWarning
            */
            displayWarning: function (sMessage) {
                this._displayTextMessage(sMessage, "Warning");
            },

            /**
            * The method displayInformation can be used to display an information message from the application. 
            * The message will be displayed in the correct control with the correct content density class and, in the case of several messages, in a message view.
            * @public
            * @param {string} sMessage Die auszugebende Informationsmeldung
            * @method module:controller/ErrorHandler#displayInformation
            */
            displayInformation: function (sMessage) {
                this._displayTextMessage(sMessage, "Information");
            },

            /**
            * The method displaySuccess can be used to display a success message from the application. 
            * The message will be displayed in the correct control and, in the case of several messages, in a message view.
            * @public
            * @param {string} sMessage Die auszugebende Erfolgsmeldung
            * @method module:controller/ErrorHandler#displaySuccess
            */
            displaySuccess: function (sMessage) {
                this._displayTextMessage(sMessage, "Success");
            },

            // ************************************************************************************************************
            // Private Methods: Processing of Messages
            // ************************************************************************************************************

            /**
            * The _onNewMessageFromV2Service method displays messages from an OData V2 service.
            * @private
            * @param {object} oEvent The triggering event
            * @method module:controller/ErrorHandler#_onNewMessageFromV2Service
            */
            _onNewMessageFromV2Service: function (oEvent) {
                // The new messages are located in the event parameter newMessages:
                var aNewMessages = oEvent.getParameter("newMessages");
                // Add all new messages to the array this._aMessages via the _addMessageToMessages method 
                // if there is not already an identical message in it:
                if (aNewMessages && aNewMessages.length) {
                    for (var i = 0; i < aNewMessages.length; i++) {
                        this._addMessageToMessages(aNewMessages[i]);
                    }
                }
                // If messages are present (the event messageChange may also be triggered if no messages are present), 
                // display them via the _displayMessages method:
                if (this._aMessages.length) {
                    this._displayMessages();
                }
            },

            /**
            * The _onNewMessageFromV4Service method displays messages from an OData V4 service.
            * @private
            * @param {object} oEvent The triggering event
            * @method module:controller/ErrorHandler#_onNewMessageFromV4Service
            */
            _onNewMessageFromV4Service: function (oEvent) {
                var oMessageManager = sap.ui.getCore().getMessageManager();
                var oEventSource = oEvent.getSource();
                if (oEventSource && oMessageManager) {
                    // The messages must be read from the context of the event:
                    var aContexts = oEventSource.getContexts();
                    if (aContexts && aContexts.length) {
                        for (var i = 0; i < aContexts.length; i++) {
                            var oContext = aContexts[i].getObject();
                            if (oContext) {
                                // Read the text of the message from context:
                                var sMessage = oContext.getMessage();
                                // Read the type of message (error, warning, etc.) from context:
                                var sType = oContext.getType();
                                // Output message via the _displayTextMessage method:
                                this._displayTextMessage(sMessage, sType);
                                // Remove the message from the Message Manager so that it is not displayed again:
                                oMessageManager.removeMessages(oContext);
                            }
                        }
                    }
                }
            },

            /**
            * The _displayTextMessage method brings a message to be displayed.
            * @private
            * @param {string} sMessage The message to be displayed
            * @param {string} sType Type of message (error, warning, information, success)
            * @method module:controller/ErrorHandler#_displayTextMessage
            */
            _displayTextMessage: function (sMessage, sType) {
                // Create message object:
                var oMessage = {
                    message: sMessage,
                    type: sType
                };
                // Add the message object to the array this._aMessages via the _addMessageToMessages method 
                // if there is not already an identical message in it:
                this._addMessageToMessages(oMessage);
                // Put all messages on display:
                this._displayMessages();
            },

            /**
            * The _addMessageToMessages method adds the message oMessage to the array this._aMessages if there is no identical message in it yet.  
            * An identical message is present if the message has the same text and the same type (error, warning, information, success).
            * @private
            * @param {object} oMessage Object of the message to be displayed
            * @method module:controller/ErrorHandler#_addMessageToMessages
            */
            _addMessageToMessages: function (oMessage) {
                var bFound = false;
                // First, add a punctuation mark to the end of the message using the _setPunctuationMark method, if the message does not already end with it.
                // We do this because OData services generated by the SAP Gateway sometimes send the same message twice, once with and once without punctuation.
                oMessage.message = this._setPunctuationMark(oMessage.message);
                // Check the messages in this._aMessages to see if they are identical to the message oMessage:
                for (var i = 0; i < this._aMessages.length; i++) {
                    if (this._aMessages[i].message === oMessage.message && this._aMessages[i].type === oMessage.type) {
                        // Message is identical.
                        // bFound is set to true so that the message is not added to the array:
                        bFound = true;
                        break;
                    }
                }
                // If bFound is false, there is no identical message.
                // In this case, the message is added to the array:
                if (!bFound) {
                    this._aMessages.push(oMessage);
                }
            },

            // ************************************************************************************************************
            // Private methods: Processing of messages
            // ************************************************************************************************************

            /**
            * The _displayMessages method displays the messages collected in the array this._aMessages. 
            * To do this, it first closes the message box or message view that may still be open. 
            * Then, depending on the number of messages to be displayed, it calls the {@link module:controller/ErrorHandler#_displaySingleMessage} method in the case of a single message  
            * or {@link module:controller/ErrorHandler#_displayMessageView} in the case of multiple messages.
            * @private
            * @method module:controller/ErrorHandler#_displayMessages
            */
            _displayMessages: function () {
                // Close all output controls.
                // The messages are not lost because they are stored in this._aMessages.
                if (this._bMessageOpen) {
                    var aDialogs = sap.m.InstanceManager.getOpenDialogs();
                    for (var i = 0; i < aDialogs.length; i++) {
                        if (aDialogs[i].toString() && aDialogs[i].toString().indexOf("sap.m.Dialog#errorHandlerMessageBox") !== -1) {
                            aDialogs[i].destroy();
                        }
                    }
                    this._bMessageOpen = false;
                }
                // If the message view is open, close it:
                if (this._oMessageViewDialog) {
                    this._oMessageViewDialog.close();
                }
                // In the case of a single message to be displayed, display it using the _displaySingleMessage method:
                if (this._aMessages.length === 1) {
                    this._displaySingleMessage();
                }
                // In the case of several messages to be displayed, display them via the _displayMessageView method:
                if (this._aMessages.length > 1) {
                    this._displayMessageView();
                }
            },

            /**
            * The _displaySingleMessage method displays a single message depending on the type (error, warning, information, success) in the corresponding control. 
            * The message is read from the array this._aMessages.
            * @private
            * @method module:controller/ErrorHandler#_displaySingleMessage
            */
            _displaySingleMessage: function () {
                if (this._aMessages.length) {
                    var oMessage = this._aMessages[0];
                    if (this._bMessageOpen) {
                        return;
                    }
                    switch (oMessage.type) {
                    case "Error":
                        // Output of error messages via MessageBox.error:
                        MessageBox.error(oMessage.message, this._getMessageBoxConfiguration());
                        this._bMessageOpen = true;
                        break;
                    case "Information":
                        // Output of information messages via MessageBox.information:
                        MessageBox.information(oMessage.message, this._getMessageBoxConfiguration());
                        this._bMessageOpen = true;
                        break;
                    case "Warning":
                        // Output of warnings via MessageBox.warning:
                        MessageBox.warning(oMessage.message, this._getMessageBoxConfiguration());
                        this._bMessageOpen = true;
                        break;
                    case "Success":
                        // Output of success messages via MessageToast:
                        sap.m.MessageToast.show(oMessage.message);
                        this._aMessages = [];
                        break;
                    default:
                        // If no type was passed, output via MessageBox.show:
                        MessageBox.show(oMessage.message, this._getMessageBoxConfiguration());
                        this._bMessageOpen = true;
                        break;
                    }
                }
            },

            /**
            * The _displayMessageView method displays the collection of messages in the array this._aMessages in a message view. 
            * @private
            * @method module:controller/ErrorHandler#_displayMessageView
            */
            _displayMessageView: function () {
                // In addition to the message to be displayed, the message view itself must also be passed a type (error, warning, etc.). 
                // Here, with several messages of different types, we decide on the "hardest" one. 
                // In the case of an error and a warning, for example, the message view is generated with the type error. 
                // The _getHardestSeverity method determines this "hardest" message type using the array this._aMessages:
                var sSeverity = this._getHardestSeverity();
                // The message items to be displayed in the message view are collected in the array aMessageItems:
                var aMessageItems = [];
                // Create a message item for each message in this._aMessages and add it to the array:
                for (var i = 0; i < this._aMessages.length; i++) {
                    var oMessageItem = new sap.m.MessageItem({
                        title: this._aMessages[i].message,
                        groupName: "1",
                        type: this._aMessages[i].type
                    });
                    aMessageItems.push(oMessageItem);
                }
                // Create a message view with the message items:
                var oMessageView = new sap.m.MessageView({
                    items: aMessageItems
                });
                // Determine the text of the close button. 
                // We drag this over the sap.m library resource bundle so that the text is displayed in the correct language. 
                var oLibraryResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.m");
                if (oLibraryResourceBundle) {
                    var sCloseText = oLibraryResourceBundle.getText("MSGBOX_CLOSE");
                }
                // If the key word MSGBOX_CLOSE is no longer accessible (e.g. due to a new SAPUI5 version in which the name has been replaced), 
                // the text "Close" is set. 
                // This should ideally be determined from the i18n in productive use.
                if (!sCloseText || sCloseText === "MSGBOX_CLOSE") {
                    sCloseText = "Close";
                }
                // Show message view in dialog::
                this._oMessageViewDialog = new sap.m.Dialog({
                    title: sSeverity,
                    state: sSeverity,
                    resizable: true,
                    draggable: true,
                    content: oMessageView,
                    buttons: new sap.m.Button({
                        text: sCloseText,
                        press: function () {
                            // Event handler for pressing the close button of the message view.
                            // Sets this._aMessages back to an empty array so that the messages are not displayed again, 
                            // and closes the dialogue.
                            this._aMessages = [];
                            this._oMessageViewDialog.close();
                        }.bind(this)
                    }),
                    contentHeight: "300px",
                    contentWidth: "300px",
                    verticalScrolling: false
                });
                this._oMessageViewDialog.addStyleClass(this._oComponent.getContentDensityClass());
                this._oMessageViewDialog.open();
            },

            // ************************************************************************************************************
            // Private Methods: Helper Methods
            // ************************************************************************************************************

            /**
            * The _setPunctuationMark method appends a dot as a punctuation mark to the message sMessage if it does not already end with a punctuation mark.  
            * @private
            * @param {string} sMessage The message to which a punctuation mark is to be added, if necessary
            * @returns {string} The message with punctuation added if necessary
            * @method module:controller/ErrorHandler#_setPunctuationMark
            */
            _setPunctuationMark: function (sMessage) {
                if (sMessage.length > 0) {
                    var sLastLetter = sMessage[sMessage.length - 1];
                    // Check the last character to see if it is a punctuation mark:
                    if (sLastLetter === "." | sLastLetter === "!" | sLastLetter === "?" | sLastLetter === ";" | sLastLetter ===
                        "*") {
                        // The message already ends with a punctuation mark.
                        return sMessage;
                    } else {
                        // The message does not end with a punctuation mark. 
                        // Output the message with a dot as punctuation mark:
                        return sMessage + ".";
                    }
                }
                return sMessage;
            },

            /**
            * The _getHardestSeverity method determines the "hardest" message type (error, warning, information, success) from the array this._aMessages.
            * Example: An array with five warnings and one error receives the message type "Error".
            * @private
            * @returns {string} The hardest message type (error, warning, information, success)
            * @method module:controller/ErrorHandler#_getHardestSeverity
            */
            _getHardestSeverity: function () {
                var bWarningFound = false;
                var bInformationFound = false;
                var bSuccessFound = false;
                for (var i = 0; i < this._aMessages.length; i++) {
                    switch (this._aMessages[i].type) {
                    case "Success":
                        bSuccessFound = true;
                        break;
                    case "Information":
                        bInformationFound = true;
                        break;
                    case "Warning":
                        bWarningFound = true;
                        break;
                    case "Error":
                        return "Error";
                    }
                }
                if (bWarningFound) {
                    return "Warning";
                }
                if (bInformationFound) {
                    return "Information";
                }
                if (bSuccessFound) {
                    return "Success";
                }
                return "None";
            },

            /**
            * The _getMessageBoxConfiguration method returns the configuration for the message box to be displayed.
            * @private
            * @method module:controller/ErrorHandler#_getMessageBoxConfiguration
            * @returns {object} Object for message box configuration consisting of id, styleClass, CLOSE action and onClose event handler.
            */
            _getMessageBoxConfiguration: function () {
                return {
                    id: "errorHandlerMessageBox",
                    styleClass: this._oComponent.getContentDensityClass(),
                    actions: [MessageBox.Action.CLOSE],
                    onClose: function () {
                        // Event handler for closing the message box.
                        // Sets this._bMessageOpen to false and this._aMessages back to an empty array, 
                        // so that the message is not displayed again.
                        this._bMessageOpen = false;
                        this._aMessages = [];
                    }.bind(this)
                };
            }
        });
    });
    ```
    
    <br>
    </details>
<br>

3. In UI5Object.extend line (line 32), adjust the namespace and the component name of your SAPUI5 app.<br>
   <img src="img/NamespaceComponent.gif"/><br><br>
4. Include the error handler file in Component.js by declaring it as a required resource in the document header.<br>
   <img src="img/Announce.gif"/><br><br>
5. Initialise the error handler in the onInit method of Component.js by inserting the following code line:
   ```js
    this._oErrorHandler = new ErrorHandler(this);
   ```
   <br>
   <img src="img/Initialise.gif"/><br><br>
6. Make sure that the Component.js contains the method getContentDensityClass for the style class setting.   
    <details>
    <summary>If missing, copy and paste it from here.</summary>
    <br>

    ```js
    getContentDensityClass : function () {
        if (!this._sContentDensityClass) {
            if (!Device.support.touch) {
                this._sContentDensityClass = "sapUiSizeCompact";
            } else {
                this._sContentDensityClass = "sapUiSizeCozy";
            }
        }
        return this._sContentDensityClass;
    }
    ```
    
    <br>
    </details>


If an OData V2 or OData V4 model is defined as the default model, the error handling for this model is now automatically adopted.<br>

## Activate Non-Default-Model
To activate error handling for a model that is not defined as the default model, the method addModelToHandle must be called transferring the corresponding model.<br>
Example:
```js
var oSecondModel = this.getModel("secondModel");
if (oSecondModel) {
    // Activate message handling for second model:
    this.getOwnerComponent()._oErrorHandler.addModelToHandle(oSecondModel);
}
```

## Output of messages from application controller
When using this error handler, it is recommended to output all messages from an application controller via this error handler, as it handles the display of several messages. This avoids, for example, several message boxes being displayed on top of each other.<br>
Example for displaying an error message:

```js
// Read error message from i18n file:
var sErrorMessage = this.readI18nText("errorMessage");
// Get error handler from component property:
var oErrorHandler = this.getOwnerComponent()._oErrorHandler;
// Display error message using error handler:
oErrorHandler.displayError(sErrorMessage);  
```