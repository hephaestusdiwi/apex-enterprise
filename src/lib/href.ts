const SAFE_HREF = /^(https?:|mailto:|tel:|\/(?!\/)|#)/i

export const isSafeHref = (value: string): boolean => SAFE_HREF.test(value.trim())