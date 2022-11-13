export function updateSentinelBoxes() {
  if (!Object.keys(this.map.getStyle().sources).includes('sentinelBoxes')) {
    this.map.addSource('sentinelBoxes', {
      type: 'geojson',
    })

    this.map.addLayer({
      id: `sentinelBoxes`,
      type: 'fill',
      source: `sentinelBoxes`,
      layout: {
        visibility: 'visible',
      },
      paint: {
        'fill-opacity': 0.25,
      },
    })
  }

  const gj = this.$store.state.sentinel.filteredGJ
  this.map.getSource('sentinelBoxes').setData(gj)
}

export function updateSentinelImage() {
  const sessionID = this.$store.state.map.sessionID
  const selected = this.$store.state.sentinel.selected
  const fileName = selected.properties.fileName
  const min = this.$store.state.sentinel.palette.min
  const max = this.$store.state.sentinel.palette.max
  const colors = this.$store.state.sentinel.palette.colors
    .map((c) => c.replace('#', ''))
    .join(',')

  //   let url = `${process.env.tuvaq2Url}/sentinelTile?filename=${fileName}&minLon=${minLon}&maxLon=${maxLon}&minLat=${minLat}&maxLat=${maxLat}&z={z}&x={x}&y={y}`
  //   let url = `${process.env.tuvaq2Url}/layers/Sentinel/tiles/${fileName}/{z}/{x}/{y}.png`
  let url = `${process.env.tuvaq2Url}/sentinelTile?id=${sessionID}&filename=${fileName}&z={z}&x={x}&y={y}&min=${min}&max=${max}&colors=${colors}`
  // console.log(url);
  //   stops.forEach((stop) => {
  //     url = `${url}&stop=${stop}`
  //   })
  //   colors.forEach((color) => {
  //     url = `${url}&color=${color}`
  //   })

  url = `${url}&dt=${Date.now()}`

  // const sources = Object.keys(this.map.getStyle().sources)
  // const oldLayers = sources.filter((src) => src.includes('filled'))

  if (!Object.keys(this.map.getStyle().sources).includes('sentinelImage')) {
    this.map.addSource('sentinelImage', {
      type: 'raster',
      tiles: [url],
      tilesize: 512,
    })

    this.map.addLayer({
      id: 'sentinelImage',
      type: 'raster',
      source: 'sentinelImage',
      paint: {
        'raster-resampling': 'nearest',
        'raster-opacity': 1.0,
      },
    })
  } else {
    this.map.removeLayer('sentinelImage')
    this.map.removeSource('sentinelImage')

    this.map.addSource('sentinelImage', {
      type: 'raster',
      tiles: [url],
      tilesize: 512,
    })

    this.map.addLayer({
      id: 'sentinelImage',
      type: 'raster',
      source: 'sentinelImage',
      paint: {
        'raster-resampling': 'nearest',
        'raster-opacity': 1.0,
      },
    })
  }

  this.sortLayers()
}

export function removeSentinel() {
  try {
    this.map.removeLayer('sentinelBoxes')
    this.map.removeSource('sentinelBoxes')
    this.map.removeLayer('sentinelImage')
    this.map.removeSource('sentinelImage')
  } catch (error) {}
}
