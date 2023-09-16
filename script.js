mapboxgl.accessToken =
    "pk.eyJ1IjoicGpsZW9uYXJkMzciLCJhIjoiY2xoMmNjODFtMTh4NzNzc2FhZWVibGR6cSJ9.eFd7Y9jGlJUP-dm0MBMvpg";

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/pjleonard37/clmcfrc8f038k01ns7j4r8ttu",
    center: [0, 0],
    zoom: 1
});

const years = [
    '1946',
    '1947',
    '1948',
    '1949',
    '1950',
    '1951',
    '1952',
    '1953',
    '1954',
    '1955',
    '1956',
    '1957',
    '1958',
    '1959',
    '1960',
    '1961',
    '1962',
    '1963',
    '1964',
    '1965',
    '1966',
    '1967',
    '1968',
    '1969',
    '1970',
    '1971',
    '1972',
    '1973',
    '1974',
    '1975',
    '1976',
    '1977',
    '1978',
    '1979',
    '1980',
    '1981',
    '1982',
    '1983',
    '1984',
    '1985',
    '1986',
    '1987',
    '1988',
    '1989',
    '1990',
    '1991',
    '1992',
    '1993',
    '1994',
    '1995',
    '1996',
    '1997',
    '1998',
    '1999',
    '2000',
    '2001',
    '2002',
    '2003',
    '2004',
    '2005',
    '2006',
    '2007',
    '2008'
];

map.on('load', () => {
    var isIncrementing = false;
    var yearIndex = -1;
    const interval = 1000;
    const sliderInterval = setInterval(advanceYear, interval);
    const buttons = document.querySelectorAll('.button');

    // Advance year if appropriate
    function advanceYear() {
        if (isIncrementing == true) {
            if (yearIndex >= 62) {
                yearIndex = 0;
            }
            yearIndex += 1;
            const filters = ['==', ['get', 'year'], years[yearIndex]];

            // Filter the icons in the layer to only those from the specified year 
            map.setFilter('location-of-armed-conflict-onset', filters);
            document.getElementById('year').textContent = years[yearIndex];
        } else {
            map.setFilter('location-of-armed-conflict-onset', null);
        }
    }

    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Remove 'selected' class from all buttons
            buttons.forEach(function (btn) {
                btn.classList.remove('selected');
            });

            // Add 'selected' class to the clicked button
            this.classList.add('selected');
            isIncrementing = !isIncrementing;
        });
    });

    // Spin the globe

    // At low zooms, complete a revolution every two minutes.
    const secondsPerRevolution = 120;
    // Above zoom level 5, do not rotate.
    const maxSpinZoom = 5;
    // Rotate at intermediate speeds between zoom levels 3 and 5.
    const slowSpinZoom = 3;

    let userInteracting = false;
    let spinEnabled = true;

    function spinGlobe() {
        const zoom = map.getZoom();
        if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
            let distancePerSecond = 360 / secondsPerRevolution;
            if (zoom > slowSpinZoom) {
                // Slow spinning at higher zooms
                const zoomDif =
                    (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
                distancePerSecond *= zoomDif;
            }
            const center = map.getCenter();
            center.lng -= distancePerSecond;
            // Smoothly animate the map over one second.
            // When this animation is complete, it calls a 'moveend' event.
            map.easeTo({ center, duration: 1000, easing: (n) => n });
        }
    }

    // Pause spinning on interaction
    map.on('mousedown', () => {
        userInteracting = true;
    });

    // Restart spinning the globe when interaction is complete
    map.on('mouseup', () => {
        userInteracting = false;
        spinGlobe();
    });

    // These events account for cases where the mouse has moved
    // off the map, so 'mouseup' will not be fired.
    map.on('dragend', () => {
        userInteracting = false;
        spinGlobe();
    });
    map.on('pitchend', () => {
        userInteracting = false;
        spinGlobe();
    });
    map.on('rotateend', () => {
        userInteracting = false;
        spinGlobe();
    });

    // When animation is complete, start spinning if there is no ongoing interaction
    map.on('moveend', () => {
        spinGlobe();
    });

    spinGlobe();
});

// Add popups 
map.on('click', 'location-of-armed-conflict-onset', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const properties = e.features[0].properties;
    const description = '<div class="label">' + properties.sideb + ' vs. ' + properties.sidea + '</div><div>Onset: ' + e.features[0].properties.startdate + '</div> '
    console.log(e.features[0]);


    new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
});