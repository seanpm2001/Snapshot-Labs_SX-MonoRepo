<script setup lang="ts">
const props = defineProps<{
  definition: any;
  error?: string;
  dirty?: boolean;
}>();

const showError = computed(() => props.error && props.dirty);
</script>

<template>
  <div class="s-base relative" :class="showError ? 's-error' : ''">
    <label v-if="definition.title" class="s-label !flex w-full items-center">
      <span class="grow" v-text="definition.title" />
      <span
        v-if="definition.maxLength"
        class="text-sm mr-3"
        v-text="`1 / ${definition.maxLength}`"
      />
    </label>
    <slot />
    <span v-if="showError" class="s-input-error-message">{{ error }}</span>
    <legend v-if="definition.description" v-text="definition.description" />
  </div>
</template>
