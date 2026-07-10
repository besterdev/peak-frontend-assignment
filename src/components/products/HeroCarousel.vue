<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-vue-next'
import { motion } from 'motion-v'
import { Button } from '@/components/ui/button'
import type { Product } from '@/types/product'

const props = defineProps<{
  products: Product[]
}>()

const activeSlide = ref(0)
const heroSlides = computed(() => props.products.slice(0, 3))
const activeHero = computed(() => heroSlides.value[activeSlide.value])
let autoplay: ReturnType<typeof setInterval> | undefined

const nextSlide = () => {
  if (heroSlides.value.length) {
    activeSlide.value = (activeSlide.value + 1) % heroSlides.value.length
  }
}

const previousSlide = () => {
  if (heroSlides.value.length) {
    activeSlide.value = activeSlide.value === 0 ? heroSlides.value.length - 1 : activeSlide.value - 1
  }
}

onMounted(() => {
  autoplay = setInterval(nextSlide, 6000)
})

onBeforeUnmount(() => clearInterval(autoplay))
</script>

<template>
  <section
    class="relative grid min-h-[520px] overflow-hidden rounded-[2rem] bg-[#eaf2ff] lg:grid-cols-[0.86fr_1.14fr]"
    aria-label="คอลเลกชันแนะนำ"
  >
    <div class="relative z-10 flex flex-col justify-between p-7 sm:p-12">
      <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#3696f5]"><Sparkles class="size-4" /> Objects with intention</div>
      <div class="space-y-5">
        <p class="text-sm font-medium text-[#3696f5]">01 — 03 / Field notes</p>
        <h1 class="max-w-md text-5xl leading-[0.96] tracking-[-0.03em] sm:text-6xl lg:text-7xl">The quiet joy of <em>good</em> things.</h1>
        <p class="max-w-sm text-sm leading-7 text-[#53658f] sm:text-base">A considered edit of objects made to stay, used every day and loved a little longer.</p>
        <Button as-child class="h-12 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"><a href="#product-catalog">Shop the edit <ArrowRight class="size-4" /></a></Button>
      </div>
      <div class="flex gap-2 pt-8">
        <Button type="button" variant="outline" size="icon" class="rounded-full border-[#a9c9f4] bg-transparent" aria-label="สไลด์ก่อนหน้า" @click="previousSlide"><ChevronLeft class="size-4" /></Button>
        <Button type="button" variant="outline" size="icon" class="rounded-full border-[#a9c9f4] bg-transparent" aria-label="สไลด์ถัดไป" @click="nextSlide"><ChevronRight class="size-4" /></Button>
      </div>
    </div>
    <div class="relative min-h-72 overflow-hidden bg-[#d8e9ff] lg:min-h-full">
      <Transition name="hero-fade" mode="out-in">
        <motion.div v-if="activeHero" :key="activeHero.id" :initial="{ opacity: 0, scale: 0.92, y: 16 }" :animate="{ opacity: 1, scale: 1, y: 0 }" class="absolute inset-0 flex items-center justify-center p-10 sm:p-16">
          <img :src="activeHero.photos[0]" :alt="activeHero.title" class="size-full object-contain drop-shadow-[0_30px_24px_rgba(37,54,34,.18)]" loading="eager" />
        </motion.div>
      </Transition>
      <div class="absolute right-6 bottom-6 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-primary backdrop-blur">{{ String(activeSlide + 1).padStart(2, '0') }}</div>
    </div>
  </section>
</template>
