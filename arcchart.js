var radius = 74,
    padding = 10;

var arc_color = d3.scale.ordinal()
    .range(["#f0f0f5","#e6e6ff","#98abc5", "#7b6888", "#a05d56", "#6b486b", "#8a89a6", "#ff8c00", "#d0743c"]);

var arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(radius - 30);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.population; });

d3.csv("data/attack_type_data_reverse.csv", function(error, data) {
  if (error) throw error;

  arc_color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Group"; }));

  data.forEach(function(d) {
    d.ages = arc_color.domain().map(function(name) {
      return {name: name, population: +d[name]};
    });
  });

  var legend = d3.select("#arcchart").append("svg")
      .attr("class", "legend")
      .attr("width", radius * 2 + 100)
      .attr("height", radius * 2 + 30)
    .selectAll("g")
      .data(arc_color.domain().slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", arc_color);

  legend.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".55em")
      .style("fill", "black")
      .text(function(d) { return d; });

  var svg3 = d3.select("#arcchart").selectAll(".pie")
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
      .style("fill", function(d) { return arc_color(d.data.name); })
      .append("svg:title")
      .text(function(d){return d.data.population + " " + d.data.name;});

  svg3.append("text")
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("fill", "black")
      .text(function(d) { return d.Group; });

});