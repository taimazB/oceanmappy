import Vue from 'vue'
import tilebelt from '@mapbox/tilebelt'

Vue.mixin({
  methods: {
    gl_lat2y(lat) {
      const R = 6378137
      return (
        R *
        Math.log(
          Math.sin(Math.PI / 4 + (lat * Math.PI) / 180 / 2) /
            Math.cos(Math.PI / 4 + (lat * Math.PI) / 180 / 2)
        )
      )
    },

    gl_lon2x(lon) {
      const R = 6378137
      return (R * lon * Math.PI) / 180
    },

    async gl_getAvailDates(data) {
      const results = await this.$axios({
        method: 'post',
        url: `${process.env.tuvaq2Url}/getAvailDateTimes`,
        data // --- instead of data: data
      })

      return await results.data.map(d => {
        const arr = d.split('_')
        return { date: arr[0], time: arr[1] }
      })
    },

    async gl_getImage(data) {
      const results = await this.$axios({
        method: 'post',
        url: `${process.env.baseUrl}/getImage`,
        data // --- instead of data: data
      })

      return await results
    },

    num2latlon(num, latlon) {
      let result
      if (latlon === 'lat') {
        num >= 0
          ? (result = num.toFixed(3) + ' &deg;N')
          : (result = (-num).toFixed(3) + ' &deg;S')
      } else if (latlon === 'lon') {
        num >= 0
          ? (result = num.toFixed(3) + ' &deg;E')
          : (result = (-num).toFixed(3) + ' &deg;W')
      }
      return result
    },

    // #############################
    // --- READ DEPTH
    initDepthReading() {
      // --- Create canvas to help reading depths
      const cnvTmpBathymetry = document.createElement('canvas')
      cnvTmpBathymetry.width = 512
      cnvTmpBathymetry.height = 512
      // const ctxTmpInsideBathymetry = cnvTmpBathymetry.getContext('2d')
      this.$store.commit(
        'map/setCtxTmpBathymetry',
        cnvTmpBathymetry.getContext('2d')
      )
      const imgBathymetry = new Image()
      imgBathymetry.crossOrigin = 'Anonymous'
      imgBathymetry.onload = () => {
        this.$store.state.map.ctxTmpBathymetry.drawImage(imgBathymetry, 0, 0)
      }
      this.$store.commit('map/setImgBathymetry', imgBathymetry)
    },

    getDepth(coord) {
      // const zoom = Math.min(Math.round(this.$store.state.map.mapZoom), 7) // --- tiles max zoom level = 7
      const zoom = 7
      const tileAddress = tilebelt.pointToTileFraction(
        coord.lng,
        coord.lat,
        zoom
      )
      const newUrl = `${process.env.tuvaq2Url}/mapTiles/Bathymetry/${
        this.$store.state.layers.selectedBathymetry.modelDir
      }/tiles/filledValue/${zoom}/${parseInt(tileAddress[0])}/${parseInt(
        tileAddress[1]
      )}.png`
      if (this.$store.state.map.urlBathymetry !== newUrl) {
        this.$store.commit('map/setUrlBathymetry', newUrl)
        this.$store.state.map.imgBathymetry.src =
          newUrl + '?' + new Date().getTime()
      }
      const x = 512 * (tileAddress[0] - parseInt(tileAddress[0]))
      const y = 512 * (tileAddress[1] - parseInt(tileAddress[1]))
      const [r, g, b] = this.$store.state.map.ctxTmpBathymetry.getImageData(
        x,
        y,
        1,
        1
      ).data

      if (r === 0 && g === 0 && b === 0) return 0
      else return ((256 ^ 2) * r + 256 * g + b) / -10
    },

    DDMM2DD(ddmm) {
      const d = Math.trunc(ddmm / 100)
      const m = ddmm - 100 * d
      return d + m / 60
    },

    DD2DDMM(d) {
      const DD = Math.trunc(d)
      const MM = (d - DD) * 60
      return 100 * DD + MM
    },
  }
})
