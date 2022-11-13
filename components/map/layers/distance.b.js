import turf from 'turf'


export function addDistance() {
    // var distanceGJ = {
    //     'type': 'FeatureCollection',
    //     'features': []
    // };

    this.distance = {
        pointsSource: {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [],
            },
        },
        id: 'distance',
        // pointsSource: {
        //     type: 'geojson',
        //     data: {
        //         type: 'Feature',
        //         geometry: {
        //             type: 'MultiPoint',
        //             coordinates: [],
        //         },
        //         properties: {
        //             radius: 28,
        //         },
        //     },
        // },
        circlesLayer: {
            type: 'circle',
            paint: {
                'circle-color': ['get', 'color'],
                'circle-radius': ['get', 'radius'],
            },
        },
        linestringSource: {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [],
            },
        },
        linesLayer: {
            type: 'line',
            paint: {
                'line-color': '#000000',
                'line-width': 4,
            },
        },
    }

    this.map.on('click', this.mapDistanceLinearClick)
    // this.map.on('mousemove', this.mapDistanceLinearMove);
}


export function mapDistanceLinearClick(e) {
    console.log(this.map);
    // --- Check if click is on a point
    var features = this.map.queryRenderedFeatures(e.point, {
        layers: ['distancecircle']
    });

    // Remove the linestring from the group
    // So we can redraw it based on the points collection
    // if (this.distance.linestringSource.data.features.length > 1) this.distance.linestringSource.data.features.pop();
    this.distance.linestringSource.data.features = []

    // --- Remove all popups
    // $('.mapboxgl-popup').remove();

    // If a feature was clicked, remove it from the map
    if (features.length) {
        // var id = features[0].properties.id;
        // var clickedCoordinate = features[0]
        // this.distance.pointsSource.data.geometry.coordinates = this.distance.pointsSource.data.geometry.coordinates.filter(coordinate =>
        //     coordinate !== clickedCoordinate
        this.distance.pointsSource.data.features = this.distance.pointsSource.data.features.filter(feature =>
            feature.properties.id !== features[0].properties.id
        );
    } else {
        // this.distance.pointsSource.data.geometry.coordinates.push([e.lngLat.lng, e.lngLat.lat])
        this.distance.pointsSource.data.features.push(
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [e.lngLat.lng, e.lngLat.lat]
                },
                'properties': {
                    'id': String(new Date().getTime()),
                    'lastDistance': 0,
                    'totalDistance': 0
                }
            }
        )
    }

    // var points = this.distance.pointsSource.data.geometry.coordinates
    var points = this.distance.pointsSource.data.features
    if (points.length > 1) {
        var totalDistance = 0;
        for (var i = 0; i < points.length - 1; i++) {
            // var lineDistance = turf.distance(points[i], points[i + 1]);
            var lastDistance = turf.distance(points[i].geometry.coordinates, points[i + 1].geometry.coordinates);
            totalDistance += lastDistance;
            this.distance.pointsSource.data.features[i + 1].properties.lastDistance = lastDistance
            this.distance.pointsSource.data.features[i + 1].properties.totalDistance = totalDistance
            var arc = [];

            // Number of steps to use in the arc and animation, more steps means
            // a smoother arc and animation, but too many steps will result in a
            // low frame rate
            var steps = 500;

            // Draw an arc between the `origin` & `destination` of the two points
            for (var j = 0; j <= lastDistance; j += lastDistance / steps) {
                var segment = turf.along(turf.lineString([points[i].geometry.coordinates, points[i + 1].geometry.coordinates]), j);
                arc.push(segment.geometry.coordinates);
            }

            // Used to draw a line between points
            this.distance.linestringSource.data.features.push({
                'type': 'Feature',
                'geometry': {
                    'type': 'LineString',
                    'coordinates': arc
                }
            });

            // --- Add popup to the point
            // var popup = new mapboxgl.Popup({
            //     closeButton: false,
            //     closeOnClick: false
            // });
            // popup.setLngLat(points[i + 1].geometry.coordinates).setHTML(`<p>${lineDistance.toFixed(1)} km</p><p><strong>${totalDistance.toFixed(1)} km</strong></p>`).addTo(map);
        }
    }
    // map.getSource('distanceLinear').setData(distanceGJ);
}


export function mapDistanceLinearMove(e) {
    var features = map.queryRenderedFeatures(e.point, {
        layers: ['distance.circles']
    });

    map.getCanvas().style.cursor = features.length
        ? 'pointer'
        : 'crosshair';
}