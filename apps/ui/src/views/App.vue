<script setup lang="ts">
import { getUrl, simplifyURL } from '@/helpers/utils';

const route = useRoute();
const { load, get, loading, loaded } = useApps();
const { setTitle } = useTitle();

const id = route.params.app as string;
const app = computed(() => get(id));

watchEffect(() => {
  if (!app.value.name) return;

  setTitle(app.value.name);
});

onMounted(() => load());
</script>

<template>
  <div class="pt-12 pb-8">
    <div class="border-t">
      <UiContainer class="!max-w-screen-lg mt-4">
        <UiLoading v-if="loading && !loaded" class="block" />
        <div v-else>
          <div class="flex space-x-1 items-center text-[17px] mb-5">
            <AppLink :to="{ name: 'site-ecosystem' }" class="flex items-center">
              <IH-view-grid class="mr-1" />
              Ecosystem
            </AppLink>
            <IH-chevron-right class="size-[14px]" />
            <div v-text="app.name" />
          </div>
          <div class="md:flex items-center mb-5">
            <div class="flex items-center flex-1 mb-3 md:mb-0">
              <img
                class="size-[80px] rounded-lg mr-3"
                :src="getUrl(app.avatar) || ''"
                :alt="app.name"
              />
              <div class="flex-1 leading-5 mb-1">
                <h1 v-text="app.name" />
                <div v-text="app.category" />
              </div>
            </div>
            <a v-if="app.link" :href="app.link" target="_blank">
              <UiButton class="primary w-full">Use integration</UiButton>
            </a>
          </div>
          <div class="md:flex md:space-x-4">
            <div class="space-y-5 p-4 flex-grow border rounded-lg h-fit mb-4">
              <div
                v-if="app.images"
                class="flex overflow-y-scroll no-scrollbar space-x-2"
              >
                <img
                  v-for="(image, i) in app.images.split(',')"
                  :key="i"
                  :src="image"
                  :alt="app.name"
                  class="max-w-[96%]"
                />
              </div>
              <div>
                <div class="eyebrow mb-2">Overview</div>
                <div class="text-md text-skin-link" v-text="app.overview" />
              </div>
              <div v-if="app.how">
                <div class="eyebrow mb-2">How it works</div>
                <div class="text-md text-skin-link" v-text="app.how" />
              </div>
              <div v-if="app.start">
                <div class="eyebrow mb-2">Get started</div>
                <div class="text-md text-skin-link" v-text="app.start" />
              </div>
              <div v-if="app.form">
                <a :href="app.form" target="_blank" class="text-skin-text">
                  <IH-pencil class="inline-block mr-1" /> Edit this page
                </a>
              </div>
            </div>
            <div
              class="border rounded-lg md:w-[300px] shrink-0 h-fit p-4 space-y-3 mb-4"
            >
              <div>
                <h4 class="eyebrow" v-text="'Built by'" />
                {{ app.author }}
              </div>
              <div v-if="app.website">
                <h4 class="eyebrow" v-text="'Website'" />
                <a :href="app.website" target="_blank">
                  {{ simplifyURL(app.website) }}
                  <IH-arrow-sm-right class="inline-block -rotate-45" />
                </a>
              </div>
              <div v-if="app.x">
                <h4 class="eyebrow" v-text="'X (Twitter)'" />
                <a :href="`https://x.com/${app.x}`" target="_blank">
                  {{ app.x }}
                  <IH-arrow-sm-right class="inline-block -rotate-45" />
                </a>
              </div>
              <div v-if="app.github">
                <h4 class="eyebrow" v-text="'Source code'" />
                <a :href="app.github" target="_blank">
                  {{ simplifyURL(app.github) }}
                  <IH-arrow-sm-right class="inline-block -rotate-45" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </UiContainer>
    </div>
  </div>
</template>
