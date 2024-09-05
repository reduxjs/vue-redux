import type { Action, Store, UnknownAction } from 'redux'
import {Subscription} from '../utils/Subscription'
import type { ProviderProps } from './Provider'
import {InjectionKey} from "vue";

export interface VueReduxContextValue<
  SS = any,
  A extends Action<string> = UnknownAction,
> extends Pick<ProviderProps, 'stabilityCheck' | 'identityFunctionCheck'> {
  store: Store<SS, A>
  subscription: Subscription
}

export const ContextKey = Symbol.for(`react-redux-context`) as InjectionKey<VueReduxContextValue>
