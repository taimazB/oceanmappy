export function loadUV() {
  const sessionID = this.$store.state.map.sessionID
  const bnds = this.map.getBounds()
  const minLon = bnds._sw.lng
  const maxLon = bnds._ne.lng
  const minLat = bnds._sw.lat
  const maxLat = bnds._ne.lat

  // const field = this.selected.field
  // const model = this.selected.modelName

  // const iRegion = this.selected.iRegion
  // const regionName = this.selected.regions[iRegion].name
  const level = this.selected.hasLevels
    ? this.selected.region.levels.values[this.selected.region.levels.iLevel]
    : null

  // const date = this.$store.state.layers.interDate
  // const time = this.$store.state.layers.interTime
  const dateTime = this.$store.state.layers.interDateTime.format('YYYYMMDD_HH')

  // if (field === null || model === null || date === null || time === null) return

  const bndsUrl = `${minLon},${minLat},${maxLon},${maxLat}`

  if (this.vectorStatic) {
    const url = `${process.env.tuvaq2Url}/gjUV_20221026?id=${sessionID}&model=${this.selected.modelName}&isMultiRegion=${this.selected.isMultiRegion}&regionName=${this.selected.region.name}&field=${this.selected.field.name}&dateTime=${dateTime}&level=${level}&bnds=${bndsUrl}`
    this.$axios({
      method: 'get',
      url,
    }).then((res) => {
      this.updateStaticUV(res.data)
    })
  } else {
    const zoom = Math.min(Math.round(this.map.getZoom()), 9)
    let maxSpeed
    switch (this.selected.field.name) {
      case 'current':
        maxSpeed = this.$store.state.map.maxSpeedCurrent
        break
      case 'wind':
        maxSpeed = this.$store.state.map.maxSpeedWind
        break
      case 'seaiceVelocity':
        maxSpeed = this.$store.state.map.maxSpeedSeaiceVelocity
        break
      default:
        break
    }
    const url = `${process.env.tuvaq2Url}/imgUV_20221026?id=${sessionID}&model=${this.selected.modelName}&isMultiRegion=${this.selected.isMultiRegion}&regionName=${this.selected.region.name}&field=${this.selected.field.name}&dateTime=${dateTime}&level=${level}&bnds=${bndsUrl}&zoom=${zoom}&maxSpeed=${maxSpeed}`

    this.$axios({
      method: 'get',
      url,
    }).then((res) => {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = () => {
        // --- Create a new canvas to fill with all the tiles
        const width = img.width
        const height = img.height
        const cnvTmp = document.createElement('canvas')
        cnvTmp.width = width
        cnvTmp.height = height
        const ctxTmp = cnvTmp.getContext('2d')
        ctxTmp.clearRect(0, 0, width, height)
        ctxTmp.fillStyle = 'rgb(127,127,0)'
        ctxTmp.fillRect(0, 0, width, height)

        ctxTmp.drawImage(img, 0, 0)

        // if (this.currentsAnimationOn) {
        this.animPrepare(width, height, cnvTmp, {
          minLon,
          minLat,
          maxLon,
          maxLat,
        })
        // } else {
        // this.staticPrepare(cnvTmp, ctxTmp, tileSize, tileAddress, Xs)
        // }
      }
      img.onerror = () => {}

      img.src = `${process.env.tuvaq2Url}/${res.data}`
    })
  }
}

export function removeUV() {
  if (Object.keys(this.map.getStyle().sources).includes('current')) {
    this.map.removeLayer('current')
    this.map.removeSource('current')
  }

  if (Object.keys(this.map.getStyle().sources).includes('wind')) {
    this.map.removeLayer('wind')
    this.map.removeSource('wind')
  }

  if (Object.keys(this.map.getStyle().sources).includes('seaiceVelocity')) {
    this.map.removeLayer('seaiceVelocity')
    this.map.removeSource('seaiceVelocity')
  }
}

/// ////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////  OLD  //////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////

// import tilebelt from '@mapbox/tilebelt'

// export function loadImageCurrents() {
//   const bnds = this.map.getBounds()
//   const zoom = Math.min(Math.round(this.map.getZoom()), 7)

//   const tileAddress = {}
//   tileAddress.ne = tilebelt
//     .pointToTileFraction(bnds._ne.lng, bnds._ne.lat, zoom)
//     .map((value) => parseInt(value))
//   tileAddress.sw = tilebelt
//     .pointToTileFraction(bnds._sw.lng, bnds._sw.lat, zoom)
//     .map((value) => parseInt(value))

