<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { getTagColorClass } from '@/lib/product-utils'

defineProps<{
  tags: string[]
  selectedTags: string[]
}>()

const emit = defineEmits<{
  toggle: [tag: string]
}>()
</script>

<template>
  <div class="space-y-2">
    <p class="text-sm font-medium">Categories</p>
    <div class="flex flex-wrap gap-2" role="group" aria-label="กรองสินค้าตามแท็ก">
      <Button
        v-for="tag in tags"
        :key="tag"
        type="button"
        size="sm"
        :variant="selectedTags.includes(tag) ? 'default' : 'outline'"
        :class="['h-10 rounded-full px-4', !selectedTags.includes(tag) && getTagColorClass(tag)]"
        :aria-pressed="selectedTags.includes(tag)"
        @click="emit('toggle', tag)"
      >
        {{ tag }}
      </Button>
    </div>
  </div>
</template>
