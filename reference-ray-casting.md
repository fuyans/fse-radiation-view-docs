# Ray-Casting Methodology for View Factor Resolution
This section outlines the numerical approach utilised by the application's solver to determine the geometric view factors ($F_e$ and $F_a$) at each receiver mesh point. The solver employs a Monte Carlo ray-casting algorithm to evaluate the integral of the radiation exchange over the visible hemisphere.

As each ray is projected into the 3D domain, the solver calculates potential geometric intersections with the defined emitter.

Let $\delta_i$ be a boolean intersection function for the $i$-th ray cast from the receiver point.
* $\delta_i = 1$ if the ray successfully intersects an emitter surface without prior obstruction.
* $\delta_i = 0$ if the ray fails to intersect an emitter.

The view factor from the receiver mesh point to the emitter geometry ($F_e$) is evaluated as the ratio of successful emitter intersections to the total number of cast rays:

$$F_e = \frac{1}{N} \sum_{i=1}^{N} \delta_i$$

## Ambient View Factor ($F_a$)
Rays that do not intersect any designated emitter geometry are classified as escaping to the ambient environment. The ambient view factor is strictly the complement of the emitter view factor:

$$F_a = 1 - F_e$$

## Algorithmic Accuracy and Mesh Resolution
The accuracy of the view factor calculation—and consequently the net heat flux—is highly dependent on the ray count ($N$). Higher values of $N$ reduce statistical variance, allowing the computed view factor to approach the exact analytical geometric view factor, at the cost of increased computation time.
