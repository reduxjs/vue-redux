import { inject } from 'vue'
import { StoreSymbol } from './provide-store'
import type { Dispatch, UnknownAction } from 'redux'

// TODO: Add `withTypes` support
export function useDispatch<
  AppDispatch extends Dispatch<UnknownAction> = Dispatch<UnknownAction>,
>(): AppDispatch {
  const context = inject(StoreSymbol)
  const { store } = context

  return store.dispatch as AppDispatch
}
