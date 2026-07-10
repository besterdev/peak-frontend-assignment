<script setup lang="ts">
defineProps<{
  count: number
}>()
</script>

<template>
  <p class="text-sm text-muted-foreground" aria-live="polite">
    พบ {{ count }} สินค้า
  </p>
</template>
