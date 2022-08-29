import Vue from 'vue'
import tilebelt from '@mapbox/tilebelt'
import moment from 'moment'

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
        data, // --- instead of data: data
      })

      return await results.data.map((d) => {
        const arr = d.split('_')
        return { date: arr[0], time: arr[1] }
      })
    },

    async gl_getImage(data) {
      const results = await this.$axios({
        method: 'post',
        url: `${process.env.baseUrl}/getImage`,
        data, // --- instead of data: data
      })

      return await results
    },

    num2latlon(num, latlon) {
      let result
      if (latlon === 'lat') {
        num >= 0
          ? (result = num.toFixed(3) + ' °N')
          : (result = (-num).toFixed(3) + ' °S')
      } else if (latlon === 'lon') {
        num >= 0
          ? (result = num.toFixed(3) + ' °E')
          : (result = (-num).toFixed(3) + ' °W')
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
      const zoom = this.$store.state.layers.selectedBathymetry.maxZoom
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

    capitalizeTheFirstLetterOfEachWord(words) {
      const separateWord = words.toLowerCase().split(' ')
      for (let i = 0; i < separateWord.length; i++) {
        separateWord[i] =
          separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1)
      }
      return separateWord.join(' ')
    },

    lastProcessedColor(hr) {
      switch (true) {
        case hr <= 24:
          return 'green'
        case hr <= 48:
          return 'orange'
        default:
          return 'red'
      }
    },

    hex2rgb(hex) {
      const aRgbHex = hex.replace('#', '').match(/.{1,2}/g)
      const aRgb = `${parseInt(aRgbHex[0], 16)},${parseInt(
        aRgbHex[1],
        16
      )},${parseInt(aRgbHex[2], 16)}`
      return aRgb
    },

    adjustColor(color, percent) {
      // https://gist.github.com/renancouto/4675192
      const num = parseInt(color.replace('#', ''), 16)
      const amt = Math.round(2.55 * percent)
      const R = (num >> 16) + amt
      const B = ((num >> 8) & 0x00ff) + amt
      const G = (num & 0x0000ff) + amt
      return (
        '#' +
        (
          0x1000000 +
          (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
          (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
          (G < 255 ? (G < 1 ? 0 : G) : 255)
        )
          .toString(16)
          .slice(1)
      )
    },

    getGliderType(type) {
      if (type.toLowerCase().includes('slocum')) return 'slocum'
      else if (type.toLowerCase().includes('seaglider')) return 'seaglider'
      else if (type.toLowerCase().includes('waveglider')) return 'wavegliderSV3'
      else return null
    },

    timestamp2datetime(n, format) {
      return moment.unix(n).format(format)
    },

    sortByTime(gj) {
      gj.features.sort((a, b) =>
        a.properties.timestamp < b.properties.timestamp ? 1 : -1
      )
      return gj
    },

    randomColor() {
      return '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    },
  },
})
