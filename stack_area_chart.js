
      var margin_2 = {top: 20, right: 55, bottom: 30, left: 60},
          width_2  = 1080 - margin_2.left - margin_2.right,
          height_2 = 600  - margin_2.top  - margin_2.bottom;

      var x = d3.scale.ordinal()
          .rangeRoundBands([0, width_2], .1);

      var y = d3.scale.linear()
          .rangeRound([height_2, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var stack = d3.layout.stack()
          .offset("zero")
          .values(function (d) { return d.values; })
          .x(function (d) { return x(d.label) + x.rangeBand() / 2; })
          .y(function (d) { return d.value; });

      var area = d3.svg.area()
          .interpolate("cardinal")
          .x(function (d) { return x(d.label) + x.rangeBand() / 2; })
          .y0(function (d) { return y(d.y0); })
          .y1(function (d) { return y(d.y0 + d.y); });

      var color_stack_area = d3.scale.ordinal()
          .range([ 
 "#8ca252", 
 "#d6616b",
                  "#98abc5", "#7b6888", "#a05d56", "#6b486b", "#8a89a6", "#ff8c00", "#d0743c",
                  "#d6616b",
                  "#9c9ede", 
                  "#e7ba52", 
                  "#b5cf6b",
                  "#ff9896","#6b6ecf"]);

      var area_svg = d3.select("#stack_area_chart").append("svg")
          .attr("width",  width_2  + margin_2.left + margin_2.right)
          .attr("height", height_2 + margin_2.top  + margin_2.bottom)
        .append("g")
          .attr("transform", "translate(" + margin_2.left + "," + margin_2.top + ")");

      d3.csv("data/output_new.csv", function (error, data) {

        var labelVar = 'year';
        var varNames = d3.keys(data[0])
            .filter(function (key) { return key !== labelVar;});
        color_stack_area.domain(varNames);

        var seriesArr = [], series = {};
        varNames.forEach(function (name) {
          series[name] = {name: name, values:[]};
          seriesArr.push(series[name]);
        });

        data.forEach(function (d) {
          varNames.map(function (name) {
            series[name].values.push({name: name, label: d[labelVar], value: +d[name]});
          });
        });

        x.domain(data.map(function (d) { return d.year; }));

        stack(seriesArr);

        y.domain([0, d3.max(seriesArr, function (c) { 
            return d3.max(c.values, function (d) { return d.y0 + d.y; });
          })]);

        area_svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height_2 + ")")
            .call(xAxis);

        area_svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Number of Death");


        var selection = area_svg.selectAll(".series")
          .data(seriesArr)
          .enter().append("g")
            .attr("class", "series");

        selection.append("path")
          .attr("class", "streamPath")
          .attr("d", function (d) { return area(d.values); })
          .style("fill", function (d) { return color_stack_area(d.name); })
          .style("fill-opacity", 0.7)
          .append("svg:title")
          .text(function(d){return "Country: " + d.name;});

        var points = area_svg.selectAll(".seriesPoints")
          .data(seriesArr)
          .enter().append("g")
            .attr("class", "seriesPoints");

        points.selectAll(".point")
          .data(function (d) { return d.values; })
          .enter().append("circle")
           .attr("class", "point")
           .attr("cx", function (d) { return x(d.label) + x.rangeBand() / 2; })
           .attr("cy", function (d) { return y(d.y0 + d.y); })
           .attr("r", "10px")
           .style("fill",function (d) { return color_stack_area(d.name); })
           .append("svg:title")
           .text(function(d){return "Country: " + d.name + "\n" + "Death: " + (d.y0 -d.y);});
//           .on("mouseover", function (d) { showPopover.call(this, d); })
//           .on("mouseout",  function (d) { removePopovers(); })

        var legend = area_svg.selectAll(".legend")
            .data(varNames.slice().reverse())
          .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) { return "translate(55," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", width_2 - 10)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", color_stack_area);

        legend.append("text")
            .attr("x", width_2 - 12)
            .attr("y", 6)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) { return d; });

//        function removePopovers () {
//          $('.popover').each(function() {
//            $(this).remove();
//          }); 
//        }
//
//        function showPopover (d) {
//          $(this).popover({
//            title: d.name,
//            placement: 'auto top',
//            container: 'body',
//            trigger: 'manual',
//            html : true,
//            content: function() { 
//              return "year: " + d.label + 
//                     "<br/>Rounds: " + d3.format(",")(d.value ? d.value: d.y1 - d.y0); }
//          });
//          $(this).popover('show')
//        }

      });
//    </script>
//  </body>
//</html>