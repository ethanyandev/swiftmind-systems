// Split copy into animatable units.
// zh: one unit per CJK character, but latin/digit runs stay whole and closing punctuation
//     (，。、；：？！）」』) attaches to the unit before it, so a line never starts with it.
// en: whitespace-separated words.
const ZH_UNIT = /[A-Za-z0-9]+[，。、；：？！）」』]*|\s+|[^\sA-Za-z0-9][，。、；：？！）」』]*/g

export function splitWords(text, lang) {
  if (lang === 'zh') return text.match(ZH_UNIT) ?? []
  return text.split(/\s+/).filter(Boolean)
}
