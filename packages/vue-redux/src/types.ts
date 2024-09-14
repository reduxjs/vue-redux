import type { UseSelectorOptions } from './compositions/use-selector'
import type { DeepReadonly, Ref, UnwrapRef } from 'vue-demi'

export type EqualityFn<T> = (a: T, b: T) => boolean

/**
 * This interface allows you to easily create a composition that is properly typed for your
 * store's root state.
 *
 * @example
 *
 * interface RootState {
 *   property: string;
 * }
 *
 * const useTypedSelector: TypedUseSelectorComposition<RootState> = useSelector;
 */
export interface TypedUseSelectorComposition<TState> {
  <TSelected>(
    selector: (state: TState) => TSelected,
    equalityFn?: EqualityFn<NoInfer<TSelected>>,
  ): Readonly<Ref<DeepReadonly<UnwrapRef<TSelected>>>>
  <Selected = unknown>(
    selector: (state: TState) => Selected,
    options?: UseSelectorOptions<Selected>,
  ): Readonly<Ref<DeepReadonly<UnwrapRef<Selected>>>>
}

export type NoInfer<T> = [T][T extends any ? 0 : never]
