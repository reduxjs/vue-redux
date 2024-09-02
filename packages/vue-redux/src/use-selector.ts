import { inject, readonly, ref, watch } from 'vue'
import { StoreSymbol } from './provide-store'
import type { EqualityFn } from './types'

export interface UseSelectorOptions<Selected = unknown> {
  equalityFn?: EqualityFn<Selected>
}

const refEquality: EqualityFn<any> = (a, b) => a === b

// TODO: Add support for `withTypes`
export function useSelector<TState = unknown, Selected = unknown>(
  selector: (state: TState) => Selected,
  equalityFnOrOptions?: EqualityFn<Selected> | UseSelectorOptions<Selected>,
): Signal<Selected> {
  const reduxContext = inject(StoreSymbol)

  // const { equalityFn = refEquality } =
  //   typeof equalityFnOrOptions === 'function'
  //     ? { equalityFn: equalityFnOrOptions }
  //     : equalityFnOrOptions

  const { store } = reduxContext

  const selectedState = ref(selector(store.getState()))

  watch(
    () => store,
    (_, __, onCleanup) => {
      const unsubscribe = store.subscribe(() => {
        selectedState.value = selector(store.getState())
      })

      onCleanup(() => {
        unsubscribe()
      })
    },
    {
      immediate: true
    }
  )

  return readonly(selectedState)
}
