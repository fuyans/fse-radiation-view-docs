# Verification

The goal of verification in this instance is to ensure the calculated heat flux due to radiation is sufficiently accurate when compared to deterministic method results. Additionally, the Monte Carlo ray casting algorithm's stochastic nature means that the result has a certain level of randomness/uncertainty; this is quantified as part of this verification to ensure the results are within the required confidence level.

## Acceptance Criteria

For the ray-casting solver to be considered verified against deterministic baselines, the following criteria must be met:
1.  **Accuracy:** The mean calculated heat flux from the solver runs must be within ±2% relative error or ±0.05 kW/m² absolute error of the deterministic analytical solution.
2.  **Edge Case Robustness:** Objects with a theoretical view factor of zero (due to orientation, back-face positioning, or occlusion) must report exactly 0.00 kW/m² incident flux.

## Comparison Against Deterministic Calculations

Deterministic methods (analytical view factor equations) are available for rectangular emitters to a receiver when they are parallel, perpendicular, or at an angle along one axis. 



The verification is carried out for a single-point receiver located at various distances to the emitter. To ensure rigorous testing of the spatial coordinates, the receiver is aligned with one corner of the emitter, rather than the center. 

### Parallel

This case involves a single emitter and a single-point receiver. The receiver is positioned aligned with one corner of the emitter at perpendicular distances ranging from 1 m to 4 m. The receiver faces directly toward the emitter (i.e., parallel planes).

* **Emitter:** 2 m width × 1 m height. Temperature = 1103.3 K, Emissivity = 1.
* **Receiver:** Single point measurement. Temperature = 293 K, Absorptivity = 1.
* **Solver settings:** 1,000,000 rays, Ambient temperature = 293 K.

**Results:**

| Separation Distance [m] | Deterministic [kW/m²] | Run 1 [kW/m²] | Run 2 [kW/m²] | Run 3 [kW/m²] | Mean [kW/m²] | Absolute Error [kW/m²] | Relative Error [%] |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 14.06 | 14.028 | 14.027 | 14.090 | 14.048 | 0.012 | 0.08% |
| 2 | 7.58 | 7.559 | 7.594 | 7.554 | 7.569 | 0.011 | 0.15% |
| 3 | 4.39 | 4.378 | 4.380 | 4.396 | 4.385 | 0.005 | 0.11% |
| 4 | 2.78 | 2.788 | 2.804 | 2.780 | 2.791 | 0.011 | 0.40% |

### Perpendicular

This case involves a single emitter and a single-point receiver. The receiver is positioned aligned with one corner of the emitter at distances ranging from 1 m to 4 m. The receiver face is oriented 90 degrees to the emitter face (i.e., perpendicular planes sharing a virtual intersecting edge).

* **Emitter:** 2 m width × 1 m height. Temperature = 1103.3 K, Emissivity = 1.
* **Receiver:** Single point measurement. Temperature = 293 K, Absorptivity = 1.
* **Solver settings:** 1,000,000 rays, Ambient temperature = 293 K.

**Results:**

| Separation Distance [m] | Deterministic [kW/m²] | Run 1 [kW/m²] | Run 2 [kW/m²] | Run 3 [kW/m²] | Mean [kW/m²] | Absolute Error [kW/m²] | Relative Error [%] |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 7.99 | 7.989 | 8.001 | 7.984 | 7.991 | 0.001 | 0.01% |
| 2 | 2.99 | 2.993 | 2.989 | 2.971 | 2.984 | 0.006 | 0.20% |
| 3 | 1.29 | 1.316 | 1.285 | 1.290 | 1.297 | 0.007 | 0.54% |
| 4 | 0.64 | 0.638 | 0.652 | 0.644 | 0.645 | 0.005 | 0.78% |

*Conclusion for Deterministic Comparison: All mean relative errors are well below the 2% threshold, confirming the solver accurately computes parallel and perpendicular view factors.*

## Blockage

The following configurations verify the geometric logic of the ray-casting algorithm, ensuring that culling, normal orientation, and physical occlusion function correctly. For all edge cases below, the theoretical incident radiation is zero.

### Receiver Behind Emitter

![edge_case-behind_emitter](images/edge_case-behind_emitter.png)

The receiver is positioned physically behind the emitter, outside the 180-degree field of view of the emitter's active (+Z) front face. The solver correctly registers 0.00 kW/m² heat flux, validating that emission only occurs from the defined active face.

### Receiver Facing Away From Emitter

![edge_case-facing_away_emitter](images/edge_case-facing_away_emitter.png)

