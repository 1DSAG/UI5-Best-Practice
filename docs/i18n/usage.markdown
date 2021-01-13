---
layout: default
title: i18n Usage
name: Usage
parent: i18n
nav_order: 2
---

# Usage of i18n in UI5 Apps

## Setup

 1. create a new folder with the name "i18n 
 2. create at least one file with the name "i18n.properties 

    The folder should be created in the "webapp" folder

    ![Folder Structure and Init File for i18n](img/i18n_folderstructure.png)
    :--: 
    *Folder Structure and Init File for i18n*

 3. configure the manifest.json

    In our manifest.json we have to configure the above created i18n file under models area within UI5 section as shown below. This code is placed in "sap.ui5" --> "models"

    ```javascript
    "i18n": {
            "type": "sap.ui.model.resource.ResourceModel",
            "settings": {
                "bundleName": "your.namespace.i18n.i18n"
            }
    ```

    ![Folder Structure and Init File for i18n](img/i18n_manifest.png)
    :--: 
    *Folder Structure and Init File for i18n*


## Usage in XML Views

Since we have defined a model in manifest.json, we access the individual keys in the XML view as with any other model.

The i18n model is referenced first in curly brackets and then the key:
`{i18n>streetNameNumber}`

We take as an example the already previously defined translations

![i18n Simple Example EN File](img/i18n_en_simple.png)
:--: 
*i18n Simple Example EN File*

![i18n example XML View](img/i18nXMLViewExample.png)
:--: 
*i18n example XML View*
