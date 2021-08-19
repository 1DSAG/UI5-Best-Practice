---
layout: default
title: V2 vs. V4
name: vs2vsv4
parent: OData
nav_order: 2
---

## Major Differences

These are the major differences between OData V2 and OData V4:

### Metadata control

In OData V4, the JSON data format now allows to control the amount of metadata that is returned in query responses. There are three levels of metadata supported [(see details)](http://docs.oasis-open.org/odata/odata-json-format/v4.0/os/odata-json-format-v4.0-os.html#_Toc372793040):

* `full`: The response contains all the metadata needed to describe the response.
* `minimal`: The response metadata references the metadata document. Information in the metadata document is not repeated in the response.
* `none`: The response contains no metadata. The application must understand the response structure.

### Search capability

OData V4 adds a new flexible search capability, `$search`. The search feature allows you to query a collection for entities that match a specified search expression. Unlike the existing filter capability, which allows a query to specify that a specific property or properties match certain criteria, the search feature can apply the search expression to any of the properties of an entity.

### Enhanced expand

The `$expand` system query option has been enhanced in OData V4. This feature specifies the related resources to be included in line with retrieved resources. In OData 2, if a single value navigation property is expanded, you get all the properties of the entity if it was a single value navigation property. And if a collection navigation property is expanded, you get all of the entities in the collection and all of the properties of those entities. In OData V4, you can now refine the results using the `$select`, `*`, `$filter` and `$top` operations.

Example: Get all teams that have at least one employee who is older than 42

```js
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(Controller, Filter, FilterOperator) {
    "use strict";
    return Controller.extend("dsag.filter.Example", {
        // ...
        filterTeams: function() {
            oTeamsBinding.filter(
                new Filter({
                    path : "EMPLOYEES",
                    operator : FilterOperator.Any,
                    variable : "employee",
                    condition : new Filter("employee/AGE", FilterOperator.GT, 42)
                });
            );
        }
    });
});
```

The resulting request would be:
`http://host/service/TEAMS?$filter=EMPLOYEES/any(employee:employee/AGE gt 42)`

### Counting

$count replaces `$inlinecount` in OData V4. `$count` has been enhanced to be used with `$filter`, `$expand` and `$orderby` options.

### Datatypes

Changes in support for data types in OData V4:

* `Edm.DateTime` has been deprecated. The lack of timezone information in OData 2 causes significant problems. Use `Edm.DateTimeOffset` instead.
* `Edm.Time` has been replaced with `Edm.Duration` and `Edm.TimeOfDay` to make it clear whether it is duration of a specific time of day.
* `Edm.Date` has been added as there was no way to express just a date in OData 2.
* `Edm.Float` has been eliminated.

### Data access methods

The UI5 OData V4 model does not support the methods `getData`, `getObject`, `getOriginalProperty`, `getProperty`. For data access, use the context API instead of methods on the model.

### Batch methods

The UI5 OData V4 model does not support the methods `getChangeBatchGroups`, `getChangeGroups`, `getDeferredGroups`, `setChangeBatchGroups`, `setChangeGroups`, `setDeferredBatchGroups`, `setDeferredGroups`, `setUseBatch` (and corresponding model construction parameters). Batch groups are solely defined via binding parameters with the corresponding parameters on the model as default. Application groups are by default deferred; there is no need to set or get deferred groups. You just need the `submitBatch` method on the model to control execution of the batch. You can use the predefined batch group `$direct` to switch off batch either for the complete model or for a specific binding (only possible for the complete model in V2).

### OData operations executed via binding

The UI5 OData V4 model does not support the method `callFunction`. Use an operation binding instead.

Example:

**View:**

```js
<Form id="getNextAvailableItem" binding="{/GetNextAvailableItem(...)}">
    <Label text="Description"/>
    <Text text="{Description}"/>
    <Button text="Call the function" press="onGetNextAvailableItem"/>
</Form>
```

**Controller:**

```js
onGetNextAvailableItem : function (oEvent) {
    this.getView().byId("getNextAvailableItem").getObjectBinding().execute();
}
```

### No CRUD methods on model

The UI5 OData V4 model does not support the methods `create`, `read`, `remove`, `update`. `read`, `update`, `create` and `remove` operations are available implicitly via the bindings, so that changes are bound to controls. It is not possible to trigger requests for specific OData URLs.

### No metadata access via model

The UI5 OData V4 model does not support methods `getServiceAnnotations`, `getServiceMetadata`, `refreshMetadata` as well as methods corresponding to the events `metadataFailed`, `metadataLoaded`. Metadata is only accessed via `ODataMetaModel`. Metadata is only loaded when needed (e.g. for type detection or to compute URLs for write requests); the corresponding methods on the `v4.ODataMetaModel` use promises instead of events.

### AnnotationHelper

`sap.ui.model.odata.AnnotationHelper` is not supported for OData V4.

---

## NOTE

Due to the limited feature scope of this version of the SAPUI5 OData V4 model, check that all required features are in place before developing applications. Double check the detailed [documentation](https://help.sap.com/viewer/468a97775123488ab3345a0c48cadd8f/1809.000/en-US/e1b625940c104b558e52f47afe5ddb4f.html) of the features, as certain parts of a feature may be missing although you might expect these parts as given. Some controls might not work due to small incompatibilities compared to `sap.ui.model.odata.(v2.)ODataModel`, or due to missing features in the model (like tree binding).

---
