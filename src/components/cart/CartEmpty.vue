<script setup lang="ts">
import { ShoppingBag } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 rounded-3xl bg-white py-16 text-center nova-shadow">
    <ShoppingBag class="size-12 text-muted-foreground/50" aria-hidden="true" />
    <div class="space-y-1">
      <h2 class="text-lg font-semibold">ตะกร้าว่าง</h2>
      <p class="max-w-sm text-sm text-muted-foreground">
        ยังไม่มีสินค้าในตะกร้า เริ่มเลือกสินค้าที่คุณชอบได้เลย
      </p>
    </div>
    <Button as-child size="sm" class="rounded-full px-5">
      <RouterLink to="/products">เลือกซื้อสินค้า</RouterLink>
    </Button>
  </div>
</template>
