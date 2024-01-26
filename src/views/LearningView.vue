<script setup lang="ts">
import LearningArea from '../components/learning-area/index.vue'
import Progress from '../components/progress/index.vue'
import { isObjectEmpty } from "@/helpers/common"
import { generatePlan, PLAN_LEVELS } from '@/helpers/learning-modes'
import frenchData from '../data/fr/level-1.js'
import turkishData from '../data/tr/level-1.js'
import englishData from '../data/en/level-1.js'
import { useStore } from '@/stores/store'
import type { TStudyPlan } from '@/types/assignments'
import { ref, computed, onMounted, watch } from 'vue'
import { LANGUAGES } from '@/consts/languages'

type TLandData = Record<string, string>[]

const store = useStore()

const studyPlan = ref<TStudyPlan[]>([])
const currentLangData = ref<TLandData[]>([])

const currentAssignmentNumber = ref(0)
const isIntenceMode = ref(false)

const currentDay = computed((): number => store.currentDay)

const currentAssignment = computed((): TStudyPlan | null => {
  if (!studyPlan.value.length) {
    return null
  }
  return studyPlan.value[currentAssignmentNumber.value]
})

function handleChangeDay(day: number) {
  store.changeDay(day)
  currentAssignmentNumber.value = 0
  createStudyPlan()
}

function handleIntenceModeChange(mode: boolean) {
  isIntenceMode.value = mode
  createStudyPlan()
}

function handleSolvedAssignment() {
  const numberOfTodaysAssignments = studyPlan.value.length - 1
  if (currentAssignmentNumber.value < numberOfTodaysAssignments) {
    currentAssignmentNumber.value++
  } else {
    handleChangeDay(currentDay.value + 1)
  }
}

function createStudyPlan() {
  const startIndex = (currentDay.value - 4 >= 0)
  ? currentDay.value - 4
  : 0
  const endIndex = currentDay.value + 1

  const currentDayData = currentLangData.value.slice(startIndex, endIndex)
 
  if (!currentDayData) {
    console.log('no study plan')
    return
  }

  const languageLevel = store.currentLang === LANGUAGES.EN ? PLAN_LEVELS.LIGHT : PLAN_LEVELS.NORMAL
  studyPlan.value = generatePlan(currentDayData.reverse(), languageLevel)
}

onMounted(() => {
  initLearning()
})

function initLearning() {
  if (!store.currentLangLocalStorageData || isObjectEmpty(store.currentLangLocalStorageData)) {
    store.updateLocalStorage({
      currentDay: 0
    })
  } else {
    store.changeDay(store.currentLangLocalStorageData.currentDay)
  }

  switch(store.currentLang) {
    case LANGUAGES.EN:
      currentLangData.value = englishData
      break
    case LANGUAGES.TR:
      currentLangData.value = turkishData
      break
    case LANGUAGES.FR:
      currentLangData.value = frenchData
      break
    default:
      currentLangData.value = []
      break
  }

  createStudyPlan()
}

watch(
  () => store.currentLang,
  () => {
    initLearning()
  }
)

</script>

<template>
  <main>
    <Progress 
      :totalDays="currentLangData.length" 
      :currentDay="store.currentDay" 
      @changeDay="handleChangeDay"
    />
    <LearningArea 
      v-if="currentAssignment"
      :learningAssignment="currentAssignment.assignment" 
      :currentLanguage="store.currentLang"
      :totalAssignmentsNumber="studyPlan.length"
      :currentAssignmentNumber="currentAssignmentNumber"
      :mode="currentAssignment.mode"
      :isIntenceMode="isIntenceMode"
      @intenceToggle="handleIntenceModeChange"
      @solved="handleSolvedAssignment"
    />
    <div>
    </div>
  </main>
</template>

<style scoped>
main {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
}
</style>