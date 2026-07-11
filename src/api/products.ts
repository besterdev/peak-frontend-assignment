import axios from 'axios'
import type { ProductsResponse } from '@/types/product'

const PRODUCTS_ENDPOINT = '/db.json'

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const fetchProducts = async (): Promise<ProductsResponse> => {
  try {
    const response = await axios.get<ProductsResponse>(PRODUCTS_ENDPOINT)
    return response.data
  } catch (error) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined
    throw new ApiError('ไม่สามารถโหลดข้อมูลสินค้าได้ กรุณาลองใหม่อีกครั้ง', status)
  }
}
