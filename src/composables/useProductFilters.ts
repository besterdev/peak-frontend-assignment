import { computed, ref, watch, type Ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { DEBOUNCE_MS } from '@/constants'
import type { Product } from '@/types/product'
import { getUniqueTags } from '@/lib/product-utils'

export const useProductFilters = (products: Ref<Product[]>) => {
  const searchQuery = ref('')
  const debouncedSearch = ref('')
  const selectedTags = ref<string[]>([])

  const updateDebouncedSearch = useDebounceFn((value: string) => {
    debouncedSearch.value = value
  }, DEBOUNCE_MS)

  watch(searchQuery, (value) => {
    updateDebouncedSearch(value)
  })

  const allTags = computed(() => getUniqueTags(products.value))

  const filteredProducts = computed(() => {
    const query = debouncedSearch.value.trim().toLowerCase()

    return products.value.filter((product) => {
      const matchesSearch =
        query.length === 0 || product.title.toLowerCase().includes(query)

      // AND logic: product must include every selected tag
      const matchesTags =
        selectedTags.value.length === 0 ||
        selectedTags.value.every((tag) => product.tags.includes(tag))

      return matchesSearch && matchesTags
    })
  })

  const toggleTag = (tag: string) => {
    if (selectedTags.value.includes(tag)) {
      selectedTags.value = selectedTags.value.filter((t) => t !== tag)
    } else {
      selectedTags.value = [...selectedTags.value, tag]
    }
  }

  const removeSearchFilter = () => {
    searchQuery.value = ''
    debouncedSearch.value = ''
  }

  const removeTagFilter = (tag: string) => {
    selectedTags.value = selectedTags.value.filter((t) => t !== tag)
  }

  const clearAllFilters = () => {
    searchQuery.value = ''
    debouncedSearch.value = ''
    selectedTags.value = []
  }

  return {
    searchQuery,
    debouncedSearch,
    selectedTags,
    allTags,
    filteredProducts,
    toggleTag,
    removeSearchFilter,
    removeTagFilter,
    clearAllFilters,
  }
}
