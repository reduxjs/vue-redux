import {describe, it, expect} from "vitest";
import { defineComponent, h } from 'vue'
import {
  createDispatchComposition, provideStore,
  provideStore as provideMock,
  useDispatch,
} from '../src'
import { createStore } from 'redux'
import {render} from "@testing-library/vue";

const store = createStore((c: number = 1): number => c + 1)
const store2 = createStore((c: number = 1): number => c + 2)

describe('Vue', () => {
  describe('compositions', () => {
    describe('useDispatch', () => {
      it("returns the store's dispatch function", () => {
        const Comp = defineComponent(() => {
          const dispatch = useDispatch();
          expect(dispatch).toBe(store.dispatch)

          return () => null;
        })

        const App = defineComponent(() => {
          provideStore({store});
          return () => <Comp/>
        })

        render(<App/>)
      })
    })
    // describe('createDispatchComposition', () => {
    //   it("returns the correct store's dispatch function", () => {
    //     const nestedContext =
    //       React.createContext<ReactReduxContextValue | null>(null)
    //     const useCustomDispatch = createDispatchComposition(nestedContext)
    //     const { result } = renderHook(() => useDispatch(), {
    //       // eslint-disable-next-line react/prop-types
    //       wrapper: ({ children, ...props }) => (
    //         <ProviderMock {...props} store={store}>
    //           <ProviderMock context={nestedContext} store={store2}>
    //             {children}
    //           </ProviderMock>
    //         </ProviderMock>
    //       ),
    //     })
    //
    //     expect(result.current).toBe(store.dispatch)
    //
    //     const { result: result2 } = renderHook(() => useCustomDispatch(), {
    //       // eslint-disable-next-line react/prop-types
    //       wrapper: ({ children, ...props }) => (
    //         <ProviderMock {...props} store={store}>
    //           <ProviderMock context={nestedContext} store={store2}>
    //             {children}
    //           </ProviderMock>
    //         </ProviderMock>
    //       ),
    //     })
    //
    //     expect(result2.current).toBe(store2.dispatch)
    //   })
    // })
  })
})
