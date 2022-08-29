export const state = () => ({
  argoLatest: null,
  selectedFloats: [],
  plotData: {index:null},
})

export const mutations = {
  setArgoLatest(state, obj) {
    state.argoLatest = obj
  },

  setPlotData(state, obj) {
    state.plotData = obj
  },

  // push2SelectedFloats(state,obj){
  //   state.selectedFloats.push(obj)
  // },

  // removeFromSelectedFloats(state,obj){
  //   state.selectedFloats = state.selectedFloats.filter(f=>f.WMO!==obj.WMO)
  // },
}
