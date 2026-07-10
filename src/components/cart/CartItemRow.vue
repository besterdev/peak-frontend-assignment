<script setup lang="ts">
import { computed } from 'vue'
import { motion } from 'motion-v'
import { Minus, Plus, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import type { Product } from '@/types/product'
import { useCartStore } from '@/stores/cart'
import { useFormatPrice } from '@/composables/useFormatPrice'
import { MAX_QUANTITY, MIN_QUANTITY } from '@/constants'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import ConfirmRemoveCartItemDialog from '@/components/cart/ConfirmRemoveCartItemDialog.vue'
import { useCartItemRemoval } from '@/composables/useCartItemRemoval'

const props = defineProps<{
  product: Product
  quantity: number
}>()

const cartStore = useCartStore()
const { formatPrice } = useFormatPrice()

const lineTotal = computed(() => props.product.price * props.quantity)
const { isRemoveDialogOpen, requestRemove, confirmRemove } = useCartItemRemoval()

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"%3E%3Crect fill="%23f4f4f5" width="80" height="80"/%3E%3C/svg%3E'

const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = PLACEHOLDER_IMAGE
}

const increment = () => {
  if (props.quantity < MAX_QUANTITY) {
    cartStore.updateQuantity(props.product.id, props.quantity + 1)
    toast.info('อัปเดตจำนวนสินค้าแล้ว')
  }
}

const decrement = () => {
  if (props.quantity > MIN_QUANTITY) {
    cartStore.updateQuantity(props.product.id, props.quantity - 1)
    toast.info('อัปเดตจำนวนสินค้าแล้ว')
  }
}

</script>

<template>
  <div class="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
    <img
      :src="product.photos[0]"
      :alt="product.title"
      loading="lazy"
      decoding="async"
      class="size-20 shrink-0 rounded-2xl bg-secondary object-contain p-2"
      @error="onImageError"
    />

    <div class="min-w-0 flex-1 space-y-1">
      <h3 class="truncate text-sm font-medium">{{ product.title }}</h3>
      <p class="text-sm text-muted-foreground">
        {{ formatPrice(product.price) }} / ชิ้น
      </p>
    </div>

    <div class="flex items-center gap-1 rounded-full bg-secondary p-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        class="rounded-full"
        :disabled="quantity <= MIN_QUANTITY"
        :aria-label="`ลดจำนวน ${product.title}`"
        @click="decrement"
      >
        <Minus class="size-4" />
      </Button>

      <motion.span
        :key="quantity"
        :initial="{ scale: 0.85 }"
        :animate="{ scale: 1 }"
        class="w-8 text-center text-sm font-medium tabular-nums"
        aria-label="จำนวน"
      >
        {{ quantity }}
      </motion.span>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        class="rounded-full"
        :disabled="quantity >= MAX_QUANTITY"
        :aria-label="`เพิ่มจำนวน ${product.title}`"
        @click="increment"
      >
        <Plus class="size-4" />
      </Button>
    </div>

    <p class="w-24 text-right text-sm font-semibold tabular-nums">
      {{ formatPrice(lineTotal) }}
    </p>

    <Button
      type="button"
      variant="ghost"
      size="icon"
      class="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
      :aria-label="`ลบ ${product.title} ออกจากตะกร้า`"
      @click="requestRemove(product.id, product.title)"
    >
      <Trash2 class="size-4" />
    </Button>

    <Separator class="sm:hidden" />
  </div>

  <ConfirmRemoveCartItemDialog
    v-model:open="isRemoveDialogOpen"
    :item-title="product.title"
    @confirm="confirmRemove"
  />
</template>
