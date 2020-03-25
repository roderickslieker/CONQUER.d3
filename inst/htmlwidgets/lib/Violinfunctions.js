var svg;

function globalSVG(local_svg){
  svg = local_svg;

}
// highlight node and connected links on mouseover
function nodeMouseover(d) {
  d3v4.select(this)
    .classed("turnedOn", true);

  d3v4.select("#tooltip")
    .style("top", d3v4.mouse(this)[1]  - 25 + "px")
    .style("left", d3v4.mouse(this)[0] + 50 + "px")
    .select("#value")
    .text(d.nes);

  d3v4.select("#tooltip").classed("hidden", false);

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


// highlight node and connected links on mouseover
function medianMouseover(d) {
  d3v4.select(this)
    .classed("turnedOn", true);

  d3v4.select("#tooltip")
    .style("top", d3v4.mouse(this)[1]  - 25 + "px")
    .style("left", d3v4.mouse(this)[0] + 50 + "px")
    .select("#value")
    .text(d.label);

  d3v4.select("#tooltip").classed("hidden", false);

}

// clear highlighted nodes or links
function medianout() {
  svg.selectAll(".turnedOn").classed("turnedOn", false);
  d3v4.select("#tooltip").classed("hidden", true);
  svg.selectAll(".turnedOff").classed("turnedOff", false);
}

function generateX(xData,height,width){
// text label for the x axis
  svg.append("text")
      .data(xData)
      .attr("transform",
          "translate(" + (width / 2) + " ," +
                         (height + 40) + ")")
      .style("text-anchor", "middle")
      .style("font-family", "Open Sans")
      .style("font-size", "15px")
      .text(xData[1].title);

// text label for the x axis
  svg.append("text")
      .data(xData)
      .attr("x", 0-width/2 + 50)
      .attr("y", height/2 - 200)
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle")
      .style("font-family", "Open Sans")
      .style("font-size", "15px")
      .text("Normalized expression levels");

}

function violin(data, mediandata, height, width){
  var maxvalue = d3v4.max(data, function(d){return d.nes}) * 1.5
  var minvalue = d3v4.min(data, function(d){return d.nes}) * 1.5
  var medianvalue = d3v4.median(data, function(d){return d.nes })

  var y = d3v4.scaleLinear()
            .domain([minvalue,maxvalue])
            .range([height, 0]);

  svg.append("g")
      .call( d3v4.axisLeft(y))
      .style("font-family", "Open Sans");

  var x = d3v4.scaleBand()
            .range([ 0, width ])
            .domain([mediandata[0].genotype, mediandata[1].genotype, mediandata[2].genotype])
            .padding(0.05);


  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3v4.axisBottom(x))
      .style("font-family", "Open Sans");

  var histogram = d3v4.histogram()
                    .domain(y.domain())
                    .thresholds(y.ticks(20))
                    .value(d => d);


  var sumstat = d3v4.nest()
                  .key(function(d) { return d.genotype;})
                  .rollup(function(d) {
                            input = d.map(function(g) { return g.nes;})
                            bins = histogram(input);
                            return(bins);
                  })
                  .entries(data);


  var maxNum = 0;
  for(i in sumstat ){
    allBins = sumstat[i].value;
    lengths = allBins.map(function(a){return a.length;})
    longuest = d3v4.max(lengths);
    if (longuest > maxNum){
      maxNum = longuest;
    }
  }
  var xNum = d3v4.scaleLinear()
                .range([0, x.bandwidth()])
                .domain([-maxNum,maxNum]);

  var myColor = d3v4.scaleSequential()
                  .interpolator(d3v4.interpolateInferno)
                  .domain([minvalue,maxvalue]);


  svg.selectAll("myViolin")
      .data(sumstat)
      .enter()
      .append("g")
      .attr("transform", function(d){ return("translate(" + x(d.key) +" ,0)") })
      .append("path")
      .datum(function(d){ return(d.value)})
      .style("stroke", "none")
      .style("fill","#A4A4A475")
      .attr("d", d3v4.area()
            .x0( xNum(0) )
            .x1(function(d){ return(xNum(d.length)) } )
            .y(function(d){ return(y(d.x0)) } )
            .curve(d3v4.curveCatmullRom)
            );


  var jitterWidth = 40;
  svg.selectAll("indPoints")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function(d){return(x(d.genotype) + x.bandwidth()/2 - Math.random() * jitterWidth )})
      .attr("cy", function(d){return(y(d.nes))})
      .attr("r", 5)
      .style("fill", function(d){ return(myColor(d.nes))})
      .attr("stroke", "white")
      .on("mouseover", nodeMouseover)
      .on("mouseout", mouseout);

  svg.selectAll("vertLines")
      .data(mediandata)
      .enter()
      .append("line")
      .attr("x1", function(d){return(x(d.genotype)+ 10)})
      .attr("x2", function(d){return(x(d.genotype)+ 120)})
      .attr("y1", function(d){return(y(d.median))})
      .attr("y2", function(d){return(y(d.median))})
      .attr("stroke", "#4B8E55")
      .attr("stroke-width", "2px")
      .style("width", 40)
      .on("mouseover", medianMouseover)
      .on("mouseout", medianout);

  generateX(mediandata,height, width);

}

