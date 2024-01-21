<script setup lang="ts">
import LearningArea from '../components/learning-area/index.vue'
import { isObjectEmpty } from "@/helpers/common"
import { generatePlan } from '@/helpers/learning-modes'
// import frenchData from '../data/fr/level-1.js'
import turkishData from '../data/tr/level-1.js'
import { useStore } from '@/stores/store'
import type { TStudyPlan } from '@/types/assignments'
import { ref, computed, onMounted } from 'vue'
import router from '@/router'

const store = useStore()

const studyPlan = ref<TStudyPlan[]>([])
const currentLangData = turkishData

const currentAssignmentNumber = ref(0)

const currentDay = computed((): number => store.currentDay)

const currentAssignment = computed((): TStudyPlan | null => {
  if (!studyPlan.value.length) {
    return null
  }
  return studyPlan.value[currentAssignmentNumber.value]
})

function handleChangeDay(day: number) {
  alert('Hurray! You have completed recall!')
  setTimeout(() => {
    router.push('/learning')
  }, 3000)
}

function handleSolvedAssignment() {
  const numberOfTodaysAssignments = studyPlan.value.length - 1
  if (currentAssignmentNumber.value < numberOfTodaysAssignments) {
    currentAssignmentNumber.value++
  } else {
    handleChangeDay(currentDay.value + 1)
  }
}

function createRecallPlan() {
  const startIndex = (currentDay.value - 4 >= 0)
  ? currentDay.value - 4
  : 0
  const endIndex = currentDay.value + 1

  const currentDayData = currentLangData.slice(startIndex, endIndex)
 
  if (!currentDayData) {
    console.log('no study plan')
    return
  }

  studyPlan.value = generatePlan(currentDayData.reverse())
}

onMounted(() => {
  if (!store.currentLangLocalStorageData || isObjectEmpty(store.currentLangLocalStorageData)) {
    router.push('/learning')
  } else {
    createRecallPlan()
  }
})

</script>

<template>
  <main>
    <div></div>
    <LearningArea 
      v-if="currentAssignment"
      :learningAssignment="currentAssignment.assignment" 
      :currentLanguage="store.currentLang"
      :totalAssignmentsNumber="studyPlan.length"
      :currentAssignmentNumber="currentAssignmentNumber"
      :mode="currentAssignment.mode"
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