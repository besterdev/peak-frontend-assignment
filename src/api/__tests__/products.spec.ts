import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, fetchProducts } from '@/api/products'

vi.mock('axios')

const mockedGet = vi.mocked(axios.get)

describe('fetchProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the products response from the API', async () => {
    const response = { products: [{ id: 1, title: 'Desk lamp' }] }
    mockedGet.mockResolvedValue({ data: response })

    await expect(fetchProducts()).resolves.toEqual(response)
    expect(mockedGet).toHaveBeenCalledWith('/db.json')
  })

  it('normalizes request failures into ApiError', async () => {
    mockedGet.mockRejectedValue(new Error('Network error'))

    await expect(fetchProducts()).rejects.toEqual(
      expect.objectContaining({
        name: 'ApiError',
        message: 'ไม่สามารถโหลดข้อมูลสินค้าได้ กรุณาลองใหม่อีกครั้ง',
      } satisfies Partial<ApiError>),
    )
  })
})
