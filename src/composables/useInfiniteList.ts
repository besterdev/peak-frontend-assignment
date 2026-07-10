import { computed, ref, watch, type Ref } from 'vue'
import { INFINITE_SCROLL_DELAY_MS, PAGE_SIZE } from '@/constants'

export const useInfiniteList = <T>(
  items: Ref<T[]>,
  batchSize = PAGE_SIZE,
  loadingDelayMs = INFINITE_SCROLL_DELAY_MS,
) => {
  const visibleCount = ref(batchSize)
  const loading = ref(false)

  const visibleItems = computed(() => items.value.slice(0, visibleCount.value))

  const hasMore = computed(() => visibleCount.value < items.value.length)

  watch(items, () => {
    visibleCount.value = batchSize
  })

  const loadMore = async () => {
    if (!hasMore.value || loading.value) {
      return
    }

    loading.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, loadingDelayMs))
      visibleCount.value = Math.min(items.value.length, visibleCount.value + batchSize)
    } finally {
      loading.value = false
    }
  }

  return {
    visibleItems,
    hasMore,
    loading,
    loadMore,
  }
}
