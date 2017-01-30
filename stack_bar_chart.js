
var margin = {top: 20, right: 55, bottom: 30, left: 60},
  width  = 1080 - margin.left - margin.right,
  height = 600  - margin.top  - margin.bottom;

var x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
  .rangeRound([height, 0]);

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

var color= d3.scale.ordinal()
        .range(["#cc4c02", "#88419d","#fc4e2a","#fe9929","#df65b0","#6a51a3","#5574a6","#dd3497","#3690c0","#8c6bb1","#ef6548","#ff6a00","#b6ff00","#0094ff","#bdbdbd","#525252"]);


var svg = d3.select("#stack_bar_chart").append("svg")
  .attr("width",  width  + margin.left + margin.right)
  .attr("height", height + margin.top  + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//var tip = d3.tip()
//  .attr('class', 'd3-tip')
//  .offset([-10, 0])
//  .html(function(d) {
//    return "<strong>value:</strong> <span style='color:red'>" + d.name + "</span>";
//  })

d3.csv("data/fixed_year_data_output.csv", function (error, data) {

    var labelVar = 'year';
    var varNames = d3.keys(data[0]).filter(function (key) { return key !== labelVar;});
    color.domain(varNames);

    data.forEach(function (d) {
      var y0 = 0;
      d.mapping = varNames.map(function (name) { 
        return {
          name: name,
          label: d[labelVar],
          y0: y0,
          y1: y0 += +d[name]
        };
      });
      d.total = d.mapping[d.mapping.length - 1].y1;
    });

    x.domain(data.map(function (d) { return d.year; }));
    y.domain([0, d3.max(data, function (d) { return d.total; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Number of Killed");

    var selection = svg.selectAll(".series")
        .data(data)
      .enter().append("g")
        .attr("class", "series")
        .attr("transform", function (d) { return "translate(" + x(d.year) + ",0)"; });

    selection.selectAll("rect")
      .data(function (d) { return d.mapping; })
    .enter().append("rect")
      .attr("width", x.rangeBand())
      .attr("y", function (d) { return y(d.y1); })
      .attr("height", function (d) { return y(d.y0) - y(d.y1); })
      .style("fill", function (d) { return color(d.name); })
      .style("fill-opacity", 0.7)
//      .on('mouseover', tip.show)
//      .on('mouseout', tip.hide);
      .append("svg:title")
      .text(function(d){return "Group: " + d.name + "\n" + "Killed: " + (d.y1 -d.y0);});
//      .on("mouseover", function (d) { showPopover.call(this, d); })
//      .on("mouseout",  function (d) { removePopovers(); })
      

//    var legend = svg.selectAll(".legend")
//        .data(varNames.slice().reverse())
//      .enter().append("g")
//        .attr("class", "legend")
//        .attr("transform", function (d, i) { return "translate(55," + i * 20 + ")"; });
//
//    legend.append("cycle")
//        .attr("cx", width - 20)
//        .attr("cy", d3.scale.linear().domain([0, 16]).range([5, height]))
//        .attr("r", 5)
//        .style("fill", color);
//
//    legend.append("text")
//        .attr("x", width - 12)
//        .attr("y", 6)
//        .attr("dy", ".35em")
//        .style("text-anchor", "end")
//        .text(function (d) { return d; });

//    function removePopovers () {
//      $('.popover').each(function() {
//        $(this).remove();
//      }); 
//    }
//
//    function showPopover (d) {
//      $(this).popover({
//        title: d.name,
//        placement: 'auto top',
//        container: 'body',
//        trigger: 'manual',
//        html : true,
//        content: function() { 
//          return "year: " + d.label + 
//                 "<br/>Killed: " + d3.format(",")(d.value ? d.value: d.y1 - d.y0); }
//      });
//      $(this).popover('show')
//    }
});
