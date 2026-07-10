<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Package, RefreshCcw, Truck } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/products'
import { useFormatPrice } from '@/composables/useFormatPrice'
import ProductGallery from '@/components/product-detail/ProductGallery.vue'
import ProductDetailActions from '@/components/product-detail/ProductDetailActions.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const { formatPrice } = useFormatPrice()

const productId = computed(() => Number(route.params.id))

const product = computed(() => productsStore.getProductById(productId.value))

const isLoading = ref(true)

onMounted(async () => {
  await productsStore.fetchProductsOnce()
  isLoading.value = false

  if (!product.value) {
    return
  }
})

const goBack = () => {
  router.push('/products')
}
</script>

<template>
  <div class="container mx-auto max-w-6xl px-4 py-8 sm:py-10">
    <div v-if="isLoading || productsStore.loading" class="space-y-6">
      <Skeleton class="h-5 w-40" />
      <div class="grid gap-8 lg:grid-cols-2">
        <Skeleton class="aspect-square rounded-3xl" />
        <div class="space-y-4">
          <Skeleton class="h-8 w-3/4" />
          <Skeleton class="h-6 w-24" />
          <Skeleton class="h-24 w-full" />
        </div>
      </div>
    </div>

    <div v-else-if="!product" class="flex flex-col items-center gap-4 rounded-3xl bg-white py-16 text-center nova-shadow">
      <h1 class="text-xl font-semibold">ไม่พบสินค้า</h1>
      <p class="text-sm text-muted-foreground">สินค้าที่คุณค้นหาอาจถูกลบหรือไม่มีอยู่ในระบบ</p>
      <Button type="button" variant="outline" size="sm" class="rounded-full" @click="goBack">
        <ArrowLeft class="size-4" />
        กลับไปรายการสินค้า
      </Button>
    </div>

    <template v-else>
      <nav class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink as-child>
                <RouterLink to="/products">สินค้า</RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{{ product.title }}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button type="button" variant="outline" size="sm" class="rounded-full" @click="goBack">
          <ArrowLeft class="size-4" />
          กลับไปรายการสินค้า
        </Button>
      </nav>

      <div class="grid gap-8 rounded-3xl bg-white p-4 nova-shadow sm:p-6 lg:grid-cols-2 lg:gap-10 lg:p-8">
        <ProductGallery :photos="product.photos" :title="product.title" />

        <article class="flex flex-col justify-center space-y-6">
          <header class="space-y-3">
            <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">
              {{ product.title }}
            </h1>
            <p class="text-2xl font-semibold">
              {{ formatPrice(product.price) }}
            </p>
            <div class="flex flex-wrap gap-1.5">
              <Badge
                v-for="tag in product.tags"
                :key="tag"
                variant="secondary"
                class="rounded-full px-3 py-1 font-normal text-muted-foreground"
              >
                {{ tag }}
              </Badge>
            </div>
          </header>

          <Separator />

          <section>
            <h2 class="mb-2 text-sm font-medium">รายละเอียดสินค้า</h2>
            <p class="text-sm leading-7 text-muted-foreground">
              {{ product.description }}
            </p>
          </section>

          <Separator />

          <ProductDetailActions :product-id="product.id" />

          <div class="grid gap-3 sm:grid-cols-3">
            <div class="flex items-center gap-2 rounded-2xl bg-secondary px-3 py-3 text-xs text-muted-foreground">
              <Truck class="size-4 shrink-0" aria-hidden="true" />
              Free shipping
            </div>
            <div class="flex items-center gap-2 rounded-2xl bg-secondary px-3 py-3 text-xs text-muted-foreground">
              <RefreshCcw class="size-4 shrink-0" aria-hidden="true" />
              30-day returns
            </div>
            <div class="flex items-center gap-2 rounded-2xl bg-secondary px-3 py-3 text-xs text-muted-foreground">
              <Package class="size-4 shrink-0" aria-hidden="true" />
              2-year warranty
            </div>
          </div>
        </article>
      </div>
    </template>
  </div>
</template>
