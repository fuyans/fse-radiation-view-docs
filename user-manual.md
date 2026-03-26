# User Manual

This editor supports 3D radiation heat transfer calculations using Monte Carlo ray tracing. Within the environment, you can define **emitters** (hot surfaces), **receivers** (surfaces that receive radiant flux), and **blocks** (opaque obstacles). 

The solver computes the **net heat flux** on each receiver. This accounts for the incident radiation from emitters, ambient irradiance (when **Ambient temperature** is set), minus the receiver's own re-emission (σT⁴). The resulting temperature difference between the emitter and receiver is inherently reflected in the calculations. 

*Note: Only emitters contribute active radiation to the environment. Rays that strike other receivers or blocks do not contribute secondary radiation; they only act as physical obstructions.*

Results are visualized as heatmaps within the viewport and can be exported for formal reporting.

## Main Concepts

* **Emitter:** A planar surface that radiates heat (e.g., a furnace wall). The solver uses the user-defined temperature to compute the emitted power.
* **Receiver:** A planar surface where the net heat flux is calculated. Each receiver is discretized into a grid of cells based on the chosen mesh size. The solver returns one net flux value per cell, which is displayed as a heatmap and optional contour lines.
* **Block:** An opaque, non-transmitting object used to model physical obstacles between emitters and receivers.
* **Image Plan:** A horizontal reference plane that displays an imported image (e.g., a floor plan or schematic). By setting the scale and origin, world units align with the image. It serves as a 2D drawing surface for the E<sub>p</sub>/R<sub>p</sub> and E<sub>S</sub>/R<sub>S</sub> two-point tools.
* **Helper Plan:** A horizontal plane with a grid and user-defined dimensions. It functions identically to an Image Plan, providing a reference drawing surface when an imported image is not required.

> **Important Geometric Note:** All geometry utilizes the **front face** of each object for radiation (emission, reception, or blocking). The front face is defined by the **+Z normal** in the object's local space. For receivers, the sampling grid is placed directly on this front face, not at the center of the object's thickness. This geometry standard typically yields conservative results (e.g., slightly higher calculated heat fluxes), which is standard practice for design or safety verifications.

## Units

All quantities utilize the following default units. There is no unit selector in the UI; you must ensure your inputs align with these standards:

* **Length:** Metres (m) — Applies to positions, dimensions, mesh size, and world coordinates.
* **Temperature:** Kelvin (K) — Applies to emitter, receiver, and ambient temperatures.
* **Heat Flux:** Kilowatts per square metre (kW/m²) — Applies to net heat flux solver outputs, heatmaps, and reports.

## Workflow

1.  **Add Objects:** Insert Emitters, Receivers, or Blocks from the Add menu or the left toolbar. Alternatively, create objects directly on a plan using the two-point drawing tools (**E<sub>p</sub> / R<sub>p</sub>** for flat surfaces, **E<sub>S</sub> / R<sub>S</sub>** for standing surfaces).
2.  **Position and Parameterize:** Place and scale objects in the viewport. Use the sidebar to configure dimensions, temperatures, and receiver **Mesh size**. 
    * *Solver Settings:* Navigate to **Settings → Solver** to define the **Ambient temperature** and **Number of Rays**. 
3.  **Run Calculation:** Click **Status → Run** (or the main Run button). The editor processes the scene data and calculates the resulting heat flux per receiver.
4.  **View Results:** Receivers will update to display a heatmap. Hover the cursor over any receiver to view the specific heat flux at that point, the min/max range, and the location of the maximum flux.
5.  **Export:** Navigate to **File → Export → Heat flux report (HTML)** to generate a data table containing raw min/max values and locations for all receivers.

## Data and Display



* **Raw Data Storage:** The values saved in each receiver's parameters and exported in reports are strictly the **raw solver output**. No reduction or smoothing is applied to stored data.
* **Visualization Refresh:** Heatmaps and visual results do not update automatically when settings change or calculations are re-run. You must click the **Refresh** button under the **Compute** tab in the sidebar to redraw the visuals.
* **Heatmap Resolution:** Heatmap textures scale dynamically based on the receiver's mesh size to optimize memory. Mesh sizes ≤ 0.01 utilize a 1× scale, while sizes ≥ 0.2 utilize a 16× upscale. Texture dimensions are capped at 2048 pixels per side.
* **Noise Reduction (Experimental):** Located in **Settings → Visualization**, this feature (e.g., Median floor) smooths the visual heatmap and cursor tooltips. **Note:** This is an experimental display override only; it does not alter the raw stored or exported data. It is generally recommended to leave this disabled.

## Cursor Info and Reporting

