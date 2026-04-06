# Ray-Casting Methodology for View-Factor Resolution

This page describes the numerical procedure used by FSE Radiation View to estimate the direct emitter view factors required by the radiation heat transfer model.

## Differential View-Factor Basis

For a receiver sample point $p$, the view factor to any target surface region $j$ is the fraction of the outward hemispherical radiative distribution subtended by that target. In differential form,

$$
F_{p \to j} = \frac{1}{\pi} \int_{\Omega_j} \cos \theta \, d\omega
$$

where:

* $\Omega_j$ = solid angle occupied by target $j$ as seen from $p$
* $\theta$ = angle between the receiver surface normal and the sampled direction
* $d\omega$ = differential solid angle

This is the standard diffuse view-factor relation for a differential receiving area.

## Monte Carlo Estimator

The application evaluates the integral numerically using Monte Carlo ray tracing. For the view factor to be expressed directly as a hit fraction, the sampled ray directions must follow a cosine-weighted distribution over the outward hemisphere. The formulation below assumes that weighting.

Let $I_j(\omega_i)$ be an indicator function for the $i$-th sampled direction:

* $I_j(\omega_i) = 1$ if the first valid intersection is target $j$
* $I_j(\omega_i) = 0$ otherwise

With $N$ sampled rays, the view factor to target $j$ is estimated as

$$
F_{p \to j} \approx \frac{1}{N} \sum_{i=1}^{N} I_j(\omega_i)
$$

For thermal calculations in this tool, target $j$ is one of the active emitters. Summing over all emitters gives the total direct emitter view factor seen by the receiver sample point.

## Geometric Classification of Rays

Each sampled ray is classified by its first relevant intersection:

* **Emitter hit:** The ray contributes to the corresponding emitter view factor.
* **Block hit:** The ray is prevented from reaching emitters beyond that obstruction.
* **Receiver hit:** The ray is also prevented from reaching emitters beyond that obstruction.
* **No geometry hit:** The ray does not intersect an active emitter within the explicit model geometry.

The ray-tracing stage is used only to estimate **direct emitter irradiation**. Ambient radiation is not inferred from rays that miss emitters, and no ambient view factor is solved.

Instead, if ambient temperature is provided, the solver applies a separate uniform radiative background term everywhere on the receiver. That ambient term is therefore independent of blocking, orientation, and sky view.

## Statistical Accuracy

For a hit-or-miss Monte Carlo estimator, the view-factor estimate for a given target behaves as a Bernoulli sample mean. The standard deviation therefore scales as

$$
\operatorname{Std}\!\left(F_{p \to j}\right) \approx \sqrt{\frac{F_{p \to j}\left(1 - F_{p \to j}\right)}{N}}
$$

and, in practical terms, the uncertainty decreases approximately in proportion to $1/\sqrt{N}$.

Increasing the ray count reduces statistical variance but increases computation time. The effect is most noticeable when:

* the mesh is fine and local gradients are being resolved
* the view factor is small and few sampled rays reach the emitter
* peak values are being extracted from a noisy field

## Mesh Resolution and Computational Cost

Reducing receiver mesh size increases the number of reported values across the receiver. That improves spatial resolution, but it also makes local stochastic variation more visible. In practice, finer meshes often require higher ray counts if a similarly smooth field is needed for interpretation or reporting.
