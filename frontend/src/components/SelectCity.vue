<template>
  <div class="w-full flex flex-col py-1">
    <div class="flex flex-col relative">
      <label for="input-filter" class="text-gray-500 text-sm"
        >Selecione a Cidade</label
      >
      <input
        v-if="data.showInput"
        type="search"
        autofocus
        name="input-filter"
        id="input-filter"
        ref="inputFilter"
        class="p-2 border-b border-gray-400 w-full"
        v-model="data.term"
        @blur="onInputFilterBlur"
      />
      <span
        v-else
        class="p-2 border-b border-gray-400 w-full select-none cursor-pointer"
        @dblclick="onShowInput()"
      >
        {{ data.selectedCity.name || 'Cidade não informada' }}
      </span>
      <div
        class="absolute top-0 left-0 right-0 mt-16"
        :class="{ hidden: !data.showList }"
      >
        <ul
          class="w-full bg-white border border-gray-400 shadow-md rounded-md overflow-y-auto max-h-48"
        >
          <li
            class="focus:bg-gray-300 hover:bg-indigo-400 hover:text-white my-2 flex"
            v-for="city in filtered"
            :key="city._id"
          >
            <button
              type="buttom"
              class="w-full mt-1 p-2 cursor-pointer text-left"
              @click="changeSelected(city)"
            >
              {{ city.name }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, watch, ref, computed } from 'vue'
export default {
  props: {
    cities: { type: Array, required: true },
  },
  setup(props) {
    const data = reactive({
      selectedCity: {},
      term: '',
      showInput: false,
      showList: false,
    })
    const inputFilter = ref(null)

    watch(
      () => props.cities,
      () => {
        data.term = ''
        data.showInput = false
        data.showList = false
        data.selectedCity = {}
      }
    )

    const filtered = computed(() => {
      if (!data.term) {
        return [...props.cities]
      }
      const newList = props.cities.filter((city) =>
        city.name.toLowerCase().includes(data.term.toLowerCase())
      )
      if (newList.length) data.showList = true
      return newList
    })

    const onShowInput = (event) => {
      data.showInput = true
    }

    const onInputFilterBlur = (event) => {
      event.preventDefault()
      data.showInput = false
    }

    const changeSelected = (city) => {
      data.selectedCity = city
      data.showList = false
      data.showInput = false
    }
    return {
      data,
      filtered,
      inputFilter,
      onShowInput,
      onInputFilterBlur,
      changeSelected,
    }
  },
}
</script>
