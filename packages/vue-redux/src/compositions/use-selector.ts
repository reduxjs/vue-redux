import { readonly, ref, toRaw, watch } from 'vue-demi'
import { ContextKey } from '../provider/context'
import {
  createReduxContextComposition,
  useReduxContext as useDefaultReduxContext,
} from './use-redux-context'
import type { DeepReadonly, InjectionKey, Ref, UnwrapRef } from 'vue-demi'
import type { EqualityFn } from '../types'
import type { VueReduxContextValue } from '../provider/context'

export interface UseSelectorOptions<Selected> {
  equalityFn?: EqualityFn<Selected>
}

const refEquality: EqualityFn<any> = (a, b) => a === b

/**
 * Represents a custom composition that allows you to extract data from the
 * Redux store state, using a selector function. The selector function
 * takes the current state as an argument and returns a part of the state
 * or some derived data. The composition also supports an optional equality
 * function or options object to customize its behavior.
 *
 * @template StateType - The specific type of state this composition operates on.
 *
 * @public
 */
export interface UseSelector<StateType = unknown> {
  /**
   * A function that takes a selector function as its first argument.
   * The selector function is responsible for selecting a part of
   * the Redux store's state or computing derived data.
   *
   * @param selector - A function that receives the current state and returns a part of the state or some derived data.
   * @param equalityFnOrOptions - An optional equality function or options object for customizing the behavior of the selector.
   * @returns The selected part of the state or derived data.
   *
   * @template TState - The specific type of state this composition operates on.
   * @template Selected - The type of the value that the selector function will return.
   */
  <TState extends StateType = StateType, Selected = unknown>(
    selector: (state: TState) => Selected,
    equalityFnOrOptions?: EqualityFn<Selected> | UseSelectorOptions<Selected>,
  ): Readonly<Ref<DeepReadonly<UnwrapRef<Selected>>>>

  /**
   * Creates a "pre-typed" version of {@linkcode useSelector useSelector}
   * where the `state` type is predefined.
   *
   * This allows you to set the `state` type once, eliminating the need to
   * specify it with every {@linkcode useSelector useSelector} call.
   *
   * @returns A pre-typed `useSelector` with the state type already defined.
   *
   * @example
   * ```ts
   * export const useAppSelector = useSelector.withTypes<RootState>()
   * ```
   *
   * @template OverrideStateType - The specific type of state this composition operates on.
   */
  withTypes: <
    OverrideStateType extends StateType,
  >() => UseSelector<OverrideStateType>
}

/**
 * Composition factory, which creates a `useSelector` composition bound to a given context.
 *
 * @param {InjectionKey<VueReduxContextValue>} [context=StoreSymbol] Injection key passed to your `inject`.
 * @returns {Function} A `useSelector` composition bound to the specified context.
 */
export function createSelectorComposition(
  context: InjectionKey<VueReduxContextValue<any, any> | null> = ContextKey,
): UseSelector {
  const useReduxContext =
    context === ContextKey
      ? useDefaultReduxContext
      : createReduxContextComposition(context)

  const useSelector = <TState, Selected>(
    selector: (state: TState) => Selected,
    equalityFnOrOptions:
      | EqualityFn<Selected>
      | UseSelectorOptions<Selected> = {},
  ): Readonly<Ref<DeepReadonly<UnwrapRef<Selected>>>> => {
    const { equalityFn = refEquality } =
      typeof equalityFnOrOptions === 'function'
        ? { equalityFn: equalityFnOrOptions }
        : equalityFnOrOptions

    const { store, subscription } = useReduxContext()

    // TODO: Introduce wrappedSelector for debuggability

    const selectedState = ref(selector(store.getState() as TState))

    watch(
      () => store,
      (_, __, onCleanup) => {
        const unsubscribe = subscription.addNestedSub(() => {
          const data = selector(store.getState() as TState)
          if (equalityFn(toRaw(selectedState.value) as Selected, data)) {
            return
          }

          selectedState.value = data as UnwrapRef<Selected>
        })

        onCleanup(() => {
          unsubscribe()
        })
      },
      {
        immediate: true,
      },
    )

    return readonly(selectedState)
  }

  Object.assign(useSelector, {
    withTypes: () => useSelector,
  })

  return useSelector as UseSelector
}

/**
 * A composition to access the redux store's state. This composition takes a selector function
 * as an argument. The selector is called with the store state.
 *
 * This composition takes an optional equality comparison function as the second parameter
 * that allows you to customize the way the selected state is compared to determine
 * whether the component needs to be re-rendered.
 *
 * @param {Function} selector the selector function
 * @param {Function=} equalityFn the function that will be used to determine equality
 *
 * @returns {any} the selected state
 *
 * @example
 *
 * import { useSelector } from '@reduxjs/vue-redux'
 *
 * export const CounterComponent = () => {
 *   const counter = useSelector(state => state.counter)
 *   return <div>{counter}</div>
 * }
 */
export const useSelector = /* #__PURE__*/ createSelectorComposition()
