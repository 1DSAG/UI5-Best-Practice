---
layout: default
title: Configuration
name: configuration
parent: Routing and Navigation
nav_order: 3
---

## Routes

Each route defines a name, a pattern, and optionally one or more targets to which to navigate when the route has been matched. In the routes section, you define which patterns are available for navigation.

Targets and routes should match view file to easily track the flow of the navigation.

## Targets

A target defines the view or component that is displayed. It is associated with one or more routes or it can be displayed manually from within the app. Whenever a target is displayed, the corresponding view or component is loaded and added to the aggregation configured with the controlAggregation option of the control.

Route names should be descriptive by itself. Prefer plural form for routes if applicable.

<div class="goodExample" markdown=1>

### Good example

- `home`
- `productDetails`

</div>

<div class="badExample" markdown=1>

### Bad example

- `page1`
- `itemDetail`

</div>

## Config

The config section contains the global router configuration and default values that apply for all routes and targets. Provide the following as minimal settings for targets:

- `routerClass`: Either `sap.ui.core.routing.Router` or `sap.m.routing.Router` (recommended)

   Compared to `sap.ui.core.routing.Router`, the `sap.m.routing.Router` is optimized for mobile apps and adds the properties `viewLevel`, `transition`, and `transitionParameters` which can be specified for each route or target created by the `sap.m.routing.Router`. The `transitionParameters` can also be used for custom transitions.

- `bypassed`: Fail safe target for unmatched routes.

- `async`: Defines whether targets are loaded asynchronously. The default value is `false`. We recommend setting this parameter to `true` to improve performance.