// Use the link to get the GeoJSON data
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Getting our GeoJSON data
d3.json(link).then(function(data) {
    console.log(data.features)
    createFeatures(data.features)
});

// Function to define markerSize() radius
function markerSize(magnitude) {
    return Math.sqrt(magnitude) * 10;
}

// function for colors regarding depth
function chooseColor(depth) {
    let shade = "";
    if (depth < 10) {
            return "#81D4FA";
        }
        else if (depth < 30) {
            return "#64B5F6";
        }
        else if (depth < 50) {
            return "#2196F3";
        }
        else if (depth < 70) {
            return "#5C6BC0";
        }
        else if (depth < 90) {
            return "#1A237E";
        }
        else return "#F5F5DC";
}

// Create markers functions
function createFeatures(earthquakeData) {
    // Marker and bindPopup onEachFeature  
    function onEachFeature(feature, layer) {

        // define variables
        let magnitude = feature.properties.mag;
        let depth = feature.geometry.coordinates[2];
        
        // Include magnitude, location, and depth in pop-up
        layer.bindPopup(`<h1>Location: ${feature.properties.place}<hr>
                        </br>Depth: ${depth}
                        </br>Magnitude: ${magnitude}`
                        );
    }

    // Create circle marker style
    function circleMarkerStyle(feature, latlng) {
        return L.circleMarker(latlng,
            {
                radius: markerSize(feature.properties.mag),
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.90,
                color: "red",
                stroke: true,
                weight: 1
            })
    }
    // Create markers location
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: circleMarkerStyle
    });

    createMap(earthquakes);
};

function createMap(earthquakes) {

    let topo = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // create a baseMaps object
    let baseMaps = {
        "Topographic": topo
    };

    // Create an overlay object to hold our overlay
    let overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the layers to load
    let myMap = L.map("map", {
        center: [
            37.00, -95.00
        ],
        zoom: 4,
        layers: [topo, earthquakes]
    });

    // Create a layer control with base/overlay maps and add to map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

        // Add legend
    var legend = L.control({position: "bottomright"});

    legend.onAdd = function(map) {
        let div = L.DomUtil.create("div", "info legend");
        let limits = [-10, 10, 30, 50, 70, 90];
        let labels = [];
        // from, to;

        function colorLegend(x) {
            return x < 10 ? "#81D4FA":
                    x < 30 ? "#64B5F6":
                    x < 50 ? "#2196F3":
                    x < 70 ? "#5C6BC0":
                    x < 90 ? "#1A237E":
                            "#F5F5DC";
        }

        // Get colors for legend
        for (var i = 0; i < limits.length; i++) {
            div.innerHTML +=
                '<i style = "background:' + colorLegend(limits[i] + 1) + '"></i>' +
                limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+') 
            
        };
        
        return div;
    }
    legend.addTo(myMap);
}