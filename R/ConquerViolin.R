#' ConquerViolin
#' @import htmlwidgets
#' @export
ConquerViolin <- function(SNP, gene, tissue, width = NULL, height = NULL, elementId = NULL) {
  violData <- violGetData(SNP = SNP, gene = gene, tissue=tissue)
  x = list(
    levelsData = violData[[1]],
    medianData = violData[[2]]
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'ConquerViolin',
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
ConquerViolinOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'ConquerViolin', width, height, package = 'conquer.d3js')
}

#' @rdname conquer.d3js-shiny
#' @export
renderConquerViolin <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, ConquerViolinOutput, env, quoted = TRUE)
}
