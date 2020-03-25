HTMLWidgets.widget({

  name: 'ConquerViolin',

  type: 'output',

  factory: function(el, width, height) {



    return {
      renderValue: function(x) {

        var elementExists = document.getElementById("ViolinContainer");

        if (typeof(elementExists) != 'undefined' && elementExists !== null){
          elementExists.remove();
        }

        var margin = {top: 10, right: 30, bottom: 50, left: 40},
                      width = 460 - margin.left - margin.right,
                      height = 400 - margin.top - margin.bottom;

        var aWindow = d3v4.select(el)
                        .append("div")
                        .attr("id","ViolinContainer");

        var svg = d3v4.select("#ViolinContainer")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform","translate(" + margin.left + "," + margin.top + ")");
        globalSVG(svg);
        violin(x.levelsData,x.medianData, height, width);

      },

      resize: function(width, height) {

      }

    };
  }
});
