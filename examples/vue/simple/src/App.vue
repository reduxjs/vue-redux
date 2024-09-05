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
