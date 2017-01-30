var radius = 74,
    padding = 10;

var arc_color_2 = d3.scale.ordinal()
                 .range(["#393b79", 
 "#5254a3", 
 "#6b6ecf", 
 "#9c9ede", 
 "#637939",
 "#8ca252", 
 "#b5cf6b",
 "#cedb9c",
 "#8c6d31",
 "#bd9e39",
 "#e7ba52", 
 "#e7cb94",
 "#843c39",
 "#ff9896",
 "#d6616b",
 "#e7969c",
 "#7b4173",
 "#a55194",
 "#ce6dbd",
 "#de9ed6",
 "#ad494a",
 "#9467bd"

]);
//                .range(["#1f77b4", 
// "#aec7e8", 
// "#ff7f0e", 
// "#ffbb78", 
// "#2ca02c",
// "#98df8a", 
// "#d62728", 
// "#ff9896", 
// "#9467bd", 
// "#c5b0d5", 
// "#1f77b4", 
// "#aec7e8", 
// "#ff7f0e", 
// "#ffbb78", 
// "#2ca02c", 
// "#98df8a", 
// "#d62728", 
// "#ff9896", 
// "#9467bd", 
// "#c5b0d5",
// "#f0f0f5",
// "#e6e6ff"]);
//    .range(["#f0f0f5","#e6e6ff","#98abc5", "#7b6888", "#a05d56", "#6b486b", "#8a89a6", "#ff8c00", "#d0743c",
//           "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262"]);

var arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(radius - 30);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.population; });

d3.csv("data/target_type_data_reverse.csv", function(error, data) {
  if (error) throw error;

  arc_color_2.domain(d3.keys(data[0]).filter(function(key) { return key !== "Group"; }));

  data.forEach(function(d) {
    d.ages = arc_color_2.domain().map(function(name) {
      return {name: name, population: +d[name]};
    });
  });

  var legend = d3.select("#arcchart2").append("svg")
      .attr("class", "legend")
      .attr("width", radius * 2 + 100)
      .attr("height", radius * 2 + 85)
    .selectAll("g")
      .data(arc_color_2.domain().slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 10 + ")"; });

  legend.append("rect")
      .attr("width", 9)
      .attr("height", 9)
      .style("fill", arc_color_2);

  legend.append("text")
      .attr("x", 24)
      .attr("y", 2)
      .attr("dy", ".55em")
      .style("fill", "black")
      .text(function(d) { return d; });

  var svg3 = d3.select("#arcchart2").selectAll(".pie")
      .data(data)
    .enter().append("svg")
      .attr("class", "pie")
      .attr("width", radius * 2)
      .attr("height", radius * 2)
    .append("g")
      .attr("transform", "translate(" + radius + "," + radius + ")");

  svg3.selectAll(".arc")
      .data(function(d) { return pie(d.ages); })
    .enter().append("path")
      .attr("class", "arc")
      .attr("d", arc)
      .style("fill", function(d) { return arc_color_2(d.data.name); })
      .append("svg:title")
      .text(function(d){return d.data.population + " " + d.data.name;});

  svg3.append("text")
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("fill", "black")
      .text(function(d) { return d.Group; });

});