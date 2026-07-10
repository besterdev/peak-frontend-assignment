import { beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useCartStore } from '@/stores/cart'
import { useProductsStore } from '@/stores/products'
import { STORAGE_KEYS } from '@/constants'

describe('useCartStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('adds items and merges quantities', () => {
    const cartStore = useCartStore()

    cartStore.addItem(1, 2)
    cartStore.addItem(1, 3)

    expect(cartStore.items).toEqual([{ productId: 1, quantity: 5 }])
    expect(cartStore.totalItems).toBe(5)
  })

  it('updates and removes items', () => {
    const cartStore = useCartStore()

    cartStore.addItem(1, 2)
    cartStore.updateQuantity(1, 4)
    expect(cartStore.getItemQuantity(1)).toBe(4)

    cartStore.removeItem(1)
    expect(cartStore.items).toHaveLength(0)
  })

  it('clears the cart', () => {
    const cartStore = useCartStore()

    cartStore.addItem(1, 1)
    cartStore.addItem(2, 2)
    cartStore.clearCart()

    expect(cartStore.items).toHaveLength(0)
    expect(cartStore.totalItems).toBe(0)
  })

  it('calculates total price from products store', async () => {
    const productsStore = useProductsStore()
    productsStore.$patch({
      products: [
        {
          id: 1,
          title: 'Product 1',
          description: 'Desc',
          photos: [],
          price: 1000,
          tags: [],
        },
        {
          id: 2,
          title: 'Product 2',
          description: 'Desc',
          photos: [],
          price: 500,
          tags: [],
        },
      ],
    })

    const cartStore = useCartStore()
    cartStore.addItem(1, 2)
    cartStore.addItem(2, 1)

    expect(cartStore.totalPrice).toBe(2500)
  })

  it('persists cart to localStorage', async () => {
    const cartStore = useCartStore()
    cartStore.addItem(3, 2)
    await nextTick()

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) ?? '[]')
    expect(stored).toEqual([{ productId: 3, quantity: 2 }])
  })

  it('hydrates cart from localStorage on init', () => {
    localStorage.setItem(
      STORAGE_KEYS.CART,
      JSON.stringify([{ productId: 5, quantity: 1 }]),
    )

    setActivePinia(createPinia())
    const cartStore = useCartStore()

    expect(cartStore.items).toEqual([{ productId: 5, quantity: 1 }])
  })
})
