HTMLWidgets.widget({

  name: 'ConquerEdge',

  type: 'output',

  factory: function(el, width, height) {

    var diameter = width,
        radius = diameter / 2,
        innerRadius = radius - 300;

    var cluster = d3v4.cluster()
        .size([360, innerRadius]);

    var line = d3v4.radialLine()
        .curve(d3v4.curveBundle.beta(0.85))
        .radius(function(d) { return d.y; })
        .angle(function(d) { return d.x / 180 * Math.PI; });

    var svg = d3v4.select(el).append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .append("g")
        .attr("transform", "translate(" + radius + "," + radius + ")");

    var link = svg.append("g").selectAll(".link"),
        node = svg.append("g").selectAll(".node");


    return {
      renderValue: function(x) {

        edge(x.pathwayTissue, link, node, cluster, line);

      },

      resize: function(width, height) {

      }

    };
  }
});
