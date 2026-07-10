<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { X, ArrowRight, Minus, Plus, Trash2, ShoppingBag } from 'lucide-vue-next'
import { motion } from 'motion-v'
import { useCartStore } from '@/stores/cart'
import { useProductsStore } from '@/stores/products'
import { useFormatPrice } from '@/composables/useFormatPrice'
import { Button } from '@/components/ui/button'
import { MAX_QUANTITY, MIN_QUANTITY } from '@/constants'
import ConfirmRemoveCartItemDialog from '@/components/cart/ConfirmRemoveCartItemDialog.vue'
import { useCartItemRemoval } from '@/composables/useCartItemRemoval'

const open = defineModel<boolean>('open', { required: true })
const cartStore = useCartStore()
const productsStore = useProductsStore()
const { formatPrice } = useFormatPrice()
const { isRemoveDialogOpen, selectedItem, requestRemove, confirmRemove } = useCartItemRemoval()

const cartItems = computed(() => cartStore.items.map((item) => ({
  ...item,
  product: productsStore.getProductById(item.productId),
})).filter((item) => item.product))

onMounted(() => productsStore.fetchProductsOnce())

</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="fixed inset-0 z-[80] bg-black/30 backdrop-blur-[2px]" @click="open = false" />
    </Transition>
    <Transition name="drawer">
      <aside v-if="open" class="fixed top-0 right-0 z-[90] flex h-dvh w-full max-w-md flex-col bg-white shadow-2xl" aria-label="ตะกร้าสินค้า">
        <header class="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Your selection</p>
            <h2 class="font-heading text-2xl">Cart <span class="font-sans text-sm text-muted-foreground">({{ cartStore.totalItems }})</span></h2>
          </div>
          <Button variant="ghost" size="icon" class="rounded-full" aria-label="ปิดตะกร้า" @click="open = false"><X class="size-5" /></Button>
        </header>

        <div v-if="cartItems.length" class="flex-1 overflow-y-auto px-6 py-4">
          <motion.div v-for="item in cartItems" :key="item.productId" :initial="{ opacity: 0, x: 16 }" :animate="{ opacity: 1, x: 0 }" class="flex gap-4 border-b border-border py-5 first:pt-2">
            <img :src="item.product!.photos[0]" :alt="item.product!.title" class="size-24 rounded-md bg-secondary object-contain p-2" />
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-3">
                <h3 class="line-clamp-2 text-sm font-semibold leading-snug">{{ item.product!.title }}</h3>
                <button type="button" class="text-muted-foreground hover:text-foreground" :aria-label="`ลบ ${item.product!.title}`" @click="requestRemove(item.productId, item.product!.title)"><Trash2 class="size-4" /></button>
              </div>
              <p class="mt-1 text-sm text-muted-foreground">{{ formatPrice(item.product!.price) }}</p>
              <div class="mt-4 flex items-center justify-between">
                <div class="flex items-center gap-1 rounded-full bg-secondary p-1">
                  <button type="button" class="flex size-7 items-center justify-center rounded-full hover:bg-white disabled:opacity-40" :disabled="item.quantity <= MIN_QUANTITY" aria-label="ลดจำนวน" @click="cartStore.updateQuantity(item.productId, item.quantity - 1)"><Minus class="size-3" /></button>
                  <span class="w-6 text-center text-xs tabular-nums">{{ item.quantity }}</span>
                  <button type="button" class="flex size-7 items-center justify-center rounded-full hover:bg-white disabled:opacity-40" :disabled="item.quantity >= MAX_QUANTITY" aria-label="เพิ่มจำนวน" @click="cartStore.updateQuantity(item.productId, item.quantity + 1)"><Plus class="size-3" /></button>
                </div>
                <span class="text-sm font-semibold">{{ formatPrice(item.product!.price * item.quantity) }}</span>
              </div>
            </div>
          </motion.div>
        </div>
        <div v-else class="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div class="mb-4 flex size-14 items-center justify-center rounded-full bg-secondary"><ShoppingBag class="size-6 text-muted-foreground" /></div>
          <h3 class="font-heading text-2xl">Your cart is quiet.</h3>
          <p class="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">Find something good for your everyday rituals.</p>
          <Button class="mt-6 rounded-full" @click="open = false">Start browsing <ArrowRight class="size-4" /></Button>
        </div>

        <footer v-if="cartItems.length" class="border-t border-border bg-[#eaf2ff] px-6 py-6">
          <div class="mb-4 flex items-center justify-between"><span class="text-sm text-muted-foreground">Subtotal</span><span class="text-lg font-semibold">{{ formatPrice(cartStore.totalPrice) }}</span></div>
          <p class="mb-4 text-xs text-muted-foreground">Shipping calculated at checkout · Free returns within 30 days</p>
          <RouterLink to="/cart" class="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-semibold text-background transition-transform hover:scale-[1.01]" @click="open = false">View full cart <ArrowRight class="size-4" /></RouterLink>
        </footer>
      </aside>
    </Transition>
    <ConfirmRemoveCartItemDialog
      v-if="selectedItem"
      v-model:open="isRemoveDialogOpen"
      :item-title="selectedItem.title"
      @confirm="confirmRemove"
    />
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.drawer-enter-active, .drawer-leave-active { transition: transform .35s cubic-bezier(.22,1,.36,1); }
.drawer-enter-from, .drawer-leave-to { transform: translateX(100%); }
</style>
