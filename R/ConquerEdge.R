#' ConquerEdge
#' @param conquerSummary Summary file  of CONQUER
#' @param width width of the figure
#' @param height height of the figure
#' @param elementId elementId
#' @export 
ConquerEdge <- function(conquerSummary, width = NULL, height = NULL, elementId = NULL, disease="all") {

  pathwayTissue <- EdgePrepareData(conquerSummary, disease=disease)

  x = list(
    pathwayTissue = pathwayTissue
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'ConquerEdge',
    x,
    width = width,
    height = height,
    package = 'conquer.d3js',
    elementId = elementId
  )
}

#' Shiny bindings for conquer.d3js
#'
#' Output and render functions for using conquer.d3js within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a conquer.d3js
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name conquer.d3js-shiny
#'
#' @export
ConquerEdgeOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'ConquerEdge', width, height, package = 'conquer.d3js')
}

#' @rdname conquer.d3js-shiny
#' @export
renderConquerEdge <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, ConquerEdgeOutput, env, quoted = TRUE)
}
