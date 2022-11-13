// import axios from "axios"
import tilebelt from '@mapbox/tilebelt'


// export function resetCurrents() {
//     cancelAnimationFrame(this.reqAnimID)
//     try {
//         this.cnvCurrents.remove()
//         if (Object.keys(this.map.getStyle().sources).includes('currents')) {
//             this.map.removeLayer('currents')
//             this.map.removeSource('currents')
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }


// export function createCanvas() {
//     // --- Creates a canvas to be used by MapBox (webgl)
//     const canvas = document.createElement('canvas')
//     canvas.width = window.innerWidth
//     canvas.height = window.innerHeight
//     return canvas
// }


export function onAllLoadedCurrents(tileAddress, images) {
    // --- Create a new canvas to fill with all the tiles
    const tileSize = 512
    const cnvTmp = document.createElement('canvas')
    cnvTmp.width = this.map.getCanvas().width // tileSize * (tileAddress.ne[0] - tileAddress.sw[0] + 1)
    cnvTmp.height = this.map.getCanvas().height // tileSize * (tileAddress.sw[1] - tileAddress.ne[1] + 1)
    const ctxTmp = cnvTmp.getContext('2d')
    ctxTmp.clearRect(0, 0, cnvTmp.width, cnvTmp.height)

    images.forEach(image => {
        const sx = image.x < tileAddress.sw[0] ? tileSize * (tileAddress.sw[0] - image.x) : 0
        const sy = image.y < tileAddress.ne[1] ? tileSize * (tileAddress.ne[1] - image.y) : 0
        const sWidth = image.x < tileAddress.sw[0] ? tileSize * (1 - tileAddress.sw[0] + image.x) : tileSize
        const sHeight = image.y < tileAddress.ne[1] ? tileSize * (1 - tileAddress.ne[1] + image.y) : tileSize
        const dx = image.x < tileAddress.sw[0] ? 0 : tileSize * (image.x - tileAddress.sw[0])
        const dy = image.y < tileAddress.ne[1] ? 0 : tileSize * (image.y - tileAddress.ne[1])
        const dWidth = image.x < tileAddress.sw[0] ? tileSize * (1 - tileAddress.sw[0] + image.x) : tileSize
        const dHeight = image.y < tileAddress.ne[1] ? tileSize * (1 - tileAddress.ne[1] + image.y) : tileSize
        // console.log(sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        ctxTmp.drawImage(image.img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    });


    // --- Convert to array
    const data = ctxTmp.getImageData(0, 0, cnvTmp.width, cnvTmp.height).data


    // --- Convert data to geojson
    const bnds = this.map.getBounds()
    const features = []
    const j = 100
    for (let i = 0; i < data.length; i = i + 4 * j) {
        const lon = bnds._sw.lng + (bnds._ne.lng - bnds._sw.lng) / cnvTmp.width * ((i / 4) % cnvTmp.width)
        const lat = bnds._ne.lat - (bnds._ne.lat - bnds._sw.lat) / cnvTmp.height * ((i / 4) / cnvTmp.width)
        const u = -3 + 6 * data[i] / 255
        const v = -3 + 6 * data[i + 1] / 255
        const speed = Math.sqrt(u ** 2 + v ** 2)
        const direction = Math.atan2(v, u) * 180 / Math.PI

        features.push({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lon, lat]
            },
            "properties": {
                speed: (data[i] === 127 && data[i + 1] === 127) ? 0 : .05 * speed,
                direction: (data[i] === 127 && data[i + 1] === 127) ? 0 : direction
            }
        })
    }
    const gj = {
        "type": "FeatureCollection",
        features
    }

    // --- Add/update map layer
    // const url = "~/assets/images/arrow.svg"
    if (!this.map.getStyle().layers.map(layer=>layer.id).includes('currents')) {
        this.map.loadImage('https://freesvg.org/img/aiga_up_arrow.png', (err, img) => {
            if (err) {
                console.log(err);
            }

            this.map.addImage('arrow', img)
            this.map.addSource('currents', {
                type: 'geojson',
                data: gj
            })

            this.map.addLayer(
                {
                    'id': 'currents',
                    'type': 'symbol',
                    'source': 'currents',
                    'layout': {
                        'icon-image': 'arrow',
                        'icon-size': ['get', 'speed'],
                        'icon-rotate': ['get', 'direction'],
                        'icon-allow-overlap': true
                    }
                },
            )

            this.map.on('ideal', 'currents', () => { this.loadImageCurrents() })
        })
    } else {
        this.map.getSource('currents').setData(gj)
    }
}


