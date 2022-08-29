import turf from 'turf'

export function updateDistance() {
  const drawGJ = this.$store.state.map.drawGJ
  const features = []

  if (drawGJ.features.length > 0) {
    drawGJ.features.forEach((feature) => {
      const coords = feature.geometry.coordinates
      const color = feature.properties.color
      let totalDistance = 0
      for (let i = 1; i < coords.length; i++) {
        const distance = turf.distance(coords[i - 1], coords[i])
        totalDistance += distance

        features.push({
          type: 'feature',
          geometry: { type: 'Point', coordinates: coords[i] },
          properties: {
            distance: `${distance.toFixed(1)} km`,
            totalDistance: i > 1 ? `${totalDistance.toFixed(1)} km` : '',
            color
          },
        })
      }
    })

    const gj = { type: 'FeatureCollection', features }

    if (!this.map.getSource('distance')) {
      this.map.addSource('distance', {
        type: 'geojson',
        data: gj,
      })
      this.map.addLayer({
        id: `distance`,
        type: 'symbol',
        source: `distance`,
        layout: {
          'text-field': [
            'format',
            ['get', 'distance'],
            {},
            '\n',
            {},
            ['get', 'totalDistance'],
            { 'text-font': ['literal', ['Ubuntu Bold']] },
          ],
        },
        paint:{
          'text-color':['get','color']
        }
      })
    } else {
      this.map.getSource('distance').setData(gj)
    }
  } else if (this.map.getSource('distance')) {
    this.map.removeLayer('distance')
    this.map.removeSource('distance')
  }
}
