<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'

const searchQuery = defineModel<string>({ required: true })
</script>

<template>
  <div class="relative max-w-md">
    <Search
      class="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
      aria-hidden="true"
    />
    <Input
      v-model="searchQuery"
      type="search"
      placeholder="ค้นหาสินค้าจากชื่อ..."
      class="h-11 rounded-full border-border/80 bg-white pl-10"
      aria-label="ค้นหาสินค้าจากชื่อ"
    />
  </div>
</template>
