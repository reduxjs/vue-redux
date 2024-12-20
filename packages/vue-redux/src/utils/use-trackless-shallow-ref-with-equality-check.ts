import { customRef } from 'vue'
import type { Ref } from 'vue'
import type { EqualityFn } from '../types'

/**
 * In some instances, `watch` will attempt to read the value from an inner ref,
 * even when not part of the `() => ...` function. This can cause unwanted
 * side effects to occur.
 *
 * To sidestep this, we can expose the inner value as an untracked property
 */
export function useTracklessShallowRefWithEqualityCheck<T>(
  initialValue: T,
  equalityFn: EqualityFn<T>,
): {
  untrackedValue: { get(): T; set(_newValue: T): void }
  ref: Ref<T>
} {
  let untrackedValue = initialValue
  return {
    // Avoid stale values by exposing the inner value as an untracked property
    untrackedValue: {
      get() {
        return untrackedValue
      },
      set(_newValue: T) {},
    },
    ref: customRef((track, trigger) => {
      return {
        get() {
          track()
          return untrackedValue
        },
        set(newValue: T) {
          if (equalityFn(untrackedValue, newValue)) {
            return
          }
          untrackedValue = newValue
          trigger()
        },
      }
    }),
  }
}
