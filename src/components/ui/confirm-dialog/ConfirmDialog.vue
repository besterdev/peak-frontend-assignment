<script setup lang="ts">
import { X, Trash2 } from 'lucide-vue-next'
import type { Component } from 'vue'
import { nextTick, ref, useId, watch } from 'vue'
import { Button } from '@/components/ui/button'

const open = defineModel<boolean>('open', { required: true })
const dialogRef = ref<HTMLElement | null>(null)
const previousActiveElement = ref<HTMLElement | null>(null)
const titleId = useId()

const props = withDefaults(
  defineProps<{
    title: string
    description: string
    confirmLabel?: string
    icon?: Component
    iconClass?: string
    iconContainerClass?: string
    confirmClass?: string
  }>(),
  { confirmLabel: 'Confirm' },
)

const emit = defineEmits<{
  confirm: []
}>()

const confirm = () => {
  emit('confirm')
  open.value = false
}

const getFocusableElements = () =>
  Array.from(
    dialogRef.value?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ) ?? [],
  )

const onDialogKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    open.value = false
    return
  }

  if (event.key !== 'Tab') return

  const focusableElements = getFocusableElements()
  const first = focusableElements[0]
  const last = focusableElements[focusableElements.length - 1]

  if (!first || !last) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(open, async (isOpen) => {
  if (isOpen) {
    previousActiveElement.value = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    await nextTick()
    getFocusableElements()[0]?.focus()
  } else {
    previousActiveElement.value?.focus()
    previousActiveElement.value = null
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="confirm-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-100 flex items-center justify-center bg-[#1f3475]/35 px-5 backdrop-blur-sm"
        @click.self="open = false"
      >
        <section
          ref="dialogRef"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
          class="w-full max-w-sm rounded-2xl border border-border bg-white p-6 shadow-2xl"
          @keydown="onDialogKeydown"
        >
          <div class="relative">
            <div
              class="mx-auto flex size-14 items-center justify-center rounded-full"
              :class="props.iconContainerClass"
            >
              <component
                :is="props.icon ?? Trash2"
                class="size-6"
                :class="props.iconClass"
                aria-hidden="true"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              class="absolute -top-2 -right-2 rounded-full"
              data-dialog-close
              aria-label="ปิดหน้าต่าง"
              @click="open = false"
            >
              <X class="size-4" />
            </Button>
          </div>
          <h2
            :id="titleId"
            class="mt-5 text-center font-heading text-2xl text-foreground"
          >
            {{ props.title }}
          </h2>
          <p class="mt-2 text-sm leading-6 text-muted-foreground">{{ props.description }}</p>
          <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row">
            <Button type="button" variant="outline" class="w-full rounded-full sm:flex-1" @click="open = false"
              >Cancel</Button
            >
            <Button
              type="button"
              class="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 sm:flex-1"
              :class="props.confirmClass"
              @click="confirm"
            >
              {{ props.confirmLabel }}
            </Button>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.confirm-fade-enter-active,
.confirm-fade-leave-active {
  transition: opacity 180ms ease;
}

.confirm-fade-enter-from,
.confirm-fade-leave-to {
  opacity: 0;
}
</style>
