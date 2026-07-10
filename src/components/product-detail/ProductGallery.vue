<script setup lang="ts">
import { ref, watch } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const props = defineProps<{
  photos: string[]
  title: string
}>()

const selectedIndex = ref(0)

watch(
  () => props.photos,
  () => {
    selectedIndex.value = 0
  },
)

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f2" width="400" height="300"/%3E%3Ctext fill="%23a1a1aa" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo image%3C/text%3E%3C/svg%3E'

const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = PLACEHOLDER_IMAGE
}

const selectPhoto = (index: number) => {
  selectedIndex.value = index
}

const previousPhoto = () => {
  selectedIndex.value =
    selectedIndex.value === 0 ? props.photos.length - 1 : selectedIndex.value - 1
}

const nextPhoto = () => {
  selectedIndex.value =
    selectedIndex.value === props.photos.length - 1 ? 0 : selectedIndex.value + 1
}

const onKeydown = (event: KeyboardEvent) => {
  if (props.photos.length <= 1) {
    return
  }

  if (event.key === 'ArrowLeft') {
    previousPhoto()
  } else if (event.key === 'ArrowRight') {
    nextPhoto()
  }
}
</script>

<template>
  <div class="space-y-3" @keydown="onKeydown">
    <div class="relative aspect-square overflow-hidden rounded-3xl bg-secondary">
      <img
        :src="photos[selectedIndex]"
        :alt="`${title} - รูปที่ ${selectedIndex + 1}`"
        class="size-full object-contain p-8"
        decoding="async"
        @error="onImageError"
      />

      <template v-if="photos.length > 1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          class="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-white"
          aria-label="รูปก่อนหน้า"
          @click="previousPhoto"
        >
          <ChevronLeft class="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          class="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-white"
          aria-label="รูปถัดไป"
          @click="nextPhoto"
        >
          <ChevronRight class="size-4" />
        </Button>
      </template>
    </div>

    <div
      v-if="photos.length > 1"
      class="flex gap-2 overflow-x-auto pb-1"
      role="tablist"
      aria-label="เลือกรูปสินค้า"
    >
      <button
        v-for="(photo, index) in photos"
        :key="`${photo}-${index}`"
        type="button"
        role="tab"
        :aria-selected="index === selectedIndex"
        :aria-label="`รูปที่ ${index + 1}`"
        :class="
          cn(
            'size-16 shrink-0 overflow-hidden rounded-2xl border-2 bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            index === selectedIndex
              ? 'border-foreground'
              : 'border-transparent opacity-70 hover:opacity-100',
          )
        "
        @click="selectPhoto(index)"
      >
        <img
          :src="photo"
          :alt="`${title} thumbnail ${index + 1}`"
          loading="lazy"
          decoding="async"
          class="size-full object-contain p-2"
          @error="onImageError"
        />
      </button>
    </div>
  </div>
</template>
