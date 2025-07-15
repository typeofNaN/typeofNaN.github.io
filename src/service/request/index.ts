import { createRequest } from './request'

export const request = createRequest({baseURL: process.env.NEXT_PUBLIC_API_BASE_URL})
