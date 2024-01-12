import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { LEARNING_MODES } from '@/consts/learning-modes'
import { LANGUAGES } from '@/consts/languages'

export const useStore = defineStore('store', () => {
  const currentLang = ref('tr-TR')
  const currentDay = ref(0)
  const currentMode = ref()
  const maxUnclockedDays = ref(1)

  const currentLangName = computed(() => {
    return Object.entries(LANGUAGES).map(([key, value]) => {
      if (value === currentLang.value) {
        return key
      }
    }).filter(lang => lang).toString()
  })

  const currentLangLocalStorageData = computed(() => {
    if (localStorage.getItem(currentLang.value)) {
      return JSON.parse(localStorage.getItem(currentLang.value) || '')
    }
  })

  function changeLang(lang: string) {
    currentLang.value = lang
  }

  function changeMode(mode: string) {
    currentMode.value = mode
  }

  function changeDay(day: number) {
    currentDay.value = day

    if (day > maxUnclockedDays.value) {
      changeMode(LEARNING_MODES.ACQUAINTANCE)
      maxUnclockedDays.value = maxUnclockedDays.value + 1
    }
  }

  function setMaxUnlockedDays(day: number) {
    maxUnclockedDays.value = day
    updateLocalStorage({ maxUnclockedDays: day })
  }

  function updateLocalStorage(partToUpdate: Record<string, string | number>) {
    let updatedStorageValue = null

    if (localStorage.getItem(currentLang.value)) {
      const localStorageObj = JSON.parse(localStorage.getItem(currentLang.value) || '') || {}
      updatedStorageValue = {
        ...localStorageObj,
        ...partToUpdate,
      }
    }


    localStorage.setItem(currentLang.value, JSON.stringify(updatedStorageValue ?? partToUpdate))
  }

  return {
    currentLang,
    currentDay,
    currentMode,
    changeLang,
    changeMode,
    changeDay,
    currentLangName,
    setMaxUnlockedDays,
    maxUnclockedDays,
    currentLangLocalStorageData,
    updateLocalStorage,
  }
})
