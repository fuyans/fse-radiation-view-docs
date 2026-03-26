# Radiation Heat Transfer

## 1. Introduction and Scope
This document details the mathematical framework used by the application to solve for radiation heat flux. The solver calculates these values at discrete mesh points situated on the surfaces of designated receivers.

To determine the incident radiation paths and view factors, the application employs a ray-casting methodology.

SI units are used throughout the calculation, except for heat flux is converted between W/m2 and kW/m2 at input and output as common practice.

### Calculation Constraints and Assumptions:

* **No Refraction or Reflection:** The application assumes straight-line radiation paths. Reflected and refracted energy are not calculated.
* **Directional Emission Limits:** Radiation originates exclusively from designated emitters. Receivers do not act as secondary emitters to other receivers. Even if a neighboring receiver possesses a higher temperature, its radiated energy is not accounted for in the heat flux calculations of other receivers.

### System Entities and Properties:

* **Emitters:** Defined by Temperature ($T_e$) and Emissivity ($\epsilon_e$).
* **Ambient:** Defined by Temperature ($T_a$).
* **Receivers:** Defined by Temperature ($T_r$), Emissivity ($\epsilon_r$), and Absorptivity ($\alpha_r$).

## 2. Net Heat Flux Equation
The total net radiation heat flux ($q''_{net}$) evaluated at any single mesh point on a receiver is the sum of two major energy terms: the net energy exchange with the ambient environment, and the energy received from the emitters.

$$q''_{net} = q''_{ambient} + q''_{emitter}$$

Where:
* $q''_{net}$ is the total net heat flux at the receiver mesh point.
* $q''_{ar}$ is the net energy exchange between the ambient environment and the receiver.
* $q''_{er}$ is the net energy exchange between the emitter and the receiver.

## 3. Energy Exchange: Emitter and Receiver ($q''_{e}$)
This term isolates the radiation originating from the emitters that is successfully absorbed by the receiver. Because the application uses ray casting, the geometric relationship and visibility between the mesh point and the emitter are quantified by a view factor ($F_e$).

The heat flux absorbed by the receiver from the emitter is calculated as:

$$q''_{e} = \alpha_{r} \cdot \epsilon_{e} \cdot \phi_{e} \cdot \sigma \cdot T_{e}^4$$

Where:
* $\alpha_r$ = Absorptivity of the receiver
* $\epsilon_e$ = Emissivity of the emitter
* $\sigma$ = Stefan-Boltzmann constant ($5.670374 \times 10^{-8} \text{ W/(m}^2 \cdot \text{K}^4)$)
* $\phi_e$ = View factor from the receiver mesh point to the emitter (determined via ray casting, $0 \le F_e \le 1$)
* $T_e$ = Absolute temperature of the emitter (in Kelvin)


## 4. Energy Exchange: Ambient and Receiver ($q''_{a}$)
This term calculates the net difference between the radiation absorbed from the ambient environment and the total radiation emitted away by the receiver itself.

Rays cast from the receiver that do not intersect an emitter are assumed to hit the ambient environment. Therefore, the ambient view factor is $F_a = 1 - F_e$. The ambient environment is modelled as a blackbody ($\epsilon = 1$) at temperature $T_a$.

The net ambient energy exchange is calculated as:

$$q''_{ar} = (\alpha_r \cdot \sigma \cdot T_a^4 \cdot \phi_{a}) - (\epsilon_r \cdot \sigma \cdot T_r^4)$$

Where:
* $T_a$ = Absolute temperature of the ambient environment (in Kelvin)
* $\phi_{a}$ = View factor from the receiver to the ambient environment
* $\epsilon_r$ = Emissivity of the receiver
* $T_r$ = Absolute temperature of the receiver (in Kelvin)
* The first half of the equation represents ambient energy absorbed; the second half represents the energy actively emitted by the receiver.

## 5. Expanded Net Heat Flux Equation
By substituting the expanded individual exchange terms back into the primary equation, the complete formula for the net heat flux at a receiver mesh point is:

$$q''_{net} = \left(\alpha_r \cdot \sigma \cdot T_a^4 \cdot \phi_a\right) - \left(\epsilon_r \cdot \sigma \cdot T_r^4\right) + \alpha_r \cdot \epsilon_e \cdot \phi_e \cdot \sigma \cdot T_e^4$$

A positive $q''_{net}$ indicates a net gain of energy (heating) at the mesh point, while a negative value indicates a net loss of energy (cooling).

## 6. Heat Flux and Temperature Conversions
In certain scenarios, the input parameters for emitters or receivers may be provided as an emitted heat flux (e.g., in **kW/m²** or **W/m²**) rather than a direct temperature limit. The application converts between these values using the Stefan-Boltzmann law.

Let $E$ represent the total emissive power (heat flux) of a surface.

**Converting Temperature to Heat Flux:**
To determine the heat flux $E$ emitted by a surface with a known temperature $T$ and emissivity $\epsilon$:

$$E = \epsilon \cdot \sigma \cdot T^4$$

*(Note: Ensure $E$ is calculated in **W/m²**; divide by 1000 to convert to **kW/m²** if required by the application interface).*

**Converting Heat Flux to Temperature:**
To determine the required surface temperature $T$ when a specific heat flux $E$ and emissivity $\epsilon$ are known:

$$T = \left( \frac{E}{\epsilon \cdot \sigma} \right)^{1/4}$$

## 7. Ray-Casting Methodology for View Factor Resolution
This section outlines the numerical approach utilized by the application's solver to determine the geometric view factors ($F_e$ and $F_a$) at each receiver mesh point. The solver employs a Monte Carlo ray-casting algorithm to evaluate the integral of the radiation exchange over the visible hemisphere.

### 7.1. Hemispherical Ray Emission
For each discrete calculation point on a receiver mesh, the algorithm establishes a local coordinate system based on the surface normal vector. A predefined total number of rays ($N$) is cast outward from the point into the hemispherical space above the surface.

To account for Lambert's cosine law, the rays are typically generated using a cosine-weighted hemispherical distribution. This distribution ensures that each cast ray represents an equal fraction of the total emitted or received radiative energy.

### **7.2. Intersection Testing and Emitter View Factor ($F_e$)**
As each ray is projected into the 3D domain, the solver calculates potential geometric intersections with the defined emitter surfaces.

Let $\delta_i$ be a boolean intersection function for the $i$-th ray cast from the receiver point.
* $\delta_i = 1$ if the ray successfully intersects an emitter surface without prior obstruction.
* $\delta_i = 0$ if the ray fails to intersect an emitter.

The view factor from the receiver mesh point to the emitter geometry ($F_e$) is evaluated as the ratio of successful emitter intersections to the total number of cast rays:

$$F_e = \frac{1}{N} \sum_{i=1}^{N} \delta_i$$

### 7.3. Ambient View Factor ($F_a$)
Rays that do not intersect any designated emitter geometry are classified as escaping to the ambient environment. The ambient view factor is strictly the complement of the emitter view factor:

$$F_a = 1 - F_e$$

### 7.4. Algorithmic Accuracy and Mesh Resolution
The accuracy of the view factor calculation—and consequently the net heat flux—is highly dependent on the ray count ($N$). Higher values of $N$ reduce statistical variance, allowing the computed view factor to approach the exact analytical geometric view factor, at the cost of increased computation time.

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