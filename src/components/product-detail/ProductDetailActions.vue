<script setup lang="ts">
import { ref } from 'vue'
import { motion } from 'motion-v'
import { ShoppingBag } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useCartStore } from '@/stores/cart'
import { Button } from '@/components/ui/button'
import QuantitySelector from '@/components/product-detail/QuantitySelector.vue'

const props = defineProps<{
  productId: number
}>()

const cartStore = useCartStore()
const quantity = ref(1)

const addToCart = () => {
  cartStore.addItem(props.productId, quantity.value)
  toast.success('เพิ่มลงตะกร้าแล้ว', {
    description: `จำนวน ${quantity.value} ชิ้น`,
  })
  quantity.value = 1
}
</script>

<template>
  <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
    <QuantitySelector v-model="quantity" />
    <motion.div
      :while-tap="{ scale: 0.98 }"
      :transition="{ type: 'spring', stiffness: 500, damping: 20 }"
      class="flex-1"
    >
      <Button type="button" size="lg" class="h-12 w-full rounded-full px-6 sm:w-auto" @click="addToCart">
        <ShoppingBag class="size-4" />
        Add to cart
      </Button>
    </motion.div>
  </div>
</template>
