import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useProductFilters } from '@/composables/useProductFilters'
import type { Product } from '@/types/product'

const products = ref<Product[]>([
  {
    id: 1,
    title: 'Red Apple',
    description: 'Desc',
    photos: [],
    price: 100,
    tags: ['tag1', 'tag2'],
  },
  {
    id: 2,
    title: 'Green Pear',
    description: 'Desc',
    photos: [],
    price: 200,
    tags: ['tag2', 'tag3'],
  },
  {
    id: 3,
    title: 'Yellow Banana',
    description: 'Desc',
    photos: [],
    price: 300,
    tags: ['tag1'],
  },
])

describe('useProductFilters', () => {
  it('filters by debounced search query', async () => {
    vi.useFakeTimers()

    const { searchQuery, filteredProducts } = useProductFilters(products)

    searchQuery.value = 'apple'
    await nextTick()
    await vi.runAllTimersAsync()

    expect(filteredProducts.value).toHaveLength(1)
    expect(filteredProducts.value[0]?.title).toBe('Red Apple')

    vi.useRealTimers()
  })

  it('filters by multiple tags with AND logic', () => {
    const { selectedTags, filteredProducts } = useProductFilters(products)

    selectedTags.value = ['tag1', 'tag2']

    expect(filteredProducts.value).toHaveLength(1)
    expect(filteredProducts.value[0]?.id).toBe(1)
  })

  it('combines search and tag filters', async () => {
    vi.useFakeTimers()

    const { searchQuery, selectedTags, filteredProducts } = useProductFilters(products)

    selectedTags.value = ['tag1']
    searchQuery.value = 'banana'
    await nextTick()
    await vi.runAllTimersAsync()

    expect(filteredProducts.value).toHaveLength(1)
    expect(filteredProducts.value[0]?.id).toBe(3)

    vi.useRealTimers()
  })

  it('clears all filters', async () => {
    vi.useFakeTimers()

    const { searchQuery, selectedTags, clearAllFilters, filteredProducts } =
      useProductFilters(products)

    searchQuery.value = 'apple'
    selectedTags.value = ['tag1']
    await nextTick()
    await vi.runAllTimersAsync()

    clearAllFilters()
    await nextTick()
    await vi.runAllTimersAsync()

    expect(filteredProducts.value).toHaveLength(3)
    expect(selectedTags.value).toHaveLength(0)

    vi.useRealTimers()
  })
})
