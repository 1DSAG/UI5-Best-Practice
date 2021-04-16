---
layout: default
title: Dos and Don'ts
name: doAndDont
parent: oData
nav_order: 4
---

## Dos and Don'ts

This section contains useful dos and don'ts for developers programming SAP Gateway applications and optimizing performance.

### Dos

#### * Do think in REST terms

If you find yourself inventing function imports such as CreateX, ReadX, GetX, ChangeX, UpdateX, or DeleteX, you should make the entity type X part of your model.
`CRUD` is covered by `GET`, `PUT`, and `DELETE` to entities and `POST` to entity sets. .

Function imports may be used for operations other than `CRUD`, such as Approve, Reject, Reserve, and Cancel. However, you might find that a reservation entity that you can create, update, and delete is better suited.

#### * Do return completely filled entries in response to GET ~/EntitySet

Think:

```sql
SELECT * FROM EntitySet WHERE ($filter) ORDER BY ($orderby) UP TO ($top) ROWS
```

if you see the following:

```sql
GET ~/EntitySet?$filter=...&$orderby=...&$top=...
```

OData does not distinguish GetList from GetDetail. OData clients expect to obtain all information from reading an entity set. If the information is not transparent and comprehensive, OData clients might attempt subsequent updates that could lead to errors in your data.

#### * Do use the OData system query options $filter, $top, $skip, $orderby

Clients can, and should, use the query options to tailor responses to your needs. Content creators should support these query options to enable clients to optimize requests.

#### * Do provide a usable set of filterable properties

Make as many properties as possible filterable. At least all primary and foreign key properties should be filterable.

#### * Do make your properties concrete

#### * Do use the right data type for your properties

#### * Do represent quantities and monetary amounts as Edm.Decimal

Use the annotation `sap:unit` for the amount or quantity property to point to the corresponding currency or unit. If you need to distinguish currency units from units of measure, use the corresponding `sap:semantics` annotation.

#### * Do use Edm.IntXX or Edm.Decimal for NUMC fields

This takes care of leading zeros and alpha conversions

#### * Do use media resources and media link entries

Binary data in common formats (for example `PDF`, `GIF`, `JPEG`) is naturally represented in OData as a media resource with a corresponding media link entry, that is, a structured record describing the media resource, and containing a link to it. In this way, the binary can be accessed directly via its own URL, just like a browser accesses a picture in the Internet. In fact, a browser can then access your binary data directly, without needing to know OData.

Another benefit is performance. Binary data as a media resource is streamed directly byte by byte, whereas binary data hidden within an OData Property of type `Edm.Binary` is represented as a string of hex digits, thereby doubling its size.

#### * Do provide navigation properties to link related data

If your model contains Customers and SalesOrders, provide navigation between them as `/Customers(4711)/SalesOrders` and `/SalesOrders(42)/Customer`. This will ensure that the client knows how to construct a query on SalesOrders using a CustomerID, or the URI of the customer resource from the CustomerID.

If one of your entity types has an xxxID property, make sure you also provide a corresponding xxx entity type and navigation to it. The same applies for xxxCode; provide an entity set that lists all possible code values and meaningful descriptions for them. The service should be self-describing.

#### * Do follow links provided by the server

URI construction rules can change, but the basic convention surrounding links will not. Following links is therefore future-proof.

Note
Strive to develop high-quality OData services. For more information, see Creating High-Quality OData Services.

### Don'ts

#### * Don't think in SOAP terms

For more information, see: [Do think in REST terms](#do-think-in-rest-terms).

#### * Don't construct URIs in your client application

For more information, see: [Do follow links provided by the server](#do-follow-links-provided-by-the-server).

#### * Don't invent your custom query options

Clients cannot discover custom query options for themselves. You have to define how your clients are to use every single custom query option.

Use function imports with `HttpMethod="GET"` returning collection of entity type if you need to expose special queries that do not fit `$filter`. Function imports are described in the `$metadata` document and can be discovered by clients.

#### * Don't force the client to construct links

For more information, see: [Do provide navigation properties to link related data](#do-provide-navigation-properties-to-link-related-data).

#### * Don't use Placeholder001 or ForFutureUse properties

For more information, see: [Do make your properties concrete](#do-make-your-properties-concrete).

#### * Don't use binary properties

For more information, see: [Do use media resources and media link entries](#do-make-your-properties-concrete).

#### * Don't use generic name-value entity types

It is inappropriate to express entity-relationship models with just two entities, one named Entity and one named Relationship.

#### * Don't just tunnel homegrown XML
