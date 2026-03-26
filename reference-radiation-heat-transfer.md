# Radiation Heat Transfer

This document details the mathematical framework used by the application to solve for radiation heat flux. The solver calculates these values at discrete mesh points situated on the surfaces of designated receivers.

To determine the incident radiation paths and view factors, the application employs a ray-casting methodology.

SI units are used throughout the calculation, except for heat flux is converted between W/m2 and kW/m2 at input and output as common practice.

Calculation Constraints and Assumptions:

* **No Refraction or Reflection:** The application assumes straight-line radiation paths. Reflected and refracted energy are not calculated.
* **Directional Emission Limits:** Radiation originates exclusively from designated emitters. Receivers do not act as secondary emitters to other receivers. Even if a neighboring receiver possesses a higher temperature, its radiated energy is not accounted for in the heat flux calculations of other receivers.

System Entities and Properties:

* **Emitters:** Defined by Temperature ($T_e$) and Emissivity ($\epsilon_e$).
* **Ambient:** Defined by Temperature ($T_a$).
* **Receivers:** Defined by Temperature ($T_r$), Emissivity ($\epsilon_r$), and Absorptivity ($\alpha_r$).

## Net Heat Flux Equation
The total net radiation heat flux ($q''_{net}$) evaluated at any single mesh point on a receiver is the sum of two major energy terms: the net energy exchange with the ambient environment, and the energy received from the emitters.

$$q''_{net} = q''_{ambient} + q''_{emitter}$$

Where:
* $q''_{net}$ is the total net heat flux at the receiver mesh point.
* $q''_{ar}$ is the net energy exchange between the ambient environment and the receiver.
* $q''_{er}$ is the net energy exchange between the emitter and the receiver.

## Energy Exchange: Emitter and Receiver ($q''_{e}$)
This term isolates the radiation originating from the emitters that is successfully absorbed by the receiver. Because the application uses ray casting, the geometric relationship and visibility between the mesh point and the emitter are quantified by a view factor ($F_e$).

The heat flux absorbed by the receiver from the emitter is calculated as:

$$q''_{e} = \alpha_{r} \cdot \epsilon_{e} \cdot \phi_{e} \cdot \sigma \cdot T_{e}^4$$

Where:
* $\alpha_r$ = Absorptivity of the receiver
* $\epsilon_e$ = Emissivity of the emitter
* $\sigma$ = Stefan-Boltzmann constant ($5.670374 \times 10^{-8} \text{ W/(m}^2 \cdot \text{K}^4)$)
* $\phi_e$ = View factor from the receiver mesh point to the emitter (determined via ray casting, $0 \le F_e \le 1$)
* $T_e$ = Absolute temperature of the emitter (in Kelvin)


## Energy Exchange: Ambient and Receiver ($q''_{a}$)
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

## Expanded Net Heat Flux Equation
By substituting the expanded individual exchange terms back into the primary equation, the complete formula for the net heat flux at a receiver mesh point is:

$$q''_{net} = \left(\alpha_r \cdot \sigma \cdot T_a^4 \cdot \phi_a\right) - \left(\epsilon_r \cdot \sigma \cdot T_r^4\right) + \alpha_r \cdot \epsilon_e \cdot \phi_e \cdot \sigma \cdot T_e^4$$

A positive $q''_{net}$ indicates a net gain of energy (heating) at the mesh point, while a negative value indicates a net loss of energy (cooling).

## Heat Flux and Temperature Conversions
In certain scenarios, the input parameters for emitters or receivers may be provided as an emitted heat flux rather than a direct temperature limit. The application converts between these values using the Stefan-Boltzmann law.

Let $E$ represent the total emissive power (heat flux) of a surface. To determine the heat flux $E$ (in $W/m^2$) emitted by a surface with a known temperature $T$ (in $K$) and emissivity $\epsilon$ (usually assumed as one for conservatism):

$$E = \epsilon \cdot \sigma \cdot T^4$$

Useful calculated values are shown in the table below assuming an emissivity of one.

| Heat flux [$W/m^2$] | Temperature [$^oC$] | Temperature [$K$] |
| ------------------- | ------------------- | ----------------- |
| 42,000              | 655                 | 928               |
| 84,000              | 831                 | 1,104             |
| 168,000             | 1,039               | 1,312             |

Use the calculator below to convert between heat flux and temperature.

<HeatFluxTempCalculator />
