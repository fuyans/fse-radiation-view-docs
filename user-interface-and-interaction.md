# User Interface and Interaction

## Purpose

This document explains how the user interface is organized and how to use it efficiently when building, editing, and reviewing a radiation heat transfer scene.

The interface is divided into five main areas:

* **Top menu bar** for file and application-level commands.
* **Right sidebar** for object properties, scene settings, and computation controls.
* **Left toolbar** for quickly adding objects to the scene.
* **Bottom toolbar** for navigation, object interaction modes, and view switching.
* **Lower-left viewport overlays** for scene statistics and the 3D axis gizmo.

## Top Menu Bar

The top menu bar exposes commands that are not always practical to keep on a toolbar.

Typical actions available here include:

* Opening and saving files.
* Importing and exporting project data.
* Accessing scene, edit, and application commands.
* Opening tools and options that are used less frequently than the main viewport controls.

In general, use the top menu bar whenever you need to manage files or access commands that affect the project as a whole rather than a single object.

## Right Sidebar

The right sidebar is the main panel for inspecting and editing the current selection or scene configuration.

Depending on what is selected, this area can be used to:

* Review and edit object properties.
* Adjust geometry and placement values.
* Configure material or solver-related inputs.
* Access scene-wide settings and visualization controls.

The sidebar is the best place to make precise changes after creating or selecting an object in the viewport.

## Left Toolbar

The left toolbar provides quick access to object creation tools so users can add items directly into the scene without opening menus.

Typical uses include adding:

* **Receivers**
* **Emitters**
* Other supported scene objects such as blocks or plan-based tools, depending on the current workflow

This toolbar is intended for rapid scene setup. When building a model, users will often start here to place the main objects before refining their dimensions and properties in the sidebar.

## Bottom Toolbar

The bottom toolbar provides quick access to scene navigation controls and interaction modes for editing objects in the 3D view.

### Navigation and Interaction Modes

The toolbar allows users to switch between several working modes:

* **Select mode** for general navigation and object selection.
* **Move mode** to select and move objects.
* **Stretch mode** to select and stretch objects.
* **Rotate mode** to select and rotate objects.

These modes help separate common editing tasks so the user can intentionally choose how they want to interact with the selected object.

### Local Axis Mode

The bottom toolbar also provides a **Local axis** toggle.

When this option is enabled, move, rotate, and stretch operations are performed relative to the selected object's local axes rather than the global scene axes. This is particularly useful when editing objects that have already been rotated and need to be adjusted in their own orientation.

When the toggle is disabled, transformations are applied relative to the global axes.

### View Selection

The toolbar includes quick access to several standard viewport views:

* **Perspective**
* **Front**
* **Back**
* **Left**
* **Right**
* **Top**
* **Bottom**

The **Perspective** view is the standard 3D working view.

The orthographic views (**Front**, **Back**, **Left**, **Right**, **Top**, and **Bottom**) present the scene in a more 2D manner, which makes alignment, positioning, and editing easier when working on a single plane or axis direction.

## Lower-Left Viewport Information

The lower-left area of the viewport contains supporting visual aids:

* **Scene statistics** showing information about the items currently in the scene.
* A **3D axis gizmo** indicating the orientation of the scene axes.

These tools help users maintain awareness of scene complexity and current orientation while navigating the model.

## Recommended Way to Use the Interface

For efficient editing, a typical workflow is:

1. Use the left toolbar to add emitters, receivers, and other required objects.
2. Use the bottom toolbar to choose the correct interaction mode and viewport view.
3. Select objects in the scene and refine their parameters in the right sidebar.
4. Use the top menu bar for file operations and less frequently used commands.
5. Refer to the lower-left overlays to stay oriented and monitor scene information while editing.

Using the interface in this way helps separate scene creation, scene navigation, precise editing, and project management into clear, predictable steps.
