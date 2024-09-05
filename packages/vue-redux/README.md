# Vue Redux

Official Vue bindings for [Redux](https://github.com/reduxjs/redux).
Performant and flexible.

> [!WARNING]
> This package is in alpha and is rapidly developing.

# Features

- Compatible with Vue 3+
- [Redux Toolkit](https://redux-toolkit.js.org/) support

# Usage

The following Vue component works as-expected:

```vue
<script setup lang="ts">
  import { useSelector, useDispatch } from 'vue-redux'
  import { decrement, increment } from './store/counter-slice'
  import { RootState } from './store'

  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()
</script>

<template>
  <div>
    <div>
      <button aria-label="Increment value" @click="dispatch(increment())">
        Increment
      </button>
      <span>{{ count }}</span>
      <button aria-label="Decrement value" @click="dispatch(decrement())">
        Decrement
      </button>
    </div>
  </div>
</template>
```

Assuming the following `store.ts` file is present:

```typescript
import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit'

export interface CounterState {
  value: number
}

const initialState: CounterState = {
  value: 0,
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```
