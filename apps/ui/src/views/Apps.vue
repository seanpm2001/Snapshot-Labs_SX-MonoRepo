<script setup lang="ts">
const router = useRouter();
const route = useRoute();
const { apps, services, load, search, appsCategories, servicesCategories, loading, loaded } =
  useApps();

const q: Ref<string> = ref((route.query.q as string) || '');

const results = computed(() => search(q.value, route.name as string));
const categories = computed(() =>
  route.name === 'apps' ? appsCategories.value : servicesCategories.value
);
const items = computed(() => (route.name === 'apps' ? apps.value : services.value));

onMounted(() => load());

watch(
  () => q.value,
  () => router.replace(!q.value ? {} : { query: { q: q.value } })
);
</script>

<template>
  <div>
    <div class="border-b mb-4">
      <UiContainer class="!max-w-screen-lg flex items-center space-x-3">
        <IH-search />
        <input
          v-model="q"
          type="text"
          :placeholder="`Search for ${route.name as string}`"
          class="py-3 bg-transparent flex-auto text-skin-link"
        />
      </UiContainer>
    </div>
    <UiContainer class="!max-w-screen-lg space-y-4">
      <UiLoading v-if="loading && !loaded" class="block" />
      <div v-else-if="q">
        <UiLink :count="results.length" text="Result(s)" class="inline-block" />
        <div
          v-if="results.length"
          class="flex grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4"
        >
          <AppsListItem
            v-for="(item, i) in results"
            :key="i"
            :app="item"
            :type="route.name === 'apps' ? 'app' : 'service'"
          />
        </div>
        <div v-else class="flex items-center text-skin-link">
          <IH-exclamation-circle class="inline-block mr-2" />
          <span v-text="`There are no ${route.name as string} here.`" />
        </div>
      </div>
      <div v-else>
        <div v-if="items.filter(({ featured }) => featured).length > 0">
          <UiLink text="Featured" class="inline-block" />
          <div class="flex grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <AppsListItem
              v-for="(app, i) in items.filter(({ featured }) => featured)"
              :key="i"
              :app="app"
              :type="route.name === 'apps' ? 'app' : 'service'"
            />
          </div>
        </div>
        <div v-for="(category, i) in categories" :key="i">
          <UiLink
            :count="items.filter(item => category === item.category).length"
            :text="category"
            class="inline-block"
          />
          <div class="flex grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <AppsListItem
              v-for="(app, j) in items.filter(item => category === item.category)"
              :key="j"
              :app="app"
              :type="route.name === 'apps' ? 'app' : 'service'"
            />
          </div>
        </div>
      </div>
    </UiContainer>
  </div>
</template>