The receiver is positioned in front of the emitter, but its own active receiving face (+Z) is oriented strictly away from the heat source. The solver correctly returns 0.00 kW/m², verifying proper back-face culling on the receiver geometry.

### Receiver Blocked by Emitter

![edge_case-blocked_by_emitter](images/edge_case-blocked_by_emitter.png)

A secondary receiver is placed entirely within the shadow cast by a primary, inactive emitter object situated between the active heat source and the receiver. The solver calculates 0.00 kW/m², confirming that emitters are treated as opaque surfaces that block rays originating from behind them.

### Receiver Blocked by a Obstacle

![edge_case-blocked_by_obstacle](images/edge_case-blocked_by_obstacle.png)

An opaque generic Block object is introduced directly into the line of sight between the emitter and the receiver, completely occluding the view factor. The solver outputs 0.00 kW/m² across the shadowed mesh, validating the geometric intersection logic for non-participating blocking bodies.

### Receiver Blocked by Another Receiver

![edge_case-blocked_by_receiver](images/edge_case-blocked_by_receiver.png)

A primary receiver is positioned between the emitter and a secondary receiver. The solver outputs heat flux values for the primary receiver, but strictly 0.00 kW/m² for the secondary receiver located in its shadow. This verifies that receivers act as opaque planes and do not inappropriately transmit incident rays.

## Uncertainty: Sources and Settings

### Sources of Uncertainty

Results from the solver are subject to two main uncertainties:

1.  **Monte Carlo (statistical) noise:** The solver casts a finite number of rays. Each cell's flux is estimated from the rays that hit it. Because the ray directions and outcomes are random, the estimate has sampling variance: with more rays, the estimate converges to the true value, but with fewer rays, you see random scatter. For typical Monte Carlo estimators, the standard error of a cell's flux is inversely proportional to the square root of the number of rays, $N$:
    $$\text{Standard Error} \propto \frac{1}{\sqrt{N}}$$
    Therefore, doubling the ray count reduces the typical error by a factor of roughly $1.414$ ($\sqrt{2}$); to halve the error, you need four times the number of rays.

2.  **Receiver discretization (mesh size):** The receiver is split into a grid of cells (controlled by the mesh size). The solver returns one flux value per cell. A finer mesh (smaller mesh size) provides better spatial resolution but yields more cells. For a fixed total ray count, a finer mesh results in fewer rays intersecting each individual cell, thereby increasing the statistical noise per cell. A coarser mesh provides smoother data but sacrifices spatial detail.

Other effects (geometry, temperatures, theoretical view factors) are deterministic. Any deviation due to these variables is classified as model error, not statistical uncertainty.

### Validation Results (500k rays, single-point receivers)

Validation runs were performed using 500,000 rays per run, with 10,000 iterations per configuration for several emitter–receiver geometries (perpendicular and parallel orientations, various separation distances). Reference (expected) heat flux was computed analytically. The following summarizes the observed Monte Carlo error (defined as the solver output minus the analytical reference, in kW/m²):

* **Bias:** The mean error across all runs is close to zero in all tested configurations, confirming the solver algorithm is statistically unbiased.
* **Spread:** The standard deviation of the error depends heavily on the spatial configuration. In high–view-factor cases (small separation distance, high expected flux), the standard deviation is on the order of 0.05 to 0.06 kW/m². As the view factor and expected flux decrease (e.g., at larger separation distances), the standard deviation decreases accordingly, falling to approximately 0.01 kW/m² in the lowest-flux cases tested.
* **Worst-case single-run error:** In the most demanding configurations (highest view factor), individual run deviations can occasionally reach approximately ±0.2 kW/m². When the view factor is smaller, absolute errors are generally bound within 0.1 kW/m², and frequently within 0.04 kW/m² in low-flux domains.
* **Practical implication:** For a baseline of 500,000 rays, standard typical deviations (1σ) of 0.05–0.06 kW/m² are expected in high-flux regions. To restrict maximum outliers to tighter tolerances in high-view-factor scenarios, the total ray count must be increased (e.g., to 1,000,000 rays) or values must be averaged across consecutive runs.

The figures below display the distribution of errors (solver output minus expected reference, in kW/m²) for each separation distance evaluated in the validation set. Each subplot represents a histogram over 10,000 runs. The red dashed line denotes the mean error, and the orange dotted lines denote the bounds of ±1 standard deviation. Subplots are ordered by separation distance (smaller to larger); as separation increases, the expected flux decreases, and the statistical spread logically narrows.

<ClientOnly>
  <ValidationUncertaintyChart />
  <template #fallback>
    <p class="chart-fallback">Loading interactive chart…</p>
  </template>
</ClientOnly>
