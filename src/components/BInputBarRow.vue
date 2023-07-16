<template>
  <a-row>
    <a-col :md="4" :lg="2">
      <slot name="label"></slot>
    </a-col>
    <a-col :md="20" :lg="22">
      <slot></slot>
    </a-col>
  </a-row>
</template>
