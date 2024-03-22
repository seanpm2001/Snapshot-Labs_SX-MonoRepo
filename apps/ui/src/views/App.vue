<script setup lang="ts">
import { simplifyURL } from '@/helpers/utils';

const route = useRoute();
const { load, get, loading, loaded } = useApps();

const id = route.params.id as string;
const item = computed(() => get(id, route.name as 'app' | 'service'));

onMounted(() => load());
</script>

<template>
  <div class="pt-4">
    <UiContainer class="!max-w-screen-lg">
      <UiLoading v-if="loading && !loaded" class="block" />
      <div v-else>
        <div class="flex space-x-1 items-center text-[17px] mb-4">
          <router-link
            :to="{ name: route.name === 'app' ? 'apps' : 'services' }"
            class="flex items-center"
          >
            <IH-view-grid class="mr-1" />
            {{ route.name === 'app' ? 'Apps' : 'Services' }}
          </router-link>
          <IH-chevron-right class="w-[14px] h-[14px]" />
          <div v-text="item.name" />
        </div>
        <div class="md:flex items-center mb-5">
          <div class="flex items-center flex-1 mb-3 md:mb-0">
            <img class="w-[80px] h-[80px] rounded-lg mr-3" :src="item.avatar" />
            <div class="flex-1 leading-5 mb-1">
              <h1 v-text="item.name" />
              <div v-text="item.category" />
            </div>
          </div>
          <a v-if="item.link" :href="item.link" target="_blank">
            <UiButton class="primary w-full">
              Use integration
              <IH-arrow-sm-right class="inline-block -rotate-45" />
            </UiButton>
          </a>
        </div>
        <div class="md:flex md:space-x-4">
          <div class="space-y-5 p-4 border rounded-lg h-fit mb-4">
            <div>
              <div class="eyebrow mb-2">Overview</div>
              <div class="text-md text-skin-link" v-text="item.overview" />
            </div>
            <div v-if="item.how">
              <div class="eyebrow mb-2">How it works</div>
              <div class="text-md text-skin-link" v-text="item.how" />
            </div>
            <div v-if="item.start">
              <div class="eyebrow mb-2">Get started</div>
              <div class="text-md text-skin-link" v-text="item.start" />
            </div>
          </div>
          <div class="border rounded-lg md:w-[300px] shrink-0 h-fit p-4 space-y-3 mb-4">
            <div>
              <h4 class="eyebrow" v-text="'Built by'" />
              {{ item.author }}
            </div>
            <div v-if="item.website">
              <h4 class="eyebrow" v-text="'Website'" />
              <a :href="item.website" target="_blank">
                {{ simplifyURL(item.website) }}
                <IH-arrow-sm-right class="inline-block -rotate-45" />
              </a>
            </div>
            <div v-if="item.x">
              <h4 class="eyebrow" v-text="'X (Twitter)'" />
              <a :href="`https://twitter.com/${item.x}`" target="_blank">
                {{ item.x }}
                <IH-arrow-sm-right class="inline-block -rotate-45" />
              </a>
            </div>
            <div v-if="item.github">
              <h4 class="eyebrow" v-text="'Source code'" />
              <a :href="item.github" target="_blank">
                {{ simplifyURL(item.github) }}
                <IH-arrow-sm-right class="inline-block -rotate-45" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </UiContainer>
  </div>
</template>
