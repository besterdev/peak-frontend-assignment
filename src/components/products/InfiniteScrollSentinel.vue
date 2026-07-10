<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { Skeleton } from '@/components/ui/skeleton'

const props = defineProps<{
  hasMore: boolean
  loading: boolean
}>()

const emit = defineEmits<{
  loadMore: []
}>()

const sentinelRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null
let wasIntersecting = false

const observe = () => {
  observer?.disconnect()

  if (!sentinelRef.value || !props.hasMore || props.loading) {
    if (!props.hasMore) wasIntersecting = false
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (!entry) return

      if (!entry.isIntersecting) {
        wasIntersecting = false
        return
      }

      if (wasIntersecting) return

      wasIntersecting = true
      emit('loadMore')
    },
    { rootMargin: '200px 0px' },
  )

  observer.observe(sentinelRef.value)
}

onMounted(observe)

watch(
  () => [props.hasMore, props.loading],
  () => {
    observe()
  },
)

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div
    v-if="hasMore"
    ref="sentinelRef"
    class="flex flex-col items-center gap-3 py-6"
    :aria-busy="loading"
    :aria-label="loading ? 'กำลังโหลดสินค้าเพิ่ม' : 'เลื่อนเพื่อโหลดสินค้าเพิ่ม'"
  >
    <div v-if="loading" class="grid w-full grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      <Skeleton v-for="i in 4" :key="i" class="h-72 rounded-2xl" />
    </div>
    <p class="text-sm text-muted-foreground">{{ loading ? 'กำลังโหลดสินค้าเพิ่ม...' : 'เลื่อนเพื่อโหลดเพิ่ม...' }}</p>
  </div>
</template>
