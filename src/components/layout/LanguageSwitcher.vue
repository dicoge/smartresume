<script setup lang="ts">
import { useLocale } from '../../composables/useLocale'
import { useI18n } from 'vue-i18n'

const { currentLocale, toggleLocale } = useLocale()
const { t } = useI18n()
</script>

<template>
  <button
    @click="toggleLocale"
    class="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200"
  >
    {{ currentLocale === 'zh-TW' ? t('language.en') : t('language.zh-TW') }}
  </button>
</template>