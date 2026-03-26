<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type LastEdited = 'temp' | 'flux' | null

// Assumes blackbody by default (matches the table on the page).
const epsilon = ref<number>(1)
const sigma = ref<number>(5.670374e-8) // W/(m^2*K^4)

// Canonical state: temperature in K and heat flux in W/m^2
const temperatureK = ref<number>(928)
const heatFluxWm2 = ref<number>(42000)

const lastEdited = ref<LastEdited>(null)

function roundTo(value: number, digits: number) {
  if (!Number.isFinite(value)) return NaN
  const f = Math.pow(10, digits)
  return Math.round(value * f) / f
}

const temperatureC = computed({
  get: () => (Number.isFinite(temperatureK.value) ? roundTo(temperatureK.value - 273.15, 2) : NaN),
  set: (c) => {
    lastEdited.value = 'temp'
    temperatureK.value = roundTo(Number(c) + 273.15, 2)
  },
})

const heatFluxkWm2 = computed({
  get: () => (Number.isFinite(heatFluxWm2.value) ? roundTo(heatFluxWm2.value / 1000, 3) : NaN),
  set: (kw) => {
    lastEdited.value = 'flux'
    heatFluxWm2.value = roundTo(Number(kw), 3) * 1000
  },
})

function fluxFromTemp(Tk: number, eps: number, sig: number) {
  if (!Number.isFinite(Tk) || !Number.isFinite(eps) || eps <= 0 || !Number.isFinite(sig) || sig <= 0) return NaN
  return eps * sig * Math.pow(Tk, 4)
}

function tempFromFlux(E: number, eps: number, sig: number) {
  if (!Number.isFinite(E) || E < 0 || !Number.isFinite(eps) || eps <= 0 || !Number.isFinite(sig) || sig <= 0) return NaN
  return Math.pow(E / (eps * sig), 0.25)
}

watch([temperatureK, epsilon, sigma], ([Tk, eps, sig]) => {
  if (lastEdited.value === 'flux') return
  const E = fluxFromTemp(Tk, eps, sig)
  if (Number.isFinite(E)) heatFluxWm2.value = roundTo(E / 1000, 3) * 1000
})

watch([heatFluxWm2, epsilon, sigma], ([E, eps, sig]) => {
  if (lastEdited.value === 'temp') return
  const Tk = tempFromFlux(E, eps, sig)
  if (Number.isFinite(Tk)) temperatureK.value = roundTo(Tk, 2)
})

const derived = computed(() => {
  const eps = epsilon.value
  const Tk = temperatureK.value
  const E = heatFluxWm2.value
  const sig = sigma.value
  return {
    epsilonOk: Number.isFinite(eps) && eps > 0,
    sigmaOk: Number.isFinite(sig) && sig > 0,
    tempOk: Number.isFinite(Tk) && Tk > 0,
    fluxOk: Number.isFinite(E) && E >= 0,
  }
})
</script>

<template>
  <div class="calc">
    <div class="grid">
      <label class="field">
        <div class="inputWrap">
          <input
            v-model.number="heatFluxkWm2"
            class="input hasUnit"
            type="number"
            min="0"
            step="0.001"
            @input="lastEdited = 'flux'"
            @blur="heatFluxWm2 = roundTo(heatFluxWm2 / 1000, 3) * 1000"
          />
          <span class="unit">kW/m²</span>
        </div>
        <span v-if="!derived.fluxOk" class="hint error">Must be ≥ 0.</span>
      </label>

      <div class="arrow" aria-hidden="true">⇔</div>

      <label class="field">
        <div class="inputWrap">
          <input
            v-model.number="temperatureC"
            class="input hasUnit"
            type="number"
            step="0.01"
            @input="lastEdited = 'temp'"
            @blur="temperatureK = roundTo(temperatureK, 2)"
          />
          <span class="unit">°C</span>
        </div>
      </label>

      <label class="field">
        <div class="inputWrap">
          <input
            v-model.number="temperatureK"
            class="input hasUnit"
            type="number"
            min="0"
            step="0.01"
            @input="lastEdited = 'temp'"
            @blur="temperatureK = roundTo(temperatureK, 2)"
          />
          <span class="unit">K</span>
        </div>
        <span v-if="!derived.tempOk" class="hint error">Must be &gt; 0.</span>
      </label>
    </div>

    <div class="footer">
      <div class="constants">
        <div class="constRow">
          <label class="constLabel" for="epsilonInput">Emissivity, ε</label>
          <div class="inputWrap constInput">
            <input id="epsilonInput" v-model.number="epsilon" class="input hasUnit" type="number" min="0" step="0.01" />
            <span class="unit">—</span>
          </div>
        </div>

        <div class="constRow">
          <label class="constLabel" for="sigmaInput">Stefan-Boltzmann constant, σ</label>
          <div class="inputWrap longUnit constInput">
            <input id="sigmaInput" v-model.number="sigma" class="input hasUnit" type="number" min="0" step="0.0000000001" />
            <span class="unit">W/(m²·K⁴)</span>
          </div>
        </div>
      </div>

      <span v-if="!derived.epsilonOk" class="hint error">ε must be &gt; 0.</span>
      <span v-if="!derived.sigmaOk" class="hint error">σ must be &gt; 0.</span>
    </div>
  </div>
</template>

<style scoped>
.calc {
  margin-top: 16px;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}
.header {
  margin-bottom: 12px;
}
.title {
  margin: 0 0 6px 0;
  font-size: 16px;
}
.subtitle {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.35;
}
.mono {
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
}
.note {
  display: block;
  margin-top: 6px;
  color: var(--vp-c-text-3);
  font-size: 12px;
}
.grid {
  display: grid;
  gap: 12px;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) minmax(0, 1fr);
  align-items: end;
}
@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
.arrow {
  align-self: center;
  justify-self: center;
  margin: 0 2px 8px 2px;
  color: var(--vp-c-text-2);
  font-size: 18px;
  line-height: 1;
  user-select: none;
}
.field {
  display: grid;
  gap: 6px;
}
.label {
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  outline: none;
}
.inputWrap {
  position: relative;
  display: block;
  --unit-pad: 64px;
}
.input.hasUnit {
  padding-right: var(--unit-pad);
}
.inputWrap.longUnit {
  --unit-pad: 140px;
}
.unit {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
  pointer-events: none;
  white-space: nowrap;
}
.input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent);
}
.hint {
  font-size: 12px;
  color: var(--vp-c-text-3);
}
.error {
  color: var(--vp-c-danger-1);
}
.footer {
  display: grid;
  gap: 10px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
}
.constants {
  display: grid;
  gap: 10px;
  width: 100%;
}
@media (max-width: 640px) {
  .constants {
    gap: 12px;
  }
}
.constRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.constLabel {
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.constInput {
  width: 240px;
  max-width: 100%;
}
@media (max-width: 640px) {
  .constRow {
    align-items: stretch;
    flex-direction: column;
  }
  .constInput {
    width: 100%;
  }
}
</style>

