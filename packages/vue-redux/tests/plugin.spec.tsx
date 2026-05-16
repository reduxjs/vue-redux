import { describe, expect, it } from 'vitest'
import { createApp, defineComponent } from 'vue'
import { createStore } from 'redux'
import { createVueReduxPlugin, useDispatch, useSelector } from '../src'

const store = createStore((c: number = 0, action: { type: string }) => {
  if (action.type === 'INCREMENT') return c + 1
  return c
})

describe('Vue', () => {
  describe('plugin', () => {
    describe('createVueReduxPlugin', () => {
      it('provides the store to the application', () => {
        let capturedDispatch: unknown
        let capturedState: unknown

        const Comp = defineComponent({
          setup() {
            capturedDispatch = useDispatch()
            capturedState = useSelector((state: number) => state)
            return () => null
          },
        })

        const app = createApp(Comp)
        app.use(createVueReduxPlugin({ store }))

        const div = document.createElement('div')
        app.mount(div)

        expect(capturedDispatch).toBe(store.dispatch)
        expect(capturedState).toBe(store.getState())

        app.unmount()
      })

      it('works with multiple components', () => {
        let dispatchA: unknown
        let dispatchB: unknown

        const CompA = defineComponent({
          setup() {
            dispatchA = useDispatch()
            return () => null
          },
        })

        const CompB = defineComponent({
          setup() {
            dispatchB = useDispatch()
            return () => null
          },
        })

        const Root = defineComponent({
          components: { CompA, CompB },
          template: '<CompA /><CompB />',
        })

        const app = createApp(Root)
        app.use(createVueReduxPlugin({ store }))

        const div = document.createElement('div')
        app.mount(div)

        expect(dispatchA).toBe(store.dispatch)
        expect(dispatchB).toBe(store.dispatch)

        app.unmount()
      })
    })
  })
})
