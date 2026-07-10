<script setup lang="ts">
import { ref, watch } from 'vue'
import { motion } from 'motion-v'
import { Minus, Plus } from 'lucide-vue-next'
import { MAX_QUANTITY, MIN_QUANTITY } from '@/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const model = defineModel<number>({ required: true })

const inputValue = ref(String(model.value))

watch(model, (value) => {
  inputValue.value = String(value)
})

const decrement = () => {
  if (model.value > MIN_QUANTITY) {
    model.value -= 1
  }
}

const increment = () => {
  if (model.value < MAX_QUANTITY) {
    model.value += 1
  }
}

const onInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const parsed = Number.parseInt(target.value, 10)

  if (Number.isNaN(parsed)) {
    inputValue.value = String(model.value)
    return
  }

  model.value = Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, parsed))
}
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="text-sm text-muted-foreground">จำนวน</span>
    <div class="flex items-center gap-1 rounded-full border bg-secondary p-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        class="rounded-full"
        :disabled="model <= MIN_QUANTITY"
        aria-label="ลดจำนวน"
        @click="decrement"
      >
        <Minus class="size-4" />
      </Button>

      <motion.div
        :key="model"
        :initial="{ scale: 0.9 }"
        :animate="{ scale: 1 }"
        :transition="{ type: 'spring', stiffness: 500, damping: 20 }"
      >
        <Input
          :model-value="inputValue"
          type="number"
          :min="MIN_QUANTITY"
          :max="MAX_QUANTITY"
          class="h-8 w-12 border-transparent bg-transparent text-center shadow-none"
          aria-label="จำนวนสินค้า"
          @change="onInputChange"
        />
      </motion.div>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        class="rounded-full"
        :disabled="model >= MAX_QUANTITY"
        aria-label="เพิ่มจำนวน"
        @click="increment"
      >
        <Plus class="size-4" />
      </Button>
    </div>
  </div>
</template>
