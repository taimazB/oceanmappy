import mapboxgl from 'mapbox-gl'
import turf from 'turf'
// import { decodeColor } from './decodeColor'
import tilebelt from '@mapbox/tilebelt'
import { times } from 'underscore'

export function activateProfileTime() {
  const marker = new mapboxgl.Marker({
    color: 'blue',
    draggable: true
  })
    .setLngLat({ lng: -40, lat: 40 })
    //   .on('drag', () => {
    //     linesMarkerDrag(this)
    //   })
    .on('dragend', () => {
      updateProfileTime(this, marker)
    })
    .addTo(this.map)

  // this.map.on('click', this.mapClick)
}

export function updateProfileTime(that, marker) {
  let field, model, date, time, depth
  if (this.$store.state.layers.selected !== null) {
    field = this.$store.state.layers.selected.field
    model = this.$store.state.layers.selected.modelDir
    date = this.$store.state.layers.interDate
    time = this.$store.state.layers.interTime
    if (this.$store.state.layers.selected.depthProperties.hasDepth)
      depth = `_${
        this.$store.state.layers.selected.depthProperties.depthValues[
          this.$store.state.layers.selected.depthProperties.iDepth
        ]
      }`
    else depth = ''

    const lon = marker.getLngLat().lng
    const lat = marker.getLngLat().lat
    const zoom = 7 // Math.min(Math.round(map.getZoom()), 7) // --- tiles max zoom level = 7

    const profileTime_tileXold = this.profileTime_tileX
    const profileTime_tileYold = this.profileTime_tileY
    const tileAddress = tilebelt.pointToTileFraction(lon, lat, zoom)
    this.profileTime_tileX = parseInt(tileAddress[0])
    this.profileTime_tileY = parseInt(tileAddress[1])
    const x = 512 * (tileAddress[0] - parseInt(tileAddress[0]))
    const y = 512 * (tileAddress[1] - parseInt(tileAddress[1]))

    if (
      profileTime_tileXold !== this.profileTime_tileX ||
      profileTime_tileYold !== this.profileTime_tileY
    ) {
      this.cnvTmps = []
      this.ctxTmps = []

      const promises = []

      if (field === 'Currents') {
        for (let i = 0; i <= times; i++) {
          const url = `${process.env.tilesUrl}/models/${field}/${model}/tiles/${model}_${field}_${date}_${time}${depth}/${zoom}/${this.profileTime_tileX}/${this.profileTime_tileY}.png`
          this.cnvTmps.push(document.createElement('canvas'))
          this.cnvTmps[i].width = 512
          this.cnvTmps[i].height = 512
          this.ctxTmps[i] = this.cnvTmps[i].getContext('2d')
          const img = new Image()
          img.crossOrigin = 'Anonymous'
          img.src = url + '?' + new Date().getTime()

          promises.push(drawImg(i, img))
        }

        Promise.all(promises).then(() => {
          const profileArray = []
          this.ctxTmps.forEach(ctxTmp => {
            const [r, g, b] = ctxTmp.getImageData(x, y, 1, 1).data
            profileArray.push([
              `${date}_${time}`,
              this.decodeColorCurrent(r, g, b).speed
            ])
          })
        })
      }
      // else {
      //   newUrl = `${
      //     process.env.tilesUrl
      //   }/models/${field}/${model}/tiles/${model}_${field}_${date}_${time}/${zoom}/${parseInt(
      //     tileAddress[0]
      //   )}/${parseInt(tileAddress[1])}.png`
      //   if (url !== newUrl) {
      //     url = newUrl
      //     ctxTmp = cnvTmp.getContext('2d')
      //     const img = new Image()
      //     img.crossOrigin = 'Anonymous'
      //     img.src = url + '?' + new Date().getTime()

      //     await drawImg(i, img)
      //   }

      //   const [r, g, b] = ctxTmp.getImageData(x, y, 1, 1).data
      //   profileArray.push([
      //     totalDistance - lastDistance + j,
      //     this.decodeColor(r, g, b, false)
      //   ])
      // }
    }
  }

  // Used to draw a line between points

  this.$store.commit('map/setProfileData', { profileArray })
}

export function removeLines() {
  this.map.off('click', this.mapClick)

  this.map.removeLayer('lines.line')
  this.map.removeSource('lines.linestringSource')

  this.lines.markers.forEach(marker => {
    marker.remove()
  })

  // --- Remove distance labels
  if (Object.keys(this.map.getStyle().sources).includes('lines.symbolSource')) {
    this.map.removeLayer('lines.text')
    this.map.removeSource('lines.symbolSource')
  }

  this.$store.commit('map/setProfileData', { profileArray: [] })
}

function drawImg(i, image) {
  return new Promise(resolve => {
    image.onload = function() {
      this.ctxTmps[i].drawImage(image, 0, 0)
      resolve('resolved')
    }
  })
}
