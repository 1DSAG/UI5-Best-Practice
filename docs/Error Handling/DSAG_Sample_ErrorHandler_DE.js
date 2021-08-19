/**
 * DSAG Muster Error Handler
 * --------------------------------------------------------------------------------------------------------
 * Dieser Error Handler wurde im Rahmen des DSAG SAPUI5 Best Practice Guides entwickelt. Er kann als Basis Error Handler eingesetzt und optional um weitere Features ergänzt werden. 
 * So haben wir bei der REWE Group beispielsweise eine erweiterte Version im Einsatz, 
 * die zusätzlich zu den Parsing Fähigkeiten des vom SAPUI5 Framework bereitgestellten OData Message Parser weitere Fehlermeldungen im XML Format parsen 
 * sowie bestimmte Fehlermeldungen ersetzen oder ignorieren kann.<br>
 * Wenn dieser Error Handler bei der Initialisierung der Komponente erzeugt wird, 
 * gibt er alle über den Message Manager erhaltenen Meldungen aus dem OData Service in dem von den SAP Fiori Guidelines vorgesehenen Control aus. 
 * So werden Fehlermeldungen in einer Message Box und Erfolgsmeldungen über einen Message Toast ausgegeben. 
 * Werden mehrere Meldungen gesendet, wird anstelle der Message Box bzw. des Message Toasts eine Message View mit allen Meldungen angezeigt.<br>
 * Über die Methode {@link module:controller/ErrorHandler#addModelToHandle} ist es möglich, 
 * das Fehler Handling ergänzend zum Default Model für weitere Models zu aktivieren.<br>
 * Der Error Handler erkennt eigenständig, ob es sich um ein OData V2 oder V4 Model handelt, 
 * und verarbeitet für beide OData Model Typen die Nachrichten, die vom SAPUI5 Message Handler empfangen werden.<br>
 * Außerdem können über die Methoden {@link module:controller/ErrorHandler#displayError}, {@link module:controller/ErrorHandler#displayWarning}, 
 * {@link module:controller/ErrorHandler#displayInformation} und {@link module:controller/ErrorHandler#displaySuccess} 
 * aus dem Anwendungscode heraus Meldungen ausgegeben werden. Diese werden ebenfalls im richtigen Control und und im Falle von mehreren Nachrichten in einer Message View ausgegeben.<br>
 * Voraussetzung für die korrekte Funktionsweise des Error Handlers ist, dass in der Component.js die Methode getContentDensityClass definiert ist (siehe dazu den entsprechenden 
 * <a href="https://experience.sap.com/fiori-design-web/cozy-compact/">SAP Fiori Guidelines Artikel</a> 
 * sowie den darin verlinkten Developer Guide zur Content Density).
 * @module controller/ErrorHandler
 * @author Tobias Kessel <tobias.kessel@rewe-group.com>
 */

