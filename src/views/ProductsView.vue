<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '@/stores/products'
import { useProductFilters } from '@/composables/useProductFilters'
import { useInfiniteList } from '@/composables/useInfiniteList'
import ProductSearch from '@/components/products/ProductSearch.vue'
import TagFilterBar from '@/components/products/TagFilterBar.vue'
import ActiveFilterPills from '@/components/products/ActiveFilterPills.vue'
import ProductListFeedback from '@/components/products/ProductListFeedback.vue'
import ProductListEmpty from '@/components/products/ProductListEmpty.vue'
import ProductGrid from '@/components/products/ProductGrid.vue'
import InfiniteScrollSentinel from '@/components/products/InfiniteScrollSentinel.vue'
import HeroCarousel from '@/components/products/HeroCarousel.vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { INFINITE_SCROLL_DELAY_MS, PAGE_SIZE } from '@/constants'

const productsStore = useProductsStore()
const { products, loading, error } = storeToRefs(productsStore)

const {
  searchQuery,
  selectedTags,
  filteredProducts,
  toggleTag,
  removeSearchFilter,
  removeTagFilter,
  allTags,
  clearAllFilters,
} = useProductFilters(products)

const {
  visibleItems,
  hasMore,
  loading: loadingMore,
  loadMore,
} = useInfiniteList(filteredProducts, PAGE_SIZE, INFINITE_SCROLL_DELAY_MS)

const showEmpty = computed(
  () => !loading.value && !error.value && filteredProducts.value.length === 0,
)

const showResults = computed(
  () => !loading.value && !error.value && filteredProducts.value.length > 0,
)

onMounted(() => {
  productsStore.fetchProductsOnce()
})
</script>

<template>
  <div class="container mx-auto max-w-6xl space-y-8 px-4 py-8 sm:py-10">
    <HeroCarousel :products="products" />

    <div id="product-catalog" class="space-y-6">
      <header class="space-y-1">
        <div class="flex items-end justify-between gap-4">
          <div>
            <p class="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
              Curated catalog
            </p>
            <h2 class="text-4xl tracking-tight sm:text-5xl">All essentials</h2>
          </div>
          <span class="hidden pb-1 text-sm text-muted-foreground sm:block"
            >{{ filteredProducts.length }} pieces</span
          >
        </div>
      </header>

      <div v-if="loading" class="space-y-6" aria-busy="true" aria-label="กำลังโหลดสินค้า">
        <Skeleton class="h-11 w-full max-w-md rounded-full" />
        <div class="flex gap-2">
          <Skeleton v-for="i in 4" :key="i" class="h-10 w-24 rounded-full" />
        </div>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Skeleton v-for="i in 8" :key="i" class="h-80 rounded-2xl" />
        </div>
      </div>

      <Alert
        v-else-if="error"
        variant="destructive"
        class="flex flex-col items-center gap-4 py-8 text-center"
      >
        <div class="w-40 overflow-hidden rounded-3xl bg-white p-2 sm:w-48">
          <img
            src="/empty-search.webp"
            alt="ไม่สามารถโหลดสินค้าได้"
            class="w-full object-contain"
            loading="eager"
            decoding="async"
          />
        </div>
        <div class="space-y-1">
          <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
          <AlertDescription>{{ error }}</AlertDescription>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          @click="productsStore.fetchProductsOnce()"
        >
          ลองใหม่
        </Button>
      </Alert>

      <template v-else>
        <section class="space-y-4" aria-label="ค้นหาและกรองสินค้า">
          <ProductSearch v-model="searchQuery" />
          <TagFilterBar :tags="allTags" :selected-tags="selectedTags" @toggle="toggleTag" />
          <ActiveFilterPills
            :search-query="searchQuery"
            :selected-tags="selectedTags"
            @remove-search="removeSearchFilter"
            @remove-tag="removeTagFilter"
            @clear-all="clearAllFilters"
          />
        </section>

        <ProductListFeedback :count="filteredProducts.length" />

        <ProductListEmpty v-if="showEmpty" @clear-filters="clearAllFilters" />

        <template v-if="showResults">
          <ProductGrid :products="visibleItems" />
          <InfiniteScrollSentinel
            :has-more="hasMore"
            :loading="loadingMore"
            @load-more="loadMore"
          />
        </template>
      </template>
    </div>
  </div>
</template>
