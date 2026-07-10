import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchProducts } from '@/api/products'
import type { Product } from '@/types/product'
import { getUniqueTags } from '@/lib/product-utils'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const hasFetched = ref(false)

  const allTags = computed(() => getUniqueTags(products.value))

  const fetchProductsOnce = async () => {
    if (loading.value || hasFetched.value) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const data = await fetchProducts()
      products.value = data.products
      hasFetched.value = true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'
    } finally {
      loading.value = false
    }
  }

  const getProductById = (id: number): Product | undefined => {
    return products.value.find((product) => product.id === id)
  }

  const resetError = () => {
    error.value = null
  }

  return {
    products,
    loading,
    error,
    hasFetched,
    allTags,
    fetchProductsOnce,
    getProductById,
    resetError,
  }
})
