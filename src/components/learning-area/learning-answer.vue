<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { LEARNING_MODES } from '@/consts/learning-modes'
import mic from '@/assets/mic.png'
import recordingSound from '@/assets/record.mp3'
import { MAX_ALTERNATIVES } from '@/consts/speech-recognition-consts'
import { sanitizeString } from '@/helpers/common'
import { completionStatuses } from '@/types/assignments'
import type { TCompletionStatusesClasses } from '@/types/assignments'

const emit = defineEmits(['solved'])

const props = defineProps({
	correctAnswer: { type: String, required: true },
  mode: { type: String, required: true },
	currentLanguage: { type: String, default: 'fr-CA' },
})

const textarea = ref('')
const alternatives = ref<string[] | null>(null)
const userAnswer = ref('')
const isRecording = ref(false)
const answerIsCorrect = ref(false)
const recordSound = ref<HTMLAudioElement>()
const speechRecognition = ref(null)
const completionStatus = ref<TCompletionStatusesClasses>()

onMounted(() => {
	focusOnInput()
	recordSound.value = new Audio(recordingSound)
	speechRecognition.value = createSpeechRecognition(props.currentLanguage)
})

/* Computed */
const sanitizedCorrectAnswer = computed(() => sanitizeString(props.correctAnswer))
const sanitizedUserAnswer = computed(() => sanitizeString(userAnswer.value))
const isWrongAnswer = computed(() => {
	if (!sanitizedUserAnswer.value) { return false }
	return sanitizedCorrectAnswer.value !== sanitizedUserAnswer.value
})

/* Methods */
function focusOnInput(): void {
  (textarea.value as unknown as HTMLElement).focus()
  completionStatus.value = completionStatuses.IN_FOCUS
}

function replaceInput(userInputAlternative: string): void {
	userAnswer.value = userInputAlternative
}

function recordUserSpeech(): void {
	if (isRecording.value) {
		speechRecognition.value.stop()
		checkCorrectness()
		isRecording.value = false
		return
	}
	recordSound.value.play()
	speechRecognition.value.start()
}

function createSpeechRecognition(language = 'fr-CA') {
	let speechRecognition = new window.webkitSpeechRecognition()

	speechRecognition.continuous = false
	speechRecognition.interimResults = false
	speechRecognition.lang = language
	speechRecognition.maxAlternatives = MAX_ALTERNATIVES

	speechRecognition.onstart = () => {
		isRecording.value = true
	}

	speechRecognition.onerror = () => {
		console.log('error')
	}

	speechRecognition.onspeechend = () => {
		speechRecognition.stop()
	}

	speechRecognition.onend = () => {
		checkCorrectness()
		isRecording.value = false
	}

	speechRecognition.onresult = (event: Event) => {
		for (let i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				alternatives.value = event.results[i]
				userAnswer.value = event.results[i][0].transcript
			}
		}
	}

	return speechRecognition
}

function checkCorrectness() {
	answerIsCorrect.value = false

	if (!isWrongAnswer.value) {
		answerIsCorrect.value = true
		alternatives.value = null
    completionStatus.value = completionStatuses.SOLVED

		emit('solved')

		setTimeout(() => {
			userAnswer.value = '';
			answerIsCorrect.value = false;
      focusOnInput()
		}, 1000)
	} else {
    completionStatus.value = completionStatuses.ERROR
  }
}

function checkForSpeaking() {
  if (props.mode === LEARNING_MODES.SPEAKING
  || props.mode === LEARNING_MODES.SPEAKING_LIGHT
  || props.mode === LEARNING_MODES.SPEAKING_AND_TRANSLATION
  || props.mode === LEARNING_MODES.SPEAKING_AND_TRANSLATION_LIGHT) {
    setTimeout(() => { recordUserSpeech() }, 2000)
  }
}

function skipAssignment() {
  emit('solved')
  userAnswer.value = '';
  answerIsCorrect.value = false;
  focusOnInput()
}

watch(() => props.correctAnswer, () => { 
  checkForSpeaking()
})

watch(() => props.currentLanguage, () => { 
  speechRecognition.value = createSpeechRecognition(props.currentLanguage)
})


</script>

<template>
	<div class="learning-answer">
		<div class="learning-answer-top">
      <button class="next-button" @click="skipAssignment">✅</button>
			<div class="input-indicator" :class="completionStatus"></div>
			<textarea
        class="learning-answer-textarea"
        ref="textarea"
        v-model="userAnswer"
        @keydown.prevent.tab="checkCorrectness"
      ></textarea>
		</div>

		<div class="learning-answer-bottom">
			<ul v-if="alternatives && isWrongAnswer" class="alternatives">
				<li v-for="(item, index) in alternatives" :key="index" @click="replaceInput(item.transcript)">
					{{ item.transcript }}
				</li>
			</ul>
			<button class="mic-button" :class="{ 'recording': isRecording }" @click="recordUserSpeech">
				<img :src="mic" alt="" />
			</button>
		</div>
	</div>
</template>

<style scoped>
.learning-answer {
	display: flex;
	flex-wrap: wrap;
	height: 250px;
	background-color: var(--color-background-soft);
	padding: 16px;
	border-radius: 32px;
	color: var(--color-text);
}

.learning-answer-bottom {
	margin-top: auto;
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 18px;
	font-weight: 300;
}

.mic-button {
	margin-left: auto;
	border: 0;
	background: transparent;
	cursor: pointer;
}

.mic-button img {
	width: 55px;
	border-radius: 50%;
	box-sizing: border-box;
	border: 1px solid transparent;
}

.mic-button.recording img {
	border-color: var(--app-color-background-light);
	animation: recording 1.3s infinite ease-in-out;
}

@keyframes recording {
	0% {
		border: 1px solid var(--app-color-background-light);
	}

	50% {
		border: 8px solid var(--app-color-background-light);
	}

	100% {
		border: 1px solid var(--app-color-background-light);
	}
}

.learning-answer-top {
	display: flex;
	width: 100%;
  padding-top: 20px;
  position: relative;
}

.next-button {
  position: absolute;
  top: 0;
  right: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.learning-answer-textarea {
	margin-left: 30px;
	margin-top: 15px;
	width: 100%;
	height: 120px;
	border: 0;
	outline: none;
	border-color: transparent;
	resize: none;
	font-size: 28px;
	font-family: 'Inconsolata', 'Arial', monospace;
	background-color: var(--color-background-soft);
  color: var(--color-text);
}

.learning-answer-textarea:focus,
.learning-answer-textarea:focus-visible {
	border: 0;
	outline: none;
	border-color: transparent;
}

.input-indicator {
	width: 3px;
	height: 70px;
	background-color: var(--app-color-background-light);
	border-radius: 16px;
  margin-left: 20px;
}

.input-indicator.in-focus {
	background-color: var(--app-color-accent-cold);
}
.input-indicator.error {
	background-color: rgb(253, 93, 93);
}
.input-indicator.solved {
	background-color: rgb(93, 253, 101);
}
</style>