export function loadImageCurrents() {
    const field = this.$store.state.map.selected.field
    const model = this.$store.state.map.selected.modelDir
    const date = this.$store.state.layers.interDate
    const time = this.$store.state.layers.interTime

    if (field === null || model === null || date === null || time === null) return

    const bnds = this.map.getBounds()
    const zoom = Math.min(Math.round(this.map.getZoom()), 7)

    const tileAddress = {}
    tileAddress.ne = tilebelt.pointToTileFraction(bnds._ne.lng, bnds._ne.lat, zoom) // .map(value=>parseInt(value))
    tileAddress.sw = tilebelt.pointToTileFraction(bnds._sw.lng, bnds._sw.lat, zoom) // .map(value=>parseInt(value))

    // --- Read tiles and fill the canvas
    const images = []
    let numLoading = (parseInt(tileAddress.ne[0]) - parseInt(tileAddress.sw[0]) + 1) * (parseInt(tileAddress.sw[1]) - parseInt(tileAddress.ne[1]) + 1)
    for (let x = parseInt(tileAddress.sw[0]); x <= parseInt(tileAddress.ne[0]); x++) {
        for (let y = parseInt(tileAddress.ne[1]); y <= parseInt(tileAddress.sw[1]); y++) {
            const img = new Image
            img.crossOrigin = "Anonymous"
            img.onload = () => { --numLoading === 0 && this.onAllLoadedCurrents(tileAddress, images) }
            img.src = `${process.env.tuvaq2Url}/mapTiles/${field}/${model}/tiles/${model}_${field}_${date}_${time}/${tileAddress.ne[2]}/${x}/${y}.png`
            images.push({ x, y, img })
        }
    }




    //     const data = {
    //         webgl: true,
    //         field: this.$store.state.map.selected.field,
    //         model: this.$store.state.map.selected.modelDir,
    //         date: this.$store.state.layers.interDate,
    //         time: this.$store.state.layers.interTime,
    //         bnds: this.$store.state.map.bnds,
    //         imgBnds: this.$store.state.map.selected.imgBnds,
    //         depth: this.$store.state.map.selected.depthProperties.hasDepth
    //             ? this.$store.state.map.selected.depthProperties.depthValues[this.$store.state.map.selected.depthProperties.iDepth]
    //             : null,
    //         hasHighRes: this.$store.state.map.selected.hasHighRes,
    //         highRes: false,
    //         minMax: {
    //             min: this.$store.state.map.selected.minOrg,
    //             minOrg: this.$store.state.map.selected.minOrg,
    //             max: this.$store.state.map.selected.maxOrg,
    //             maxOrg: this.$store.state.map.selected.maxOrg,
    //         },
    //     }

    //     downloadImageCurrents(data).then((imgSrc) => {
    //         this.imgFilledGlobal.img = new Image()
    //         this.imgFilledGlobal.img.onload = () => {
    //             this.drawCurrents(this.map)
    //             this.$store.commit('map/setShowButtons', 'true')
    //         }

    //         this.imgFilledGlobal.width = imgSrc.data.imgWidth
    //         this.imgFilledGlobal.height = imgSrc.data.imgHeight
    //         this.imgFilledGlobal.img.src = imgSrc.data.imgData
    //     })
}

// export function drawCurrents() {
//     const left = this.imgFilledGlobal.width * (this.$store.state.map.bnds._sw.lng - this.$store.state.map.selected.imgBnds.minLon) / (this.$store.state.map.selected.imgBnds.maxLon - this.$store.state.map.selected.imgBnds.minLon)
//     const right = this.imgFilledGlobal.width * (this.$store.state.map.bnds._ne.lng - this.$store.state.map.selected.imgBnds.minLon) / (this.$store.state.map.selected.imgBnds.maxLon - this.$store.state.map.selected.imgBnds.minLon)
//     const top = this.imgFilledGlobal.height * (lat2y(this.$store.state.map.selected.imgBnds.maxLat) - lat2y(this.$store.state.map.bnds._ne.lat)) / (lat2y(this.$store.state.map.selected.imgBnds.maxLat) - lat2y(this.$store.state.map.selected.imgBnds.minLat))
//     const bottom = this.imgFilledGlobal.height * (lat2y(this.$store.state.map.selected.imgBnds.maxLat) - lat2y(this.$store.state.map.bnds._sw.lat)) / (lat2y(this.$store.state.map.selected.imgBnds.maxLat) - lat2y(this.$store.state.map.selected.imgBnds.minLat))

//     const imgWidth = right - left
//     const imgHeight = bottom - top

//     // --- A canvas to store the cropped image for the current viewport (2d)
//     const cnvTmp = document.createElement('canvas')
//     cnvTmp.width = window.innerWidth
//     cnvTmp.height = window.innerHeight
//     const ctxTmp = cnvTmp.getContext('2d')


//     // --- To prepare for redrawing
//     cancelAnimationFrame(this.reqAnimID)
//     ctxTmp.clearRect(0, 0, imgWidth, imgHeight)

