<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { motion } from 'motion-v'
import { ShoppingBag } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import type { Product } from '@/types/product'
import { useCartStore } from '@/stores/cart'
import { useFormatPrice } from '@/composables/useFormatPrice'
import { getTagColorClass, sortTags } from '@/lib/product-utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  product: Product
}>()

const cartStore = useCartStore()
const { formatPrice } = useFormatPrice()
const uniqueTags = computed(() => sortTags(Array.from(new Set(props.product.tags))))

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f2" width="400" height="300"/%3E%3Ctext fill="%23a1a1aa" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo image%3C/text%3E%3C/svg%3E'

const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = PLACEHOLDER_IMAGE
}

const addToCart = () => {
  cartStore.addItem(props.product.id, 1)
  toast.success('เพิ่มลงตะกร้าแล้ว', {
    description: props.product.title,
  })
}
</script>

<template>
  <motion.div
    :while-hover="{ y: -6 }"
    :while-tap="{ scale: 0.99 }"
    :transition="{ type: 'spring', stiffness: 360, damping: 26 }"
    class="h-full"
  >
    <article
      class="group flex h-full min-w-0 flex-col overflow-hidden rounded-md border border-border/80 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:nova-shadow-lg"
    >
      <RouterLink
        :to="`/products/${product.id}`"
        class="relative block overflow-hidden bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        :aria-label="`ดูรายละเอียด ${product.title}`"
      >
        <div class="aspect-square p-3 sm:p-7">
          <img
            :src="product.photos[0]"
            :alt="product.title"
            loading="lazy"
            decoding="async"
            class="size-full object-contain transition-transform duration-500 group-hover:scale-105"
            @error="onImageError"
          />
        </div>
      </RouterLink>

      <div class="flex flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-5">
        <div class="space-y-1">
          <RouterLink
            :to="`/products/${product.id}`"
            class="block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <h3
              class="line-clamp-2 text-[13px] font-semibold leading-snug tracking-tight sm:text-[15px]"
            >
              {{ product.title }}
            </h3>
          </RouterLink>
          <p class="text-xs text-muted-foreground sm:text-sm">
            {{ formatPrice(product.price) }}
          </p>
        </div>

        <div class="mt-auto flex items-center justify-between gap-2">
          <div class="flex min-w-0 flex-wrap gap-x-2 gap-y-1.5">
            <Badge
              v-for="tag in uniqueTags"
              :key="tag"
              variant="secondary"
              :class="['rounded-full px-2 py-0.5 text-[11px] font-normal', getTagColorClass(tag)]"
            >
              {{ tag }}
            </Badge>
          </div>

          <Button
            type="button"
            size="icon-sm"
            class="size-8 shrink-0 rounded-full sm:size-9"
            :aria-label="`เพิ่ม ${product.title} ลงตะกร้า`"
            @click="addToCart"
          >
            <ShoppingBag class="size-4" />
          </Button>
        </div>
      </div>
    </article>
  </motion.div>
</template>
