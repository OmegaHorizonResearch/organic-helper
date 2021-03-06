// NOTE: ohApp is defined in app.js
ohApp.directive("functionalGroupDirective", function() {
    return {
        restrict : 'E',
        templateUrl : 'js/templates/functional-group-container.html',
        scope: {
          name: "@",
          displayname: "@",
          atomicname: "@",
        },
        link: function(scope, element, attrs) {

          scope.name = attrs.name;
          scope.displayname = attrs.displayname;
          scope.atomicname = attrs.atomicname;

          scope.$watch('name', function(nV, oV) {
            if(nV){

              function drawGraph(w, h, scale) {

                var width = w,
                    height = h;

                var radius = d3.scale.sqrt()
                    .range([0, 6]);

                var svg = d3.select(".viz").append("svg")
                    .style("border", "1px solid black")
                    .attr("width", width)
                    .attr("height", height);

                svg.append("text")
                    .attr("x", width - 35 + 'px')
                    .attr("y", '60px')
                    .style("font-weight", 900)
                    .attr("text-anchor", "end")
                    .text(attrs.atomicname);

                svg.append("text")
                    .attr("x", width - 35 + 'px')
                    .attr("y", '40px')
                    .attr("text-anchor", "end")
                    .text('The formula is usually written');

                var force = d3.layout.force()
                    .size([width, height])
                    .charge(-400 * scale * scale * scale)
                    .linkDistance(function(d) { return radius(d.source.size) + radius(d.target.size) + 20; });

                var jsonPath = "json/" + attrs.name + ".json";
                console.log('loading---->  ' + jsonPath);

                function findColor(data) {
                  var color = ''
                  switch (data.atom) {
                    case 'H':
                        color = 'white';
                      break;
                    case 'O':
                        color = 'red';
                      break;
                    case 'Cl':
                        color = 'green';
                      break;
                    case 'N':
                        color = 'dodgerBlue';
                      break;
                    case 'C':
                        color = 'grey';
                      break;
                    case 'S':
                        color = 'yellow';
                      break;
                    case 'P':
                        color = 'orange';
                      break;
                    case "R":
                        color = 'maroon';
                      break;
                    case "R'":
                        color = 'maroon';
                      break;
                    case "R''":
                        color = 'maroon';
                      break;
                    case "R'''":
                        color = 'maroon';
                      break;
                    case "R''''":
                        color = 'maroon';
                      break;
                    case "F":
                        color = 'lightGreen';
                      break;
                    default:
                        color = 'black';
                      break;
                  }
                  return color
                }

                d3.json(jsonPath, function(error, graph) {
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
                      .attr("r", function(d) { return radius(d.size); })
                      .style("fill", function(d) { return findColor(d); });

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

              } // End drawGraph function

              if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                drawGraph(260, 300, .7)
              } else {
                drawGraph(460, 500, 1)
              }

            }
          })

        }
    };
});
