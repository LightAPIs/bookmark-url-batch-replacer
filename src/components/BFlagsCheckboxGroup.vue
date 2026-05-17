<template>
  <a-checkbox-group v-model:value="flags" :disabled="disabled" class="b-flags-checkbox-group">
    <a-row>
      <a-col :span="6">
        <a-tooltip :title="i18n('rulesFlagsGTip')">
          <a-checkbox value="g">g</a-checkbox>
        </a-tooltip>
      </a-col>
      <a-col :span="6">
        <a-tooltip :title="i18n('rulesFlagsITip')">
          <a-checkbox value="i">i</a-checkbox>
        </a-tooltip>
      </a-col>
      <a-col :span="6">
        <a-tooltip :title="i18n('rulesFlagsUTip')">
          <a-checkbox value="u">u</a-checkbox>
        </a-tooltip>
      </a-col>
      <a-col :span="6">
        <a-tooltip :title="i18n('rulesFlagsVTip')">
          <a-checkbox value="v">v</a-checkbox>
          <!-- ! chrome 112+ | firefox 116+ -->
        </a-tooltip>
      </a-col>
    </a-row>
  </a-checkbox-group>
</template>

<script setup lang="ts">
import { i18n } from '@/common/ui';

const flags = defineModel<string[]>('flags', {
  required: true,
});

defineProps<{
  disabled?: boolean;
}>();
</script>

<style>
.b-flags-checkbox-group {
  width: 100%;
}
</style>