### Viewport Tooltips
Hovering over a receiver displays:
* **Heat flux:** Interpolated value at the exact cursor position.
* **Position:** World coordinates (x, y, z).
* **Range:** The minimum and maximum flux across the entire receiver.
* **Max flux and location:** The absolute peak raw heat flux and its precise world coordinate or cell index.

### HTML Reports
Using **File → Export → Heat flux report (HTML)** generates a comprehensive table of all receivers. The report details the receiver name, dimensions, min/max flux, and the specific location of the maximum flux. 

## Managing Uncertainty: Mesh Size and Rays

Results from the Monte Carlo solver are subject to two primary sources of uncertainty: statistical noise and spatial discretization. 

### 1. Statistical Noise (Number of Rays)
The solver casts a finite number of rays. Because ray direction is stochastic, the flux estimate contains sampling variance. The standard error of a cell's flux scales proportionally to 1/√N, where N is the number of rays. Halving the error requires roughly four times the total rays.
* **Recommendation:** A baseline of **500,000 rays** is recommended for standard accuracy.
* Increase the ray count if you utilize a very fine mesh, require smoother spatial gradients, or need tight confidence intervals on peak values.

### 2. Discretization (Mesh Size)
The receiver is divided into a grid of cells governed by the **Mesh size**. The solver returns one averaged flux value per cell. 
* **Finer mesh (smaller value):** Yields higher spatial resolution but results in fewer rays striking each cell, increasing statistical noise.
* **Coarser mesh (larger value):** Yields smoother data with less noise, but sacrifices localized detail.
* **Recommendation:** For large receivers (>10 units), start with a mesh size of **0.5**. For smaller receivers, use **0.2**.

*Workflow Tip:* Set your mesh size to capture the necessary physical detail first. Run a test with a moderate ray count. If the heatmap is too noisy, increase the ray count for the final calculation rather than sacrificing spatial resolution.

## Advanced Techniques

### Calculating Heat Flux at a Single Point
To measure heat flux at one exact location, create a receiver at those coordinates. Set its dimensions to a very small area (e.g., 0.1 × 0.1 m) and set the **Mesh size** to a value *greater* than the receiver's dimensions. This forces the solver to produce a single calculation point at the exact center of the surface.

### Drawing Objects on a Plan (E<sub>p</sub>/R<sub>p</sub> and E<sub>S</sub>/R<sub>S</sub>)
You can swiftly create objects matched to a floor plan's orientation using the surface creation tools in the left toolbar.

* **E<sub>p</sub> / R<sub>p</sub> (Flat):** Draws an emitter or receiver lying flat against the plan (e.g., a floor panel).
* **E<sub>S</sub> / R<sub>S</sub> (Standing):** Draws an object standing vertically on the plan (e.g., a wall). The drawn line dictates the base width, and the height defaults to 1m (adjustable in the sidebar).

**How to use:**
1. Click the desired tool (E<sub>p</sub>, R<sub>p</sub>, E<sub>S</sub>, or R<sub>S</sub>) to enter creation mode.
2. Click once on your Image Plan (or the default y=0 plane) to anchor the first corner.
3. Move the cursor. A green wireframe box will preview the object's footprint and thickness.
4. Click again to confirm the opposite corner. The object is generated instantly, and the tool deselects. 
*Press **Esc** at any time to cancel.*

### Upcoming Feature Exploration: Bulk Digitization
Future updates may introduce polyline-based bulk object creation. This will allow users to select an image plan and draw continuous line segments, automatically generating a sequence of standing emitters or receivers along that path. This is intended to drastically reduce setup time for complex floor plans.

## 8. User Interface Variable Inputs and Units
To facilitate accurate solver execution, the application interface must collect the following parameters. All temperatures must be internally converted to Kelvin (K) prior to calculation.

### 8.1. Global Parameters
* **Ambient Temperature ($T_a$):** Required. Standard input format: Kelvin (K) or Celsius (°C).
* **Ray Count ($N$):** Required. Integer value dictating the Monte Carlo ray-casting resolution per mesh point. Default recommendation: 1,000 to 10,000 rays.

### 8.2. Emitter Parameters
* **Surface Temperature ($T_e$):** Required (unless Emissive Power is provided). Input format: K or °C.
* **Emissivity ($\epsilon_e$):** Required. Dimensionless scalar. Valid range: $0.0 \le \epsilon_e \le 1.0$.
* **Emissive Power / Heat Flux ($E$):** Optional alternative to temperature. Input format: kW/m² or W/m².

### 8.3. Receiver Parameters
* **Surface Temperature ($T_r$):** Required. Input format: K or °C.
* **Emissivity ($\epsilon_r$):** Required. Dimensionless scalar. Valid range: $0.0 \le \epsilon_r \le 1.0$.
* **Absorptivity ($\alpha_r$):** Required. Dimensionless scalar. Valid range: $0.0 \le \alpha_r \le 1.0$.