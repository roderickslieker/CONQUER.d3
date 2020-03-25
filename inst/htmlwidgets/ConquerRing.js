HTMLWidgets.widget({

  name: 'ConquerRing',

  type: 'output',

  factory: function(el, width, height) {

      var rings = new d3plus.Rings();

    return {
      renderValue: function(x) {

        var elementExists = document.getElementById("RingContainer");

        if (typeof(elementExists) != 'undefined' && elementExists !== null){
          elementExists.remove();
        }

        var aWindow = d3.select(el)
                        .append("div")
                        .attr("id","RingContainer");

        rings
          .select("#RingContainer")
          .links(x.data)
          .label(d => d.id)
          .center(x.tissue)
          .width(width)
          .height(height)
          .on("mouseover",d => Shiny.setInputValue(x.hoverID, d))
          .render();


      },

      resize: function(width, height) {

         rings
          .select("#RingContainer")
          .links(x.data)
          .label(d => d.id)
          .center(x.tissue)
          .width(width)
          .height(height)
          .on("mouseover",d => Shiny.setInputValue(x.hoverID, d))
          .render();

      }

    };
  }
});
