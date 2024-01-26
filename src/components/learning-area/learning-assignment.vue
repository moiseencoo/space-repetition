<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { LEARNING_MODES } from '@/consts/learning-modes'
import speaker from '@/assets/volume-up.png'
import flıp from '@/assets/flıp.png'

const props = defineProps({
  assignment: { type: String, required: true },
  answer: { type: String, required: true },
	progressPercent: { type: Number, required: true },
  mode: { type: String, required: true },
})

const emit = defineEmits(['speak'])

const showAnswer = ref(false)

const progressStyle = computed(() => {
	const percentRemains = 100 - props.progressPercent
	return `linear-gradient(
		to right,
		var(--app-color-accent-cold) ${props.progressPercent}%,
		rgba(240, 161, 119, 0.5) ${props.progressPercent}% ${percentRemains}%)`
})

const learningModeName = computed(() => {
  switch(props.mode) {
    case LEARNING_MODES.ACQUAINTANCE:
      return 'ACQUAINTANCE (full)'
    case LEARNING_MODES.ACQUAINTANCE_LIGHT:
      return 'ACQUAINTANCE'
    case LEARNING_MODES.DICTATION:
      return 'DICTATION (full)'
    case LEARNING_MODES.DICTATION_LIGHT:
      return 'DICTATION'
    case LEARNING_MODES.TRANSLATION:
      return 'TRANSLATION (full)'
    case LEARNING_MODES.TRANSLATION_LIGHT:
      return 'TRANSLATION'
    case LEARNING_MODES.SPEAKING:
      return 'SPEAKING (full)'
    case LEARNING_MODES.SPEAKING_LIGHT:
      return 'SPEAKING'
    case LEARNING_MODES.SPEAKING_AND_TRANSLATION:
      return 'SPEAKING_AND_TRANSLATION (full)'
    case LEARNING_MODES.SPEAKING_AND_TRANSLATION_LIGHT:
      return 'SPEAKING_AND_TRANSLATION'
    default:
      return ''
  }
})

const showAnswerWithAssignment = computed(() => {
  const { mode } = props
  return mode === LEARNING_MODES.ACQUAINTANCE
    || mode === LEARNING_MODES.ACQUAINTANCE_LIGHT
    || mode === LEARNING_MODES.SPEAKING
    || mode === LEARNING_MODES.SPEAKING_LIGHT
})

function checkForSpeaking() {
  if (props.mode === LEARNING_MODES.ACQUAINTANCE
  || props.mode === LEARNING_MODES.DICTATION
  || props.mode === LEARNING_MODES.ACQUAINTANCE_LIGHT
  || props.mode === LEARNING_MODES.DICTATION_LIGHT) {
      emit('speak', props.answer)
  }
}

watch(() => props.assignment, () => { 
  checkForSpeaking()
})

onMounted(() => {
  setTimeout(() => { checkForSpeaking() }, 2000)
})

</script>

<template>
	<div class="learning-assignment">
    <div class="learning-mode">
      {{  learningModeName  }}
    </div>
		<h2 class="learning-assignment-value">
      {{ showAnswer ? answer : assignment }}
      <span v-if="showAnswerWithAssignment" class="answer">
        {{  answer }}
      </span>
		</h2>
		<div class="learning-assignment-controls">
      <button class="speaker-button" @click="emit('speak', answer)">
				<img :src="speaker" alt="" />
			</button>
      <button class="speaker-button" @click="showAnswer = !showAnswer">
				<img :src="flıp" alt="" />
			</button>
		</div>
		<div class="learning-assignment-progress" :style="{ backgroundImage: progressStyle }"></div>
	</div>
</template>

<style scoped>
.learning-assignment {
	position: relative;
  display: flex;
  flex-direction: column;
	height: 50%;
	background-color: var(--color-background-soft);
	padding: 16px;
	color: var(--color-text);
}

.learning-assignment-progress {
	position: absolute;
	bottom: -12px;
	left: 0;
	height: 12px;
	width: 100%;
	background-image: linear-gradient(to right, var(--app-color-accent-cold) 10%, rgba(240, 161, 119, 0.5) 10% 90%);
}

.learning-assignment-value {
  position: relative;
  font-size: 28px;
  margin-top: 50px;
  margin-left: 53px;
}

.answer {
  display: block;
  margin-top: 8px;
  font-weight: bold;
}

.learning-assignment-value:before {
  content: '';
  position: absolute;
  width: 3px;
  height: 200%;
  background-color: var(--app-color-background-light);
  border-radius: 16px;
  left: -30px;
  top: 50%;
  transform: translateY(-50%);
}

.learning-mode {
  margin-left: auto;
}

.learning-assignment-controls {
  margin-top: auto;
  margin-left: auto;
}

.speaker-button {
	margin-top: auto;
	border: 0;
	background: transparent;
	cursor: pointer;
}

.speaker-button img {
	width: 35px;
	border-radius: 50%;
	box-sizing: border-box;
	border: 1px solid transparent;
}
</style>