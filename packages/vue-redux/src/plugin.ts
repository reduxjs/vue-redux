import { provideStoreToApp } from './provider/provider'
import type { ProviderProps } from './provider/provider'
import type { App, Plugin } from 'vue'
import type { Action, UnknownAction } from 'redux'

export interface VueReduxPluginOptions<
  A extends Action<string> = UnknownAction,
  S = unknown,
> extends ProviderProps<A, S> {}

/**
 * Creates a Vue plugin that provides the Redux store to the entire application.
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createVueReduxPlugin } from '@reduxjs/vue-redux'
 * import { store } from './store'
 *
 * const app = createApp(App)
 * app.use(createVueReduxPlugin({ store }))
 * app.mount('#app')
 * ```
 */
export function createVueReduxPlugin<
  A extends Action<string> = UnknownAction,
  S = unknown,
>(options: VueReduxPluginOptions<A, S>): Plugin {
  return {
    install(app: App) {
      provideStoreToApp(app, options)
    },
  }
}
