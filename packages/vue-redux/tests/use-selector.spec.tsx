import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, inject, watchSyncEffect } from 'vue'
import { createStore } from 'redux'
import { cleanup, render, waitFor } from '@testing-library/vue'
import { ContextKey, provideStore as provideMock, useSelector } from '../src'
import type { TypedUseSelectorComposition } from '../src'
import type { AnyAction, Store } from 'redux'
import { Subscription } from '../src/utils/Subscription'

describe('Vue', () => {
  describe('compositions', () => {
    describe('useSelector', () => {
      type NormalStateType = {
        count: number
      }
      let normalStore: Store<NormalStateType, AnyAction>
      let renderedItems: any[] = []
      type RootState = ReturnType<typeof normalStore.getState>
      const useNormalSelector: TypedUseSelectorComposition<RootState> =
        useSelector

      beforeEach(() => {
        normalStore = createStore(
          ({ count }: NormalStateType = { count: -1 }): NormalStateType => ({
            count: count + 1,
          }),
        )
        renderedItems = []
      })

      afterEach(() => cleanup())

      describe('core subscription behavior', () => {
        it('selects the state on initial render', () => {
          let result: number | undefined
          const Comp = defineComponent(() => {
            const count = useNormalSelector((state) => state.count)

            watchSyncEffect(() => {
              result = count.value
            })
            return () => <div>{count}</div>
          })

          const App = defineComponent(() => {
            provideMock({ store: normalStore })
            return () => <Comp />
          })

          render(<App />)

          expect(result).toEqual(0)
        })

        it('selects the state and renders the component when the store updates', async () => {
          const selector = vi.fn((s: NormalStateType) => s.count)
          let result: number | undefined
          const Comp = defineComponent(() => {
            const count = useNormalSelector(selector)

            watchSyncEffect(() => {
              result = count.value
            })
            return () => <div>{count}</div>
          })

          const App = defineComponent(() => {
            provideMock({ store: normalStore })
            return () => <Comp />
          })

          render(<App />)

          expect(result).toEqual(0)
          expect(selector).toHaveBeenCalledTimes(1)

          normalStore.dispatch({ type: '' })

          await waitFor(() => expect(result).toEqual(1))
          expect(selector).toHaveBeenCalledTimes(2)
        })
      })

      describe('lifecycle interactions', () => {
        it('always uses the latest state', async () => {
          const store = createStore((c: number = 1): number => c + 1, -1)

          const Comp = defineComponent(() => {
            const selector = (c: number): number => c + 1
            const value = useSelector(selector)
            watchSyncEffect(() => {
              renderedItems.push(value.value)
            })
            return () => <div />
          })

          const App = defineComponent(() => {
            provideMock({ store })
            return () => <Comp />
          })

          render(<App />)

          expect(renderedItems).toEqual([1])

          store.dispatch({ type: '' })

          await waitFor(() => expect(renderedItems).toEqual([1, 2]))
        })

        it('subscribes to the store synchronously', async () => {
          let appSubscription: Subscription | null = null

          const Child = defineComponent(() => {
            const count = useNormalSelector((s) => s.count)
            return () => <div>{count.value}</div>
          })

          const Parent = defineComponent(() => {
            const contextVal = inject(ContextKey)
            appSubscription = contextVal && contextVal.subscription
            const count = useNormalSelector((s) => s.count)
            return () => (count.value === 1 ? <Child /> : null)
          })

          const App = defineComponent(() => {
            provideMock({ store: normalStore })
            return () => <Parent />
          })

          render(<App />)
          // Parent component only
          expect(appSubscription!.getListeners().get().length).toBe(1)

          normalStore.dispatch({ type: '' })

          // Parent component + 1 child component
          await waitFor(() =>
            expect(appSubscription!.getListeners().get().length).toBe(2),
          )
        })
      })
    })
  })
})
