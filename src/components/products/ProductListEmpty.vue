<script setup lang="ts">
import { Button } from '@/components/ui/button'

const emit = defineEmits<{
  clearFilters: []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 rounded-3xl bg-white py-16 text-center nova-shadow">
    <div class="space-y-2">
      <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">A little pause</p>
      <h2 class="font-heading text-3xl text-foreground sm:text-4xl">ไม่พบสินค้า</h2>
    </div>
    <div class="w-56 overflow-hidden rounded-[2rem] bg-white p-2 sm:w-64">
      <img
        src="/empty-search.webp"
        alt="ไม่พบสินค้าที่ค้นหา"
        class="w-full object-contain"
        loading="lazy"
        decoding="async"
      />
    </div>
    <div class="space-y-1">
      <p class="max-w-sm text-sm text-muted-foreground">
        เราลองค้นหาแล้ว แต่ยังไม่เจอชิ้นที่ตรงใจ ลองปรับคำค้นหาหรือตัวกรองใหม่อีกครั้ง
      </p>
    </div>
    <Button type="button" variant="outline" size="sm" class="rounded-full" @click="emit('clearFilters')">
      ล้างตัวกรองทั้งหมด
    </Button>
  </div>
</template>
