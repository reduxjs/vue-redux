import { onScopeDispose, provide } from 'vue'
import { createSubscription } from './utils/Subscription'
import type { App } from 'vue'
import type { Action, Store, UnknownAction } from 'redux'

export interface ProviderProps<
  A extends Action<string> = UnknownAction,
  S = unknown,
> {
  /**
   * The single Redux store in your application.
   */
  store: Store<S, A>
}

export const StoreSymbol = Symbol('Store')

export type StoreContext = ReturnType<typeof getStoreContext>

export function getStoreContext<
  A extends Action<string> = UnknownAction,
  S = unknown,
>({ store }: ProviderProps<A, S>) {
  const subscription = createSubscription(store)
  subscription.onStateChange = subscription.notifyNestedSubs
  subscription.trySubscribe()

  const context = {
    store,
    subscription,
  }

  return context
}

export function provideStore<
  A extends Action<string> = UnknownAction,
  S = unknown,
>(props: ProviderProps<A, S>) {
  const context = getStoreContext(props)

  onScopeDispose(() => {
    context.subscription.tryUnsubscribe()
    context.subscription.onStateChange = undefined
  })

  provide(StoreSymbol, context)
}

export function provideStoreToApp<
  A extends Action<string> = UnknownAction,
  S = unknown,
>(app: App, props: ProviderProps<A, S>) {
  const context = getStoreContext(props)
  app.provide(StoreSymbol, context)
}
