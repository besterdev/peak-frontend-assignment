<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import CartItemRow from '@/components/cart/CartItemRow.vue'
import CartSummary from '@/components/cart/CartSummary.vue'
import CartEmpty from '@/components/cart/CartEmpty.vue'
import { Skeleton } from '@/components/ui/skeleton'

const productsStore = useProductsStore()
const cartStore = useCartStore()

const cartItemsWithProducts = computed(() =>
  cartStore.items
    .map((item) => {
      const product = productsStore.getProductById(item.productId)
      if (!product) {
        return null
      }
      return { product, quantity: item.quantity }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null),
)

onMounted(() => {
  productsStore.fetchProductsOnce()
})
</script>

<template>
  <div class="container mx-auto max-w-6xl px-4 py-8 sm:py-10">
    <header class="mb-8 space-y-1">
      <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">ตะกร้าสินค้า</h1>
      <p class="text-sm text-muted-foreground">ตรวจสอบรายการสินค้าก่อนดำเนินการต่อ</p>
    </header>

    <CartEmpty v-if="cartStore.items.length === 0" />

    <template v-else>
      <div v-if="productsStore.loading" class="space-y-3">
        <Skeleton v-for="i in 3" :key="i" class="h-24 w-full rounded-2xl" />
      </div>

      <div v-else class="grid gap-6 lg:grid-cols-3">
        <section
          class="divide-y rounded-3xl bg-white px-4 nova-shadow sm:px-5 lg:col-span-2"
          aria-label="รายการสินค้าในตะกร้า"
        >
          <CartItemRow
            v-for="item in cartItemsWithProducts"
            :key="item.product.id"
            :product="item.product"
            :quantity="item.quantity"
          />
        </section>

        <aside class="lg:col-span-1" aria-label="สรุปยอดชำระ">
          <CartSummary />
        </aside>
      </div>
    </template>
  </div>
</template>
