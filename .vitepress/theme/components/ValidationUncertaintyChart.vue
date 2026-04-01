<script setup>
import { onMounted, onUnmounted, ref, nextTick, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

// JSON: array of runs [ { target, errs, ... }, ... ]. Replace docs/public/validation-data.json.
const DATA_URL = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL)
    ? `${import.meta.env.BASE_URL}validation-data.json`
    : '/editor/wiki/validation-data.json'

const numBins = 50

function computeStats(values) {
  const n = values.length
  if (n === 0) return { mu: 0, sigma: 0 }
  const mu = values.reduce((a, b) => a + b, 0) / n
  const variance = values.reduce((a, x) => a + (x - mu) ** 2, 0) / n
  const sigma = Math.sqrt(variance)
  return { mu, sigma }
}

function binRangeFromData(values, padding = 0.1) {
  if (!values.length) return { binMin: -0.1, binMax: 0.1 }
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  const span = hi - lo || 0.1
  const margin = span * padding
  return { binMin: lo - margin, binMax: hi + margin }
}

function buildHistogramFromData(values, binMin, binMax, numBins) {
  const step = (binMax - binMin) / numBins
  const counts = Array.from({ length: numBins }, () => 0)
  for (const v of values) {
    if (v < binMin || v > binMax) continue
    const i = Math.min(Math.floor((v - binMin) / step), numBins - 1)
    counts[i]++
  }
  const bins = counts.map((y, i) => ({
    x: binMin + (i + 0.5) * step,
    y,
  }))
  const maxCount = Math.max(...counts, 1)
  return { bins, maxCount }
}

function toSci(x) {
  if (x === 0) return '0'
  const e = Math.floor(Math.log10(Math.abs(x)))
  const m = x / Math.pow(10, e)
  return m.toFixed(2) + 'e' + (e >= 0 ? '+' : '') + e
}

// State & Refs
const chartRefs = ref([])
const canvasRefs = ref([])
const loadError = ref(null)
const runCount = ref(0)
const isDarkTheme = ref(false)
let themeObserver = null

// Color palette generator
function getColors(isDark) {
  return {
    textColor: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.75)',
    gridColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
    barFill: isDark ? 'rgba(99, 165, 255, 0.5)' : 'rgba(59, 130, 246, 0.5)',
    barBorder: isDark ? 'rgba(99, 165, 255, 0.9)' : 'rgba(59, 130, 246, 0.85)',
    chartAreaBg: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.02)',
    tooltipBg: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.96)',
    chartAreaBorderColor: '#000000',
  }
}

// Dynamically update charts when the theme changes
watch(isDarkTheme, (isDark) => {
  const c = getColors(isDark)
  chartRefs.value.forEach((chart) => {
    // Update Axes
    chart.options.scales.x.title.color = c.textColor
    chart.options.scales.x.ticks.color = c.textColor
    chart.options.scales.x.grid.color = c.gridColor

    chart.options.scales.y.title.color = c.textColor
    chart.options.scales.y.ticks.color = c.textColor
    chart.options.scales.y.grid.color = c.gridColor

    // Update Plugins
    if (chart.options.plugins.legend?.labels) chart.options.plugins.legend.labels.color = c.textColor
    if (chart.options.plugins.title) chart.options.plugins.title.color = c.textColor

    if (chart.options.plugins.tooltip) {
      chart.options.plugins.tooltip.backgroundColor = c.tooltipBg
      chart.options.plugins.tooltip.titleColor = c.textColor
      chart.options.plugins.tooltip.bodyColor = c.textColor
      chart.options.plugins.tooltip.borderColor = c.gridColor
    }

    // Update Datasets
    const barDs = chart.data.datasets.find(ds => ds.type === 'bar')
    if (barDs) {
      barDs.backgroundColor = c.barFill
      barDs.borderColor = c.barBorder
    }

    chart.update()
  })
})

