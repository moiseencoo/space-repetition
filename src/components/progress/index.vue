<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'

const props = defineProps({
	totalDays: Number,
	currentDay: { type: Number, required: true },
})

const emit = defineEmits(['changeDay'])
const internalInstance = getCurrentInstance()

const estimatedCompletionTime = computed(() => {
  const remainingDays = 99 - props.currentDay
  const format = 'D MMM'
  const today = new Date()
  if (internalInstance) {
    const moment = internalInstance.appContext.config.globalProperties
    const regularSpeed = moment.$moment(today).add(remainingDays, 'days').format(format)
    const doubleSpeed = moment.$moment(today).add(remainingDays / 2, 'days').format(format)
    const tripleSpeed = moment.$moment(today).add(remainingDays / 3, 'days').format(format)
    const fourTimesSpeed = moment.$moment(today).add(remainingDays / 4, 'days').format(format)
    const fiveTimesSpeed = moment.$moment(today).add(remainingDays / 5, 'days').format(format)
    return `${regularSpeed} / ${doubleSpeed} / ${tripleSpeed} / ${fourTimesSpeed} / ${fiveTimesSpeed}`
  }
  return 'no estimation'
})

</script>

<template>
  <div v-if="totalDays" class="day-progress">
    <div class="estimation">
      {{  estimatedCompletionTime }}
    </div>
		<div 
			v-for="(day, index) in totalDays"
			:key="`day_${day}`"
			:class="[
				'day',
				{ 'active': currentDay === index },
				{ 'locked': index > currentDay },
			]"
      @click="emit('changeDay', index)"
		>
			{{ day }}
		</div>
	</div>
</template>

<style scoped>
.day-progress {
	width: 90px;
	height: 80vh;
	background-color: var(--app-color-background-light);
	border-radius: 0 16px 16px 0;
	padding: 20px 0;
	overflow: auto;
  position: relative;
}

.day {
	width: 55px;
	height: 34px;
	border-radius: 0 16px 16px 0;
	margin-bottom: 10px;
	background-color: var(--app-color-accent-cold);
	color: #ffffff;
	font-size: 20px;
	font-weight: bold;
	text-align: center;
	padding: 7px 20px;
	margin-left: -10px;
	cursor: pointer;
}

.day.active {
	background-color: var(--app-color-accent-warm);
	width: 80px;
	text-align: right;
	cursor: default;
}

.day.locked {
	background-color: #D9D9D9;
	color: #D9D9D9;
	cursor: default;
	user-select: none;
}

.estimation {
  position: fixed;
  top: 15px;
  right: 70px;
  z-index: 10;
}
</style>
