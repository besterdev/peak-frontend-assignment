<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getTagColorClass } from '@/lib/product-utils'

defineProps<{
  searchQuery: string
  selectedTags: string[]
}>()

const emit = defineEmits<{
  removeSearch: []
  removeTag: [tag: string]
  clearAll: []
}>()
</script>

<template>
  <div
    v-if="searchQuery || selectedTags.length > 0"
    class="flex flex-wrap items-center gap-2"
    aria-label="ตัวกรองที่ใช้งานอยู่"
  >
    <span class="text-sm text-muted-foreground">ตัวกรอง:</span>

    <Badge
      v-if="searchQuery"
      variant="secondary"
      class="gap-1 rounded-full bg-white px-3 py-1.5 pr-1 font-normal nova-shadow"
    >
      ค้นหา: "{{ searchQuery }}"
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        class="size-5 rounded-full"
        aria-label="ลบตัวกรองค้นหา"
        @click="emit('removeSearch')"
      >
        <X class="size-3" />
      </Button>
    </Badge>

    <Badge
      v-for="tag in selectedTags"
      :key="tag"
      variant="secondary"
      :class="['gap-1 rounded-full px-3 py-1.5 pr-1 font-normal nova-shadow', getTagColorClass(tag)]"
    >
      {{ tag }}
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        class="size-5 rounded-full"
        :aria-label="`ลบแท็ก ${tag}`"
        @click="emit('removeTag', tag)"
      >
        <X class="size-3" />
      </Button>
    </Badge>

    <Button
      type="button"
      variant="ghost"
      size="sm"
      class="rounded-full text-muted-foreground"
      @click="emit('clearAll')"
    >
      ล้างทั้งหมด
    </Button>
  </div>
</template>
