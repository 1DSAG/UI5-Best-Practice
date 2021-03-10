---
layout: default
title: Fiori Design Guidelines
name: Fiori Design Guidelines
parent: Design Guidelines
nav_order: 2
---



Traditional most of sap gui transaction weren't considerd as user friendly. The past has shown, how important usibility is. When developping Fiori Apps however, design and usibility play major roles. Today, every UI5 developper should be interested in creating these beautyfull nicely to use apps. Following the Fiori Design Guidlines can help to achieve this goal. For that Reason it is recommended to get familiar with the Design Guidelines. Also following the guidelines ensures coherence, one of the five fiori design principles (see below for more on that), between standard UI5 apps and custom apps. But what exactly is Fiori and what is the difference between Ui5 and Fiori Apps?

![SAPUI5 i18n Files and Folder](img/FioriDesignGuidelines.png)

# Fiori, Fiori Apps and UI5 Apps

 Fiori is a design system, that describes how Apps should be designed. A Fiori App is an App that is designed according to this Fiori design paradigm. UI5 is a software framework, which is used to develop Apps. This means that not every UI5 App is a Fiori App at same time. It is possible to build an UI5 App, which violates the Fiori Design Principles. But UI5 is usually needed to create a Fiori App, because it includes many elements, which are based on the fiori design principles. Besides UI5, SAP offers another concept to develop Apps according to the Fiori Design Guidelines. This is fiori elements.

This chapter describes some of the basics concepts, when it comes to designing fiori Apps. For details it is strongly reffered to the official [Fiori Design Guidelines](https://experience.sap.com/fiori-design-web/) published by SAP.

# Design Principles

Fiori is based on five design principles. They should be considered in any design decisions. The five principles are:
- ROLE-BASED
- DELIGHTFUL
- COHERENT
- SIMPLE
- ADAPTIVE

For a detailed definition and description we refer once again to the [Design Guidelines](https://experience.sap.com/fiori-design-web/design-principles/). Nevertheless, we would like to highlight the importance of a 'coherent' user experience. Coherence means in the context of fiori as much as that the design and interaction of different apps should be consistent. It is important to ensure that users know what the consequences of their actions are. For exmaple the same icon should be used in all apps to delete items from a list. This inevitably means that third-party developers should follow the design of standard SAP applications, because most self-developed UI5 apps are deployed together with standard applications on the same system.

# Floorplans
An important concept in Designing Fiori Apps are Floorplans. They are basically page layouts. On a closer look at them you will notice, that many standard fiori Apps are build according to these Floorplans. The Design Guidlines consider them to be good layout choices for given use cases.
Six floorplans exist. These are:
- Analytical List Page
- List Report
- Worklist
- Overview Page
- Object Page
- Initial Page
- Wizard

 For the their detailed structure and the usecases, it is referred to [Fiori Design Guidelines](https://experience.sap.com/fiori-design-web/). Keep in mind, that each of them has its own layout and should be used in different usecases. Whenever a floorplan fits to the usecase, it should be used. 

# Other content of the Design Guidelines and their limitations

A few must-read-articles can be found in the section ['Foundations'](https://experience.sap.com/fiori-design-web/launchpad/). For instance the article action placement where to place Buttons and other clickable elements. Another insteresting example in this section is the article 'Message Handling', what describes how messages should be displayed. 

There is a another section, that is called 'UI Elements'. Here single UI5 elements are presented. Recommendations are given when to use certain ui elements and when not to use them. Also their behavior and possible interactions with the controls are described. This can be very helpful to decide which ui elements are appropriate in a given context.

Of course lots of other interesting articles can be found in the guidelines, which aren't mentioned here. Since the goal is here to provide an overview, not every article is discussed. However, the fiori design guidelines have some gaps and never will be able to answer all design issues. To achieve a company-wide uniform app design, it is recommend to enhance the official design guidelines with company own rules. This is especially important, if the guidelines don't provide answers for a certain design question. While creating company own rules of course the five design principles should be taken into account. Perhaps rules can be even derieved from the design principles. 




