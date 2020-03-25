// Global Variables
var ldmaxvalue ;
var ldminvalue ;
var track1 = 200;
var track2 = 100;
var track3 = 100;
var delta = 35;
var tooltip;
var svg;

function defineTooltip(local_toolip){
  tooltip = local_toolip;
}

function svgGlobal(local_svg){
  svg = local_svg;
}
//Read the data
function rsquared(data, width, height) {

    function make_y_axis(){
      return d3v4.axisLeft()
          .scale(y)
          .ticks(5);
    }

  var maxvalue = d3v4.max(data, function(d){return d.start;});
  var minvalue = d3v4.min(data, function(d){return d.start;});

  ldmaxvalue = maxvalue;
  ldminvalue = minvalue;

  // Add X axis
  var x = d3v4.scaleLinear()
            .domain([minvalue,maxvalue])
            .range([ 0, width ]);
  svg.append("g")
      .attr("transform", "translate(0," + track1 + ")")
      .call(d3v4.axisBottom(x))
      .style("text-anchor", "middle")
      .style('font-family', '"Open Sans", sans-serif')
      .style("font-size", "11px");
  // Add Y axis
  var y = d3v4.scaleLinear()
            .range([ track1, 0]);
  svg.append("g")
      .call(d3v4.axisLeft(y))
      .style("text-anchor", "left")
      .style('font-family', '"Open Sans", sans-serif')
      .style("font-size", "11px");

  svg.append("g")
      .attr("class", "path")
      .call(make_y_axis()
          .tickSize(-width, 0, 0)
          .tickFormat("")
      );
  // Add dots
  svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return x(d.start);})
      .attr("cy", function (d) { return y(d.r2);})
      .attr("r", 1.5)
      .style("fill", function (d) { return d.col} )
      .style("stroke-width", function(d){return d.strokeweight * 5 + "px"})
      .style("stroke", "black")
      .attr("r", function (d) { return d.r2 + 3})
      .on("mouseover", function(d){
          tooltip.transition()
                  .duration(200)
                  .style("opacity", 0.9);
          tooltip.html(d.label)
                  .style("left", (d3v4.event.pageX + 5) + "px")
                  .style("top", (d3v4.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d){
          tooltip.transition()
                  .duration(500)
                  .style("opacity", 0);
      });
}

//Read the data
function recombination(data, width, height) {

  function make_y_axis2() {
      return d3v4.axisLeft()
                .scale(y)
                .ticks(5);
    }

  var maxvalue = d3v4.max(data, function(d){return d.start;});
  var minvalue = d3v4.min(data, function(d){return d.start;});
  var rry = track1 + track2 + delta;

  // Add X axis
  var x = d3v4.scaleLinear()
            .domain([minvalue,maxvalue])
            .range([ 0, width ]);

  svg.append("g")
      .attr("transform", "translate(0," + rry + ")")
      .call(d3v4.axisBottom(x))
      .style("text-anchor", "middle")
      .style('font-family', '"Open Sans", sans-serif')
      .style("font-size", "11px");


  // Add Y axis
  var y = d3v4.scaleLinear()
            .domain([0, 100])
            .range([track2 + track1 + delta, track1 + delta]);

  svg.append("g")
    .call(d3v4.axisLeft(y))
    .style("text-anchor", "left")
    .style('font-family', '"Open Sans", sans-serif')
    .style("font-size", "11px");

  // Add line
  svg.append('g')
      .selectAll("line")
      .data(data)
      .enter()
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3v4.line()
        .x(function(d) { return x(d.start) })
        .y(function(d) { return y(d.recombination) })
        );

 // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.start);} )
    .attr("cy", function (d) { return y(d.recombination); } )
    .attr("r", 1.5)
    .style("fill", "steelblue")
    .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", 0.9);
          tooltip.html("RR = "+ d.recombination)
               .style("left", (d3v4.event.pageX + 5) + "px")
               .style("top", (d3v4.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

  svg.append("g")
      .attr("class", "path")
      .call(make_y_axis2()
          .tickSize(-width, 50, 0)
          .tickFormat("")
      );

}

//Read the data
function addgenes(genes, exons, width, height) {

 // Add X axis
  var x = d3v4.scaleLinear()
    .domain([ldminvalue,ldmaxvalue])
    .range([ 0, width ]);

  // Add Y axis
  var y = d3v4.scaleLinear()
    .domain([0, 5])
    .range([ track1 + track2 + track3 + 2*delta, track1 + track2 + 2 * delta]);
  svg.append("g")
    .call(d3v4.axisLeft(y)
      .tickSize(0))
    .style("text-anchor", "left")
    .style('font-family', '"Open Sans", sans-serif')
    .style("font-size", "0px")
    .style("stroke-width", "0px");


  var genesy = track1+track2+track3 + 2 * delta;

  svg.append("g")
    .attr("transform", "translate(0," + genesy + ")")
    .call(d3v4.axisBottom(x))
    .style("text-anchor", "middle")
    .style('font-family', '"Open Sans", sans-serif')
    .style("font-size", "11px");


    svg.selectAll("vertLine")
    .data(genes)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x(d.start)) })
      .attr("x2", function(d){return(x(d.end))})
      .attr("y1", function(d){return(y(d.y))})
      .attr("y2", function(d){return(y(d.y))})
      .attr("stroke", "black")
      .style("width", 40)
      .on("mouseover", function(d) {
    tooltip.transition()
         .duration(200)
         .style("opacity", 0.9);
    tooltip.html(d.external_name)
         .style("left", (d3v4.event.pageX + 5) + "px")
         .style("top", (d3v4.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

    //Text
    svg.selectAll("textLabels")
    .data(genes)
    .enter()
    .append("text")
      .attr("x", function(d){return(x(d.middle))})
      .attr("y", function(d){return(y(d.y + 0.5))})
      .attr('text-anchor', 'middle')
      .html(function(d){return(d.label)})
      .attr("font-style", "oblique")
      .style('font-family', '"Open Sans", sans-serif')
      .style("font-size", "15px")
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", 0.9);
          tooltip.html(d.external_name)
               .style("left", (d3v4.event.pageX + 5) + "px")
               .style("top", (d3v4.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

    //Add exons
    svg.selectAll("boxes")
    .data(exons)
    .enter()
    .append("rect")
        .attr("x", function(d){return(x(d.middle))})
        .attr("width", function(d){return((width * d.width) / (ldmaxvalue - ldminvalue))})
        .attr("y", function(d) { return y(d.y +  0.5)})
        .attr("height", 20 )
        .attr("stroke", "black")
        .style("fill", "gray")
        .on("mouseover", function(d) {
            tooltip.transition()
                 .duration(200)
                 .style("opacity", 0.9);
            tooltip.html(d.external_name)
                 .style("left", (d3v4.event.pageX + 5) + "px")
                 .style("top", (d3v4.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
        });

}

function axisLabels(width, height)
{
   //Axis labels
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 30)
      .style("text-anchor", "middle")
      .text("Position (kb)")
      .style("text-anchor", "middle")
      .style('font-family', '"Open Sans", sans-serif')
      .style("font-size", "15px");

   //Axis labels
    svg.append("text")
      .attr("x", -100)
      .attr("y", -40)
      .style("text-anchor", "middle")
      .html("Correlation (r²)")
      .attr("transform", "rotate(270)")
      .style('font-family', '"Open Sans", sans-serif')
      .style("font-size", "15px");

    //Axis labels
    svg.append("text")
      .attr("x", -285)
      .attr("y", -40)
      .style("text-anchor", "middle")
      .html("Rec. rate (CM/Mb)")
      .attr("transform", "rotate(270)")
      .style('font-family', '"Open Sans", sans-serif')
      .style("font-size", "15px");

        //Axis labels
    svg.append("text")
      .attr("x", -425)
      .attr("y", -40)
      .style("text-anchor", "middle")
      .html("Genes")
      .attr("transform", "rotate(270)")
      .style('font-family', '"Open Sans", sans-serif')
      .style("font-size", "15px");
}
