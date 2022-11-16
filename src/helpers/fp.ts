export const prop = <T>(key: keyof T) => (obj: T) => obj[key]
