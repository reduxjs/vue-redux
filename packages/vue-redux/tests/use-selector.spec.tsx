import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Fragment, defineComponent, h, inject, watchSyncEffect } from 'vue-demi'
import { createStore } from 'redux'
import { cleanup, render, waitFor } from '@testing-library/vue'
import {
  ContextKey,
  provideStore as provideMock,
  shallowEqual,
  useSelector,
} from '../src'
import type { Ref } from 'vue-demi'
import type { Subscription } from '../src/utils/Subscription'
import type { TypedUseSelectorComposition } from '../src'
import type { AnyAction, Store } from 'redux'

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
            appSubscription = contextVal ? contextVal.subscription : null
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

        it('unsubscribes when the component is unmounted', async () => {
          let appSubscription: Subscription | null = null

          const Child = defineComponent(() => {
            const count = useNormalSelector((s) => s.count)
            return () => <div>{count.value}</div>
          })

          const Parent = defineComponent(() => {
            const contextVal = inject(ContextKey)
            appSubscription = contextVal ? contextVal.subscription : null
            const count = useNormalSelector((s) => s.count)
            return () => (count.value === 0 ? <Child /> : null)
          })

          const App = defineComponent(() => {
            provideMock({ store: normalStore })
            return () => <Parent />
          })

          render(<App />)
          // Parent + 1 child component
          expect(appSubscription!.getListeners().get().length).toBe(2)

          normalStore.dispatch({ type: '' })

          // Parent component only
          await waitFor(() =>
            expect(appSubscription!.getListeners().get().length).toBe(1),
          )
        })

        it('notices store updates between render and store subscription effect', async () => {
          const Child = defineComponent(
            (props: { count: Ref<number> }) => {
              // console.log('Child rendering')
              watchSyncEffect(() => {
                // console.log('Child layoutEffect: ', props.count.value)
                if (props.count.value === 0) {
                  // console.log('Dispatching store update')
                  normalStore.dispatch({ type: '' })
                }
              })
              return () => null
            },
            {
              props: ['count'],
            },
          )

          const Comp = defineComponent(() => {
            // console.log('Parent rendering, selecting state')
            const count = useNormalSelector((s) => s.count)

            watchSyncEffect(() => {
              // console.log('Parent layoutEffect: ', count)
              renderedItems.push(count.value)
            })

            return () => (
              <div>
                {count.value}
                <Child count={count} />
              </div>
            )
          })

          const App = defineComponent(() => {
            provideMock({ store: normalStore })
            return () => <Comp />
          })

          // console.log('Starting initial render')
          render(<App />)

          // With `useSyncExternalStore`, we get three renders of `<Comp>`:
          // 1) Initial render, count is 0
          // 2) Render due to dispatch, still sync in the initial render's commit phase
          expect(renderedItems).toEqual([0, 1])
        })
      })

      describe('performance optimizations and bail-outs', () => {
        it('defaults to ref-equality to prevent unnecessary updates', async () => {
          const state = {}
          const store = createStore(() => state)

          const Comp = defineComponent(() => {
            const value = useSelector((s) => s)
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

          expect(renderedItems.length).toBe(1)

          store.dispatch({ type: '' })

          await waitFor(() => expect(renderedItems.length).toBe(1))
        })

        it('allows other equality functions to prevent unnecessary updates', async () => {
          interface StateType {
            count: number
            stable: {}
          }
          const store = createStore(
            ({ count, stable }: StateType = { count: -1, stable: {} }) => ({
              count: count + 1,
              stable,
            }),
          )

          const Comp = defineComponent(() => {
            const value = useSelector(
              (s: StateType) => Object.keys(s),
              shallowEqual,
            )
            watchSyncEffect(() => {
              renderedItems.push(value.value)
            })
            return () => <div />
          })

          const Comp2 = defineComponent(() => {
            const value = useSelector((s: StateType) => Object.keys(s), {
              equalityFn: shallowEqual,
            })
            watchSyncEffect(() => {
              renderedItems.push(value.value)
            })
            return () => <div />
          })

          const App = defineComponent(() => {
            provideMock({ store })
            return () => (
              <>
                <Comp />
                <Comp2 />
              </>
            )
          })

          render(<App />)

          expect(renderedItems.length).toBe(2)

          store.dispatch({ type: '' })

          await waitFor(() => expect(renderedItems.length).toBe(2))
        })

        it('calls selector exactly once on mount and on update', async () => {
          interface StateType {
            count: number
          }
          const store = createStore(({ count }: StateType = { count: 0 }) => ({
            count: count + 1,
          }))

          const selector = vi.fn((s: StateType) => {
            return s.count
          })
          const renderedItems: number[] = []

          const Comp = defineComponent(() => {
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

          expect(selector).toHaveBeenCalledTimes(1)
          expect(renderedItems.length).toEqual(1)

          store.dispatch({ type: '' })

          await waitFor(() => expect(selector).toHaveBeenCalledTimes(2))
          expect(renderedItems.length).toEqual(2)
        })

        it('calls selector twice once on mount when state changes during render', async () => {
          interface StateType {
            count: number
          }
          const store = createStore(({ count }: StateType = { count: 0 }) => ({
            count: count + 1,
          }))

          const selector = vi.fn((s: StateType) => {
            return s.count
          })
          const renderedItems: number[] = []

          const Child = defineComponent(() => {
            watchSyncEffect(() => {
              store.dispatch({ type: '', count: 1 })
            })
            return () => <div />
          })

          const Comp = defineComponent(() => {
            const value = useSelector(selector)

            watchSyncEffect(() => {
              renderedItems.push(value.value)
            })

            return () => (
              <div>
                <Child />
              </div>
            )
          })

          const App = defineComponent(() => {
            provideMock({ store })
            return () => <Comp />
          })

          render(<App />)

          // Selector first called on Comp mount, and then re-invoked after mount due to useLayoutEffect dispatching event
          expect(selector).toHaveBeenCalledTimes(2)
          expect(renderedItems.length).toEqual(2)
        })
      })
    })
  })
})
