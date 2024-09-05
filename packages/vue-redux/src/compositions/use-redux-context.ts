import { inject } from 'vue'
import { ContextKey } from '../provider/context'
import type { VueReduxContextValue } from '../provider/context'
import type { InjectionKey } from 'vue'

/**
 * Composition factory, which creates a `useReduxContext` hook bound to a given context. This is a low-level
 * composition that you should usually not need to call directly.
 *
 * @param {InjectionKey<VueReduxContextValue | null>} [context=ContextKey] Context passed to your `provide`.
 * @returns {Function} A `useReduxContext` composition bound to the specified context.
 */
export function createReduxContextComposition(context = ContextKey) {
  return function useReduxContext(): VueReduxContextValue {
    const contextValue = inject(context)

    // TODO: Add dev check for `contextValue`

    return contextValue!
  }
}

/**
 * A composition to access the value of the `VueReduxContext`. This is a low-level
 * composition that you should usually not need to call directly.
 *
 * @returns {any} the value of the `VueReduxContext`
 *
 * @example
 *
 * import { useReduxContext } from '@reduxjs/vue-redux'
 *
 * export const CounterComponent = () => {
 *   const { store } = useReduxContext()
 *   return <div>{store.getState()}</div>
 * }
 */
export const useReduxContext = /*#__PURE__*/ createReduxContextComposition()
