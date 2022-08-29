export function updateAIS() {
  // --- Remove AIS if already there
  try {
    this.map.removeLayer('AIS')
    this.map.removeSource('AIS')
  } catch (error) {}

  if (this.AISselectedYear && this.AISselectedMonthIndex) {
    this.map.addSource('AIS', {
      type: 'vector',
      tiles: [
        `${process.env.tuvaq2Url}/mapTiles/AIS/tiles/${
          this.AISselectedYear
        }/${String(this.AISselectedMonthIndex + 1).padStart(
          2,
          '0'
        )}/{z}/{x}/{y}.pbf?dt=${Date.now()}`,
      ],
    })

    this.map.addLayer({
      id: 'AIS',
      type: 'heatmap',
      source: 'AIS',
      'source-layer': 'positions',
      layout: {},
      paint: {
        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 2, 5, 14, 10],
      },
    })
  }
}
