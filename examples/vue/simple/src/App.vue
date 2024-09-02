<script setup lang="ts">
import { useStore } from 'vue-redux'

const localStore = useStore()
</script>

<template>
  <p>{{ JSON.stringify(localStore.getState()) }}</p>
</template>
