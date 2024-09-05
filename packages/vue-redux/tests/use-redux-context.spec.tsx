import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { render } from '@testing-library/vue'
import { createReduxContextComposition, useReduxContext } from '../src'
import type { InjectionKey } from 'vue'

describe('Vue', () => {
  describe('compositions', () => {
    describe('useReduxContext', () => {
      it('throws if component is not wrapped in provider', () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

        const App = defineComponent(() => {
          useReduxContext()
          return () => null
        })

        expect(() => render(<App />)).toThrow(
          /could not find vue-redux context value/,
        )
        spy.mockRestore()
      })
    })
    describe('createReduxContextHook', () => {
      it('throws if component is not wrapped in provider', () => {
        const customContext = Symbol.for(
          'testing',
        ) as InjectionKey<VueReduxContextValue | null>
        const useCustomReduxContext =
          createReduxContextComposition(customContext)
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

        const App = defineComponent(() => {
          useCustomReduxContext()
          return () => null
        })

        expect(() => render(<App />)).toThrow(
          /could not find vue-redux context value/,
        )

        spy.mockRestore()
      })
    })
  })
})
