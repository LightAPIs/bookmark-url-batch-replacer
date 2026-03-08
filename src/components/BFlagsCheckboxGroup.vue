<template>
  <a-checkbox-group :value="flags" :disabled="disabled" @update:value="onUpdate" class="b-flags-checkbox-group">
    <a-row>
      <a-col :span="8">
        <a-tooltip :title="i18n('rulesFlagsGTip')">
          <a-checkbox value="g">g</a-checkbox>
        </a-tooltip>
      </a-col>
      <a-col :span="8">
        <a-tooltip :title="i18n('rulesFlagsITip')">
          <a-checkbox value="i">i</a-checkbox>
        </a-tooltip>
      </a-col>
      <a-col :span="8">
        <a-tooltip :title="i18n('rulesFlagsUTip')">
          <a-checkbox value="u">u</a-checkbox>
        </a-tooltip>
      </a-col>
    </a-row>
  </a-checkbox-group>
</template>

<script setup lang="ts">
import { i18n } from '@/common/ui';
import type { CheckboxValueType } from 'ant-design-vue/es/checkbox/interface';

defineProps<{
  flags: string[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:flags', value: string[]): void;
}>();

function onUpdate(value: CheckboxValueType[]) {
  emit(
    'update:flags',
    value.map(v => v.toString()),
  );
}
</script>

<style>
.b-flags-checkbox-group {
  width: 100%;
}
</style>
