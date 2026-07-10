import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { STORAGE_KEYS, MAX_QUANTITY, MIN_QUANTITY } from '@/constants'
import type { CartItem } from '@/types/cart'
import { useProductsStore } from '@/stores/products'

const loadCartFromStorage = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as CartItem[]
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(
      (item) =>
        typeof item.productId === 'number' &&
        typeof item.quantity === 'number' &&
        item.quantity >= MIN_QUANTITY,
    )
  } catch {
    console.warn('ไม่สามารถโหลดข้อมูลตะกร้าจาก localStorage ได้')
    return []
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadCartFromStorage())

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  )

  const totalPrice = computed(() => {
    const productsStore = useProductsStore()
    return items.value.reduce((sum, item) => {
      const product = productsStore.getProductById(item.productId)
      return sum + (product?.price ?? 0) * item.quantity
    }, 0)
  })

  const getItemQuantity = (productId: number): number => {
    return items.value.find((item) => item.productId === productId)?.quantity ?? 0
  }

  const addItem = (productId: number, quantity: number) => {
    const safeQuantity = Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, quantity))
    const existing = items.value.find((item) => item.productId === productId)

    if (existing) {
      existing.quantity = Math.min(MAX_QUANTITY, existing.quantity + safeQuantity)
      return
    }

    items.value.push({ productId, quantity: safeQuantity })
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    const safeQuantity = Math.min(MAX_QUANTITY, quantity)
    const existing = items.value.find((item) => item.productId === productId)

    if (existing) {
      existing.quantity = safeQuantity
    }
  }

  const removeItem = (productId: number) => {
    items.value = items.value.filter((item) => item.productId !== productId)
  }

  const clearCart = () => {
    items.value = []
  }

  watch(
    items,
    (newItems) => {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(newItems))
    },
    { deep: true },
  )

  return {
    items,
    totalItems,
    totalPrice,
    getItemQuantity,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  }
})
