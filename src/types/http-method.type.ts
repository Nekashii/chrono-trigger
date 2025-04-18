export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const

export type HttpMethod = (typeof HTTP_METHODS)[number]
