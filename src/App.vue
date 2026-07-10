<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import BackToTop from '@/components/layout/BackToTop.vue'
import { Toaster } from '@/components/ui/sonner'
import CartDrawer from '@/components/cart/CartDrawer.vue'
import { ref } from 'vue'

const isCartOpen = ref(false)
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader @open-cart="isCartOpen = true" />
    <main class="flex-1">
      <RouterView />
    </main>
    <BackToTop />
    <CartDrawer v-model:open="isCartOpen" />
    <Toaster rich-colors position="top-right" />
  </div>
</template>
