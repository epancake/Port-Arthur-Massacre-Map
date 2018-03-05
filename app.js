var map = L.map("map").setView([-43.041533, 147.651459], 10);
mapLink =
   '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer(
  "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; " + mapLink + " Contributors",
    maxZoom: 18,
  }).addTo(map);
let currentCircleId

/* Initialize the SVG layer */
map._initPathRoot()

/* We simply pick up the SVG from the map object */
var svg = d3.select("#map").select("svg"),
g = svg.append("g");


d3.json("./circles.json", function(collection) {
  /* Add a LatLng object to each item in the dataset */
  collection.objects.forEach(function(d) {
    d.LatLng = new L.LatLng(d.circle.coordinates[0],
                d.circle.coordinates[1]);
  })

  var feature = g.selectAll("circle")
    .data(collection.objects)
    .enter().append("circle")
    .style("stroke", "black")
    .style("opacity", .6)
    .attr("r", 15)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);


  map.on("viewreset", update);
  update();

  function update() {
    feature.attr("transform",
      function(d) {
        return "translate("+
        map.latLngToLayerPoint(d.LatLng).x +","+
        map.latLngToLayerPoint(d.LatLng).y +")";
      }
    )
      .attr("fill", function(d) {
        return d.circle.color
      })
  }


  function handleMouseOver(d) {
    console.log("did", d.circle.id)
    currentCircleId = d.circle.id
    d3.select(this).attr({
      r: 30,
      id: d.circle.id,
    })
    map.setView(d.circle.coordinates, d.circle.zoom)
    document.getElementById("storyTitle").innerHTML = d.circle.title
    document.getElementById("storyDescription").innerHTML = d.circle.description
    document.getElementById("storyImage1").src = d.circle.image1
    document.getElementById("storyImage2").src = d.circle.image2
    addBtn()
    addResetBtn()

  }

  function addBtn () {
    $aside = document.getElementById("storyCard")
    if (!document.getElementById("nextBtn")) {
      var btn = document.createElement("button")
      var t = document.createTextNode("Next")
      btn.setAttribute("id", "nextBtn")
      btn.appendChild(t);
      btn.addEventListener("click", moveToNext);
      document.getElementById("storyCard").appendChild(btn)
    }
  }

  function addResetBtn () {
    $aside = document.getElementById("storyCard")
    if (!document.getElementById("resetBtn")) {
      var resetBtn = document.createElement("button")
      var t = document.createTextNode("Reset Map")
      resetBtn.setAttribute("id", "resetBtn")
      resetBtn.appendChild(t);
      resetBtn.addEventListener("click", resetMap);
      document.getElementById("storyCard").appendChild(resetBtn)
    }
  }

  function resetMap () {
    map.setView([-43.141533, 147.651459], 10)
  }

  function moveToNext () {
    console.log("currentCircleId", currentCircleId)
    d3.json("./circles.json", function(collection) {
      collection.objects.forEach(function(d) {
        if (d.circle.id === currentCircleId + 1) {
          map.setView(d.circle.coordinates, d.circle.zoom)
          document.getElementById("storyTitle").innerHTML = d.circle.title
          document.getElementById("storyDescription").innerHTML = d.circle.description
          document.getElementById("storyImage1").src = d.circle.image1
          document.getElementById("storyImage2").src = d.circle.image2

          addBtn()
        }
      })
      currentCircleId++
    })
    // map.setView(d.circle.coordinates, d.circle.zoom)

  }


  function handleMouseOut(d, i) {
    d3.select(this).attr({
      r: 20
    });
  }
})
