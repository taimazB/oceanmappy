export const state = () => ({
  gj: null,
  filteredGJ: null,
  selected: null,
  palette:{}
})

export const mutations = {
  setGJ(state, obj) {
    state.gj = obj
  },

  setFilteredGJ(state, obj) {
    state.filteredGJ = obj
  },

  setSelected(state, obj) {
    state.selected = obj
  },

  setPalette(state,obj){
    state.palette=obj
  }
}