//   const category = this.selected.category
//   const field = this.selected.field
//   const model = this.selected.directory
//   const date = this.$store.state.layers.interDate
//   const time = this.$store.state.layers.interTime
//   const colorbar = this.$store.state.layers.categories
//     .filter((c) => c.name === category)[0]
//     .fields.filter((f) => f.name === field)[0].colorbar
//   const minOrg = colorbar.minOrg
//   const stops = []
//   const colors = []
//   colorbar.colormap.forEach((obj) => {
//     stops.push(obj.value)
//     colors.push(obj.color.replace('#', ''))
//   })

//   if (field === null || model === null || date === null || time === null) return

//   // --- Take care of crossing -180 longitude
//   const Xs = []
//   if (tileAddress.ne[0] < tileAddress.sw[0]) {
//     for (let x = tileAddress.sw[0]; x < 2 ** zoom; x++) Xs.push(x)
//     for (let x = 0; x <= tileAddress.ne[0]; x++) Xs.push(x)
//   } else {
//     for (let x = tileAddress.sw[0]; x <= tileAddress.ne[0]; x++) Xs.push(x)
//   }

//   // --- Read tiles and fill the canvas
//   const images = []
//   let numLoading = Xs.length * (tileAddress.sw[1] - tileAddress.ne[1] + 1)
//   const sessionID = this.$store.state.map.sessionID
//   let dir = `${model}_${field}_${date}_${time}`
//   if (this.$store.state.layers.selected.levels.hasLevels)
//     dir = `${dir}_${
//       this.$store.state.layers.selected.levels.values[
//         this.$store.state.layers.selected.levels.iLevels
//       ]
//     }`

//   for (let ix in Xs) {
//     for (let y = tileAddress.ne[1]; y <= tileAddress.sw[1]; y++) {
//       const img = new Image()
//       img.crossOrigin = 'Anonymous'
//       img.onload = () => {
//         images.push({ x: Xs[ix], y, img })
//         --numLoading === 0 &&
//           this.onAllLoadedCurrents(tileAddress, Xs, images, zoom)
//       }
//       img.onerror = () => {
//         --numLoading === 0 &&
//           this.onAllLoadedCurrents(tileAddress, Xs, images, zoom)
//       }
//       let url = `${process.env.tuvaq2Url}/imgCurrents?id=${sessionID}&field=${field}&model=${model}&dir=${dir}&z=${tileAddress.ne[2]}&x=${Xs[ix]}&y=${y}&minOrg=${minOrg}`
//       stops.forEach((stop) => {
//         url = `${url}&stop=${stop}`
//       })
//       colors.forEach((color) => {
//         url = `${url}&color=${color}`
//       })
//       this.$axios({
//         method: 'get',
//         url,
//       }).then((data) => {
//         img.src = `${process.env.tuvaq2Url}/${data.data}`
//       })
//     }
//   }
// }

// export function onAllLoadedCurrents(tileAddress, Xs, images, zoom) {
//   // --- Create a new canvas to fill with all the tiles
//     const tileSize = 512
//     const width = tileSize * Xs.length
//     const height = tileSize * (tileAddress.sw[1] - tileAddress.ne[1] + 1)
//     const cnvTmp = document.createElement('canvas')
//     cnvTmp.width = width
//     cnvTmp.height = height
//     const ctxTmp = cnvTmp.getContext('2d')
//     ctxTmp.clearRect(0, 0, width, height)
//     ctxTmp.fillStyle = 'rgb(127,127,0)'
//     ctxTmp.fillRect(0, 0, width, height)

//     images.forEach((image) => {
//       const sx = 0
//       const sy = 0
//       const sWidth = tileSize
//       const sHeight = tileSize
//       const dx =
//         image.x >= Xs[0]
//           ? tileSize * (image.x - Xs[0])
//           : tileSize * (image.x - Xs[0] + 2 ** zoom)
//       const dy = tileSize * (image.y - tileAddress.ne[1])
//       const dWidth = tileSize
//       const dHeight = tileSize

//       ctxTmp.drawImage(
//         image.img,
//         sx,
//         sy,
//         sWidth,
//         sHeight,
//         dx,
//         dy,
//         dWidth,
//         dHeight
//       )
//     })
//     this.animPrepare(width, height, cnvTmp, tileAddress)

// }

// export function removeCurrents() {
//   if (Object.keys(this.map.getStyle().sources).includes('currents')) {
//     this.map.removeLayer('currents')
//     this.map.removeSource('currents')
//   }
// }
