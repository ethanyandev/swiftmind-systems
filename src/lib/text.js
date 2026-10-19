// Split copy into animatable units: characters for Chinese, whitespace-separated words for English.
export function splitWords(text, lang) {
  if (lang === 'zh') return Array.from(text)
  return text.split(/\s+/).filter(Boolean)
}
