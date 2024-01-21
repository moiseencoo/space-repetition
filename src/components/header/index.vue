<script setup lang="ts">
import { ref, computed } from 'vue'
import { LANGUAGES } from '@/consts/languages'
import { useStore } from '@/stores/store'

const showPicker = ref(false)
const store = useStore()

const languages = computed(() => {
  return Object.entries(LANGUAGES)
    .map(([key, value]) => ({ key, value}))
    .filter(lang => lang.value !== store.currentLang)
})

function handleLanguageChange(lang: string) {
  if (lang === store.currentLang) {
    showPicker.value = false
  } else {
    store.changeLang(lang)
  }
}

</script>

<template>
  <header class="header">
    <a href="/" class="logo-link"> spaceRepetition </a>
    <div class="lang-picker">
      <span @click="showPicker = !showPicker" class="current-lang">{{ store.currentLangName }}</span>
      <template v-if="showPicker">
        <ul class="lang-dropdown">
          <li 
            v-for="lang in languages"
            class="lang-option"
            @click="handleLanguageChange(lang.value)"
          >
            {{ lang.key }}
          </li>
        </ul>
      </template>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  padding: 30px 70px 20px;
  z-index: 10;
}

.logo-link {
  display: block;
  position: relative;
  font-weight: 700;
  font-size: 40px;
  text-decoration: none;
  color: #000000;
}

.logo-link:before {
  content: '';
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  bottom: 5px;
  left: -26px;
  background-color: var(--app-color-accent-cold);
  z-index: -1;
}

.logo-link:after {
  content: '';
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  top: 50%;
  left: -6px;
  transform: translateY(-42%);
  background-color: #ffffff;
  z-index: -1;
}

.current-lang {
  cursor: pointer;
  font-size: 24px;
  font-weight: 300;
}

.lang-picker {
  position: relative;
}

.lang-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  list-style: none;
  padding: 0;
}

.lang-option {
  cursor: pointer;
  padding: 8px 4px;
}

.lang-option:hover {
  color: var(--app-color-background-light);
}
</style>
