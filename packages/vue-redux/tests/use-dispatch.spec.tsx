import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue-demi'
import { createStore } from 'redux'
import { render } from '@testing-library/vue'
import {
  createDispatchComposition,
  provideStore as provideMock,
  useDispatch,
} from '../src'
import type { VueReduxContextValue } from '../src'
import type { InjectionKey } from 'vue-demi'

const store = createStore((c: number = 1): number => c + 1)
const store2 = createStore((c: number = 1): number => c + 2)

describe('Vue', () => {
  describe('compositions', () => {
    describe('useDispatch', () => {
      it("returns the store's dispatch function", () => {
        const Comp = defineComponent(() => {
          const dispatch = useDispatch()
          expect(dispatch).toBe(store.dispatch)

          return () => null
        })

        const App = defineComponent(() => {
          provideMock({ store })
          return () => <Comp />
        })

        render(<App />)
      })
    })
    describe('createDispatchComposition', () => {
      it("returns the correct store's dispatch function", () => {
        const nestedContext = Symbol.for(
          'mock-redux-store',
        ) as InjectionKey<VueReduxContextValue | null>
        const useCustomDispatch = createDispatchComposition(nestedContext)

        const CheckDispatch = defineComponent(() => {
          const dispatch = useDispatch()
          const customDispatch = useCustomDispatch()
          expect(dispatch).toBe(store.dispatch)
          expect(customDispatch).toBe(store2.dispatch)

          return () => null
        })

        const InnerApp = defineComponent(() => {
          provideMock({ store: store2, context: nestedContext })
          return () => <CheckDispatch />
        })

        const App = defineComponent(() => {
          provideMock({ store })
          return () => <InnerApp />
        })

        render(<App />)
      })
    })
  })
})
