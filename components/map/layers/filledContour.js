export function addFilledContour() {
  const sessionID = this.$store.state.map.sessionID
  const selected = this.$store.state.layers.selected
  // const category = this.$store.state.layers.categories.filter(
  //   (c) => c.name === selected.category
  // )[0]
  const group = selected.field.group
  // const field = category.fields.filter((f) => f.name === selected.field)[0]
  // const fieldName = fieldName
  // const model = selected.name
  // const multiRegion = selected.regions.length > 1
  // const iRegion = selected.iRegion
  // const regionName = selected.regions[iRegion].name
  
  const level = selected.hasLevels
    ? selected.region.levels.values[selected.region.levels.iLevel]
    : null
  // const date = this.$store.state.layers.interDate
  // const time = this.$store.state.layers.interTime
  const dateTime = this.$store.state.layers.interDateTime.format('YYYYMMDD_HH')
  const colorbar = selected.field.colorbar
  const minOrg = colorbar.minOrg
  const step = colorbar.step
  const stops = []
  const colors = []
  colorbar.colormap.forEach((obj) => {
    stops.push(obj.value)
    colors.push(obj.color.replace('#', ''))
  })

  let url
  url = `${process.env.tuvaq2Url}/tile4nc_20221026?id=${sessionID}&field=${selected.field.name}&model=${selected.modelName}&isMultiRegion=${selected.isMultiRegion}&regionName=${selected.region.name}&dateTime=${dateTime}&level=${level}&z={z}&x={x}&y={y}&minOrg=${minOrg}&step=${step}`
console.log(url);
  stops.forEach((stop) => {
    url = `${url}&stop=${stop}`
  })
  colors.forEach((color) => {
    url = `${url}&color=${color}`
  })

  url = `${url}&dt=${Date.now()}`

  const sources = Object.keys(this.map.getStyle().sources)
  const oldLayers = sources.filter((src) => src.includes('filled'))

  if (oldLayers.length === 0) {
    this.map.addSource(`filled_${group}_0`, {
      type: 'raster',
      tiles: [url],
      tilesize: 512,
    })

    this.map.addLayer(
      {
        id: `filled_${group}_0`,
        type: 'raster',
        source: `filled_${group}_0`,
        paint: {
          'raster-resampling': 'nearest',
          'raster-opacity': this.activeLayerOpacity,
          // 'raster-opacity': 0.25
        },
      }
      // upLayer
    )
  } else {
    const oldLayer = oldLayers[oldLayers.length - 1]
    const i = parseInt(oldLayer.split('_')[2]) + 1
    this.map.addSource(`filled_${group}_${i}`, {
      type: 'raster',
      tiles: [url],
      tilesize: 512,
    })

    this.map.addLayer({
      id: `filled_${group}_${i}`,
      type: 'raster',
      source: `filled_${group}_${i}`,
      paint: {
        'raster-resampling': 'nearest',
        'raster-opacity': this.activeLayerOpacity,
        // 'raster-opacity': 0.25
      },
    })

    this.map.once('idle', (e) => {
      oldLayers.forEach((oldLayer) => {
        this.map.removeLayer(oldLayer)
        this.map.removeSource(oldLayer)
      })
    })
  }

  this.sortLayers()
}

export function removeFilledContour() {
  const sources = Object.keys(this.map.getStyle().sources)
  const oldLayers = sources.filter((src) => src.includes('filled'))
  oldLayers.forEach((oldLayer) => {
    this.map.removeLayer(oldLayer)
    this.map.removeSource(oldLayer)
  })
}
