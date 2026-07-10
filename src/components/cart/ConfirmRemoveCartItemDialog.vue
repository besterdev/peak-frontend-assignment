<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import ConfirmDialog from '@/components/ui/confirm-dialog/ConfirmDialog.vue'

const props = defineProps<{
  itemTitle: string
}>()

const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  confirm: []
}>()
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    title="นำสินค้าออกจากตะกร้า?"
    :description="`ต้องการนำ ${props.itemTitle} ออกจากตะกร้าหรือไม่`"
    confirm-label="นำออก"
    :icon="Trash2"
    icon-class="text-white"
    icon-container-class="bg-destructive"
    confirm-class="bg-destructive text-white hover:bg-destructive/90"
    @confirm="emit('confirm')"
  />
</template>
