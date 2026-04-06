# User Manual

FSE Radiation View supports 3D radiation heat transfer calculations using Monte Carlo ray tracing. Within the modelling environment you can define emitters, receivers, and opaque blocking geometry, then calculate the resulting net radiative heat flux on each receiver.

The reported receiver values combine:

- radiation received directly from designated emitters
- radiation from an optional uniform ambient radiative background
- the receiver's own thermal re-emission

Results are visualised as heatmaps in the viewport and can be exported for formal reporting.

> **Model scope:** Only designated emitters contribute active source radiation. Blocks and receivers affect line of sight, but they are not solved as secondary radiating surfaces. When ambient temperature is supplied, it is applied as a uniform radiative background and is not reduced by shielding or orientation. The application is therefore suited to direct-radiation problems, not full enclosure-radiation or radiosity analyses.

## Main Concepts

* **Emitter:** A planar surface that radiates energy according to its assigned thermal properties.
* **Receiver:** A planar surface on which net radiative heat flux is evaluated. Each receiver is discretised into cells according to the selected mesh size, and one value is reported per cell.
* **Block:** An opaque, non-transmitting object used to represent shielding or geometric obstruction.
* **Image Plan:** A horizontal reference plane displaying an imported image, such as a floor plan or schematic. Once the image scale and origin are set, world coordinates can be aligned to the drawing. It also acts as a 2D drawing surface for the **E<sub>p</sub>** / **R<sub>p</sub>** and **E<sub>S</sub>** / **R<sub>S</sub>** tools.
* **Helper Plan:** A horizontal reference plane with a grid and user-defined dimensions. It serves the same drawing function as an Image Plan when no imported image is required.

> **Face orientation:** Radiation is associated with the front face of each object, defined by the local +Z direction. Receiver sampling points are placed on that front face rather than at the mid-plane of the object thickness. Surface orientation and thickness should therefore be chosen to represent the physical receiving face explicitly.

## Units

Unless the interface explicitly indicates otherwise, use the following engineering units consistently throughout the model:

* **Length:** Metres (m) — Applies to positions, dimensions, mesh size, and world coordinates.
* **Temperature:** Kelvin (K) — Applies to emitter, receiver, and ambient temperatures.
* **Heat Flux:** Kilowatts per square metre (kW/m²) — Applies to net heat flux solver outputs, heatmaps, and reports.

## Ambient Temperature Interpretation

Within this application, **ambient temperature** represents a **radiative surroundings temperature**, not a room-air or outdoor-air temperature for convection.

When ambient temperature is provided, the solver applies a uniform radiative background equal to $\sigma T_a^4$ at every receiver location. This ambient contribution:

* is **not** ray-traced
* is **not** reduced by blocks
* does **not** depend on receiver orientation
* does **not** distinguish between sky, walls, ground, or other surroundings

This is equivalent to applying a uniform blackbody background at temperature $T_a$ with an effective view factor of 1.

## Recommended Workflow

1. **Create geometry:** Insert emitters, receivers, and blocks from the Add menu or the left toolbar. Alternatively, draw objects directly on an Image Plan or Helper Plan using the two-point tools (**E<sub>p</sub>** / **R<sub>p</sub>** for flat surfaces and **E<sub>S</sub>** / **R<sub>S</sub>** for standing surfaces).
2. **Orient and dimension objects:** Position the geometry in the viewport and use the sidebar for exact dimensions, coordinates, and thermal inputs. Confirm that each active face points in the intended direction.
3. **Set receiver resolution:** Choose a mesh size that captures the required spatial variation without creating unnecessary numerical noise.
4. **Run the solver:** Use **Status > Run** or the main **Run** control. The application processes the scene and calculates one net heat-flux value per receiver cell.
5. **Review the output:** Inspect the heatmap, tooltip values, and reported extrema. If the field appears noisy, repeat the analysis with a higher ray count.
6. **Export results:** Use **File > Export > Heat flux report (HTML)** to generate a report containing the receiver names, dimensions, and principal result values.

## Data and Display

* **Raw data storage:** Values stored with each receiver and values exported to reports are the raw solver outputs. No smoothing or post-processing is applied to those saved values.
* **Visual refresh:** Heatmaps do not redraw automatically after every parameter change or re-run. Use the **Refresh** control under the **Compute** tab when you need the visual overlay to be regenerated.
* **Heatmap resolution:** Heatmap textures scale with receiver mesh size to control memory use. Mesh sizes $\le 0.01$ use a 1x scale, mesh sizes $\ge 0.2$ use a 16x scale, and texture dimensions are capped at 2048 pixels per side.
* **Noise reduction (experimental):** Visual smoothing options in **Settings > Visualisation** modify only the displayed field. They do not change the underlying stored or exported values. For engineering review, it is generally preferable to assess the raw results first.

## Cursor Info and Reporting

### Viewport Tooltips

Hovering over a receiver displays:

