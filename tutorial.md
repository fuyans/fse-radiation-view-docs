# Tutorial

This page walks you through a step-by-step workflow using the Radiation Heat Transfer Editor. You should read and understand the principles of **BR 187** (or your applicable fire-safety standard) before interpreting results for design or safety assessments.

## Worked example 1

This example is a more realistic scenario: the building in question has an irregular shape—a circular dome-shaped enclosure connected to another cuboid enclosure. The two spaces are fully connected (so fire could spread between them), at different heights, and both are offices.

Four adjacent buildings (A to D) are included. Relevant building surfaces are labelled with numbers for convenience.

In this example, actual building surfaces are used to assess external flame spread; the site-boundary and mirror-building concepts are not used.

The figure below shows the site plan.

![Site plan](/tutorial/worked_example_1/site_plan.png)

### 1. Import the drawing and set the scale
Import the floor plan as a PNG and set the image scale so world units match the drawing.

<video controls width="100%">
  <source src="/tutorial/worked_example_1/1-import_drawing.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

### 2. Add emitters
Use the standing emitter option to draw emitters on the plan. Draw in an anticlockwise direction so that the emitting face points outward. After creating each emitter, check visually: the **red** side is the radiating face. 

<video controls width="100%">
  <source src="/tutorial/worked_example_1/2-add_emitters.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

### 3. Add receivers
Add receivers in the same way as emitters, using the standing receiver option and drawing on the plan.

<video controls width="100%">
  <source src="/tutorial/worked_example_1/3-add_receivers.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

### 4. Set heights
Set heights (and widths) for emitters and receivers in the sidebar. Use the **height/width** fields for dimensions and leave **scale** at 1 in all directions—using scale for size is not recommended because scale and height/width multiply together.

<video controls width="100%">
  <source src="/tutorial/worked_example_1/4-set_heights.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

### 5. Set temperatures
Assign temperatures to emitters and receivers in the sidebar. You can convert between heat flux and temperature using the Stefan–Boltzmann law (e.g. in FSEtools v2). BR 187 gives recommended values for common scenarios.

<video controls width="100%">
  <source src="/tutorial/worked_example_1/5-set_temperature.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

### 6. Rename objects
Rename emitters and receivers to something meaningful (e.g. by location or façade). This makes exported results easier to match to each receiver.

<video controls width="100%">
  <source src="/tutorial/worked_example_1/6-rename_objects.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

### 7. Run the calculation
When the model is ready, run from the **Compute** sidebar. The calculation runs on a server; use the **Check** button to confirm the server is available. For guidance on **Number of Rays** and uncertainty, see [Verification](./verification.md). The solver processes one receiver at a time; the full run can take several minutes. Progress is shown during the calculation.

<video controls width="100%">
  <source src="/tutorial/worked_example_1/7-run.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

### 8. Inspect results visually
When the run is complete, results appear on each receiver as a heatmap (and optional contours). Hover the cursor over a receiver to see the incident heat flux at that point. You can adjust the colour scale, value range, and contour levels in the sidebar.

<video controls width="100%">
  <source src="/tutorial/worked_example_1/8-inspect_visual_output.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

### 9. Export numerical results
Export results in tabulated form for reporting (e.g. **File → Export → Heat flux report (HTML)**). See the [User Manual](./user-manual.md) for details on reports and cursor tooltips.

<video controls width="100%">
  <source src="/tutorial/worked_example_1/9-inspect_numerical_output.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

---

For more detail on concepts, units, and workflow, see the [User Manual](./user-manual.md). For solver accuracy, uncertainty, and recommended ray counts, see [Verification](./verification.md).
