<script setup lang="ts">
import { computed } from 'vue'
import { useWindowScroll } from '@vueuse/core'
import { motion } from 'motion-v'
import { ArrowUp } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const { y } = useWindowScroll()
const isVisible = computed(() => y.value > 400)

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <motion.div
    v-if="isVisible"
    :initial="{ opacity: 0, y: 16 }"
    :animate="{ opacity: 1, y: 0 }"
    :exit="{ opacity: 0, y: 16 }"
    :transition="{ type: 'spring', stiffness: 400, damping: 28 }"
    class="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6"
  >
    <Button
      type="button"
      size="icon"
      class="size-11 rounded-full nova-shadow-lg"
      aria-label="กลับขึ้นด้านบน"
      @click="scrollToTop"
    >
      <ArrowUp class="size-5" />
    </Button>
  </motion.div>
</template>
