---
layout: default
title: Naming Conventions
name: naming
parent: oData
nav_order: 3
---

## Naming Conventions

| oData Term      | Rule | Good Example | Bad Example |
| -------- | ----------- | ----------- | ----------- |
| General | Use Camel case | SalesDocument | SALESDOCUMENT |
| General | No Underscores | PurchaseOrder | Purchase_Order |
| General | Use English Names | Order | Auftrag |
| General | No SAP technical names | CompanyCode | BUKRS |
| Entity Names | Only Nouns | CostCenter | CostCenterF4 |
| Entity Names | Only Singulars | PurchaseOrder | PurchaseOrderList |
| Entity Names | No Operation Names | SalesOrder | CreateSalesOrder |
| Entity Sets | Use Plural of Entity Name or add "Set" | PurchaseOrders, PurchaseOrderSet | PurchaseOrder |
| Navigations | Name as Entity name if the target cardinality is 1 | /OrderHead('1')/OrderItem('1') | /OrderHead('1')/Header_Item('1') |
| Navigations | Same as EntitySet name if the target cardinality is M | /OrderHead('1')/OrderItems | /OrderHead('1')/Header_Item |
| Function Imports | Use Clear Names | BlockSalesOrder | Block |
