
    d3.csv('data/new_global_terror_table.csv', function(error, incidents) {
        
        function reformat(array) {
                var data = [];
                array.map(function (d, i) {

                    data.push({
                        id: i,
                        type: "Feature",
                        year: +d.iyear,
                        month: +d.imonth,
                        day: +d.iday,
                        country: d.country_txt,
                        gname: d.gname,
                        nkill: +d.nkill,
                        attackType: d.attacktype1_txt,
                        targetType: d.targtype1_txt,
                        geometry: {
                            coordinates: [+d.longitude, +d.latitude],
                            type: "Point"
                        }
                       

                    });
                });
                return data;
            }


      var geoData = { type: "FeatureCollection", features: reformat(incidents) };



      var qtree = d3.geom.quadtree(geoData.features.map(function(data, i) {
        return {
          x: data.geometry.coordinates[0],
          y: data.geometry.coordinates[1],
          all: data
        };
      }));


      // Find the nodes within the specified rectangle.
      function search(quadtree, x0, y0, x3, y3) {
        var pts = [];
        var subPixel = false;
        var subPts = [];
        var scale = getZoomScale();
        var counter = 0;
        quadtree.visit(function(node, x1, y1, x2, y2) {
          var p = node.point;
          var pwidth = node.width * scale;
          var pheight = node.height * scale;

          // -- if this is too small rectangle only count the branch and set opacity
          if ((pwidth * pheight) <= 1) {
            // start collecting sub Pixel points
            subPixel = true;
          }
          // -- jumped to super node large than 1 pixel
          else {
            // end collecting sub Pixel points
            if (subPixel && subPts && subPts.length > 0) {

              subPts[0].group = subPts.length;
              pts.push(subPts[0]); // add only one todo calculate intensity
              counter += subPts.length - 1;
              subPts = [];
            }
            subPixel = false;
          }

          if ((p) && (p.x >= x0) && (p.x < x3) && (p.y >= y0) && (p.y < y3)) {

            if (subPixel) {
              subPts.push(p.all);
            } else {
              if (p.all.group) {
                delete(p.all.group);
              }
              pts.push(p.all);
            }

          }
          // if quad rect is outside of the search rect do nto search in sub nodes (returns true)
          return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
        });
        
        return pts;

      }


      function updateNodes(quadtree) {
        var nodes = [];
        quadtree.depth = 0; // root

        quadtree.visit(function(node, x1, y1, x2, y2) {
          var nodeRect = {
            left: MercatorXofLongitude(x1),
            right: MercatorXofLongitude(x2),
            bottom: MercatorYofLatitude(y1),
            top: MercatorYofLatitude(y2),
          }
          node.width = (nodeRect.right - nodeRect.left);
          node.height = (nodeRect.top - nodeRect.bottom);

          if (node.depth == 0) {
            console.log(" width: " + node.width + "height: " + node.height);
          }
          nodes.push(node);
          for (var i = 0; i < 4; i++) {
            if (node.nodes[i]) node.nodes[i].depth = node.depth + 1;
          }
        });
        return nodes;
      }

      //-------------------------------------------------------------------------------------
      MercatorXofLongitude = function(lon) {
        return lon * 20037508.34 / 180;
      }

      MercatorYofLatitude = function(lat) {
        return (Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180)) * 20037508.34 / 180;
      }
      
      var colorByGroup = {
          "Taliban": "#0094ff",
          "Islamic State of Iraq and the Levant (ISIL)" : "#b6ff00",
          "Boko Haram" : "#ff6a00",
          "Al-Shabaab" : "#ef6548",
          "Tehrik-i-Taliban Pakistan (TTP)" : "#8c6bb1",
          "Al-Qaida in Iraq" : "#3690c0",
          "Al-Qaida" : "#dd3497",
          "Al-Qaida in the Arabian Peninsula (AQAP)" : "#5574a6",
          "Al-Nusrah Front" : "#6a51a3",
          "Lord's Resistance Army (LRA)" : "#df65b0",
          "Communist Party of India - Maoist (CPI-Maoist)" : "#fe9929",
          "Liberation Tigers of Tamil Eelam (LTTE)" : "#fc4e2a",
          "Fulani Militants" : "#88419d",
          "Revolutionary Armed Forces of Colombia (FARC)" : "#cc4c02",
          "Unknown" : "#525252"
      }
      var leafletMap = L.map('map').setView([20.7525, 3.04197], 3);
      leafletMap.scrollWheelZoom.disable();
//      leafletMap.once('focus', function() { leafletMap.scrollWheelZoom.enable();});
      leafletMap.on('click', function() {
          if (leafletMap.scrollWheelZoom.enabled()) {
            leafletMap.scrollWheelZoom.disable();
          } else {
            leafletMap.scrollWheelZoom.enable();
          }
      });

      L.tileLayer("http://{s}.sm.mapstack.stamen.com/(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/{z}/{x}/{y}.png").addTo(leafletMap);
        
      var svg = d3.select(leafletMap.getPanes().overlayPane).append("svg");
      var g = svg.append("g").attr("class", "leaflet-zoom-hide");


      // Use Leaflet to implement a D3 geometric transformation.
      function projectPoint(x, y) {
        var point = leafletMap.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
      }

      var transform = d3.geo.transform({
        point: projectPoint
      });
      var path = d3.geo.path().projection(transform);


      updateNodes(qtree);

      leafletMap.on('moveend', mapmove);

      mapmove();




      function getZoomScale() {
        var mapWidth = leafletMap.getSize().x;
        var bounds = leafletMap.getBounds();
        var planarWidth = MercatorXofLongitude(bounds.getEast()) - MercatorXofLongitude(bounds.getWest());
        var zoomScale = mapWidth / planarWidth;
        return zoomScale;

      }

      function redrawSubset(subset) {
        path.pointRadius(function(d){
            return Math.sqrt(d.nkill) * 1.5;
        }); // * scale);

        var bounds = path.bounds({
          type: "FeatureCollection",
          features: subset
        });
        var topLeft = bounds[0];
        var bottomRight = bounds[1];


        svg.attr("width", bottomRight[0] - topLeft[0])
          .attr("height", bottomRight[1] - topLeft[1])
          .style("left", topLeft[0] + "px")
          .style("top", topLeft[1] + "px");


        g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

        var start = new Date();


        var points = g.selectAll("path")
          .data(subset, function(d) {
            return d.geometry.coordinates;
          });
        points.enter().append("path");
        points.exit().remove();
        points.attr("d", path);
        
        points.style("fill", function(d) {
            if(d.gname in colorByGroup) {
                return colorByGroup[d.gname];
            }            
        });

        points.style("fill-opacity", function(d) {
          if (d.group) {
            return (d.group * 0.1) + 0.3;
          }
        })
        .append("svg:title")
        .text(function(d) {
            return "Group: " +d.gname + "\n" + "Date: " + d.year + "/" + d.month + "/" + d.day + "\n" + "Country: " + d.country + "\n"
            + "Death: " + d.nkill + "\n" + "Attack Type: " + d.attackType + "\n" + "Target Type: " + d.targetType;
        });

        console.log("updated at  " + new Date().setTime(new Date().getTime() - start.getTime()) + " ms ");
        
      }

      function mapmove(e) {
        var mapBounds = leafletMap.getBounds();
        var subset = search(qtree, mapBounds.getWest(), mapBounds.getSouth(), mapBounds.getEast(), mapBounds.getNorth());
        console.log("subset: " + subset.length);

        redrawSubset(subset);

      }
    });
