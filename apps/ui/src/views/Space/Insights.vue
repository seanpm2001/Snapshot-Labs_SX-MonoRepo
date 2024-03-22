<script setup lang="ts">
import { Space } from '@/types';

const props = defineProps<{ space: Space }>();

const { setTitle } = useTitle();

const activeDelegationId = ref(0);
const delegateData = computed(() => props.space.delegations[activeDelegationId.value]);

watchEffect(() => setTitle(`Insights - ${props.space.name}`));
</script>

<template>
  <SpaceDelegates
    v-if="delegateData"
    :key="activeDelegationId"
    :space="space"
    :delegation="delegateData"
  />
</template>
