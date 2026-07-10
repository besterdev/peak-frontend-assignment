import type { Product } from '@/types/product'

const TAG_COLOR_CLASSES: Record<string, string> = {
  tag1: 'border-[#b8d7fb] bg-[#eaf2ff] text-[#286fbe] hover:bg-[#dcecff]',
  tag2: 'border-[#b7e8df] bg-[#e5f8f5] text-[#178676] hover:bg-[#d3f2ed]',
  tag3: 'border-[#f6c5d9] bg-[#fff0f6] text-[#bf4f7e] hover:bg-[#ffe2ee]',
  tag4: 'border-[#f4d994] bg-[#fff6de] text-[#a36d00] hover:bg-[#ffedbd]',
}

export const sortTags = (tags: string[]): string[] =>
  [...tags].sort((firstTag, secondTag) =>
    firstTag.localeCompare(secondTag, undefined, { numeric: true, sensitivity: 'base' }),
  )

export const getTagColorClass = (tag: string): string =>
  TAG_COLOR_CLASSES[tag.toLowerCase()] ?? 'border-border bg-secondary text-secondary-foreground hover:bg-secondary/80'

export const getUniqueTags = (products: Product[]): string[] => {
  const tags = new Set<string>()

  for (const product of products) {
    for (const tag of product.tags) {
      tags.add(tag)
    }
  }

  return sortTags(Array.from(tags))
}
