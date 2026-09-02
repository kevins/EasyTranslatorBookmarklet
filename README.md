# Easy Translator Bookmarklet for Dynamics 365 / Power Apps

A browser bookmarklet for editing Microsoft Dataverse / Dynamics 365 / Power Apps model-driven app translations directly from the page you already have open.

It recreates the core **Easy Translator** workflow in a bookmarklet, making it useful on locked-down machines where installing XrmToolBox or browser extensions is not possible.

![Easy Translator export options](images/easy-translator-options.png)

## Why a Bookmarklet?

Easy Translator is normally used through XrmToolBox. This version runs directly inside the current Dynamics 365 / Power Apps browser session.

There is no separate executable to install and no additional sign-in. The bookmarklet uses the Dataverse permissions of the user currently signed in to the environment.

## Installation

1. Create a new browser bookmark/favorite.
2. Name it something like `Easy Translator`.
3. Edit the bookmark.
4. Paste the complete bookmarklet code into the URL field.
5. Make sure the URL starts with `javascript:`.
6. Open a Dynamics 365 / Power Apps model-driven application.
7. Click the bookmark.

## Using It

1. Click **Load Entities**.
2. Choose all entities or load entities from a specific solution.
3. Select the tables and translation types you want to work with.
4. Choose whether to export all languages or a specific language.
5. Optionally filter rows to translations that are blank or still match English.
6. Click **Extract translations**.
7. Edit labels directly in the workbook-style grid.
8. Review the pending changes.
9. Click **Save and Publish** to write the changes back to Dataverse and publish the affected customizations.

![Easy Translator translation editor](images/easy-translator-workbook.png)

## Translation Types

The bookmarklet can work with translations for:

- Tables/entities
- Columns/attributes
- Relationships with custom labels
- Global Choice / Option Set labels
- Local Choice / Option Set labels
- Boolean labels
- Views
- Charts
- Forms
- Form tabs
- Form sections
- Form fields
- Sitemap areas, groups, and subareas
- Dashboards and dashboard components

You can also choose to work with names, descriptions, or both.

## Useful Features

- Load all customizable tables or only tables from a selected solution
- Search and select individual tables
- Export all available languages or one language
- Filter to rows where French matches English, is blank, or both
- Spreadsheet-style translation editor with separate tabs for each component type
- Filter extracted rows
- Track the number of pending changes
- Jump between changed cells
- Save edited labels directly back to Dataverse
- Publish targeted customizations when possible
- Resizable and movable interface
- Runs entirely from the current browser session

## Requirements

- Microsoft Dynamics 365 / Power Apps model-driven app backed by Dataverse
- A modern browser that supports bookmarklets
- Permission to read the metadata being extracted
- Appropriate Dataverse customization privileges for anything you want to save and publish

## Security

The bookmarklet runs JavaScript in the Dynamics 365 / Power Apps page that is already open and uses your existing authenticated Dataverse session.

It does **not** bypass Dataverse security. If your account does not have permission to modify or publish a customization, the bookmarklet does not grant that permission.

Because **Save and Publish** makes real changes to the environment, use it carefully in production.

## Easy Translator / XrmToolBox

This is an independent bookmarklet implementation of the Easy Translator workflow and is **not** the official Easy Translator plugin or an official XrmToolBox project.

The original Easy Translator plugin for XrmToolBox is maintained by **MscrmTools**:

- Easy Translator: https://www.xrmtoolbox.com/plugins/MsCrmTools.Translator/
- XrmToolBox: https://github.com/MscrmTools/XrmToolBox

If you are able to install and run XrmToolBox, the official Easy Translator plugin is also worth using.

## Repository Layout

```text
EasyTranslatorBookmarklet/
├── EasyTranslatorBookmarklet.txt
├── README.md
└── images/
    ├── easy-translator-options.png
    └── easy-translator-workbook.png
```

If you store the bookmarklet under a different filename, update the layout above accordingly.
