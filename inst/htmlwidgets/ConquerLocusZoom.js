HTMLWidgets.widget({

  name: 'ConquerLocusZoom',

  type: 'output',

  factory: function(el, width, height) {
  // set the dimensions and margins of the graph
  var margin = {top: 30, right: 20, bottom: 30, left: 60},
                widthjs = width - margin.left - margin.right,
                heightjs = height - margin.top - margin.bottom;

    return {
      renderValue: function(x) {

        var elementExists = document.getElementById("LocusContainer");

        if (typeof(elementExists) != 'undefined' && elementExists !== null){
          elementExists.remove();
        }

        var lddata = x.ld;
        var rcdata = x.rc;
        var genes = x.genes;
        var exons = x.exons;

        // Define tooltip
        var tooltip = d3v4.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        //Make global for functions
        defineTooltip(tooltip);


        var aWindow = d3v4.select(el)
                        .append("div")
                        .attr("id","LocusContainer");

        //Define SVG
        var svg = d3v4.select("#LocusContainer")
            .append("svg")
            .attr("width", widthjs + margin.left + margin.right)
            .attr("height", heightjs + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
        //Make SVG global for functions
        svgGlobal(svg);
        // Top plot
        rsquared(lddata, widthjs, heightjs);
        // Recombination
        recombination(rcdata, widthjs, heightjs);
        // Genes
        addgenes(genes, exons, widthjs, heightjs);
        // Axis labels
        axisLabels(widthjs, heightjs);

      },

      resize: function(width, height) {

      }

    };
  }
});
