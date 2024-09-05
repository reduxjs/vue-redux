import {inject} from "vue";
import type {InjectionKey} from "vue";
import {ContextKey, VueReduxContextValue} from "../provider/context";

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

    if (process.env.NODE_ENV !== 'production' && !contextValue) {
      throw new Error(
        'could not find react-redux context value; please ensure the component is wrapped in a <Provider>',
      )
    }

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
