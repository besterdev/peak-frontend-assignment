<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { motion } from 'motion-v'
import { ShoppingBag } from 'lucide-vue-next'

import { useCartStore } from '@/stores/cart'
import { Badge } from '@/components/ui/badge'
import peakShopLogo from '@/assets/peak-shop-logo.svg'

const cartStore = useCartStore()
const route = useRoute()

const cartCount = computed(() => cartStore.totalItems)
const isCartActive = computed(() => route.path === '/cart')
const emit = defineEmits<{ openCart: [] }>()
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-border/80 bg-white/90 backdrop-blur-md">
    <div class="container mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
      <RouterLink
        to="/products"
        class="shrink-0 rounded-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="PEAK Shop - ไปหน้ารายการสินค้า"
      >
        <img :src="peakShopLogo" alt="PEAK SHOP" class="h-9 w-auto" />
      </RouterLink>

      <div class="ml-auto flex items-center gap-1">
        <button
          type="button"
          class="relative inline-flex size-10 items-center justify-center rounded-full transition-colors hover:bg-secondary"
          :class="isCartActive ? 'bg-secondary' : ''"
          aria-label="ตะกร้าสินค้า"
          @click="emit('openCart')"
        >
          <ShoppingBag class="size-5" aria-hidden="true" />
          <motion.div
            v-if="cartCount > 0"
            :key="cartCount"
            :initial="{ scale: 0.5 }"
            :animate="{ scale: 1 }"
            :transition="{ type: 'spring', stiffness: 500, damping: 15 }"
            class="absolute -top-0.5 -right-0.5"
          >
            <Badge
              variant="default"
              class="flex size-5 items-center justify-center rounded-full p-0 text-[10px]"
              :aria-label="`${cartCount} รายการในตะกร้า`"
            >
              {{ cartCount > 99 ? '99+' : cartCount }}
            </Badge>
          </motion.div>
        </button>
      </div>
    </div>
  </header>
</template>
