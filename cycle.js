var m = [10, 0, 10, 0];
var width = 400;
var height = 500;

function colores_google(n) {
    var groupcolor = ["#0094ff","#b6ff00","#ff6a00","#ef6548","#8c6bb1","#3690c0","#dd3497","#5574a6","#6a51a3","#df65b0", "#fe9929","#fc4e2a","#88419d","#cc4c02","#525252","#bdbdbd"]
  return groupcolor[n % groupcolor.length];
}

function group_name(n) {
    var groupname =
    ["Taliban",
  "Islamic State of Iraq and the Levant (ISIL)",
  "Boko Haram",
  "Al-Shabaab",
  "Tehrik-i-Taliban Pakistan (TTP)",
  "Al-Qaida in Iraq",
  "Al-Qaida",
  "Al-Qaida in the Arabian Peninsula (AQAP)",
  "Al-Nusrah Front",
  "Lord's Resistance Army (LRA)",
  "Communist Party of India - Maoist (CPI-Maoist)",
  "Liberation Tigers of Tamil Eelam (LTTE)",
  "Fulani Militants",
  "Revolutionary Armed Forces of Colombia (FARC)",
  "Unknown",
  "Other"]
  return groupname[n % groupname.length];
}

var svg1 = d3.select("#cyclemarker")
             .append("svg")
             .attr("width", width + m[1] + m[3])
             .attr("height", height + m[0] + m[2])
             .attr("transform", "translate(" + m[3] + "," + m[0] + ")");


svg1.selectAll("circle")
        .data(d3.range(16))
        .enter()
        .append("circle")
        .attr("r", 5 )
        .attr("cx", width / 5)
        .attr("cy", d3.scale.linear().domain([0, 16]).range([5, height]))
        .attr("fill", function(d,i) {return colores_google(i);});

svg1.selectAll("text")
        .data(d3.range(16))
        .enter()
        .append("text")
        .attr("x", width / 5 + 10)
        .attr("y", d3.scale.linear().domain([0, 16]).range([5, height]))
        .attr("dy", ".35em")
        .style("fill", "black")
        .text(function(d,i) {return group_name(i);});