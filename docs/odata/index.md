---
layout: default
title: OData
permalink: /odata/
has_children: true
nav_order: 2
---

## Architecture

OData is a protocol for the creation and consumption of RESTful APIs. Thus, as common practices of REST, OData builds on HTTP, AtomPub, and JSON using URIs to address and access data feed resources.

### Resource Identification

OData uses URIs to identify resources. For every OData service whose service root is abbreviated as <http://host/service/>, the following fixed resources can be found:

#### The Service Document

The service document lists entity sets, functions, and singletons that can be retrieved. Clients can use the service document to navigate the model in a hypermedia-driven fashion.

The service document is available at the "doc root"/service-root: <http://host/service/>.

#### The Metadata Document

The metadata document describes the types, sets, functions and actions understood by the OData service. Clients can use the metadata document to understand how to query and interact with entities in the service.

The metadata document is available at <http://host/service/$metadata>.

#### Resource operation

OData uses the HTTP verbs to indicate the operations on the resources.

* `GET`: Get the resource (a collection of entities, a single entity, a structural property, a navigation property, a stream, etc.).
* `POST`: Create a new resource.
* `PUT`: Update an existing resource by replacing it with a complete instance.
* `PATCH`: Update an existing resource by replacing part of its properties with a partial instance.
* `DELETE`: Remove the resource.
