// This implements `StyleImageInterface`
// to draw a pulsing dot icon on the map.
export function addPulsingDot(i, coord, color) {
  const that = this
  const size = 75
  const pulsingDot = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),

    // When the layer is added to the map,
    // get the rendering context for the map canvas.
    onAdd() {
      const canvas = document.createElement('canvas')
      canvas.width = this.width
      canvas.height = this.height
      this.context = canvas.getContext('2d')
    },

    // Call once before every frame where the icon will be used.
    render() {
      const duration = 1000
      const t = (performance.now() % duration) / duration

      const radius = (size / 2) * 0.3
      const outerRadius = (size / 2) * 0.7 * t + radius
      const context = this.context

      // Draw the outer circle.
      context.clearRect(0, 0, this.width, this.height)
      context.beginPath()
      context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2)
      context.fillStyle = `rgba(255, 200, 200, ${1 - t})`
      context.fill()

      // Draw the inner circle.
      context.beginPath()
      context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
      context.fillStyle = color
      context.strokeStyle = 'white'
      context.lineWidth = 2 + 4 * (1 - t)
      context.fill()
      context.stroke()

      // Update this image's data with data from the canvas.
      this.data = context.getImageData(0, 0, this.width, this.height).data

      // Continuously repaint the map, resulting
      // in the smooth animation of the dot.
      that.map.triggerRepaint()

      // Return `true` to let the map know that the image was updated.
      return true
    }
  }

  that.map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 })

  that.map.addSource(`pulsingDot_${i}`, {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: coord // icon position [lng, lat]
          }
        }
      ]
    }
  })
  that.map.addLayer({
    id: `pulsingDot_${i}`,
    type: 'symbol',
    source: `pulsingDot_${i}`,
    layout: {
      'icon-image': 'pulsing-dot',
      visibility: 'visible'
    }
  })
}

export function updatePulsingDot(i, coord) {
  this.map.getSource(`pulsingDot_${i}`).setData({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: coord
        }
      }
    ]
  })
}

export function removePulsingDot(i) {
  this.map.removeLayer(`pulsingDot_${i}`)
  this.map.removeSource(`pulsingDot_${i}`)
}
