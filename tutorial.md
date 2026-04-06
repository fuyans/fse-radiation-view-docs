# Tutorial

This tutorial presents a worked example using FSE Radiation View. Results should always be interpreted alongside the relevant fire engineering design method or regulatory guidance. In UK practice this may include BRE Report 187 (BR 187) or an equivalent project-specific methodology.

## Worked Example 1

This example considers an irregular building arrangement comprising a circular dome-shaped enclosure connected to a cuboid enclosure. The two spaces are fully connected, are at different heights, and are both used as offices.

Four adjacent buildings, labelled A to D, are also included. Relevant building surfaces are numbered for clarity.

In this example, the actual building surfaces are assessed directly. The site-boundary and mirror-building concepts are not used.

The figure below shows the site plan.

![Site plan](/tutorial/worked_example_1/site_plan.png)

### 1. Import the Drawing and Set the Scale

Import the floor plan as a PNG and set the image scale so that the drawing dimensions match the world coordinates.

<video controls width="100%">
  <source src="/tutorial/worked_example_1/1-import_drawing.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

### 2. Add Emitters

Use the standing-emitter tool to draw emitters on the plan. Draw them in an anticlockwise direction so that the active face points outwards. After each emitter is created, confirm visually that the red face is the radiating face.

<video controls width="100%">
  <source src="/tutorial/worked_example_1/2-add_emitters.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

### 3. Add Receivers

Add receivers using the corresponding standing-receiver tool. Ensure that the receiver front face is oriented towards the expected radiation source before proceeding.

<video controls width="100%">
  <source src="/tutorial/worked_example_1/3-add_receivers.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

### 4. Set Heights

Set the heights and widths of emitters and receivers in the sidebar. Use the explicit **height** and **width** fields for dimensions, and leave **scale** at 1 in all directions. Using both scale and dimension fields together is not recommended because the values multiply.

<video controls width="100%">
  <source src="/tutorial/worked_example_1/4-set_heights.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

### 5. Set Temperatures

Assign temperatures to emitters and receivers in the sidebar. If you need to convert between temperature and emissive power, use the Stefan-Boltzmann relation or the calculator on the [Radiation Heat Transfer](./reference-radiation-heat-transfer.md) page. BR 187 provides representative source terms for many external fire spread scenarios.

<video controls width="100%">
  <source src="/tutorial/worked_example_1/5-set_temperature.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

### 6. Rename Objects

Rename emitters and receivers using meaningful identifiers, for example by facade, orientation, or location. This makes the exported report substantially easier to interpret.

<video controls width="100%">
  <source src="/tutorial/worked_example_1/6-rename_objects.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

### 7. Run the Calculation

When the model is ready, run the calculation from the **Compute** section of the sidebar. The solver runs on a server, so use the **Check** control to confirm that the service is available before starting. For guidance on **Number of Rays** and uncertainty, see [Verification](./verification.md). The solver processes one receiver at a time, so the full run may take several minutes.

<video controls width="100%">
  <source src="/tutorial/worked_example_1/7-run.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

### 8. Inspect Results Visually

When the calculation is complete, results are displayed on each receiver as a heatmap with optional contours. Hover over a receiver to inspect the local net heat flux. The colour scale, value range, and contour levels can be adjusted in the sidebar.

<video controls width="100%">
  <source src="/tutorial/worked_example_1/8-inspect_visual_output.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

### 9. Export Numerical Results

Export results in tabulated form for reporting using **File > Export > Heat flux report (HTML)**. See the [User Manual](./user-manual.md) for further detail on report contents and viewport tooltips.

<video controls width="100%">
  <source src="/tutorial/worked_example_1/9-inspect_numerical_output.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

---

For additional detail on concepts, units, and workflow, see the [User Manual](./user-manual.md). For solver accuracy, uncertainty, and recommended ray counts, see [Verification](./verification.md).
