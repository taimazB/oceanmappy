import mapboxgl from 'mapbox-gl'
import turf from 'turf'
// import { decodeColor } from './decodeColor'
import tilebelt from '@mapbox/tilebelt'
import Chart from 'chart.js/auto'
// import annotationPlugin from 'chartjs-plugin-annotation'
// Chart.register(annotationPlugin)

export function startLine() {
  this.lines = {
    id: 'lines',
    markers: [],
    linestringSource: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    },
    symbolSource: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    }
  }

  this.map.on('click', this.mapClick)

  // --- Add source and layer for lines
  this.map.addSource('lines.linestringSource', this.lines.linestringSource)
  this.map.addLayer({
    id: 'lines.line',
    source: 'lines.linestringSource',
    type: 'line',
    paint: {
      'line-color': '#000000',
      'line-width': 2
    }
  })
  this.sortLayers()

  // if (this.distanceOn) {
  // --- Add source and layer for distance labels
  this.map.addSource('lines.symbolSource', this.lines.symbolSource)
  this.map.addLayer({
    id: 'lines.text',
    source: 'lines.symbolSource',
    type: 'symbol',
    layout: {
      'text-field': [
        'format',
        ['get', 'lastDistance'],
        { 'font-scale': 1, 'text-color': '#333' },
        '\n',
        {},
        ['get', 'totalDistance'],
        { 'font-scale': 1.5, 'text-color': '#111' }
      ],
      'text-size': 16,
      visibility: this.distanceOn ? 'visible' : 'none'
    }
  })
  this.sortLayers()
  // }
}

export async function mapClick(e) {
  // --- If clicked close to a marker, remove it
  const nearMarkers = this.lines.markers.filter(
    m =>
      m._pos.x >= e.point.x - 8 &&
      m._pos.x <= e.point.x + 8 &&
      m._pos.y >= e.point.y - 8 &&
      m._pos.y <= e.point.y + 8
  )
  if (nearMarkers.length > 0) {
    this.lines.markers = this.lines.markers.filter(m => m !== nearMarkers[0])
    nearMarkers[0].remove()
  }
  // --- Otherwise, add a new marker
  else {
    const marker = document.createElement('div')
    marker.className = 'marker'
    marker.style.backgroundImage = `url(https://api.oceangns.com/images/circle.svg)`
    marker.style.width = `16px`
    marker.style.height = `16px`
    marker.style.backgroundSize = '100%'

    this.lines.markers.push(
      new mapboxgl.Marker(marker, {
        draggable: true
      })
        .setLngLat(e.lngLat)
        //   .on('drag', () => {
        //     linesMarkerDrag(this)
        //   })
        .on('dragend', () => {
          linesMarkerDragEnd(this)
        })
        .addTo(this.map)
    )
  }

  // const popup = new mapboxgl.Popup().setHTML('<svg class="popup-d3-svg" style="margin: 0 auto; display: block;"></svg>') // TAIMAZ
  // this.lines.markers[this.lines.markers.length-1].setPopup(popup).togglePopup()
  //   const svgElement = popup.getElement().getElementsByClassName('popup-d3-svg')[0];
  // console.log(this.lines.markers,svgElement);
  // const svg = d3.select(svgElement)
  //   .attr('width', 100)
  //   .attr('height', 100)
  //   .style('background-color', 'black');

  // svg.append('line')
  //   .style('stroke', 'lightgreen')
  //   .style('stroke-width', 2)
  //   .attr('x1', 0)
  //   .attr('y1', 0)
  //   .attr('x2', 50)
  //   .attr('y2', 50);

  const result = await this.updateLines(this.map, this.lines.markers)
  this.lines.linestringSource.data.features = result.features
  this.map
    .getSource('lines.linestringSource')
    .setData(this.lines.linestringSource.data)
  // if (this.distanceOn) {
  this.lines.symbolSource.data.features = result.textFeatures
  this.map.getSource('lines.symbolSource').setData(this.lines.symbolSource.data)
  // }
}

// export async function linesMarkerDrag(that) {
//   const result = await that.updateLines(that.map, that.lines.markers)
//   that.lines.linestringSource.data.features = result.features
//   that.map
//     .getSource('lines.linestringSource')
//     .setData(that.lines.linestringSource.data)
//   if (that.distanceOn) {
//     that.lines.symbolSource.data.features = result.textFeatures
//     that.map
//       .getSource('lines.symbolSource')
//       .setData(that.lines.symbolSource.data)
//   }
// }

