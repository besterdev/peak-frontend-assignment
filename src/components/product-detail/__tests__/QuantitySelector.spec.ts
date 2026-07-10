import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import QuantitySelector from '@/components/product-detail/QuantitySelector.vue'
import { MAX_QUANTITY, MIN_QUANTITY } from '@/constants'

describe('QuantitySelector', () => {
  it('increments and decrements quantity within bounds', async () => {
    const wrapper = mount(QuantitySelector, {
      props: {
        modelValue: 2,
        'onUpdate:modelValue': (value: number) => wrapper.setProps({ modelValue: value }),
      },
    })

    await wrapper.find('[aria-label="เพิ่มจำนวน"]').trigger('click')
    expect(wrapper.props('modelValue')).toBe(3)

    await wrapper.find('[aria-label="ลดจำนวน"]').trigger('click')
    expect(wrapper.props('modelValue')).toBe(2)
  })

  it('disables decrement at minimum quantity', () => {
    const wrapper = mount(QuantitySelector, {
      props: { modelValue: MIN_QUANTITY },
    })

    const decrementButton = wrapper.find('[aria-label="ลดจำนวน"]')
    expect(decrementButton.attributes('disabled')).toBeDefined()
  })

  it('disables increment at maximum quantity', () => {
    const wrapper = mount(QuantitySelector, {
      props: { modelValue: MAX_QUANTITY },
    })

    const incrementButton = wrapper.find('[aria-label="เพิ่มจำนวน"]')
    expect(incrementButton.attributes('disabled')).toBeDefined()
  })
})
