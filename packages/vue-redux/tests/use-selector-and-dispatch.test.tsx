import { describe, expect, it } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { defineComponent, h } from 'vue-demi'
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { provideStore, useDispatch, useSelector } from '../src'

const user = userEvent.setup()

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1
    },
  },
})

describe('Vue Redux', () => {
  it('useSelector should work without reactivity', async () => {
    const store = configureStore({
      reducer: {
        counter: counterSlice.reducer,
      },
    })

    type RootState = ReturnType<typeof store.getState>

    const Comp = defineComponent(() => {
      const count = useSelector((state: RootState) => state.counter.value)
      return () => <p>Count: {count.value}</p>
    })

    const App = defineComponent(() => {
      provideStore({ store })

      return () => <Comp />
    })

    const { getByText } = render(<App />)
    expect(getByText('Count: 0')).toBeInTheDocument()
  })

  it('useSelector should work with reactivity', async () => {
    const store = configureStore({
      reducer: {
        counter: counterSlice.reducer,
      },
    })

    type RootState = ReturnType<typeof store.getState>

    const Comp = defineComponent(() => {
      const count = useSelector((state: RootState) => state.counter.value)
      const dispatch = useDispatch()
      return () => (
        <button
          onClick={() => {
            dispatch(counterSlice.actions.increment())
          }}
        >
          Count: {count.value}
        </button>
      )
    })

    const App = defineComponent(() => {
      provideStore({ store })

      return () => <Comp />
    })

    const { getByText } = render(<App />)
    const btn = getByText('Count: 0')
    expect(btn).toBeInTheDocument()
    await user.click(btn)
    expect(getByText('Count: 1')).toBeInTheDocument()
  })
})
