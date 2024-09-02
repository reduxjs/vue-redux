import { inject } from 'vue'
import { StoreSymbol } from './provide-store'
import type { Action, Dispatch, UnknownAction } from 'redux'

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
   *
   * @since 9.1.0
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
>() {
  const useDispatch = () => {
    const context = inject(StoreSymbol)
    const { store } = context

    return store.dispatch as AppDispatch
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
 * import { useDispatch } from 'vue-redux'
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
export const useDispatch = /*#__PURE__*/ createDispatchComposition()
