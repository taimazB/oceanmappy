import tilebelt from '@mapbox/tilebelt'


export function staticPrepare(cnvTmp,ctxTmp,tileSize,tileAddress,Xs) {
  // --- Convert to array
  const data = ctxTmp.getImageData(0, 0, cnvTmp.width, cnvTmp.height).data

  this.$store.commit('map/setCurrentsCnvProps', {
    data,
    tileSize,
    tileAddress,
    Xs,
    bnds: this.map.getBounds(),
    width: cnvTmp.width
  })

  // --- Convert data to geojson
  const gj = this.generateGJ(tileSize, data)

  // --- Add/update map layer
  this.updateStaticCurrentsLayer(gj)
}

export function generateGJ() {
  const data = this.$store.state.map.currentsCnvProps.data
  const tileSize = this.$store.state.map.currentsCnvProps.tileSize
  const tileAddress = this.$store.state.map.currentsCnvProps.tileAddress
  const Xs = this.$store.state.map.currentsCnvProps.Xs
  const bnds = this.$store.state.map.currentsCnvProps.bnds
  const width = this.$store.state.map.currentsCnvProps.width

  const maxOrg = Math.abs(this.$store.state.layers.categories[0].fields[0].colorbar.minOrg)
  const min = this.$store.state.map.currentsMin
  const max = this.$store.state.map.currentsMax
  // const min = 0
  // const max=100

  // const zoom = this.map.getZoom()
  const zoom = Math.min(Math.round(this.map.getZoom()), 7)
  const features = []

  const n = this.$vuetify.breakpoint.smAndDown? 20:75  // --- For mobile support
  
  for (
    let lon = bnds._sw.lng;
    lon <= bnds._ne.lng;
    lon += (bnds._ne.lng - bnds._sw.lng) / n
  ) {
    for (
      let lat = bnds._sw.lat;
      lat <= bnds._ne.lat;
      lat += (bnds._ne.lng - bnds._sw.lng) / n
    ) {
      const XYZ = tilebelt.pointToTileFraction(lon, lat, zoom)
      let DX = (XYZ[0] - Xs[0])
      if (DX<0) DX += 2**zoom
      const i =
        4 *
        (parseInt(tileSize * (XYZ[1] - tileAddress.ne[1])) * width +
          parseInt(tileSize * DX))
      const u = -maxOrg + (2 * maxOrg * data[i]) / 255
      const v = -maxOrg + (2 * maxOrg * data[i + 1]) / 255

      if (data[i] !== 127 && data[i + 1] !== 127) {
        let speed = Math.sqrt(u ** 2 + v ** 2)
        let arrow
        if (speed >= min && speed <= max) arrow = 'arrowBlack'
        else if (speed > max) {
          speed = max
          arrow = 'arrowRed'
        } else {
          speed = min
          arrow = 'arrowRed'
        }
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lon, lat]
          },
          properties: {
            // speed: (0.75 * speed) / (max - min) + 0.01,
            speed: (0.5 * speed) / (max - min) + 0.001,
            direction: (-Math.atan2(v, u) * 180) / Math.PI,
            arrow
          }
        })
      }
    }
  }

  return {
    type: 'FeatureCollection',
    features
  }
}

export function updateStaticCurrentsLayer(gj) {
  if (
    !this.map
      .getStyle()
      .layers.map(layer => layer.id)
      .includes('currents')
  ) {
    this.map.addSource('currents', {
      type: 'geojson',
      data: gj
    })

    this.map.addLayer(
      {
        id: 'currents',
        type: 'symbol',
        source: 'currents',
        layout: {
          'icon-image': ['get', 'arrow'],
          'icon-size': ['get', 'speed'],
          'icon-rotate': ['get', 'direction'],
          'icon-allow-overlap': true
        },
        paint:{
          'icon-opacity': this.activeLayerOpacity
        }
      },
      'topLayer'
    )
    this.sortLayers()

    this.map.on('ideal', 'currents', () => {
      this.loadImageCurrents()
    })
  } else {
    this.map.getSource('currents').setData(gj)
  }
}
