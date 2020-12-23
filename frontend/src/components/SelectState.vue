<template>
  <div class="flex flex-col p-1 min-w-full">
    <label for="states" class="text-gray-500 text-sm"
      >Selecione um Estado</label
    >
    <select
      name="states"
      id="states"
      class="block w-full border border-gray-400 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default"
      v-model="data.selected"
    >
      <option value=""></option>
      <option
        v-for="state in data.states"
        :value="state.abbreviation"
        :key="state._id"
      >
        {{ state.name }} - {{ state.abbreviation }}
      </option>
    </select>
  </div>
</template>
<script>
import { reactive, onMounted, watch } from 'vue'

import { apiClient } from '../services'

export default {
  emits: ['change'],
  setup(props, { emit }) {
    const data = reactive({
      states: [],
      selected: '',
    })

    watch(
      () => data.selected,
      (selected) => {
        emit('change', selected)
      }
    )

    onMounted(async () => {
      try {
        data.states = await apiClient.getStates()
      } catch (error) {
        data.states = []
      }
    })

    return {
      data,
    }
  },
}
</script>
