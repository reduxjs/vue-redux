---
id: getting-started
title: Getting Started with Vue Redux
hide_title: true
sidebar_label: Getting Started
description: "Introduction > Getting Started: First steps with Vue Redux"
---

# Getting Started with Vue Redux

[Vue Redux](https://github.com/reduxjs/vue-redux) is the official [Vue](https://vuejs.org/) UI bindings layer for [Redux](https://redux.js.org/). It lets your Vue components read data from a Redux store, and dispatch actions to the store to update state.

## Installation

Vue Redux requires **Vue 3 or later**, in order to make use of the Vue Composition API.

### Installing with `npm` or `yarn`

To use Vue Redux with your Vue app, install it as a dependency:

```bash
# If you use npm:
npm install @reduxjs/vue-redux

# Or if you use Yarn:
yarn add @reduxjs/vue-redux
```

You'll also need to [install Redux](https://redux.js.org/introduction/installation) and [set up a Redux store](https://redux.js.org/recipes/configuring-your-store/) in your app.

Vue-Redux is written in TypeScript, so all types are automatically included.

## API Overview

### `createVueReduxPlugin`

Vue Redux provides a `createVueReduxPlugin` function that creates a Vue plugin to provide the Redux store to your app:

```typescript
import { createApp } from 'vue'
import { createVueReduxPlugin } from '@reduxjs/vue-redux'
import { store } from './store'

import App from './App.vue'

const app = createApp(App)
app.use(createVueReduxPlugin({ store }))
app.mount('#app')
```

### `provideStoreToApp`

Alternatively, you can use `provideStoreToApp` directly without the plugin pattern:

```typescript
import { createApp } from 'vue'
import { provideStoreToApp } from '@reduxjs/vue-redux'
import { store } from './store'

import App from './App.vue'

const app = createApp(App)
provideStoreToApp(app, { store })
app.mount('#app')
```

### Compositions

Vue Redux provides a pair of custom Vue compositions that allow your Vue components to interact with the Redux store.

`useSelector` reads a value from the store state and subscribes to updates, while `useDispatch` returns the store's `dispatch` method to let you dispatch actions.

```html
<script setup lang="ts">
import { useSelector, useDispatch } from '@reduxjs/vue-redux'
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

## Help and Discussion

The **[#redux channel](https://discord.gg/0ZcbPKXt5bZ6au5t)** of the **[Reactiflux Discord community](http://www.reactiflux.com)** is our official resource for all questions related to learning and using Redux. Reactiflux is a great place to hang out, ask questions, and learn - come join us!

You can also ask questions on [Stack Overflow](https://stackoverflow.com) using the **[#redux tag](https://stackoverflow.com/questions/tagged/redux)**.
