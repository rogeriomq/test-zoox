<template>
  <div
    class="relative flex flex-wrap items-center max-w-lg mt-10 p-6 mx-auto bg-white rounded-md shadow-md"
  >
    <select-state @change="onSelectStateChange" />
    <select-city :cities="cities" />
    <div
      class="absolute w-full h-full bg-gray-500 opacity-40 top-0 left-0 rounded-md flex items-center justify-center"
      :class="{ hidden: !loading }"
    >
      <span class="font-black text-black text-opacity-100">Loading...</span>
    </div>
  </div>
</template>

<script>
import { onMounted, watch, ref } from 'vue'
import SelectState from './components/SelectState.vue'
import SelectCity from './components/SelectCity.vue'

import { apiClient } from './services'

export default {
  components: {
    SelectState,
    SelectCity,
  },
  setup() {
    const loading = ref(false)
    const stateSelected = ref('')
    const cities = ref([])

    const onSelectStateChange = async (selected) => {
      stateSelected.value = selected
      try {
        loading.value = true
        cities.value = await apiClient.getCitiesByState(selected)
      } catch (error) {
        cities.value = []
      } finally {
        loading.value = false
      }
    }

    return {
      stateSelected,
      onSelectStateChange,
      cities,
      loading,
    }
  },
}
</script>
