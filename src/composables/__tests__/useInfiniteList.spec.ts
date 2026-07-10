import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useInfiniteList } from '@/composables/useInfiniteList'

describe('useInfiniteList', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows the first batch of items', () => {
    const items = ref(Array.from({ length: 50 }, (_, i) => i + 1))
    const { visibleItems, hasMore } = useInfiniteList(items, 10)

    expect(visibleItems.value).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(hasMore.value).toBe(true)
  })

  it('loads the next batch after the loading delay', async () => {
    vi.useFakeTimers()
    const items = ref(Array.from({ length: 25 }, (_, i) => i + 1))
    const { visibleItems, hasMore, loadMore } = useInfiniteList(items, 10)

    const firstLoad = loadMore()
    expect(visibleItems.value).toHaveLength(10)
    await vi.advanceTimersByTimeAsync(2000)
    await firstLoad
    expect(visibleItems.value).toHaveLength(20)
    expect(hasMore.value).toBe(true)

    const secondLoad = loadMore()
    await vi.advanceTimersByTimeAsync(2000)
    await secondLoad
    expect(visibleItems.value).toHaveLength(25)
    expect(hasMore.value).toBe(false)
  })

  it('resets visible count when the source list changes', async () => {
    vi.useFakeTimers()
    const items = ref(Array.from({ length: 30 }, (_, i) => i + 1))
    const { visibleItems, loadMore } = useInfiniteList(items, 10)

    const pendingLoad = loadMore()
    await vi.advanceTimersByTimeAsync(2000)
    await pendingLoad
    expect(visibleItems.value).toHaveLength(20)

    items.value = Array.from({ length: 12 }, (_, i) => i + 100)
    await nextTick()

    expect(visibleItems.value).toEqual([100, 101, 102, 103, 104, 105, 106, 107, 108, 109])
  })
})
