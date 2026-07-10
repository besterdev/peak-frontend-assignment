import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import ProductCard from '@/components/products/ProductCard.vue'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types/product'

vi.mock('vue-sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}))

const product: Product = {
  id: 1,
  title: 'Product Name 1',
  description: 'Description',
  photos: ['https://example.com/photo.png'],
  price: 1000,
  tags: ['tag1', 'tag2'],
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/products/:id', component: { template: '<div />' } },
  ],
})

describe('ProductCard', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('renders product title, price, and tags', async () => {
    const wrapper = mount(ProductCard, {
      props: { product },
      global: {
        plugins: [router],
      },
    })

    await router.isReady()

    expect(wrapper.text()).toContain('Product Name 1')
    expect(wrapper.text()).toContain('tag1')
    expect(wrapper.text()).toContain('tag2')
    expect(wrapper.find('img').attributes('alt')).toBe('Product Name 1')
    expect(wrapper.find('img').attributes('loading')).toBe('lazy')
  })

  it('adds one item to cart from the product card action', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(ProductCard, {
      props: { product },
      global: {
        plugins: [router, pinia],
      },
    })

    await router.isReady()
    await wrapper.get('[aria-label="เพิ่ม Product Name 1 ลงตะกร้า"]').trigger('click')

    const cartStore = useCartStore()
    expect(cartStore.getItemQuantity(product.id)).toBe(1)
  })
})
