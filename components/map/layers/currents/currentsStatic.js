// import tilebelt from '@mapbox/tilebelt'

// export function staticPrepare(cnvTmp, ctxTmp, tileSize, tileAddress, Xs) {
// export function staticPrepare() {
//   // --- Convert to array
//   // const data = ctxTmp.getImageData(0, 0, cnvTmp.width, cnvTmp.height).data

//   // this.$store.commit('map/setCurrentsCnvProps', {
//   //   data,
//   //   tileSize,
//   //   tileAddress,
//   //   Xs,
//   //   bnds: this.map.getBounds(),
//   //   width: cnvTmp.width,
//   // })

//   // --- Convert data to geojson
//   this.generateGJ()
// }

// export function generateGJ() {
//   const sessionID = this.$store.state.map.sessionID
//   const model = this.$store.state.layers.selected.modelName
//   // const iLevel =
//   //   this.$store.state.layers.selected.levels.values.length -
//   //   this.$store.state.layers.selected.levels.iLevel -
//   //   1
//   const iLevel = 0
//   const date = this.$store.state.layers.interDate
//   const time = this.$store.state.layers.interTime

//   const bnds = this.$store.state.map.bnds

//   this.$axios({
//     method: 'post',
//     url: `${process.env.tuvaq2Url}/HYCOMdirection`,
//     data: {
//       id: sessionID,
//       model,
//       date,
//       time,
//       iLevel,
//       minLon: bnds._sw.lng,
//       maxLon: bnds._ne.lng,
//       minLat: bnds._sw.lat,
//       maxLat: bnds._ne.lat,
//     },
//   }).then((res) => {
//     // --- Add/update map layer
//     this.updateStaticCurrentsLayer(res.data)
//   })

  // const data = this.$store.state.map.currentsCnvProps.data
  // const tileSize = this.$store.state.map.currentsCnvProps.tileSize
  // const tileAddress = this.$store.state.map.currentsCnvProps.tileAddress
  // const Xs = this.$store.state.map.currentsCnvProps.Xs
  // const bnds = this.$store.state.map.currentsCnvProps.bnds
  // const width = this.$store.state.map.currentsCnvProps.width

  // const maxOrg = Math.abs(this.$store.state.layers.categories[0].fields[0].colorbar.minOrg)
  // const min = this.$store.state.map.currentsMin
  // const max = this.$store.state.map.currentsMax
  // // const min = 0
  // // const max=100

  // // const zoom = this.map.getZoom()
  // const zoom = Math.min(Math.round(this.map.getZoom()), 7)
  // const features = []

  // const n = this.$vuetify.breakpoint.smAndDown? 20:75  // --- For mobile support

  // for (
  //   let lon = bnds._sw.lng;
  //   lon <= bnds._ne.lng;
  //   lon += (bnds._ne.lng - bnds._sw.lng) / n
  // ) {
  //   for (
  //     let lat = bnds._sw.lat;
  //     lat <= bnds._ne.lat;
  //     lat += (bnds._ne.lng - bnds._sw.lng) / n
  //   ) {
  //     const XYZ = tilebelt.pointToTileFraction(lon, lat, zoom)
  //     let DX = (XYZ[0] - Xs[0])
  //     if (DX<0) DX += 2**zoom
  //     const i =
  //       4 *
  //       (parseInt(tileSize * (XYZ[1] - tileAddress.ne[1])) * width +
  //         parseInt(tileSize * DX))
  //     const u = -maxOrg + (2 * maxOrg * data[i]) / 255
  //     const v = -maxOrg + (2 * maxOrg * data[i + 1]) / 255

  //     if (data[i] !== 127 && data[i + 1] !== 127) {
  //       let speed = Math.sqrt(u ** 2 + v ** 2)
  //       let arrow
  //       if (speed >= min && speed <= max) arrow = 'arrowBlack'
  //       else if (speed > max) {
  //         speed = max
  //         arrow = 'arrowRed'
  //       } else {
  //         speed = min
  //         arrow = 'arrowRed'
  //       }
  //       features.push({
  //         type: 'Feature',
  //         geometry: {
  //           type: 'Point',
  //           coordinates: [lon, lat]
  //         },
  //         properties: {
  //           // speed: (0.75 * speed) / (max - min) + 0.01,
  //           speed: (0.5 * speed) / (max - min) + 0.001,
  //           direction: (-Math.atan2(v, u) * 180) / Math.PI,
  //           arrow
  //         }
  //       })
  //     }
  //   }
  // }

  // return {
  //   type: 'FeatureCollection',
  //   features
  // }
// }

export function updateStaticUV(gj) {
  const field = this.$store.state.layers.selected.field.name

  if (
    !this.map
      .getStyle()
      .layers.map((layer) => layer.id)
      .includes(field)
  ) {
    this.map.addSource(field, {
      type: 'geojson',
      data: gj,
    })

    this.map.addLayer({
      id: field,
      type: 'symbol',
      source: field,
      layout: {
        'icon-image': 'arrowBlack', // ['get', 'arrow'],
        'icon-size': ['/', ['get', 'speed'], this.maxSpeed],
        'icon-rotate': ['get', 'direction'],
        'icon-allow-overlap': true,
      },
      // paint: {
      //   'icon-opacity': this.activeLayerOpacity,
      // },
    })
    this.sortLayers()
  } else {
    this.map.getSource(field).setData(gj)
  }
}

export function updateStaticUVmaxSpeed() {
  const field = this.$store.state.layers.selected.field
  if (
    this.map
      .getStyle()
      .layers.map((layer) => layer.id)
      .includes(field)
  ) {
    this.map.setLayoutProperty(field, 'icon-size', [
      '/',
      ['get', 'speed'],
      this.maxSpeed,
    ])
  }
}
