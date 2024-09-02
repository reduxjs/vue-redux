import { inject } from 'vue'
import { StoreSymbol } from './provide-store'

export function useStore<A extends Action<string> = UnknownAction, S = unknown>(): Store<S, A> {
  const context = inject(StoreSymbol)
  const { store } = context
  return store
}
