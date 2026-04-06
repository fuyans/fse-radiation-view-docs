# Radiation Heat Transfer

This page summarises the radiation heat transfer formulation used by FSE Radiation View. The solver evaluates net radiative heat flux at discrete sample locations distributed across each receiver surface.

The application uses ray tracing to estimate direct irradiation from designated emitters. Ambient temperature, where supplied, is handled separately as a uniform radiative background.

Strict SI units are used internally. Heat-flux values may be presented at the interface in either W/m² or kW/m² for engineering convenience.

## Modelling Assumptions

The current formulation adopts the following assumptions:

* **Non-participating medium:** Radiation travels in straight lines through the intervening space. Gas absorption, gas emission, and scattering are not modelled.
* **Diffuse-grey surface treatment:** The view-factor formulation assumes diffuse radiative exchange.
* **No reflection or transmission:** Reflected radiation, transmitted radiation, and refraction are not included.
* **No secondary re-radiation from non-emitters:** Blocks and receivers influence line of sight, but they are not solved as secondary radiating surfaces.
* **Uniform ambient background:** If ambient temperature is supplied, it is converted to a uniform radiative background and applied equally at every receiver point. It is not ray-traced and does not depend on geometry.

These assumptions make the tool appropriate for direct-radiation problems with defined emitters and receivers. They are not equivalent to a full enclosure-radiation or radiosity solution.

## Net Heat Flux Formulation

At a receiver sample point $p$, the net radiative heat flux is written as

$$
q''_{\text{net}}(p) = \alpha_r \left(q''_{\text{emitters}}(p) + J_{\text{ambient}}\right) - \epsilon_r \sigma T_r^4
$$

where:

* $q''_{\text{net}}(p)$ = net radiative heat flux at receiver point $p$
* $\alpha_r$ = receiver absorptivity
* $q''_{\text{emitters}}(p)$ = irradiation from visible emitter surfaces at receiver point $p$
* $J_{\text{ambient}}$ = ambient radiosity applied uniformly at all receiver points
* $\epsilon_r$ = receiver emissivity
* $\sigma$ = Stefan-Boltzmann constant, $5.670374 \times 10^{-8}\ \text{W}/(\text{m}^2 \cdot \text{K}^4)$
* $T_r$ = absolute receiver temperature, in K

A positive value of $q''_{\text{net}}$ indicates net heating of the receiver; a negative value indicates net radiative cooling.

## Direct Irradiation from Emitters

For $M$ emitters, the direct emitter contribution is

$$
q''_{\text{emitters}}(p) = \sum_{j=1}^{M} F_{p \to e_j}\, \epsilon_{e_j}\, \sigma T_{e_j}^4
$$

where:

* $F_{p \to e_j}$ = view factor from receiver point $p$ to emitter $j$
* $\epsilon_{e_j}$ = emissivity of emitter $j$
* $T_{e_j}$ = absolute temperature of emitter $j$, in K

Only designated emitters contribute to this term. Blocks and receivers may prevent rays from reaching emitters, but they do not add their own radiation term.

## Ambient Temperature Handling

When ambient temperature is provided, the solver converts it to ambient radiosity:

$$
J_{\text{ambient}} = \sigma T_a^4
$$

where:

* $J_{\text{ambient}}$ = uniform ambient radiosity, in W/m²
* $T_a$ = ambient temperature, in K

This ambient term is applied uniformly to every receiver point. It is **not** ray-traced and therefore:

* blockers do not reduce it
* receiver orientation does not change it
* partial view to the surroundings is not modelled
* sky, walls, ground, and other surroundings are not distinguished separately

In practical terms, this is equivalent to applying a large black isothermal enclosure at temperature $T_a$ with an effective view factor of 1.

If ambient temperature is omitted, then

$$
J_{\text{ambient}} = 0
$$

## Expanded Equation

Substituting the direct-emitter and ambient terms gives

$$
q''_{\text{net}}(p) =
\alpha_r \left(
\sum_{j=1}^{M} F_{p \to e_j}\, \epsilon_{e_j}\, \sigma T_{e_j}^4
+
\sigma T_a^4
\right)
- \epsilon_r \sigma T_r^4
$$

when ambient temperature is supplied.

If ambient temperature is omitted, the equation reduces to

$$
q''_{\text{net}}(p) =
\alpha_r \left(
\sum_{j=1}^{M} F_{p \to e_j}\, \epsilon_{e_j}\, \sigma T_{e_j}^4
\right)
- \epsilon_r \sigma T_r^4
$$

For a single emitter, this becomes

$$
q''_{\text{net}} =
\alpha_r \left(
F_{p \to e}\, \epsilon_e\, \sigma T_e^4
+
\sigma T_a^4
\right)
- \epsilon_r \sigma T_r^4
$$

when ambient temperature is present.

## Practical Interpretation

The formulation above shows that the result depends on both geometry and thermal state:

* the **emitter view factors** determine how much direct source irradiation reaches the receiver
* the **emitter temperatures and emissivities** determine the source strength
* the **ambient temperature**, if supplied, adds a uniform radiative background everywhere
* the **receiver temperature and emissivity** determine the re-emission term

This means that ambient temperature should be interpreted as a **radiative surroundings temperature**, not as a convective air temperature.

If the objective is to isolate direct emitter-to-receiver exchange during benchmarking, a useful setup is to set $T_a = T_r$. Under that condition, the net ambient-only term vanishes when $\alpha_r = \epsilon_r$.

Where shielding, restricted sky view, or separate surroundings temperatures are important, the present ambient treatment may overestimate ambient heating and underestimate radiative cooling.

## Special Cases

If ambient temperature is omitted, ambient irradiation is zero and only direct emitter irradiation contributes.

If there are no emitters and ambient temperature is supplied, the equation reduces to

$$
q''_{\text{net}} = \alpha_r \sigma T_a^4 - \epsilon_r \sigma T_r^4
$$

If $T_a = T_r$ and $\alpha_r = \epsilon_r = 1$, the net ambient-only contribution is zero.

## Heat Flux and Temperature Conversions

Where a surface is defined by emitted heat flux rather than temperature, the Stefan-Boltzmann relation is used:

$$
E = \epsilon \sigma T^4
$$

The inverse conversion is

$$
T = \left(\frac{E}{\epsilon \sigma}\right)^{1/4}
$$

where:

* $E$ = emissive power, in W/m²
* $\epsilon$ = surface emissivity
* $T$ = absolute temperature, in K

Useful reference values for $\epsilon = 1.0$ are listed below.

| Heat Flux [W/m²] | Temperature [°C] | Temperature [K] |
| :--- | :--- | :--- |
| 42,000 | 655 | 928 |
| 84,000 | 831 | 1,104 |
| 168,000 | 1,039 | 1,312 |

Use the calculator below to convert between heat flux and temperature.

<HeatFluxTempCalculator />