sap.ui.define([
	"sap/ui/base/Object",
	"sap/m/MessageBox"
], function (UI5Object, MessageBox) {
	"use strict";

	return UI5Object.extend("rewe.sf.sfazubirec.controller.ErrorHandler", {

		// ************************************************************************************************************
		// Constructor
		// ************************************************************************************************************

		/**
		 * Constructor Methode des Error Handlers. Initialisiert das Fehlerhandling für das Default-Model der Komponente.
		 * @public
		 * @constructor
		 * @param {sap.ui.core.UIComponent} oComponent Referenz auf die Komponente der App
		 * @method module:controller/ErrorHandler#constructor
		 */
		constructor: function (oComponent) {
			this._oComponent = oComponent;
			this._bMessageOpen = false;
			this._aMessages = [];
			this._oMessageViewDialog = null;
			this._oV4Model = null;

			if (oComponent) {
				// Das Fehlerhandling für das Default-Model der Komponente initialisieren: 
				var oModel = oComponent.getModel();
				if (oModel) {
					this.addModelToHandle(oModel);
				}
			}
		},

		// ************************************************************************************************************
		// Öffentliche Methoden
		// ************************************************************************************************************

		/**
		 * Die Methode addModelToHandle aktiviert das Fehler Handling für das OData V2 oder V4 Model oModel.
		 * @public
		 * @param {object} oModel OData V2 oder V4 Model
		 * @method module:controller/ErrorHandler#addModelToHandle
		 */
		addModelToHandle: function (oModel) {
			if (oModel) {
				var oMessageManager = sap.ui.getCore().getMessageManager();
				if (oMessageManager) {
					// Je nach Model Typ (OData V2  oder V4) das Message Handling über den Message Manager initialisieren:
					// OData V2:
					if (oModel.toString().indexOf("sap.ui.model.odata.v2.ODataModel") !== -1) {
						// Über die Message Manager Methode registerMessageProcessor wird der Message Handler im Model aktiviert:
						oMessageManager.registerMessageProcessor(oModel);
						// Nach der Aktivierung wird das Event messageChange ausgelöst, wenn eine neue Meldung aus dem Service empfangen wird.
						// An dieses Event knüpfen wir die Event Handler Methode _onNewMessageFromV2Service:
						oModel.attachMessageChange(this._onNewMessageFromV2Service.bind(this));
					}
					// OData V4:
					if (oModel.toString().indexOf("sap.ui.model.odata.v4.ODataModel") !== -1) {
						// Das OData V4 Message Handling muss nur einmal für alle V4 Models initialisiert werden.
						// Zunächst also prüfen, ob dies bereits geschehen ist:
						if (!this._oV4Model) {
							// Es existiert noch nicht.
							// Im Message Model des Message Managers erzeugen wir ein List Binding, 
							// das anschließend bei neuen Meldungen das Event change auslösen wird:
							var oMessageModel = oMessageManager.getMessageModel();
							var oMessageModelBinding = oMessageModel.bindList("/", undefined, [],
								new sap.ui.model.Filter("technical", sap.ui.model.FilterOperator.EQ, true));
							// An dieses Event knüpfen wir die Event Handler Methode _onNewMessageFromV4Service:
							oMessageModelBinding.attachChange(this._onNewMessageFromV4Service, this);
							this._oV4Model = oMessageModel;
						}
					}
				}
			}
		},

		/**
		 * Über die Methode displayError kann aus der Anwendung heraus eine Fehlermeldung ausgegeben werden. 
		 * Sie wird im richtigen Control mit korrekter Content Density Class sowie im Falle mehrerer Nachrichten in einer Message View ausgegeben.
		 * @public
		 * @param {string} sMessage Die auszugebende Fehlermeldung
		 * @method module:controller/ErrorHandler#displayError
		 */
		displayError: function (sMessage) {
			this._displayTextMessage(sMessage, "Error");
		},

		/**
		 * Über die Methode displayWarning kann aus der Anwendung heraus eine Warnung ausgegeben werden. 
		 * Sie wird im richtigen Control mit korrekter Content Density Class sowie im Falle mehrerer Nachrichten in einer Message View ausgegeben.
		 * @public
		 * @param {string} sMessage Die auszugebende Warnungsmeldung
		 * @method module:controller/ErrorHandler#displayWarning
		 */
		displayWarning: function (sMessage) {
			this._displayTextMessage(sMessage, "Warning");
		},

		/**
		 * Über die Methode displayInformation kann aus der Anwendung heraus eine Information ausgegeben werden. 
		 * Sie wird im richtigen Control mit korrekter Content Density Class sowie im Falle mehrerer Nachrichten in einer Message View ausgegeben.
		 * @public
		 * @param {string} sMessage Die auszugebende Informationsmeldung
		 * @method module:controller/ErrorHandler#displayInformation
		 */
		displayInformation: function (sMessage) {
			this._displayTextMessage(sMessage, "Information");
		},

		/**
		 * Über die Methode displaySuccess kann aus der Anwendung heraus eine Erfolgsmeldung ausgegeben werden. 
		 * Sie wird im richtigen Control sowie im Falle mehrerer Nachrichten in einer Message View ausgegeben.
		 * @public
		 * @param {string} sMessage Die auszugebende Erfolgsmeldung
		 * @method module:controller/ErrorHandler#displaySuccess
		 */
		displaySuccess: function (sMessage) {
			this._displayTextMessage(sMessage, "Success");
		},

		// ************************************************************************************************************
		// Private Methoden: Verarbeitung der Nachrichten
		// ************************************************************************************************************

		/**
		 * Die Methode _onNewMessageFromV2Service bringt Meldungen aus einem OData V2 Service zur Anzeige.
		 * @private
		 * @param {object} oEvent Das auslösende Event
		 * @method module:controller/ErrorHandler#_onNewMessageFromV2Service
		 */
		_onNewMessageFromV2Service: function (oEvent) {
			// Die neuen Nachrichten befinden sich im Event Parameter newMessages:
			var aNewMessages = oEvent.getParameter("newMessages");
			// Alle neuen Nachrichten über die Methode _addMessageToMessages dem Array this._aMessages hinzufügen, 
			// falls darin noch keine identische Nachricht vorhanden ist:
			if (aNewMessages && aNewMessages.length) {
				for (var i = 0; i < aNewMessages.length; i++) {
					this._addMessageToMessages(aNewMessages[i]);
				}
			}
			// Falls Nachrichten vorhanden sind (das Event messageChange wird unter Umständen auch ausgelöst, wenn keine Meldungen vorhanden sind), 
			// diese über die Methode _displayMessages ausgeben:
			if (this._aMessages.length) {
				this._displayMessages();
			}
		},

		/**
		 * Die Methode _onNewMessageFromV4Service bringt Meldungen aus einem OData V4 Service zur Anzeige.
		 * @private
		 * @param {object} oEvent Das auslösende Event
		 * @method module:controller/ErrorHandler#_onNewMessageFromV4Service
		 */
		_onNewMessageFromV4Service: function (oEvent) {
			var oMessageManager = sap.ui.getCore().getMessageManager();
			var oEventSource = oEvent.getSource();
			if (oEventSource && oMessageManager) {
				// Die Nachrichten müssen aus dem Kontext des Events ausgelesen werden:
				var aContexts = oEventSource.getContexts();
				if (aContexts && aContexts.length) {
					for (var i = 0; i < aContexts.length; i++) {
						var oContext = aContexts[i].getObject();
						if (oContext) {
							// Text der Nachricht aus dem Kontext lesen:
							var sMessage = oContext.getMessage();
							// Typ der Nachricht (Error, Warning etc.) aus dem Kontext lesen:
							var sType = oContext.getType();
							// Meldung über die Methode _displayTextMessage ausgeben:
							this._displayTextMessage(sMessage, sType);
							// Die Meldung aus dem Message Manager entfernen, damit sie nicht erneut angezeigt wird:
							oMessageManager.removeMessages(oContext);
						}
					}
				}
			}
		},

		/**
		 * Die Methode _displayTextMessage bringt eine Meldung zur Anzeige.
		 * @private
		 * @param {string} sMessage Die anzuzeigende Meldung
		 * @param {string} sType Typ der Meldung (Error, Warning, Information, Success)
		 * @method module:controller/ErrorHandler#_displayTextMessage
		 */
		_displayTextMessage: function (sMessage, sType) {
			// Message Objekt erzeugen:
			var oMessage = {
				message: sMessage,
				type: sType
			};
			// Message Objekt über die Methode _addMessageToMessages dem Array this._aMessages hinzufügen, 
			// falls sich darin noch keine identische Meldung befindet:
			this._addMessageToMessages(oMessage);
			// Alle Nachrichten zur Anzeige bringen:
			this._displayMessages();
		},

		/**
		 * Die Methode _addMessageToMessages fügt dem Array this._aMessages die Nachricht oMessage hinzu, wenn noch keine identische Meldung darin vorhanden ist. 
		 * Eine identische Meldung ist dann vorhanden, wenn die Meldung denselben Text und den selben Typ (Error, Warning, Information, Success) hat.
		 * @private
		 * @param {object} oMessage Objekt der anzuzeigenden Meldung
		 * @method module:controller/ErrorHandler#_addMessageToMessages
		 */
		_addMessageToMessages: function (oMessage) {
			var bFound = false;
			// Zunächst über die Methode _setPunctuationMark der Meldung am Ende ein Satzzeichen hinzufügen, falls diese nicht bereits damit endet. 
			// Dies machen wir, da vom SAP Gateway generierte OData Sercices teilweise zweimal dieselbe Meldung einmal mit und einmal ohne Satzzeichen senden.
			oMessage.message = this._setPunctuationMark(oMessage.message);
			// Die Nachrichten in this._aMessages daraufhin prüfen, ob sie mit der Nachricht oMessage identisch sind:
			for (var i = 0; i < this._aMessages.length; i++) {
				if (this._aMessages[i].message === oMessage.message && this._aMessages[i].type === oMessage.type) {
					// Nachricht ist identisch.
					// bFound wird auf true gesetzt, damit die Nachricht nicht dem Array hinzugefügt wird:
					bFound = true;
					break;
				}
			}
			// Falls bFound false ist, ist keine identische Nachricht vorhanden.
			// In diesem Fall wird die Nachricht dem Array hinzugefügt:
			if (!bFound) {
				this._aMessages.push(oMessage);
			}
		},

		// ************************************************************************************************************
		// Private Methoden: Verarbeitung der Nachrichten
		// ************************************************************************************************************

		/**
		 * Die Methode _displayMessages bringt die im Array this._aMeldungen gesammelten Nachrichten zur Anzeige. 
		 * Dafür schließt sie zunächst die möglicherweise noch offene Message Box oder Message View. 
		 * Anschließend ruft sie abhängig von der Anzahl der anzuzeigenden Nachrichten die Methode {@link module:controller/ErrorHandler#_displaySingleMessage} im Falle einer 
		 * oder {@link module:controller/ErrorHandler#_displayMessageView} im Falle mehrerer Nachrichten auf.
		 * @private
		 * @method module:controller/ErrorHandler#_displayMessages
		 */
		_displayMessages: function () {
			// Alle Ausgabe Controls schließen.
			// Die Nachrichten gehen nicht verloren, da sie in this._aMessages abgelegt sind.
			if (this._bMessageOpen) {
				var aDialogs = sap.m.InstanceManager.getOpenDialogs();
				for (var i = 0; i < aDialogs.length; i++) {
					if (aDialogs[i].toString() && aDialogs[i].toString().indexOf("sap.m.Dialog#errorHandlerMessageBox") !== -1) {
						aDialogs[i].destroy();
					}
				}
				this._bMessageOpen = false;
			}
			// Falls die Message View geöffnet ist, diese schließen:
			if (this._oMessageViewDialog) {
				this._oMessageViewDialog.close();
			}
			// Im Falle von einer anzuzeigenden Nachricht diese über die Methode _displaySingleMessage zur Anzeige bringen:
			if (this._aMessages.length === 1) {
				this._displaySingleMessage();
			}
			// Im Falle von mehreren anzuzeigenden Nachrichten diese über die Methode _displayMessageView zur Anzeige bringen:
			if (this._aMessages.length > 1) {
				this._displayMessageView();
			}
		},

		/**
		 * Die Methode _displaySingleMessage gibt eine einzelne Nachricht je nach Typ (Error, Warning, Information, Success) im entsprechenden Control aus. 
		 * Die Nachricht wird aus dem Array this._aMessages gelesen.
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
					// Ausgabe von Fehlermeldungen über MessageBox.error:
					MessageBox.error(oMessage.message, this._getMessageBoxConfiguration());
					this._bMessageOpen = true;
					break;
				case "Information":
					// Ausgabe von Informationsmeldungen über MessageBox.information:
					MessageBox.information(oMessage.message, this._getMessageBoxConfiguration());
					this._bMessageOpen = true;
					break;
				case "Warning":
					// Ausgabe von Warnungen über MessageBox.warning:
					MessageBox.warning(oMessage.message, this._getMessageBoxConfiguration());
					this._bMessageOpen = true;
					break;
				case "Success":
					// Ausgabe von Erfolgsmeldungen über MessageToast:
					sap.m.MessageToast.show(oMessage.message);
					this._aMessages = [];
					break;
				default:
					// Falls kein Typ übergeben wurde, Ausgabe über MessageBox.show:
					MessageBox.show(oMessage.message, this._getMessageBoxConfiguration());
					this._bMessageOpen = true;
					break;
				}
			}
		},
		
		/**
		 * Die Methode _displayMessageView gibt die Sammlung an Nachrichten im Array this._aMessages in einer Message View aus. 
		 * @private
		 * @method module:controller/ErrorHandler#_displayMessageView
		 */
		_displayMessageView: function () {
			// Der Message View selbst muss neben den anzuzeigenden Nachricht auch ein Typ (Error, Warning etc.) übergeben werden. 
			// Hier entscheiden wir uns bei mehreren Nachrichten unterschiedlicher Typen für den "härtesten". 
			// Bei einem Fehler und einer Warnung wird also beispielsweise die Message View mit dem Typ Error erzeugt. 
			// Die Methode _getHardestSeverity ermittelt diesen "härtesten" Meldungstypen anhand des Arrays this._aMessages:
			var sSeverity = this._getHardestSeverity();
			// Im Array aMessageItems werden die in der Message View anzuzeigenden Message Items gesammelt:
			var aMessageItems = [];
			// Für jede Nachricht in this._aMessages ein Message Item erzeugen und dieses dem Array hinzufügen:
			for (var i = 0; i < this._aMessages.length; i++) {
				var oMessageItem = new sap.m.MessageItem({
					title: this._aMessages[i].message,
					groupName: "1",
					type: this._aMessages[i].type
				});
				aMessageItems.push(oMessageItem);
			}
			// Message View mit den Message Items erzeugen:
			var oMessageView = new sap.m.MessageView({
				items: aMessageItems
			});
			// Den Text des Schließen-Buttons ermitteln. 
			// Wir ermitteln diesen über das sap.m Library Resource Bundle, damit er in der richtigen Sprache angezeigt wird. 
			var oLibraryResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.m");
			if (oLibraryResourceBundle) {
				var sCloseText = oLibraryResourceBundle.getText("MSGBOX_CLOSE");
			}
			// Wenn für den Schlüssel MSGBOX_CLOSE nichts zurückgegeben wird (zum Beispiel, weil der Schlüsselname sich in einer neuen SAPUI5 Version geändert hat), 
			// setzen wir das Wort "Schließen". 
			// In der produktiven Nutzung würde dies idealerweise über die i18n-Datei realisiert werden.
			if (!sCloseText || sCloseText === "MSGBOX_CLOSE") {
				sCloseText = "Schließen";
			}
			// Message View im Dialog anzeien:
			this._oMessageViewDialog = new sap.m.Dialog({
				title: sSeverity,
				state: sSeverity,
				resizable: true,
				draggable: true,
				content: oMessageView,
				buttons: new sap.m.Button({
					text: sCloseText,
					press: function () {
						// Event Handler für das Drücken des Schließen-Buttons der Message View.
						// Setzt this._aMessages zurück auf einen leeren Array, damit die Nachrichten nicht erneut angezeigt werden, 
						// und schließt den Dialog.
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
		// Private Methoden: Helfer-Methoden
		// ************************************************************************************************************
		
		/**
		 * Die Methode _setPunctuationMark hängt der Nachricht sMessage ein Punkt als Satzzeichen an, falls sie nicht bereits mit einem Satzzeichen endet. 
		 * @private
		 * @param {string} sMessage Die Nachricht, die ggf. um ein Satzzeichen ergänzt werden soll
		 * @returns {string} Die Nachricht mit ggf. ergänzten Satzzeichen
		 * @method module:controller/ErrorHandler#_setPunctuationMark
		 */
		_setPunctuationMark: function (sMessage) {
			if (sMessage.length > 0) {
				var sLastLetter = sMessage[sMessage.length - 1];
				// Das letzte Zeichen darauf prüfen, ob es sich um ein Satzzeichen handelt:
				if (sLastLetter === "." | sLastLetter === "!" | sLastLetter === "?" | sLastLetter === ";" | sLastLetter ===
					"*") {
					// Die Nachricht endet bereits mit einem Satzzeichen.
					return sMessage;
				} else {
					// Die Nachricht endet nicht mit einem Satzzeichen. 
					// Die Nachricht mit Satzzeichen ausgeben:
					return sMessage + ".";
				}
			}
			return sMessage;
		},

		/**
		 * Die Methode _getHardestSeverity ermittelt aus dem Array this._aMessages den "härtesten" Meldungstypen (Error, Warning, Information, Success).
		 * Beispiel: Ein Array mit fünf Warnungen und einem Fehler erhält den Meldungstypen "Error".
		 * @private
		 * @returns {string} Der härteste Meldungstyp (Error, Warning, Information, Success)
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
		 * Die Methode _getMessageBoxConfiguration gibt die Konfiguration für die darzustellende Message Box wieder.
		 * @private
		 * @method module:controller/ErrorHandler#_getMessageBoxConfiguration
		 * @returns {object} Objekt für Message Box Konfiguration bestehend aus id, styleClass, CLOSE-Action und onClose Event Handler
		 */
		_getMessageBoxConfiguration: function () {
			return {
				id: "errorHandlerMessageBox",
				styleClass: this._oComponent.getContentDensityClass(),
				actions: [MessageBox.Action.CLOSE],
				onClose: function () {
					// Event Handler für das Schließen der Message Box.
					// Setzt this._bMessageOpen auf false und this._aMessages zurück auf einen leeren Array, 
					// damit die Nachricht nicht erneut angezeigt wird.
					this._bMessageOpen = false;
					this._aMessages = [];
				}.bind(this)
			};
		}
	});
});