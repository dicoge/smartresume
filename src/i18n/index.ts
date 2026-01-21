import { createI18n } from 'vue-i18n'
import zhTW from './zh-TW'
import en from './en'

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    'zh-TW': zhTW,
    en: en,
  },
})

export default i18n
