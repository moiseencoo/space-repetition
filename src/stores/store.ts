import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { LANGUAGES } from '@/consts/languages'

export const useStore = defineStore('store', () => {
  const currentLang = ref('tr-TR')
  const currentDay = ref(0)
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

  function changeDay(day: number) {
    currentDay.value = day

    if (day > maxUnclockedDays.value) {
      maxUnclockedDays.value = maxUnclockedDays.value + 1
      updateLocalStorage({
        currentDay: day,
        maxUnclockedDays: maxUnclockedDays.value,
      })
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
    changeLang,
    changeDay,
    currentLangName,
    setMaxUnlockedDays,
    maxUnclockedDays,
    currentLangLocalStorageData,
    updateLocalStorage,
  }
})
