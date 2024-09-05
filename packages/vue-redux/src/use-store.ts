import { inject } from 'vue'
import {  StoreSymbol } from './provide-store'
import type {StoreContext} from './provide-store';
import type { Action, Store } from 'redux'

/**
 * Represents a type that extracts the action type from a given Redux store.
 *
 * @template StoreType - The specific type of the Redux store.
 *
 * @internal
 */
export type ExtractStoreActionType<StoreType extends Store> =
  StoreType extends Store<any, infer ActionType> ? ActionType : never

/**
 * Represents a custom composition that provides access to the Redux store.
 *
 * @template StoreType - The specific type of the Redux store that gets returned.
 *
 * @public
 */
export interface UseStore<StoreType extends Store> {
  /**
   * Returns the Redux store instance.
   *
   * @returns The Redux store instance.
   */
  (): StoreType

  /**
   * Returns the Redux store instance with specific state and action types.
   *
   * @returns The Redux store with the specified state and action types.
   *
   * @template StateType - The specific type of the state used in the store.
   * @template ActionType - The specific type of the actions used in the store.
   */
  <
    StateType extends ReturnType<StoreType['getState']> = ReturnType<
      StoreType['getState']
    >,
    ActionType extends Action = ExtractStoreActionType<Store>,
  >(): Store<StateType, ActionType>

  /**
   * Creates a "pre-typed" version of {@linkcode useStore useStore}
   * where the type of the Redux `store` is predefined.
   *
   * This allows you to set the `store` type once, eliminating the need to
   * specify it with every {@linkcode useStore useStore} call.
   *
   * @returns A pre-typed `useStore` with the store type already defined.
   *
   * @example
   * ```ts
   * export const useAppStore = useStore.withTypes<AppStore>()
   * ```
   *
   * @template OverrideStoreType - The specific type of the Redux store that gets returned.
   */
  withTypes: <
    OverrideStoreType extends StoreType,
  >() => UseStore<OverrideStoreType>
}

/**
 * Composition factory, which creates a `useStore` composition bound to a given context.
 *
 * @returns {Function} A `useStore` composition bound to the specified context.
 */
export function createStoreComposition<
  StateType = unknown,
  ActionType extends Action = Action,
>() {
  const useStore = () => {
    const context = inject(StoreSymbol) as StoreContext
    const { store } = context
    return store
  }

  Object.assign(useStore, {
    withTypes: () => useStore,
  })

  return useStore as UseStore<Store<StateType, ActionType>>
}

/**
 * A composition to access the redux store.
 *
 * @returns {any} the redux store
 *
 * @example
 *
 * import { useStore } from '@reduxjs/vue-redux'
 *
 * export const ExampleComponent = () => {
 *   const store = useStore()
 *   return <div>{store.getState()}</div>
 * }
 */
export const useStore = /* #__PURE__*/ createStoreComposition()
