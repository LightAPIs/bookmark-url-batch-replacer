<template>
  <a-config-provider :theme="isDark ? { algorithm: theme.darkAlgorithm } : {}" :key="isDark ? 'dark' : 'light'">
    <div class="index-app">
      <b-theme-switcher />
      <a-layout>
        <a-layout-header class="index-header">
          <div class="input-bar">
            <b-input-bar-row>
              <template #label>{{ i18n('indexPatternLabel') }}</template>
              <a-input
                v-model:value="pattern"
                :disabled="fetching"
                :placeholder="isRegex ? i18n('indexPatternPlaceholder') : i18n('indexPatternPlaceholderNormal')"
              />
            </b-input-bar-row>
            <b-input-bar-row>
              <template #label>{{ i18n('indexReplaceMode') }}</template>
              <a-radio-group v-model:value="isRegex" :disabled="fetching">
                <a-radio :value="false">{{ i18n('indexModeNormal') }}</a-radio>
                <a-radio :value="true">{{ i18n('indexModeRegex') }}</a-radio>
              </a-radio-group>
            </b-input-bar-row>
            <b-input-bar-row v-if="isRegex">
              <template #label>{{ i18n('indexFlagesLabel') }}</template>
              <b-flags-checkbox-group v-model:flags="flags" :disabled="fetching"></b-flags-checkbox-group>
            </b-input-bar-row>
            <b-input-bar-row v-if="!isRegex">
              <template #label>{{ i18n('indexReplaceCountLabel') }}</template>
              <a-input-number
                v-model:value="replaceCount"
                :disabled="fetching"
                :min="0"
                :placeholder="i18n('indexReplaceCountPlaceholder')"
                style="width: 100%"
              />
            </b-input-bar-row>
            <b-input-bar-row>
              <template #label>{{ i18n('indexReplacementLabel') }}</template>
              <a-input v-model:value="replacement" :disabled="fetching" :placeholder="i18n('indexReplacementPlaceholder')" />
            </b-input-bar-row>
            <a-row>
              <a-col :md="4" :lg="2">
                <template v-if="hadResult">{{ selectedRowKeys.length }}/{{ curData.length }}</template>
              </a-col>
              <a-col :md="4" :lg="2">
                <a-button type="primary" :loading="fetching" @click="onPreview">{{ i18n('indexBtnPreview') }}</a-button>
              </a-col>
              <a-col :md="4" :lg="2">
                <a-button :disabled="!hadResult" @click="onSelectAll">{{ i18n('indexBtnSelectAll') }}</a-button>
              </a-col>
              <a-col :md="4" :lg="2">
                <a-button type="primary" danger :disabled="!hadSelected" :loading="fetching" @click="onEffect">{{ i18n('indexBtnEffect') }}</a-button>
              </a-col>
            </a-row>
          </div>
        </a-layout-header>
        <a-layout-content>
          <a-spin :spinning="fetching">
            <a-table
              :columns="columns"
              :data-source="curData"
              :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
              :pagination="{ showSizeChanger: true }"
            ></a-table>
          </a-spin>
        </a-layout-content>
        <a-layout-footer class="index-footer">
          <a target="_blank" :href="i18n('indexRegexUrl')">{{ i18n('indexLearnRegex') }}</a>
        </a-layout-footer>
      </a-layout>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, h, watch } from 'vue';
import { useLocalStorage, useMediaQuery } from '@vueuse/core';
import { i18n } from '@/common/ui';
import { getTree, updateUrl } from '@/common/bookmark';
import BInputBarRow from '@/components/BInputBarRow.vue';
import BFlagsCheckboxGroup from '@/components/BFlagsCheckboxGroup.vue';
import BThemeSwitcher from '@/components/BThemeSwitcher.vue';
import { message, notification, theme } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/es/table/interface';

const themeMode = useLocalStorage<'auto' | 'light' | 'dark'>('theme-mode', 'auto');
const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

const isDark = computed(() => {
  if (themeMode.value === 'auto') {
    return prefersDark.value;
  }
  return themeMode.value === 'dark';
});

watch(
  isDark,
  dark => {
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  },
  { immediate: true },
);

const undoKey = 'index-undo-key';

const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    title: i18n('indexName'),
    width: 150,
  },
  {
    dataIndex: 'source',
    key: 'source',
    title: i18n('indexSource'),
    ellipsis: true,
  },
  {
    dataIndex: 'result',
    key: 'result',
    title: i18n('indexResult'),
    ellipsis: true,
  },
];

const fetching = ref(false);

const isRegex = useLocalStorage('replace-mode-is-regex', false);
const pattern = ref('');
const flags = ref<string[]>([]);
const replacement = ref('');
const replaceCount = ref<number | undefined>(undefined);

const curData = ref<DataItem[]>([]);
const oldData = ref<DataItem[]>([]);
const selectedRowKeys = ref<string[]>([]);

const hadResult = computed(() => curData.value.length > 0);
const hadSelected = computed(() => selectedRowKeys.value.length > 0);

async function onPreview() {
  if (pattern.value) {
    fetching.value = true;
    selectedRowKeys.value = [];
    curData.value = [];

    curData.value = await getTree(pattern.value, flags.value, replacement.value, isRegex.value, replaceCount.value ?? 0);
  }
  fetching.value = false;
}

async function onEffect() {
  if (selectedRowKeys.value.length > 0) {
    fetching.value = true;
    oldData.value = [];

    for (const keyValue of selectedRowKeys.value) {
      for (const ele of curData.value) {
        if (ele.key === keyValue) {
          const res = await updateUrl(keyValue, ele.result);
          if (res) {
            oldData.value.push(ele);
          } else {
            message.error(i18n('indexErrorUpdateText') + ele.name);
            console.error(ele);
          }
          break;
        }
      }
    }

    await onPreview();

    notification.close(undoKey);

    nextTick(() => {
      notification.success({
        key: undoKey,
        placement: 'bottomRight',
        duration: 10,
        message: () =>
          h('div', [
            i18n('indexCompletionText'),
            h('a', {
              class: 'undo',
              textContent: i18n('indexUndoText'),
              onClick(e: Event) {
                e.stopPropagation();
                onUndo();
              },
            }),
          ]),
      });
    });
  }
}

async function onUndo() {
  for (const item of oldData.value) {
    const res = await updateUrl(item.key, item.source);
    if (!res) {
      message.error(i18n('indexErrorUpdateText') + item.name);
      console.error(item);
    }
  }

  notification.close(undoKey);
  onPreview();
}

function onSelectChange(selected: Key[]) {
  selectedRowKeys.value = selected.map(v => v.toString());
}

function onSelectAll() {
  selectedRowKeys.value = curData.value.map(item => item.key);
}
</script>

<style>
html {
  color-scheme: light dark;
}

html[data-theme='dark'] {
  background: #000;
  color: #fff;
}

html:not([data-theme='dark']) {
  background: #fff;
  color: #000;
}

html[data-theme='dark'] .ant-layout-header {
  background: #141414;
}

html:not([data-theme='dark']) .ant-layout-header {
  background: #f0fcfc;
}

.index-app .index-header {
  width: 100%;
  height: auto;
}
.index-app .index-footer {
  text-align: center;
}
.undo {
  margin-left: 15px;
}
</style>
