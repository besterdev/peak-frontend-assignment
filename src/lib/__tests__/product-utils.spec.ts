import { describe, expect, it } from 'vitest'
import { getTagColorClass, getUniqueTags, sortTags } from '@/lib/product-utils'

describe('product utils', () => {
  it('sorts tags without mutating the source array', () => {
    const tags = ['tag10', 'tag2', 'tag1']

    expect(sortTags(tags)).toEqual(['tag1', 'tag2', 'tag10'])
    expect(tags).toEqual(['tag10', 'tag2', 'tag1'])
  })

  it('returns unique sorted tags from products', () => {
    expect(
      getUniqueTags([
        { id: 1, title: 'One', description: '', photos: [], price: 1, tags: ['z', 'a'] },
        { id: 2, title: 'Two', description: '', photos: [], price: 1, tags: ['a', 'm'] },
      ]),
    ).toEqual(['a', 'm', 'z'])
  })

  it('returns a stable color class for each tag', () => {
    expect(getTagColorClass('tag1')).toContain('bg-[#eaf2ff]')
    expect(getTagColorClass('tag4')).toContain('bg-[#fff6de]')
    expect(getTagColorClass('unknown')).toContain('bg-secondary')
  })
})
