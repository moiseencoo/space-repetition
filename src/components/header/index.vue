<script setup lang="ts">
import { ref } from 'vue'
import { LANGUAGES } from '@/consts/languages'
import { useStore } from '@/stores/store'

const showPicker = ref(false)
const store = useStore()

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
        <ul v-for="(lang, key) in LANGUAGES" class="lang-dropdown">
          <li @click="handleLanguageChange(lang)">{{ key }}</li>
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
  z-index: 1;
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
  font-size: 24px;
  font-weight: 300;
}
</style>
