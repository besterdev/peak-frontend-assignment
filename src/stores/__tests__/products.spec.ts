import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useProductsStore } from '@/stores/products'
import type { Product } from '@/types/product'

vi.mock('@/api/products', () => ({
  fetchProducts: vi.fn(),
}))

import { fetchProducts } from '@/api/products'

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Product Name 1',
    description: 'Description 1',
    photos: ['https://example.com/1.png'],
    price: 1000,
    tags: ['tag1', 'tag2'],
  },
  {
    id: 2,
    title: 'Product Name 2',
    description: 'Description 2',
    photos: ['https://example.com/2.png'],
    price: 1000,
    tags: ['tag2', 'tag3'],
  },
]

describe('useProductsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('fetches products once and caches them', async () => {
    vi.mocked(fetchProducts).mockResolvedValue({ products: mockProducts })

    const store = useProductsStore()

    await store.fetchProductsOnce()
    await store.fetchProductsOnce()

    expect(fetchProducts).toHaveBeenCalledTimes(1)
    expect(store.products).toHaveLength(2)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('sets error state when fetch fails', async () => {
    vi.mocked(fetchProducts).mockRejectedValue(new Error('Network error'))

    const store = useProductsStore()
    await store.fetchProductsOnce()

    expect(store.error).toBe('Network error')
    expect(store.products).toHaveLength(0)
  })

  it('caches a successful empty response', async () => {
    vi.mocked(fetchProducts).mockResolvedValue({ products: [] })

    const store = useProductsStore()

    await store.fetchProductsOnce()
    await store.fetchProductsOnce()

    expect(fetchProducts).toHaveBeenCalledTimes(1)
    expect(store.products).toHaveLength(0)
    expect(store.hasFetched).toBe(true)
  })

  it('returns product by id from cache', async () => {
    vi.mocked(fetchProducts).mockResolvedValue({ products: mockProducts })

    const store = useProductsStore()
    await store.fetchProductsOnce()

    expect(store.getProductById(1)?.title).toBe('Product Name 1')
    expect(store.getProductById(999)).toBeUndefined()
  })

  it('derives unique sorted tags', async () => {
    vi.mocked(fetchProducts).mockResolvedValue({ products: mockProducts })

    const store = useProductsStore()
    await store.fetchProductsOnce()

    expect(store.allTags).toEqual(['tag1', 'tag2', 'tag3'])
  })
})
