export const DEEPLINK_METHOD = 0
export const DEEPLINK_RESULT = 1

export const toRlp = (o) => Object.values(o).map(v => typeof v === "object" ? toRlp(v) : v)
export const rlpToStrings = (o) => Object.values(o).map(v => typeof v === "Array" ? rlpToStrings(v) : v.toString())