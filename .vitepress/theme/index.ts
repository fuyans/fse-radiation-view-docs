import DefaultTheme from 'vitepress/theme'

import HeatFluxTempCalculator from './components/HeatFluxTempCalculator.vue'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx)
    ctx.app.component('HeatFluxTempCalculator', HeatFluxTempCalculator)
  },
}

