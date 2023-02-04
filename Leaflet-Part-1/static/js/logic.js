var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createCircles(data);
});


function createMap(earthquakeData) {
    console.log(earthquakeData);
    // Create a map object.
    var myMap = L.map("map", {
        center: [40.76, -111.89],
        zoom: 5,
        layers: [earthquakeData]
      });
      
      // Add a tile layer.
    var background = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(myMap);

    var baseMaps = {
      "Street Map": background
    };

    var overlayMaps = {
      "Earthquakes": earthquakeData
    };

    /*Legend specific*/
    var legend = L.control({ position: "bottomleft" });

    legend.onAdd = function(map) {
      var div = L.DomUtil.create("div", "legend");
      div.innerHTML += "<h4>Depth (KM)</h4>";
      div.innerHTML += '<i style="background:darkgreen"></i><span><=-10</span><br>';
      div.innerHTML += '<i style="background:green"></i><span>-10-0</span><br>';
      div.innerHTML += '<i style="background:lightgreen"></i><span>0-10</span><br>';
      div.innerHTML += '<i style="background:yellow"></i><span>10-20</span><br>';
      div.innerHTML += '<i style="background:orange"></i><span>20-30</span><br>';
      div.innerHTML += '<i style="background:red"></i><span>30-40</span><br>';
      div.innerHTML += '<i style="background:darkred"></i><span>>40</span><br>';
      
      

      return div;
    };

    legend.addTo(myMap);
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
};

  function createCircles(response) {
    
    console.log(response.features[0])
    let earthquakes = []

    for (var i = 0; i < response.features.length; i++) {
      let depthcolor = ''
      var depth = response.features[i].geometry.coordinates[2]
      if (depth <= -10) {
        depthcolor = "darkgreen"
      } else if (depth <= 0) {
        depthcolor = "green"
      } else if (depth <= 10) {
        depthcolor = "lightgreen"
      } else if (depth <= 20) {
        depthcolor = "yellow"
      } else if (depth <= 30) {
        depthcolor = "orange"
      } else if (depth <= 40) {
        depthcolor = "red"
      } else  {
        depthcolor = "darkred"
      }
    //   // Setting the marker radius for the state by passing population into the markerSize function
      earthquakes.push(
        L.circle([response.features[i].geometry.coordinates[1],response.features[i].geometry.coordinates[0]], {
          fillOpacity: 0.5,
          color: depthcolor,
          radius: response.features[i].properties.mag * 30000
        }).bindPopup("<h3>" + response.features[i].properties.title + "<h3><h3>Depth: " + response.features[i].geometry.coordinates[2] + "<h3>")
      );
    }
    console.log(earthquakes)
    // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
    createMap(L.layerGroup(earthquakes));
  }