* **Heat flux:** The displayed value at the cursor position.
* **Position:** World coordinates $(x, y, z)$.
* **Range:** The minimum and maximum heat flux over the receiver.
* **Maximum value and location:** The peak raw heat flux and its associated world coordinate or cell index.

### HTML Reports

Using **File > Export > Heat flux report (HTML)** generates a tabulated summary of all receivers, including the receiver name, dimensions, minimum and maximum heat flux, and the reported location of the maximum value.

## Managing Uncertainty: Mesh Size and Rays

Results from the Monte Carlo solver are subject primarily to statistical sampling noise and spatial discretisation.

### 1. Statistical Noise (Ray Count)

The solver uses a finite number of stochastic rays, so each reported heat-flux value contains Monte Carlo sampling error. As a first-order rule, the standard error decreases approximately in proportion to $1/\sqrt{N}$, where $N$ is the ray count. Halving the statistical error therefore requires approximately four times as many rays.

* **Recommendation:** Use **500,000 rays** as a practical starting point for engineering studies, then increase the ray count where smoother fields or tighter tolerances are required.
* Increase the ray count when using a fine mesh, when examining localised peaks, or when the result is sensitive to small changes in geometry.

### 2. Discretisation (Mesh Size)

Each receiver is divided into cells according to the selected **Mesh size**, and the solver reports one average value per cell.

* **Finer mesh (smaller value):** Improves spatial resolution, but makes local fluctuations more visible and may require a higher ray count to obtain a comparably smooth field.
* **Coarser mesh (larger value):** Produces a smoother field, but may smear local peaks and gradients.
* **Recommendation:** Select mesh size from the expected scale of the physical variation. For large receivers, **0.5 m** is a reasonable starting point. For smaller receivers, **0.2 m** is often suitable.

> **Workflow Tip:** Set your mesh size to capture the necessary physical detail first. Run a test with a moderate ray count. If the heatmap is too noisy, increase the ray count for the final calculation rather than sacrificing spatial resolution.

## Practical Modelling Guidance

### Approximating Heat Flux at a Single Location

To approximate the heat flux at a specific location, place a very small receiver at that position and choose a **Mesh size** larger than the receiver dimensions so that only one cell is created. The reported value is then a small-area average centred on that receiver rather than a true mathematical point value.

### Drawing Objects on a Plan (E<sub>p</sub>/R<sub>p</sub> and E<sub>S</sub>/R<sub>S</sub>)

The surface creation tools in the left toolbar allow rapid model setup directly from a plan or reference image.

* **E<sub>p</sub>** / **R<sub>p</sub>** (Flat): Draws an emitter or receiver lying flat against the plan (for example, a floor panel).
* **E<sub>S</sub>** / **R<sub>S</sub>** (Standing): Draws an object standing vertically on the plan (for example, a wall). The drawn line defines the base width, and the height defaults to 1 m until edited in the sidebar.

**How to use:**

1. Click the desired tool (**E<sub>p</sub>**, **R<sub>p</sub>**, **E<sub>S</sub>**, or **R<sub>S</sub>**) to enter creation mode.
2. Click once on the Image Plan, Helper Plan, or default $y = 0$ plane to set the first corner.
3. Move the cursor to preview the object footprint and thickness.
4. Click again to confirm the opposite corner. The object is created immediately and the tool then deselects.

*Press **Esc** at any time to cancel.*

## Parameter Summary

### Global Parameters

* **Ambient temperature ($T_a$):** Defines the uniform radiative surroundings temperature. If omitted, ambient irradiance is taken as zero. Setting $T_a = T_r$ is useful when a benchmark is intended to isolate direct emitter-to-receiver exchange.
* **Ray count ($N$):** Controls the Monte Carlo sample size. Higher values reduce statistical noise at the cost of longer run time.

### Emitter Parameters

* **Surface temperature ($T_e$):** Defines the thermal emission level of the source.
* **Emissivity ($\epsilon_e$):** Dimensionless radiative property of the emitter, bounded by $0 \le \epsilon_e \le 1$.
* **Emissive power / heat flux ($E$):** Where this input mode is available, it provides an alternative way to define the source strength using Stefan-Boltzmann equivalence.

### Receiver Parameters

* **Surface temperature ($T_r$):** Defines the receiver's thermal re-emission term.
* **Emissivity ($\epsilon_r$):** Dimensionless receiver emissivity, bounded by $0 \le \epsilon_r \le 1$.
* **Absorptivity ($\alpha_r$):** Dimensionless receiver absorptivity, bounded by $0 \le \alpha_r \le 1$.
* **Mesh size:** Controls receiver discretisation and therefore the spatial resolution of the reported field.

> **Engineering note:** For an opaque grey surface, a common simplifying assumption is $\alpha_r = \epsilon_r$. If different values are entered, the modelling basis should be stated explicitly in the project record.

> **Warning on ambient temperature:** Because the ambient term is geometry-independent, the model does not capture reduced environmental radiation due to shielding, restricted sky view, or separate temperatures for surrounding surfaces. If those effects are important, the present ambient treatment may overestimate ambient heating and underestimate radiative cooling.
