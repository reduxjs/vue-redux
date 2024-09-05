import type { Subscription } from '../utils/Subscription'
import type { Action, Store, UnknownAction } from 'redux'
import type { ProviderProps } from './Provider'
import type { InjectionKey } from 'vue'

export interface VueReduxContextValue<
  SS = any,
  A extends Action<string> = UnknownAction,
> extends Pick<ProviderProps, 'stabilityCheck' | 'identityFunctionCheck'> {
  store: Store<SS, A>
  subscription: Subscription
}

export const ContextKey = Symbol.for(
  `vue-redux-context`,
) as InjectionKey<VueReduxContextValue>
