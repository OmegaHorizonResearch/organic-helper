function drawGraph(w, h, scale){

  var width = w,
      height = h;

  var color = d3.scale.category20();

  var radius = d3.scale.sqrt()
      .range([0, 6]);

  var svg = d3.select(".bostockExample").append("svg")
      .attr("width", width)
      .attr("height", height);

  var force = d3.layout.force()
      .size([width, height])
      .charge(-400 * scale * scale * scale)
      .linkDistance(function(d) { return radius(d.source.size) + radius(d.target.size) + 20; });


  d3.json("./json/graph.json", function(error, graph) {
    if (error) throw error;

    force
        .nodes(graph.nodes)
        .links(graph.links)
        .on("tick", tick)
        .start();

    var link = svg.selectAll(".link")
        .data(graph.links)
      .enter().append("g")
        .attr("class", "link");

    link.append("line")
        .style("stroke-width", function(d) { return (d.bond * 2 - 1) * 2 + "px"; });

    link.filter(function(d) { return d.bond > 1; }).append("line")
        .attr("class", "separator");

    var node = svg.selectAll(".node")
        .data(graph.nodes)
      .enter().append("g")
        .attr("class", "node")
        .call(force.drag);

    node.append("circle")
        .attr("r", function(d) { return radius(d.size) * scale; })
        .style("fill", function(d) { return color(d.atom); });

    node.append("text")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.atom; });

    function tick() {
      link.selectAll("line")
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }
  });

}

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  drawGraph(260, 300, .7)
} else {
  drawGraph(460, 500, 1)
}
