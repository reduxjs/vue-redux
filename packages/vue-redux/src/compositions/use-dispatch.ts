import { ContextKey } from '../provider/context'
import {
  createStoreComposition,
  useStore as useDefaultStore,
} from './use-store'
import type { VueReduxContextValue } from '../provider/context';
import type { Action, Dispatch, UnknownAction } from 'redux'
import type { InjectionKey } from 'vue'

/**
 * Represents a custom composition that provides a dispatch function
 * from the Redux store.
 *
 * @template DispatchType - The specific type of the dispatch function.
 *
 * @public
 */
export interface UseDispatch<
  DispatchType extends Dispatch<UnknownAction> = Dispatch<UnknownAction>,
> {
  /**
   * Returns the dispatch function from the Redux store.
   *
   * @returns The dispatch function from the Redux store.
   *
   * @template AppDispatch - The specific type of the dispatch function.
   */
  <AppDispatch extends DispatchType = DispatchType>(): AppDispatch

  /**
   * Creates a "pre-typed" version of {@linkcode useDispatch useDispatch}
   * where the type of the `dispatch` function is predefined.
   *
   * This allows you to set the `dispatch` type once, eliminating the need to
   * specify it with every {@linkcode useDispatch useDispatch} call.
   *
   * @returns A pre-typed `useDispatch` with the dispatch type already defined.
   *
   * @example
   * ```ts
   * export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
   * ```
   *
   * @template OverrideDispatchType - The specific type of the dispatch function.
   */
  withTypes: <
    OverrideDispatchType extends DispatchType,
  >() => UseDispatch<OverrideDispatchType>
}

/**
 * Composition factory, which creates a `useDispatch` composition bound to a given context.
 *
 * @returns {Function} A `useDispatch` composition bound to the specified context.
 */
export function createDispatchComposition<
  StateType = unknown,
  ActionType extends Action = UnknownAction,
>(
  context?: InjectionKey<VueReduxContextValue<
    StateType,
    ActionType
  > | null> = ContextKey,
) {
  const useStore =
    context === ContextKey ? useDefaultStore : createStoreComposition(context)

  const useDispatch = () => {
    const store = useStore()
    return store.dispatch
  }

  Object.assign(useDispatch, {
    withTypes: () => useDispatch,
  })

  return useDispatch as UseDispatch<Dispatch<ActionType>>
}

/**
 * A composition to access the redux `dispatch` function.
 *
 * @returns {any|function} redux store's `dispatch` function
 *
 * @example
 *
 * import { useDispatch } from '@reduxjs/vue-redux'
 *
 * export const CounterComponent = ({ value }) => {
 *   const dispatch = useDispatch()
 *   const increaseCounter = () => dispatch({ type: 'increase-counter' })
 *   return (
 *     <div>
 *       <span>{value}</span>
 *       <button onClick={increaseCounter}>Increase counter</button>
 *     </div>
 *   )
 * }
 */
export const useDispatch = /* #__PURE__*/ createDispatchComposition()
