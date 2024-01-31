<script setup lang="ts">
import LearningAnswer from './learning-answer.vue'
import LearningAssignment from './learning-assignment.vue'
import { computed, onMounted, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { useStore } from '@/stores/store'
import { EN } from '@/consts/voices'
import { LANGUAGES } from '@/consts/languages'

const store = useStore()

const props = defineProps({
  learningAssignment: { type: Object as PropType<Record<string, string>>, required: true },
  totalAssignmentsNumber: { type: Number, default: 0 },
  currentAssignmentNumber: { type: Number, default: 0 },
  mode: { type: String, required: true },
  isIntenceMode: { type: Boolean, required: true },
})

const emit = defineEmits(['solved', 'intenceToggle'])

const voices = ref<Record<string, any>[] | null>(null)
const currentSpeachSynthesis = ref()
const rate = ref("1")
const loadingSpeechRecognition = ref(false)


const assignmentValue = computed((): string => {
  return Object.keys(props.learningAssignment)[0]
})

const answerValue = computed((): string => {
  return Object.values(props.learningAssignment)[0]
})

const currentProgress = computed((): number => {
  return Math.round(props.currentAssignmentNumber * 100 / props.totalAssignmentsNumber)
})

function handleSolved(): void {
  speak(answerValue.value)
  const interval = setInterval(() => {
    if (!speechSynthesis.speaking) {
      emit('solved')
      clearInterval(interval)
    }
  }, 1000)
}

async function fetchVoices(currentLanguage: string = 'fr-CA') {
  if (currentSpeachSynthesis.value?.utterance?.lang === currentLanguage) {
    return
  }

  let allVoices = await getVoices()
  if (currentLanguage === LANGUAGES.EN) {
    const currentVoice = allVoices.filter(voice => EN.includes(voice.name)) ?? null
    voices.value = currentVoice
  } else {
    voices.value = allVoices.filter(voice => voice.lang === currentLanguage) ?? null
  }

  const utterance = new SpeechSynthesisUtterance()
  utterance.lang = currentLanguage
  currentSpeachSynthesis.value = utterance
  loadingSpeechRecognition.value = false
}

function getVoices(): Promise<Record<string, any>[]> {
  return new Promise((resolve) => {
    let allVoices = speechSynthesis.getVoices()
    if (allVoices.length) {
      resolve(allVoices)
      return
    }
    speechSynthesis.onvoiceschanged = () => {
      allVoices = speechSynthesis.getVoices()
      resolve(allVoices)
    }
  })
}

function speak(text: string) {
  if (!voices.value) { return }

  let index = 0
  if (voices.value.length > 1) {
    // get random voice
    index = Math.floor(Math.random() * voices.value.length)
  }

  currentSpeachSynthesis.value.voice = voices.value[index]
  currentSpeachSynthesis.value.text = text
  currentSpeachSynthesis.value.rate = rate.value
  speechSynthesis.speak(currentSpeachSynthesis.value)
}

onMounted(() => {
  fetchVoices(store.currentLang)
})

watch(
  () => store.currentLang,
  () => {
    loadingSpeechRecognition.value = true
    fetchVoices(store.currentLang)
  }
)

</script>

<template>
	<div class="learning-area">
    <div>
      <label for="rate">Rate:
        <input type="range" min="0.5" max="2" v-model="rate" step="0.1" id="rate" />
      </label>
    </div>
		<LearningAssignment
      v-if="!loadingSpeechRecognition"
      :assignment="assignmentValue"
      :answer="answerValue"
      :progressPercent="currentProgress"
      :mode="mode"
      @speak="speak($event)"
    />
    <div class="learning-progress">
      {{ props.currentAssignmentNumber + 1 }} / {{  props.totalAssignmentsNumber }}
    </div>
    <label for="isIntenceMode" class="intence-mode">Intence Mode:
      <input type="checkbox" :value="isIntenceMode" id="isIntenceMode" @click="emit('intenceToggle', !isIntenceMode)"/>
    </label>
    <LearningAnswer
      :currentLanguage="store.currentLang"
      :correctAnswer="answerValue"
      :mode="mode"
      @solved="handleSolved" 
    />
	</div>
</template>

<style scoped>
.learning-area {
	background-color: var(--app-color-background-light);
	border-radius: 30px;
	padding: 40px;
	height: calc(100vh - 150px);
	width: 780px;
	box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.09);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.intence-mode {
  margin-top: -16px;
  margin-right: auto;
}

.learning-progress {
  margin-top: 8px;
  margin-left: auto;
}
</style>