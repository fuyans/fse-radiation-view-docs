# FSE Radiation View Documentation

This documentation describes FSE Radiation View, a 3D radiation heat transfer tool that estimates spatially resolved net radiative heat flux on user-defined receivers using Monte Carlo ray tracing.

## Scope and Intended Use

FSE Radiation View is intended for engineering problems in which simple closed-form view-factor relations are not practical, for example:

- multiple emitters and receivers
- arbitrary orientations
- partial shielding or complex line-of-sight conditions
- irregular layouts imported from plans or other reference drawings

For simple canonical arrangements, simplified analytical methods should remain the first choice because they are faster, more transparent, and easier to verify independently.

The present model is a direct-radiation tool. It resolves exchange from designated emitters to receivers, can include an optional uniform ambient radiative background, and treats other geometry as opaque for visibility calculations. It does not solve full enclosure radiosity, reflected radiation, or secondary re-radiation between receivers.

Reliable results depend on consistent units, correct face orientation, suitable mesh resolution, and an adequate ray count.

## Guide

- [User Manual](./user-manual.md) — Concepts, workflow, solver assumptions, and practical guidance
- [User Interface and Interaction](./ui-and-ux.md) — Layout, controls, and recommended operating sequence
- [Tutorial](./tutorial.md) — Worked example and step-by-step setup
- [Verification](./verification.md) — Benchmark cases, uncertainty, and acceptance criteria

## Reference

- [Radiation Heat Transfer](./reference-radiation-heat-transfer.md) — Governing equations, assumptions, and unit conventions
- [Ray Casting](./reference-ray-casting.md) — Monte Carlo view-factor estimation and geometric classification
