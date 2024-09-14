import type { Subscription } from '../utils/Subscription'
import type { Action, Store, UnknownAction } from 'redux'
import type { InjectionKey } from 'vue-demi'

export interface VueReduxContextValue<
  SS = any,
  A extends Action<string> = UnknownAction,
> {
  store: Store<SS, A>
  subscription: Subscription
}

export const ContextKey = Symbol.for(
  `vue-redux-context`,
) as InjectionKey<VueReduxContextValue>
