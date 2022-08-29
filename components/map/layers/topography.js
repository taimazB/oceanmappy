export function addTopography() {
    if (Object.keys(this.map.getStyle().sources).includes('topography')) {
        this.map.removeLayer('topography')
        this.map.removeSource('topography')
    }
    this.map.addSource('topography', {
        type: 'raster',
        tiles: [`${process.env.tuvaq2Url}/mapTiles/Topography/GEBCO/tiles/{z}/{x}/{y}.png`],
        tilesize: 512
    });


    this.map.addLayer(
        {
            'id': 'topography',
            'type': 'raster',
            'source': 'topography',
            'paint': {
                'raster-resampling': 'nearest'
            }
        },
        'settlement-subdivision-label'
    )
}


export function removeTopography() {
    this.map.removeLayer('topography')
    this.map.removeSource('topography')
}
