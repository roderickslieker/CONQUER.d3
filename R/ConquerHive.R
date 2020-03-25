#' ConquerHive
#' @import htmlwidgets
#' @export
ConquerHive <- function(SNPData, cis=T, trans=T, width = NULL, height = NULL, elementId = NULL) {

  hiveData <- HivePrepareData(SNPData, cis, trans)

  x = list(
    nodes = hiveData[[1]],
    links = hiveData[[2]]
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'ConquerHive',
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
ConquerHiveOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'ConquerHive', width, height, package = 'conquer.d3js')
}

#' @rdname conquer.d3js-shiny
#' @export
renderConquerHive <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, ConquerHiveOutput, env, quoted = TRUE)
}
