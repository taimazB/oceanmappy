export const state = () => ({
  //   selectedAltimetrySatellites: [],
  //   selectedAltimetryDates: [],
  //   selectedAltimetryVariable: null,
  altimetryLoadedGJs: [], // --- [{satellite:'', date:'', gj:''}, ...]
  altimetryShownGJs: [], // --- Stores altimetry gj's already shown on the map.  Used for finding min/max in colorbar.
  loadingAltimetry: false,
  //   altimetryAvailSatDates: {},
  selectedAltimetryPackage: { satellites: [], dates: [], variable: '' },
  altimetryMapboxColormap: [],

  field: {
    // --- Needed for colorbar
    field: 'altimetry',
    colorbar: {
      hasColorbar: true,
      step: 0.001,
      minOrg: -1,
      toFixed: 3,
      unit: 'm',
      colormapOrg: [
        {
          value: -1,
          color: '#003399',
        },
        {
          value: -0.75,
          color: '#33cccc',
        },
        {
          value: -0.5,
          color: '#00cc66',
        },
        {
          value: -0.25,
          color: '#66ff66',
        },
        {
          value: 0,
          color: '#ffffff',
        },
        {
          value: 0.25,
          color: '#ffff00',
        },
        {
          value: 0.5,
          color: '#ff9900',
        },
        {
          value: 0.75,
          color: '#ff3300',
        },
        {
          value: 1,
          color: '#800000',
        },
      ],
      colormap: [
        {
          value: -1,
          color: '#003399',
        },
        {
          value: -0.75,
          color: '#33cccc',
        },
        {
          value: -0.5,
          color: '#00cc66',
        },
        {
          value: -0.25,
          color: '#66ff66',
        },
        {
          value: 0,
          color: '#ffffff',
        },
        {
          value: 0.25,
          color: '#ffff00',
        },
        {
          value: 0.5,
          color: '#ff9900',
        },
        {
          value: 0.75,
          color: '#ff3300',
        },
        {
          value: 1,
          color: '#800000',
        },
      ],
    },
  },
})

export const mutations = {
  //   setAltimetryAvailSatDates(state, obj) {
  //     state.altimetryAvailSatDates = obj
  //   },

  //   setSelectedAltimetrySatellites(state, array) {
  //     state.selectedAltimetrySatellites = array
  //   },

  //   setSelectedAltimetryDates(state, array) {
  //     state.selectedAltimetryDates = array
  //   },

  setSelectedAltimetryPackage(state, obj) {
    state.selectedAltimetryPackage = obj
  },

  //   setSelectedAltimetryVariable(state, value) {
  //     state.selectedAltimetryVariable = value
  //   },

  setAltimetryShownGJs(state, array) {
    state.altimetryShownGJs = array
  },
  // setAltimetryGJ(state, gj) {
  //   state.altimetryGJ = gj
  // },

  setLoadingAltimetry(state, status) {
    state.loadingAltimetry = status
  },

  setAltimetryMapboxColormap(state, array) {
    state.altimetryMapboxColormap = array
  },
}
