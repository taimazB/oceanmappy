export function updateArgoCoordinates() {
  if (!Object.keys(this.map.getStyle().sources).includes('argo')) {
    this.map.addSource('argo', {
      type: 'geojson',
    })

    this.map.addLayer({
      id: `argo`,
      type: 'circle',
      source: `argo`,
      layout: {
        visibility: 'visible',
      },
      paint: {
        'circle-radius': 2,
      },
    })
  }

  const gj = this.$store.state.argo.argoLatest
  this.map.getSource('argo').setData(gj)

  this.map.on('click', this.argoClicked)
}

export function argoClicked(e) {
  const bbox = [
    [e.point.x - 5, e.point.y - 5],
    [e.point.x + 5, e.point.y + 5],
  ]
  // --- Find features intersecting the bounding box.
  const selectedFeatures = this.map.queryRenderedFeatures(bbox, {
    layers: ['argo'],
  })

  selectedFeatures.forEach((feature) => {
    const WMO = feature.properties.WMO
    const i = this.selectedFloats.map((f) => f.WMO).indexOf(WMO)
    if (i >= 0) this.selectedFloats[i].show = true
    else
      this.selectedFloats.push({ WMO, show: true, color: this.randomColor() })
  })
}

export function updateArgoTracks() {
  const mapWMOs = Object.keys(this.map.getStyle().sources)
    .filter((src) => src.includes('argoTrack'))
    .map((x) => x.split('_')[1])

  this.selectedFloats.forEach((f) => {
    const src = `argoTrack_${f.WMO}`
    if (f.show) {
      // --- Add to map if WMO is in the selected list, but not in the map
      if (!mapWMOs.includes(f.WMO)) {
        this.$axios({
          method: 'post',
          url: `${process.env.tuvaq2Url}/getArgoTrack`,
          data: { WMO: f.WMO },
        }).then((res) => {
          const gj = res.data
          this.map.addSource(src, {
            type: 'geojson',
          })

          this.map.addLayer({
            id: `${src}_circle`,
            type: 'circle',
            source: src,
            layout: {
              visibility: 'visible',
            },
            paint: {
              'circle-radius': 2,
              'circle-color': f.color,
            },
          })

          this.map.addLayer({
            id: `${src}_line`,
            type: 'line',
            source: src,
            layout: {
              visibility: 'visible',
            },
            paint: {
              'line-width': 1,
              'line-color': f.color,
            },
          })

          this.map.getSource(src).setData(gj)
          this.sortLayers()
        })
      }
      // --- Update properties of the already present track
      else {
        this.map.setPaintProperty(`${src}_circle`, 'circle-color', f.color)
        this.map.setPaintProperty(`${src}_line`, 'line-color', f.color)
      }
    }
    // --- Remove from map
    else if (mapWMOs.includes(f.WMO)) {
      this.map.removeLayer(`${src}_circle`)
      this.map.removeLayer(`${src}_line`)
      this.map.removeSource(src)
    }
  })

  // --- Update last point circle size based on selectedFloats
  // FIX LATER (last remaining point doesn't shrink)
  this.map.setPaintProperty('argo', 'circle-radius', [
    'match',
    ['get', 'WMO'],
    this.selectedFloats.filter((f) => f.show).map((f) => f.WMO),
    4,
    2,
  ])
}

export function updateArgoProfilePoint() {
  if (this.argoPlotData.index) {
    const feature = this.argoPlotData.features[this.argoPlotData.index]
    const gj = { type: 'FeatureCollection', features: [feature] }
    const sourceName = 'argoProfilePoint'

    if (
      !Object.keys(this.map.getStyle().sources).includes('argoProfilePoint')
    ) {
      this.map.addSource(sourceName, {
        type: 'geojson',
      })

      this.map.addLayer({
        id: sourceName,
        type: 'circle',
        source: sourceName,
        layout: {
          visibility: 'visible',
        },
        paint: {
          'circle-radius': 4,
          'circle-color': this.argoPlotData.color,
        },
      })
      this.sortLayers()
    }
    this.map.getSource(sourceName).setData(gj)
    this.map.setPaintProperty(
      'argoProfilePoint',
      'circle-color',
      this.argoPlotData.color
    )
  } else {
    try {
      this.map.removeLayer('argoProfilePoint')
      this.map.removeSource('argoProfilePoint')
    } catch (error) {}
  }
}
