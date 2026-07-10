<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { Lock } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import { useFormatPrice } from '@/composables/useFormatPrice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import ConfirmClearCartDialog from '@/components/cart/ConfirmClearCartDialog.vue'

const cartStore = useCartStore()
const { formatPrice } = useFormatPrice()
const isClearDialogOpen = ref(false)

const clearCart = () => {
  cartStore.clearCart()
  toast.success('ล้างตะกร้าเรียบร้อยแล้ว')
}
</script>

<template>
  <Card class="sticky top-24 rounded-3xl border-0 bg-white nova-shadow">
    <CardHeader>
      <CardTitle class="text-base font-semibold">สรุปคำสั่งซื้อ</CardTitle>
    </CardHeader>
    <CardContent class="space-y-3">
      <div class="flex justify-between text-sm">
        <span class="text-muted-foreground">จำนวนสินค้า</span>
        <span>{{ cartStore.totalItems }} ชิ้น</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-muted-foreground">Shipping</span>
        <span>Free</span>
      </div>
      <Separator />
      <div class="flex justify-between text-base font-semibold">
        <span>Total</span>
        <span>{{ formatPrice(cartStore.totalPrice) }}</span>
      </div>
    </CardContent>
    <CardFooter class="flex-col gap-2">
      <Button type="button" class="h-11 w-full rounded-full" disabled>
        <Lock class="size-4" />
        Checkout securely
      </Button>
      <Button
        type="button"
        variant="outline"
        class="w-full rounded-full"
        :disabled="cartStore.items.length === 0"
        @click="isClearDialogOpen = true"
      >
        ล้างตะกร้า
      </Button>
    </CardFooter>
  </Card>

  <ConfirmClearCartDialog
    v-model:open="isClearDialogOpen"
    @confirm="clearCart"
  />
</template>
