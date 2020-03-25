EdgePrepareData <- function(conquerSummary){
  enrichmentResults <- conquerSummary["canOR",]
  pathways <- sapply(enrichmentResults,function(tissueSpecific){
    do.call(rbind,tissueSpecific)$PathwayName
  }) %>% do.call(what = c)
  pathways <- data.frame("Pathways" = unname(pathways),
                         "Tissue" = gsub("[[:digit:]]+","",names(pathways)))
  pathways <- unique(pathways)
  pws <- table(pathways$Pathways) %>% sort(decreasing = T) %>% names()
  pathways <- pathways[factor(pathways$Pathways,levels=pws) %>% order(),]
  jsonData <- EdgeTransformtoJSON(pathways)
  return(jsonData)
}
