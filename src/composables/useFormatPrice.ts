const priceFormatter = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export const useFormatPrice = () => {
  const formatPrice = (price: number): string => {
    return priceFormatter.format(price)
  }

  return { formatPrice }
}
