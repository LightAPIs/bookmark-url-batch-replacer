<template>
  <div class="theme-switcher" @mouseenter="visible = true" @mouseleave="visible = false">
    <div class="theme-switcher-trigger">
      <svg v-if="themeMode === 'light'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
      </svg>
      <svg v-else-if="themeMode === 'dark'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>
      </svg>
    </div>
    <transition name="dropdown">
      <div v-show="visible" class="theme-switcher-dropdown">
        <a-radio-group v-model:value="themeMode">
          <a-radio value="auto">{{ i18n('themeModeAuto') }}</a-radio>
          <a-radio value="light">{{ i18n('themeModeLight') }}</a-radio>
          <a-radio value="dark">{{ i18n('themeModeDark') }}</a-radio>
        </a-radio-group>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { i18n } from '@/common/ui';

const themeMode = useLocalStorage<'auto' | 'light' | 'dark'>('theme-mode', 'auto');
const visible = ref(false);
</script>

<style scoped>
.theme-switcher {
  position: absolute;
  top: 0;
  right: 16px;
  z-index: 100;
}

.theme-switcher-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 24px;
  cursor: pointer;
}

.theme-switcher-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08);
  min-width: 140px;
}

html[data-theme="dark"] .theme-switcher-dropdown {
  background: #1f1f1f;
  border-color: #434343;
}

.theme-switcher-dropdown :deep(.ant-radio-group) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>