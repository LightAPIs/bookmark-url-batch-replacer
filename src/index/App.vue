<template>
  <div class="index-app">
    <a-layout>
      <a-layout-header class="index-header">
        <div class="input-bar">
          <b-input-bar-row>
            <template #label>{{ i18n('indexPatternLabel') }}</template>
            <a-input v-model:value="pattern" :disabled="fetching" :placeholder="i18n('indexPatternPlaceholder')" />
          </b-input-bar-row>
          <b-input-bar-row>
            <template #label>{{ i18n('indexFlagesLabel') }}</template>
            <b-flags-checkbox-group v-model:flags="flags" :disabled="fetching"></b-flags-checkbox-group>
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
</template>

<script setup lang="ts">
import { ref, computed, nextTick, h } from 'vue';
import { i18n } from '@/common/ui';
import { getTree, updateUrl } from '@/common/bookmark';
import BInputBarRow from '@/components/BInputBarRow.vue';
import BFlagsCheckboxGroup from '@/components/BFlagsCheckboxGroup.vue';
import { message, notification } from 'ant-design-vue';

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

const pattern = ref('');
const flags = ref<string[]>([]);
const replacement = ref('');

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

    curData.value = await getTree(pattern.value, flags.value, replacement.value);
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

function onSelectChange(selected: string[]) {
  selectedRowKeys.value = selected;
}
</script>

<style>
.index-app .index-header {
  width: 100%;
  height: auto;
  background: #f0fcfc;
}
.index-app .index-footer {
  text-align: center;
  background: #dfdfdf;
}
.undo {
  margin-left: 15px;
}
</style>
