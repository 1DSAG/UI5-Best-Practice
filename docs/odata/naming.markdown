---
layout: default
title: Naming Conventions
name: naming
parent: OData
nav_order: 3
---

## Naming Conventions

<table>
  <tr>
    <th>OData Term</th>
    <th>Rule</th>
    <th class="goodExample">Good Example</th>
    <th class="badExample">Bad Example</th>
  </tr>
  <tr>
    <td>General</td>
    <td>Use Camel case</td>
    <td class="goodExample">SalesDocument</td>
    <td class="badExample">SALESDOCUMENT</td>
  </tr>
  <tr>
    <td>General</td>
    <td>No Underscores</td>
    <td class="goodExample">PurchaseOrder</td>
    <td class="badExample">Purchase_Order</td>
  </tr>
  <tr>
    <td>General</td>
    <td>Use English Names</td>
    <td class="goodExample">Order</td>
    <td class="badExample">Auftrag</td>
  </tr>
  <tr>
    <td>General</td>
    <td>No SAP technical names</td>
    <td class="goodExample">CompanyCode</td>
    <td class="badExample">BUKRS</td>
  </tr>
  <tr>
    <td>Entity Names</td>
    <td>Only Nouns</td>
    <td class="goodExample">CostCenter</td>
    <td class="badExample">CostCenterF4</td>
  </tr>
  <tr>
    <td>Entity Names</td>
    <td>Only Singulars</td>
    <td class="goodExample">PurchaseOrder</td>
    <td class="badExample">PurchaseOrderList</td>
  </tr>
  <tr>
    <td>Entity Names</td>
    <td> No Operation Names</td>
    <td class="goodExample">SalesOrder</td>
    <td class="badExample">CreateSalesOrder</td>
  </tr>
  <tr>
    <td>Entity Sets</td>
    <td>Use Plural of Entity Name or add "Set"</td>
    <td class="goodExample">PurchaseOrders, PurchaseOrderSet</td>
    <td class="badExample">PurchaseOrder</td>
  </tr>
  <tr>
    <td>Navigations</td>
    <td>Name as Entity name if the target cardinality is 1</td>
    <td class="goodExample"><code>/OrderHead('1')/OrderItem('1')</code></td>
    <td class="badExample"><code>/OrderHead('1')/Header_Item('1')</code></td>
  </tr>
  <tr>
    <td>Navigations</td>
    <td>Same as EntitySet name if the target cardinality is M</td>
    <td class="goodExample"><code>/OrderHead('1')/OrderItems</code></td>
    <td class="badExample"><code>/OrderHead('1')/Header_Item</code></td>
  </tr>
  <tr>
    <td>Function Imports (V2) / Actions (V4)</td>
    <td>Use Clear Names</td>
    <td class="goodExample">BlockSalesOrder</td>
    <td class="badExample">Block</td>
  </tr>
</table>
