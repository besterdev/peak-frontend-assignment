<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import ConfirmDialog from '@/components/ui/confirm-dialog/ConfirmDialog.vue'

const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  confirm: []
}>()
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    title="ล้างตะกร้าสินค้า?"
    description="สินค้าทั้งหมดจะถูกนำออกจากตะกร้า และไม่สามารถย้อนกลับได้"
    confirm-label="ล้างตะกร้า"
    :icon="Trash2"
    icon-class="text-red-500"
    icon-container-class="bg-red-500/10"
    confirm-class="bg-destructive text-white hover:bg-destructive/90"
    @confirm="emit('confirm')"
  />
</template>
