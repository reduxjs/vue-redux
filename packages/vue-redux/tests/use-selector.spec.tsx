import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h, watchSyncEffect } from 'vue'
import { createStore } from 'redux'
import { cleanup, render } from '@testing-library/vue'
import { provideStore as provideMock, useSelector } from '../src'
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
      })
    })
  })
})
