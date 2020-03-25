HTMLWidgets.widget({

  name: 'ConquerHive',

  type: 'output',

  factory: function(el, width, height) {


    return {
      renderValue: function(x) {


        var tooltip = d3v4.select("body")
                        .append("div")
                        .attr("class", "hidden")
                        .attr("id","tooltip")
                        .html('<p><span id="value"></span></p>');

        var elementExists = document.getElementById("HiveContainer");

        if (typeof(elementExists) != 'undefined' && elementExists !== null){
          elementExists.remove();
        }

        var aWindow = d3v4.select(el)
                        .append("div")
                        .attr("id","HiveContainer");


        var innerRadius = width * 0.05;
        var outerRadius = width * 0.5;
        var nodes = x.nodes;
        var links = JSON.parse(x.links);
        var angle = d3v4.scalePoint()
                      .domain(d3v4.range(4))
                      .range([0, 2 * Math.PI]);
        var radius = d3v4.scaleLinear()
                      .range([innerRadius, outerRadius]);
        var color = d3v4.scaleOrdinal(d3v4.schemeCategory10)
                      .domain(d3v4.range(20));


        var tokeep = [1];
        filteredNodes = nodes.filter( function( el ) {
          return tokeep.includes( el.x );
        });

        var svg = d3v4.select("#HiveContainer")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

        //Axis 1
        svg.selectAll(".axis")
            .data(d3v4.range(1))
            .enter()
            .append("line")
            .attr("class", "axis")
            .attr("transform", function(d) { return "rotate(" + degrees(angle(d)) + ")" })
            .attr("x1", 195)
            .attr("x2", 200);


        //Axis 2
        svg.selectAll(".axis")
            .data(d3v4.range(2))
            .enter()
            .append("line")
            .attr("class", "axis")
            .attr("transform", function(d) { return "rotate(" + degrees(angle(d)) + ")" })
            .attr("x1", radius.range()[0])
            .attr("x2", function(){
            	if( filteredNodes.length < 5){
            		if( filteredNodes.length == 1){
            			var out = 45;
            		}else{
            		  var out = 40 + ((filteredNodes.length - 1) * 20);
            		  out;
            		}
            	}else{
            		  var out = radius.range()[1];
            	}
            	return(out);
              });

          //Axis 3
           svg.selectAll(".axis")
              .data(d3v4.range(3))
              .enter()
              .append("line")
              .attr("class", "axis")
              .attr("transform", function(d) { return "rotate(" + degrees(angle(d)) + ")" })
              .attr("x1", radius.range()[0])
              .attr("x2", radius.range()[1]);


          // draw links
          svg.selectAll(".link")
              .data(links)
              .enter()
              .append("path")
              .attr("class", "link")
              .attr("d", d3v4.hive.link()
                                .angle(function(d) { return angle(d.x); })
                                .radius(function(d) { return radius(d.y); }))
              .on("mouseover", linkMouseover)
              .on("mouseout", mouseout);


          // draw nodes
          svg.selectAll(".node")
              .data(nodes)
              .enter()
              .append("circle")
              .attr("class", "node")
              .attr("transform", function(d) { return "rotate(" + degrees(angle(d.x)) + ")"; })
              .attr("cx", function(d) { return radius(d.y); })
              .attr("r", 5)
              .style("fill", function(d) { return d.color; })
              .on("mouseover", nodeMouseover)
              .on("mouseout", mouseout);

          if(nodes.length - 48 < 20){
           svg.selectAll("text")
                .data(nodes)
                .enter().append("text")
                .attr("x", function(d){return 45 + d.y * 280 + "px"})
                .attr("y", function(d){return 18 + d.y * 160})
                .style("text-anchor", "left")
                .style('font-family', "Open Sans")
                .style('font-style', "oblique")
                .style("font-size", "13px")

                .html(function(d){
                  var test = d.x==1;

                  if(test)
                  {
                    return(d.id);
                  }
                });
            }
             svg.selectAll("text2")
                  .data(nodes)
                  .enter().append("text")
                  .attr("x", 0)
                  .attr("y", -210)
                  .style("text-anchor", "middle")
                  .html(function(d){
                    var test = d.x==0;

                    if(test)
                    {
                      return(d.id);
                    }
                  })
                  .attr("transform", "rotate(0)")
                  .style('font-family', '"Open Sans", sans-serif')
                  .style("font-size", "15px");

            // highlight link and connected nodes on mouseover
            function linkMouseover(d) {
              console.log("blabla");
              svg.selectAll(".link")
                .classed("turnedOn", function(dl) {
                  d3v4.select("#tooltip")
                  .style("top", d3v4.event.pageY + "px")
                  .style("left", d3v4.event.pageX  +  "px")
                  .select("#value")
                  //.text(function(d){concat(d.source.x)});
                  .html(function(dl){
                    var name = 'Source:';
                    var out = name.concat(d.source.id, '<br/>Target:', d.target.id);
                    return(out);
                  });
                //Show the tooltip
                d3v4.select("#tooltip").classed("hidden", false);
                return dl === d;
                })
                .classed("turnedOff", function(dl) {
                  return !(dl === d);
                });
              svg.selectAll(".node")
                .classed("turnedOn", function(dl) {
                  return dl === d.source || dl === d.target;
                });
            }

            // highlight node and connected links on mouseover
            function nodeMouseover(d) {
              svg.selectAll(".link")
              .classed("turnedOn", function(dl) {
                d3v4.select("#tooltip")
                .style("top", d3v4.event.pageY + "px")
                .style("left", d3v4.event.pageX  +  "px")
                .select("#value")
                .text(d.id);
                //Show the tooltip
                d3v4.select("#tooltip").classed("hidden", false);
                return dl.source === d || dl.target === d;
              })
              .classed("turnedOff", function(dl) {
                return !(dl.source === d || dl.target === d);
              });
              d3v4.select(this)
              .classed("turnedOn", true);
            }

            // clear highlighted nodes or links
            function mouseout() {
              svg.selectAll(".turnedOn").classed("turnedOn", false);
              d3v4.select("#tooltip").classed("hidden", true);
              svg.selectAll(".turnedOff").classed("turnedOff", false);
            }

            function degrees(radians) {
              return radians / Math.PI * 180 - 90;
            }

      },

      resize: function(width, height) {

      }

    };
  }
});