onMounted(async () => {
  // 1. Initial Theme Setup & Observer
  isDarkTheme.value = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')

  if (typeof MutationObserver !== 'undefined') {
    themeObserver = new MutationObserver(() => {
      isDarkTheme.value = document.documentElement.classList.contains('dark')
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  }

  // 2. Fetch Data
  let raw
  try {
    const res = await fetch(DATA_URL)
    if (!res.ok) throw new Error(res.statusText)
    raw = await res.json()
  } catch (e) {
    loadError.value = e.message || 'Failed to load validation-data.json'
    return
  }

  let runs = Array.isArray(raw) ? raw : (Array.isArray(raw?.runs) ? raw.runs : [])
  if (!runs.length && raw && Array.isArray(raw.errs)) runs = [raw]

  if (!runs.length) {
    loadError.value = 'JSON must be an array of runs or contain "runs" or "errs"'
    return
  }

  runCount.value = runs.length

  // Wait for Vue to render the <canvas> elements in the v-for
  await nextTick()

  const colors = getColors(isDarkTheme.value)
  const charts = []

  // 3. Build Charts
  for (let i = 0; i < runs.length; i++) {
    const run = runs[i]
    const errs = Array.isArray(run?.errs) ? run.errs : []
    if (!errs.length) continue

    // Restored dynamic binning logic
    // const { binMin, binMax } = binRangeFromData(errs)
    const { binMin, binMax } = { binMin: -0.2, binMax: 0.2 }
    const { mu, sigma } = computeStats(errs)
    const { bins, maxCount } = buildHistogramFromData(errs, binMin, binMax, numBins)
    const yMax = Math.ceil(maxCount * 1.12)

    const titleParts = []
    if (run.emitter_size != null) titleParts.push(`emitter_size=${JSON.stringify(run.emitter_size)}`)
    if (run.emitter_flux != null) titleParts.push(`emitter_flux=${run.emitter_flux}`)
    if (run.separation != null) titleParts.push(`separation=${run.separation}`)
    if (run.offset != null) titleParts.push(`offset=${JSON.stringify(run.offset)}`)
    if (run.angle != null) titleParts.push(`angle=${JSON.stringify(run.angle)}`)
    const chartTitle = titleParts.length ? titleParts.join(', ') : `Run ${i + 1}`

    const plugins = [
      {
        id: 'chartAreaBorder',
        beforeDraw: (chart) => {
          const ctx = chart.ctx
          const area = chart.chartArea
          if (!area) return
          ctx.save()
          // Automatically reacts to the ref via the helper function in runtime
          ctx.fillStyle = getColors(isDarkTheme.value).chartAreaBg
          ctx.fillRect(area.left, area.top, area.right - area.left, area.bottom - area.top)
          ctx.restore()
        },
        afterDatasetsDraw: (chart) => {
          const ctx = chart.ctx
          const area = chart.chartArea
          if (!area) return
          ctx.save()
          ctx.strokeStyle = colors.chartAreaBorderColor
          ctx.lineWidth = 2
          ctx.setLineDash([])
          ctx.strokeRect(area.left, area.top, area.right - area.left, area.bottom - area.top)
          ctx.restore()
        },
      },
      {
        id: 'drawLinesOnTop',
        afterDatasetsDraw: (chart) => {
          const ctx = chart.ctx
          const xScale = chart.scales.x
          const yScale = chart.scales.y
          if (!xScale || !yScale) return
          const top = yScale.getPixelForValue(yMax)
          const bottom = yScale.getPixelForValue(0)
          const drawLine = (xVal, color, width, dash) => {
            const x = xScale.getPixelForValue(xVal)
            ctx.save()
            ctx.strokeStyle = color
            ctx.lineWidth = width
            ctx.setLineDash(dash)
            ctx.beginPath()
            ctx.moveTo(x, top)
            ctx.lineTo(x, bottom)
            ctx.stroke()
            ctx.restore()
          }
          drawLine(mu, 'rgba(239, 68, 68, 0.95)', 2.5, [8, 4])
          drawLine(mu - sigma, 'rgba(251, 146, 60, 0.9)', 1.5, [3, 4])
          drawLine(mu + sigma, 'rgba(251, 146, 60, 0.9)', 1.5, [3, 4])
        },
      },
    ]

    const config = {
      type: 'bar',
      data: {
        datasets: [
          {
            type: 'bar',
            label: 'Count',
            data: bins,
            order: 0,
            backgroundColor: colors.barFill,
            borderColor: colors.barBorder,
            borderWidth: 1,
            borderRadius: 0,
            barPercentage: 0.92,
            categoryPercentage: 1,
          },
          {
            type: 'line',
            label: 'Mean (μ)',
            data: [{ x: mu, y: 0 }, { x: mu, y: yMax }],
            order: 1,
            borderColor: 'rgba(239, 68, 68, 0.95)',
            borderWidth: 0,
            borderDash: [8, 4],
            pointRadius: 0,
            pointHoverRadius: 0,
            pointHitRadius: 14,
          },
          {
            type: 'line',
            label: '±1 σ',
            data: [{ x: mu - sigma, y: 0 }, { x: mu - sigma, y: yMax }],
            order: 1,
            borderColor: 'rgba(251, 146, 60, 0.9)',
            borderWidth: 0,
            borderDash: [3, 4],
            pointRadius: 0,
            pointHoverRadius: 0,
            pointHitRadius: 14,
          },
          {
            type: 'line',
            label: '±1 σ',
            data: [{ x: mu + sigma, y: 0 }, { x: mu + sigma, y: yMax }],
            order: 1,
            borderColor: 'rgba(251, 146, 60, 0.9)',
            borderWidth: 0,
            borderDash: [3, 4],
            pointRadius: 0,
            pointHoverRadius: 0,
            pointHitRadius: 14,
          },
        ],
      },
      options: {
        responsive: true,
        // maintainAspectRatio: true,
        // aspectRatio: 1.4,
        animation: false,
        animations: { resize: false },
        layout: { padding: { top: 8, right: 12, bottom: 4, left: 4 } },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              boxWidth: 20,
              boxHeight: 10,
              font: { size: 12, weight: '500' },
              color: colors.textColor,
              padding: 16,
              generateLabels: (chart) => {
                const items = Chart.defaults.plugins.legend.labels.generateLabels(chart)
                return items
                    .filter((item) => item.datasetIndex !== 3)
                    .map((item) => {
                      const ds = chart.data.datasets[item.datasetIndex]
                      if (ds?.label === 'Count') return { ...item, pointStyle: 'rect' }
                      if (ds?.label === 'μ' || ds?.label === 'Mean (μ)') {
                        return {
                          ...item,
                          pointStyle: 'line',
                          strokeStyle: 'rgba(239, 68, 68, 0.95)',
                          lineWidth: 2.5,
                          lineDash: [8, 4],
                          fillStyle: 'transparent',
                        }
                      }
                      if (ds?.label === '±1 σ') {
                        return {
                          ...item,
                          pointStyle: 'line',
                          strokeStyle: 'rgba(251, 146, 60, 0.9)',
                          lineWidth: 1.5,
                          lineDash: [3, 4],
                          fillStyle: 'transparent',
                        }
                      }
                      return item
                    })
              },
            },
          },
          tooltip: {
            enabled: true,
            backgroundColor: colors.tooltipBg,
            titleColor: colors.textColor,
            bodyColor: colors.textColor,
            borderColor: colors.gridColor,
            borderWidth: 1,
            padding: 10,
            displayColors: true,
            callbacks: {
              title: (items) => {
                const ds = items[0]?.dataset
                if (ds?.label === 'Mean (μ)') return 'Mean value'
                if (ds?.label === '±1 σ') return '±1 standard deviation'
                if (ds?.label === 'Count' && items[0]?.parsed != null) return 'Error = ' + Number(items[0].parsed.x).toFixed(5)
                return ''
              },
              label: (ctx) => {
                if (ctx.dataset.label === 'Count') return ` ${ctx.parsed.y} iterations`
                if (ctx.dataset.label === 'Mean (μ)') return ` μ = ${toSci(mu)}`
                if (ctx.dataset.label === '±1 σ') return ` ${ctx.datasetIndex === 2 ? 'μ − σ' : 'μ + σ'} = ${toSci(ctx.parsed.x)}`
                return null
              },
            },
          },
          title: {
            display: true,
            text: chartTitle,
            position: 'top',
            align: 'center',
            font: { size: 12, weight: '500' },
            color: colors.textColor,
            padding: { bottom: 8 },
          },
        },
        scales: {
          x: {
            type: 'linear',
            title: { display: true, text: 'Error [kW/m²]', font: { size: 12, weight: '500' }, color: colors.textColor },
            min: binMin,
            max: binMax,
            border: { display: false },
            grid: { color: colors.gridColor, drawTicks: true },
            ticks: { maxTicksLimit: 8, font: { size: 11 }, color: colors.textColor },
          },
          y: {
            title: { display: true, text: 'Count', font: { size: 12, weight: '500' }, color: colors.textColor },
            min: 0,
            max: yMax,
            border: { display: false },
            grid: { color: colors.gridColor },
            ticks: { font: { size: 11 }, color: colors.textColor },
          },
        },
      },
      plugins,
    }

    // Use Vue template refs instead of document.getElementById
    const el = canvasRefs.value[i]
    if (el) {
      const ch = new Chart(el.getContext('2d'), config)
      charts.push(ch)
    }
  }

  chartRefs.value = charts
})

// Clean up chart instances and observer to prevent memory leaks
onUnmounted(() => {
  if (themeObserver) themeObserver.disconnect()
  chartRefs.value.forEach(chart => chart.destroy())
})
</script>

<template>
  <div class="validation-uncertainty-chart">
    <div v-if="loadError" class="chart-error">{{ loadError }}</div>
    <div v-else class="chart-grid">
      <div v-for="i in runCount" :key="i" class="chart-cell">
        <div class="canvas-wrapper">
          <canvas :ref="(el) => { if (el) canvasRefs[i - 1] = el }"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.validation-uncertainty-chart {
  margin: 1.5rem 0;
}
.chart-error {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 3px;
}
.chart-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  max-width: 560px;
}
.chart-cell {
  min-height: 180px;
  padding: 0.75rem 0;
}
.canvas-wrapper {
  position: relative; /* Crucial for Chart.js responsive layout */
  width: 100%;
}

.chart-cell canvas {
  display: block;
  /* Let Chart.js handle width/height dynamically to prevent the resize loop */
}
</style>