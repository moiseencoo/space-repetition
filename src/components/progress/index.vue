<script setup lang="ts">
defineProps({
	totalDays: Number,
	currentDay: Number,
	maxUnlockedDay: { type: Number, required: true },
})

</script>

<template>
  <div v-if="totalDays" class="day-progress">
		<div 
			v-for="day in totalDays"
			:key="`day_${day}`"
			:class="[
				'day',
				{ 'active': day === currentDay },
				{ 'locked': day > maxUnlockedDay },
			]"
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
</style>
