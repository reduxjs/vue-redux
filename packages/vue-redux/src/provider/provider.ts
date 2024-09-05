import { onScopeDispose, provide } from 'vue'
import type { App, InjectionKey } from 'vue'
import type {Action, Store, UnknownAction} from 'redux'
import {ContextKey, ProviderProps, VueReduxContextValue} from "./context";
import {createSubscription, Subscription} from "../utils/Subscription";

export interface ProviderProps<
  A extends Action<string> = UnknownAction,
  S = unknown,
> {
  /**
   * The single Redux store in your application.
   */
  store: Store<S, A>
  /**
   * Optional context to be used internally in vue-redux. Use `Symbol() as InjectionKey<VueReduxContextValue<S, A>>` to create a context to be used.
   * Set the initial value to null, and the compositions will error
   * if this is not overwritten by `provide`.
   *
   * @see https://vuejs.org/guide/typescript/composition-api#typing-provide-inject
   */
  context?: InjectionKey<VueReduxContextValue<S, A> | null>
}


export function getContext<
  A extends Action<string> = UnknownAction,
  S = unknown,
>({ store }: Pick<ProviderProps<A, S>, "store">): VueReduxContextValue<S, A> | null {
  const subscription = createSubscription(store) as Subscription
  subscription.onStateChange = subscription.notifyNestedSubs
  subscription.trySubscribe()

  return {
    store,
    subscription,
  }
}

export function provideStore<
  A extends Action<string> = UnknownAction,
  S = unknown,
>({store, context}: ProviderProps<A, S>) {
  const contextValue = getContext({store})

  onScopeDispose(() => {
    contextValue.subscription.tryUnsubscribe()
    contextValue.subscription.onStateChange = undefined
  })

  const providerKey = context || ContextKey;

  provide(providerKey, contextValue)
}

export function provideStoreToApp<
  A extends Action<string> = UnknownAction,
  S = unknown,
>(app: App, {store, context}: ProviderProps<A, S>) {
  const contextValue = getContext({store})

  const providerKey = context || ContextKey;

  app.provide(providerKey, contextValue)
}
