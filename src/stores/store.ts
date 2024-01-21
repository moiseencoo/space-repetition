import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { LANGUAGES } from '@/consts/languages'

export const useStore = defineStore('store', () => {
  const currentLang = ref('en-US')
  const currentDay = ref(0)

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

  function changeDay(day: number, updateLS = true) {
    currentDay.value = day
  
    updateLS && updateLocalStorage({
      currentDay: day,
    })
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
    currentLangLocalStorageData,
    updateLocalStorage,
  }
})