//     const imgCropped = new Image()
//     imgCropped.src = cnvTmp.toDataURL()
//     const windData = {
//         width: imgWidth,
//         height: imgHeight,
//         varMin: this.$store.state.map.selected.minOrg,
//         varMax: this.$store.state.map.selected.maxOrg,
//         image: imgCropped,
//     }

//     // setTimeout(() => {
//     //     this.wind.setWind(windData)
//     // }, 1)


//     // --- Draw/Redraw
//     ctxTmp.drawImage(this.imgFilledGlobal.img, left, top, imgWidth, imgHeight, 0, 0, window.innerWidth, window.innerHeight);
//     // this.ctx2GJ(ctxTmp, imgWidth, imgHeight, this.$store.state.map.bnds);
//     imgCropped.src = cnvTmp.toDataURL()

//     this.wind.numParticles = 40000
//     windData.image = imgCropped

//     setTimeout(() => {
//         this.wind.setWind(windData)
//         this.frame()
//     }, 1)


//     try {
//         this.map.addSource('currents', {
//             type: 'canvas',
//             canvas: this.cnvCurrents,
//             coordinates: [
//                 [
//                     this.$store.state.map.bnds._sw.lng,
//                     this.$store.state.map.bnds._ne.lat,
//                 ],
//                 [
//                     this.$store.state.map.bnds._ne.lng,
//                     this.$store.state.map.bnds._ne.lat,
//                 ],
//                 [
//                     this.$store.state.map.bnds._ne.lng,
//                     this.$store.state.map.bnds._sw.lat,
//                 ],
//                 [
//                     this.$store.state.map.bnds._sw.lng,
//                     this.$store.state.map.bnds._sw.lat,
//                 ],
//             ],
//             // --- Set to true if the canvas source is animated. If the canvas is static, animate should be set to false to improve performance.
//             animate: true,
//         })

//         this.map.addLayer(
//             {
//                 id: 'currents',
//                 type: 'raster',
//                 source: 'currents',
//                 paint: { 'raster-fade-duration': 0 }
//             },
//             'topography'
//         )

//     } catch (error) {
//         this.$store.commit('map/setBounds', this.map.getBounds())
//         this.map.getSource('currents').setCoordinates(
//             [
//                 [
//                     this.$store.state.map.bnds._sw.lng,
//                     this.$store.state.map.bnds._ne.lat,
//                 ],
//                 [
//                     this.$store.state.map.bnds._ne.lng,
//                     this.$store.state.map.bnds._ne.lat,
//                 ],
//                 [
//                     this.$store.state.map.bnds._ne.lng,
//                     this.$store.state.map.bnds._sw.lat,
//                 ],
//                 [
//                     this.$store.state.map.bnds._sw.lng,
//                     this.$store.state.map.bnds._sw.lat,
//                 ],
//             ]
//         )
//     }
// }

// async function downloadImageCurrents(data) {
//     const results = await axios({
//         method: 'post',
//         url: `${process.env.baseUrl}/downloadImageCurrents`,
//         data, // --- instead of data: data
//     })

//     return await results
// }

// function lat2y(lat) {
//     const R = 6378137;
//     return (R * Math.log(Math.sin(Math.PI / 4 + lat * Math.PI / 180 / 2) / Math.cos(Math.PI / 4 + lat * Math.PI / 180 / 2)));
// }


// export function ctx2GJ(ctx, width, height, bnds) {
//     const array = ctx.getImageData(0, 0, width, height).data
//     const normalArray = Array.prototype.slice.call(array);
//     let array2D = []
//     while (normalArray.length) array2D.push(normalArray.splice(0, 4));


//     let features = []
//     let lon, lat, u, v, speed, direction

//     array2D.map((point, i) => {
//         lon = bnds._sw.lng + (bnds._ne.lng - bnds._sw.lng) * (i % Math.floor(width)) / width
//         lat = bnds._sw.lat + (bnds._ne.lat - bnds._sw.lat) * Math.floor(i / Math.floor(width)) / height
//         u = 3 * (point[0] - 127) / 127
//         v = 3 * (point[1] - 127) / 127
//         speed = Math.sqrt(u ** 2 + v ** 2)
//         direction = Math.atan2(v, u)

//         features.push(
//             {
//                 "type": "Feature",
//                 "geometry": { "type": "Point", "coordinates": [lon, lat] },
//                 "properties": { "speed": speed, "direction": direction }
//             },
//         )
//     })

//     const geojson = {
//         "type": "FeatureCollection",
//         "features": features
//     }

//     this.map.addSource('currentsStatic2', {
//         'type': 'geojson',
//         'data': geojson
//     })

//     this.map.addLayer({
//         'id': 'currentsStatic2',
//         'type': 'symbol',
//         'source': 'currentsStatic2',
//         'layout': {
//             'icon-image': 'arrow', // reference the image
//             'icon-size': 10
//         }
//     })
// }