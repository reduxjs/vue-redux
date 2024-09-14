import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue-demi'
import { render } from '@testing-library/vue'
import { createReduxContextComposition, useReduxContext } from '../src'
import type { VueReduxContextValue } from '../src'
import type { InjectionKey } from 'vue-demi'

describe('Vue', () => {
  describe('compositions', () => {
    describe('useReduxContext', () => {
      it('throws if component is not wrapped in provider', () => {
        const App = defineComponent(() => {
          expect(useReduxContext()).toBe(undefined)
          return () => null
        })

        // TODO: Change this test to check against `toThrow`
        render(<App />)
      })
    })
    describe('createReduxContextHook', () => {
      it('throws if component is not wrapped in provider', () => {
        const customContext = Symbol.for(
          'testing',
        ) as InjectionKey<VueReduxContextValue | null>
        const useCustomReduxContext =
          createReduxContextComposition(customContext)

        const App = defineComponent(() => {
          expect(useCustomReduxContext()).toBe(undefined)

          return () => null
        })

        // TODO: Change this test to check against `toThrow`
        render(<App />)
      })
    })
  })
})
