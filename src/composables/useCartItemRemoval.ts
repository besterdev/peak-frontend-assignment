import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useCartStore } from '@/stores/cart'

export const useCartItemRemoval = () => {
  const cartStore = useCartStore()
  const isRemoveDialogOpen = ref(false)
  const selectedItem = ref<{ productId: number; title: string } | null>(null)

  const requestRemove = (productId: number, title: string) => {
    selectedItem.value = { productId, title }
    isRemoveDialogOpen.value = true
  }

  const confirmRemove = () => {
    if (!selectedItem.value) return

    cartStore.removeItem(selectedItem.value.productId)
    toast.success('ลบสินค้าออกจากตะกร้าแล้ว', {
      description: selectedItem.value.title,
    })
    selectedItem.value = null
  }

  return {
    isRemoveDialogOpen,
    selectedItem,
    requestRemove,
    confirmRemove,
  }
}