export async function linesMarkerDragEnd(that) {
  const result = await that.updateLines(that.map, that.lines.markers)
  that.lines.linestringSource.data.features = result.features
  that.map
    .getSource('lines.linestringSource')
    .setData(that.lines.linestringSource.data)
  // if (that.distanceOn) {
  that.lines.symbolSource.data.features = result.textFeatures
  that.map.getSource('lines.symbolSource').setData(that.lines.symbolSource.data)
  // }
}

export async function updateLines(map, markers) {
  // const distanceOn = this.$store.state.map.distanceOn
  const profileXYon = this.$store.state.map.profileXYon

  const features = []
  const textFeatures = []
  const lastDistances = []
  const totalDistances = []
  const profileObj = { breaks: [], data: [] }

  let field, model, date, time, depth
  if (this.$store.state.map.selected !== null) {
    field = this.$store.state.map.selected.field
    model = this.$store.state.map.selected.modelDir
    date = this.$store.state.layers.interDate
    time = this.$store.state.layers.interTime
    if (this.$store.state.map.selected.depthProperties.hasDepth)
      depth = `_${
        this.$store.state.map.selected.depthProperties.depthValues[
          this.$store.state.map.selected.depthProperties.iDepth
        ]
      }`
    else depth = ''
  }

  if (markers.length > 1) {
    let totalDistance = 0
    for (let i = 0; i < markers.length - 1; i++) {
      if (i > 0) profileObj.breaks.push(totalDistance)
      const lon1 = markers[i].getLngLat().lng
      const lat1 = markers[i].getLngLat().lat
      const lon2 = markers[i + 1].getLngLat().lng
      const lat2 = markers[i + 1].getLngLat().lat

      const lastDistance = turf.distance([lon1, lat1], [lon2, lat2])
      totalDistance += lastDistance
      lastDistances.push(lastDistance)
      totalDistances.push(totalDistance)

      const arc = []
      // var steps = parseInt(lastDistance);

      // Draw an arc between the `origin` & `destination` of the two points
      let url = ''
      const zoom = 7 // Math.min(Math.round(map.getZoom()), 7) // --- tiles max zoom level = 7
      // const tileSizeX = 360 / (2 ** zoom)
      // const tileSizeY = 180 / (2 ** zoom)
      const cnvTmp = document.createElement('canvas')
      cnvTmp.width = 512
      cnvTmp.height = 512
      let ctxTmp

      for (let j = 0; j <= lastDistance; j += 1) {
        const coordinate = turf.along(
          turf.lineString([
            [lon1, lat1],
            [lon2, lat2]
          ]),
          j
        ).geometry.coordinates

        // --- Get data at coordinate
        if (profileXYon) {
          const tileAddress = tilebelt.pointToTileFraction(
            coordinate[0],
            coordinate[1],
            zoom
          )
          const x = 512 * (tileAddress[0] - parseInt(tileAddress[0]))
          const y = 512 * (tileAddress[1] - parseInt(tileAddress[1]))

          let newUrl
          if (field === undefined) {
            // --- Bathymetry
            const newUrl = `${process.env.tuvaq2Url}/mapTiles/Bathymetry/${
              this.$store.state.layers.selectedBathymetry.modelDir
            }/tiles/filledValue/${zoom}/${parseInt(tileAddress[0])}/${parseInt(
              tileAddress[1]
            )}.png`
            if (url !== newUrl) {
              url = newUrl
              ctxTmp = cnvTmp.getContext('2d')
              const img = new Image()
              img.crossOrigin = 'Anonymous'
              img.src = url + '?' + new Date().getTime()

              await drawImg(ctxTmp, img)
            }
            const x = 512 * (tileAddress[0] - parseInt(tileAddress[0]))
            const y = 512 * (tileAddress[1] - parseInt(tileAddress[1]))
            const [r, g, b] = ctxTmp.getImageData(x, y, 1, 1).data

            let value
            if (r === 0 && g === 0 && b === 0) value = 0
            else value = ((256 ^ 2) * r + 256 * g + b) / -10

            profileObj.data.push([totalDistance - lastDistance + j, value])
          } else if (field === 'Currents') {
            newUrl = `${
              process.env.tuvaq2Url
            }/mapTiles/${field}/${model}/tiles/${model}_${field}_${date}_${time}${depth}/${
              tileAddress[2]
            }/${parseInt(tileAddress[0])}/${parseInt(tileAddress[1])}.png`
            if (url !== newUrl) {
              url = newUrl
              ctxTmp = cnvTmp.getContext('2d')
              const img = new Image()
              img.crossOrigin = 'Anonymous'
              img.src = url + '?' + new Date().getTime()

              await drawImg(ctxTmp, img)
            }

            const [r, g, b] = ctxTmp.getImageData(x, y, 1, 1).data
            profileObj.data.push([
              totalDistance - lastDistance + j,
              this.decodeColorCurrent(r, g, b).speed
            ])
          } else {
            newUrl = `${
              process.env.tuvaq2Url
            }/mapTiles/${field}/${model}/tiles/${model}_${field}_${date}_${time}/${zoom}/${parseInt(
              tileAddress[0]
            )}/${parseInt(tileAddress[1])}.png`
            if (url !== newUrl) {
              url = newUrl
              ctxTmp = cnvTmp.getContext('2d')
              const img = new Image()
              img.crossOrigin = 'Anonymous'
              img.src = url + '?' + new Date().getTime()

              await drawImg(ctxTmp, img)
            }

            const [r, g, b] = ctxTmp.getImageData(x, y, 1, 1).data
            profileObj.data.push([
              totalDistance - lastDistance + j,
              this.decodeColor(this.colormap, r, g, b, false)
            ])
          }
        }

        arc.push(coordinate)
      }

      // Used to draw a line between points
      features.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: arc
        }
        // 'properties': {
        //     values
        // }
      })

      textFeatures.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            arc[parseInt(lastDistance / 2)][0],
            arc[parseInt(lastDistance / 2)][1]
          ]
        },
        properties: {
          lastDistance: parseInt(lastDistance) + ' km',
          totalDistance: parseInt(totalDistance) + ' km'
        }
      })
    }
  }

  // if (profileXYon) this.$store.commit('map/setProfileData', { profileObj })
  if (profileXYon) this.updateXYplot(profileObj)

  return { features, textFeatures, lastDistances, totalDistances }
}

