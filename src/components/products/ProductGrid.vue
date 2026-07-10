<script setup lang="ts">
import type { Product } from '@/types/product'
import ProductCard from '@/components/products/ProductCard.vue'

defineProps<{
  products: Product[]
}>()
</script>

<template>
  <div
    class="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-3 xl:grid-cols-4"
    role="list"
    aria-label="รายการสินค้า"
  >
    <article
      v-for="product in products"
      :key="product.id"
      role="listitem"
      class="h-full"
    >
      <ProductCard :product="product" />
    </article>
  </div>
</template>
