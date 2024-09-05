# Vue Redux

Official Vue bindings for [Redux](https://github.com/reduxjs/redux).
Performant and flexible.

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/reduxjs/vue-redux/test.yml?style=flat-square) [![npm version](https://img.shields.io/npm/v/@reduxjs/vue-redux.svg?style=flat-square)](https://www.npmjs.com/package/@reduxjs/vue-redux)
[![npm downloads](https://img.shields.io/npm/dm/@reduxjs/vue.svg?style=flat-square)](https://www.npmjs.com/package/@reduxjs/vue-redux)

> [!WARNING]
> This package is in alpha and is rapidly developing.

## Installation

Vue Redux requires **Vue 3 or later**.

To use React Redux with your Vue app, install it as a dependency:

```bash
# If you use npm:
npm install @reduxjs/vue-redux

# Or if you use Yarn:
yarn add @reduxjs/vue-redux
```

You'll also need to [install Redux](https://redux.js.org/introduction/installation) and [set up a Redux store](https://redux.js.org/recipes/configuring-your-store/) in your app.

This assumes that you’re using [npm](http://npmjs.com/) package manager
with a module bundler like [Webpack](https://webpack.js.org/) or
[Browserify](http://browserify.org/) to consume [CommonJS
modules](https://webpack.js.org/api/module-methods/#commonjs).

# Usage

The following Vue component works as-expected:

```vue
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
