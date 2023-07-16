<template>
  <a-checkbox-group :value="flags" :disabled="disabled" @update:flags="(v: string[]) => emit('update:flags', v)" class="b-flags-checkbox-group">
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

defineProps<{
  flags: string[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:flags', value: string[]): void;
}>();
</script>

<style>
.b-flags-checkbox-group {
  width: 100%;
}
</style>
