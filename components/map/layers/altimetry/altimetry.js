import mapboxgl from 'mapbox-gl'
import axios from 'axios'
import moment from 'moment'

export function updateAltimetry() {
  // --- ADD ALTIMETRY
  if (this.selectedAltimetryPackage.variable) {
    this.$store.commit('altimetry/setLoadingAltimetry', true)

    if (!Object.keys(this.map.getStyle().sources).includes('altimetry')) {
      this.map.addSource('altimetry', {
        type: 'geojson',
      })

      this.map.addLayer({
        id: `altimetry`,
        type: 'circle',
        source: `altimetry`,
        layout: {
          visibility: 'visible',
        },
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 3, 7, 10],
        },
      })

      // READ VALUES WITH HOVER
      let altimetryID = null
      const popup = new mapboxgl.Popup({
        closeOnClick: false,
        closeButton: false,
      })

      this.map.on('mousemove', 'altimetry', (event) => {
        this.map.getCanvas().style.cursor = 'pointer'
        // Set constants equal to the current feature's magnitude, location, and time
        const value =
          event.features[0].properties[this.selectedAltimetryPackage.variable]
        const time = event.features[0].properties.time

        // Check whether features exist
        if (event.features.length === 0) return

        const popupText = `<div>
      <div>${moment.utc(1000 * time).format('D MMM, HH:mm')}</div>
      <div>${Math.round(100000 * value) / 100000} m</div>
      </div>`
        popup.setLngLat(event.lngLat).setHTML(popupText).addTo(this.map)

        // If quakeID for the hovered feature is not null,
        // use removeFeatureState to reset to the default behavior
        if (altimetryID) {
          this.map.removeFeatureState({
            source: 'altimetry',
            id: altimetryID,
          })
        }

        altimetryID = event.features[0].id

        // When the mouse moves over the earthquakes-viz layer, update the
        // feature state for the feature under the mouse
        this.map.setFeatureState(
          {
            source: 'altimetry',
            id: altimetryID,
          },
          {
            hover: true,
          }
        )
      })

      this.map.on('mouseleave', 'altimetry', () => {
        popup.remove()

        if (altimetryID) {
          this.map.setFeatureState(
            {
              source: 'earthquakes',
              id: altimetryID,
            },
            {
              hover: false,
            }
          )
        }

        altimetryID = null

        // Reset the cursor style
        this.map.getCanvas().style.cursor = ''
      })

      this.sortLayers()
    }

    const altimetryLoadedGJs = this.$store.state.altimetry.altimetryLoadedGJs
    const promises = []

    this.selectedAltimetryPackage.satellites.forEach((satellite) => {
      this.selectedAltimetryPackage.dates.forEach((date) => {
        if (
          !altimetryLoadedGJs.map((obj) => obj.satellite).includes(satellite) ||
          !altimetryLoadedGJs.map((obj) => obj.date).includes(date)
        ) {
          const url = `${process.env.tuvaq2Url}/models/Altimetry/gj/${satellite}_${date}.geojson`
          promises.push(
            axios({ method: 'get', url }).catch((err) => {
              console.log(err)
              return null
            })
          )
        }
      })
    })

    Promise.all(promises).then((responses) => {
      responses.forEach((response) => {
        if (response) {
          const satDate = response.request.responseURL
            .replace(/.*gj\//, '')
            .replace('.geojson', '')
            .split('_')
          altimetryLoadedGJs.push({
            satellite: satDate[0],
            date: satDate[1],
            gj: response.data,
          })
        }
      })

      const features = []
      this.selectedAltimetryPackage.satellites.forEach((satellite) => {
        this.selectedAltimetryPackage.dates.forEach((date) => {
          const preloadedSatDate = altimetryLoadedGJs.filter(
            (obj) => obj.satellite === satellite && obj.date === date
          )[0]

          if (preloadedSatDate) features.push(...preloadedSatDate.gj.features)
        })
      })

      const gj = {
        type: 'FeatureCollection',
        features,
      }
      this.$store.commit('altimetry/setAltimetryShownGJs', gj)

      this.map.getSource('altimetry').setData(gj)

      // this.updateAltimetry(altimetryLoadedGJs)

      this.$store.commit('altimetry/setLoadingAltimetry', false)
    })
  } else {
    try {
      this.map.removeLayer('altimetry')
      this.map.removeSource('altimetry')
    } catch (error) {}
  }
}

export function updateAltimetryColormap() {
  this.map.setPaintProperty(
    'altimetry',
    'circle-color',
    this.altimetryMapboxColormap
  )
}

// export function updateAltimetry(altimetryLoadedGJs) {
//   const features = []
//   this.selectedAltimetrySatellites.forEach((satellite) => {
//     this.selectedAltimetryDates.forEach((date) => {
//       const preloadedSatDate = altimetryLoadedGJs.filter(
//         (obj) => obj.satellite === satellite && obj.date === date
//       )[0]

//       if (preloadedSatDate) features.push(...preloadedSatDate.gj.features)
//     })
//   })

//   const gj = {
//     type: 'FeatureCollection',
//     features,
//   }
//   this.$store.commit('layers/setAltimetryShownGJs', gj)

//   this.map.getSource('altimetry').setData(gj)
//   this.map.setPaintProperty(
//     'altimetry',
//     'circle-color',
//     this.altimetryMapboxColormap
//   )
// }
