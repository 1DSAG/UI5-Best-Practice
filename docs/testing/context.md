---
layout: default
title: Context
parent: Testing
---

# What to tests

Even though the [`TDD`/`BDD`-approach](index.md#how-does-tdd-work) is recommended, it largely remains an unfulfillable myth, especially in somewhat agile environments. There, requirements constantly change, making it hard to put any test first.

That's OK as it is no excuse to _drop_ writing tests - instead, continue writing tests at implementation time, accompanying feature development.

## e2e: the happy path(s)

In end-to-end tests, focus on the most important "journeys" that always need to work for the user. Think of these journeys as the core of the value chain of your app. Without your users being able to travel these journeys, the app looses value - so utilize end-to-end tests to safeguard those "happy paths".

All the difference resides in the wording, any `OPA5`-, `wdi5`-, or `$framework`-specific syntax needs no change to walk the happy path.  
Instead, focus on writing the happy path first in the test framework of your choice.  
Here's an `OPA5`-example:

```js
sap.ui.require([
    "sap/ui/test/Opa5",
    "sap/ui/test/opaQUnit",
], (Opa5, opaQUnit) => {

  opaQUnit("an item can be put in the shopping card", (Given, When, Then) => {
        // Arrangements
        Given.iStartTheBeerShopApp()

        // Actions
        When.onTheOverViewPage
            .iNavigateToTheIPAPage()
            .and.iSelectAPaleAle("YippiAPIPA")
            .and.iAddItToTheCart()

        // Assertions
        Then.onTheShoppingCartPage.aBeerShouldBeVisible("YippiAPIPA")
    })
})
```

## bug fixes

Along with the actual fix, provide at least one test validating the fix. This safeguards any future regressions creeping into your app later. Any subsequent test run will touch the formerly problematic code and conserve its' correct functionality.

If there's a ticket number (or any other identifier) for the bug, put the number/identifier into the test subject for easier reference.

```js
QUnit.test("(fix) bug-4711-beershop-app: glass overflow", assert => {
    // ...
    assert.strictLowerThanOrEqual(glass, beer)
})
```
