import DefaultTheme from 'vitepress/theme'

import HeatFluxTempCalculator from './components/HeatFluxTempCalculator.vue'
import ValidationUncertaintyChart from './components/ValidationUncertaintyChart.vue'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx)
    ctx.app.component('HeatFluxTempCalculator', HeatFluxTempCalculator)
    ctx.app.component('ValidationUncertaintyChart', ValidationUncertaintyChart)
  },
}