export function updateXYplot(profileObj) {
  const xAxisValues = profileObj.data.map(p => p[0])
  const profile = profileObj.data.map(p => p[1])
  const vLines = {}
  profileObj.breaks.forEach((brk, i) => {
    vLines[`line${i}`] = {
      type: 'line',
      xMin: brk,
      xMax: brk,
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 1
    }
  })

  let width, height
  if (this.$vuetify.breakpoint.smAndDown) {
    width = 100
    height = 75
  } else {
    width = 200
    height = 150
  }

  const popup = new mapboxgl.Popup({ offset: [0, -30] }).setHTML(
    `<canvas class="cnvProfileXY" width:"${width}" height:"${height}" style="margin: 0; display: block;"></canvas>`
  )
  this.lines.markers[this.lines.markers.length - 1]
    .setPopup(popup)
    .togglePopup()
  const ctx = popup
    .getElement()
    .getElementsByClassName('cnvProfileXY')[0]
    .getContext('2d')

  const xyPlot = new Chart(ctx, {
    type: 'line',
    data: {
      labels: xAxisValues,
      datasets: [
        {
          // label: '# of Votes',
          data: profile,
          // backgroundColor: [
          //   'rgba(255, 99, 132, 0.2)',
          //   'rgba(54, 162, 235, 0.2)',
          //   'rgba(255, 206, 86, 0.2)',
          //   'rgba(75, 192, 192, 0.2)',
          //   'rgba(153, 102, 255, 0.2)',
          //   'rgba(255, 159, 64, 0.2)'
          // ],
          // borderColor: [
          //   'rgba(255, 99, 132, 1)',
          //   'rgba(54, 162, 235, 1)',
          //   'rgba(255, 206, 86, 1)',
          //   'rgba(75, 192, 192, 1)',
          //   'rgba(153, 102, 255, 1)',
          //   'rgba(255, 159, 64, 1)'
          // ],
          animation: false,
          borderWidth: 0,
          backgroundColor: '#000',
          pointStyle: 'circle',
          pointRadius: 1,
          pointHoverRadius: 3
        }
      ]
    },
    options: {
      plugins: {
        title: { display: false },
        legend: { display: false },
        // --- VERTICAL LINES
        annotation: {
          annotations: vLines
        }
      },
      scales: {
        x: {
          display: true,
          ticks: {
            callback: (value, index, ticks) => {
              return Math.round(value)
            },
            font: {
              size: 10
            },
            maxRotation: 90,
            minRotation: 90
          }
        },
        y: {
          display: true
        }
      }
    }
  })
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

  // this.$store.commit('map/setProfileData', { profileObj: [] })
}

function drawImg(ctx, image) {
  return new Promise(resolve => {
    image.onload = function() {
      ctx.drawImage(image, 0, 0)
      resolve('resolved')
    }
  })
}
