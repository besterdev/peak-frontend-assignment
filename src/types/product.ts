export interface Product {
  id: number
  title: string
  description: string
  photos: string[]
  price: number
  tags: string[]
}

export interface ProductsResponse {
  products: Product[]
}
