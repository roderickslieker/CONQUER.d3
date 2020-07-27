EdgePrepareData <- function(conquerSummary, disease="all"){
  enrichmentResults <- conquerSummary["canOR",]
  
  pathways <- sapply(enrichmentResults,function(tissueSpecific){
    do.call(rbind,tissueSpecific)$PathwayName
  }) %>% do.call(what = c)
  pathways <- data.frame("Pathways" = unname(pathways),
                         "Tissue" = gsub("[[:digit:]]+","",names(pathways)))
  pathways <- unique(pathways)
  
  kegg <- conquer.d3js::KEGG_CLASSIFICATION
  disease_pathways <- kegg[kegg$main_class == "Human Diseases","Name"]
  
  if(disease == "all")
  {}else if(disease == "no")
  {
    pathways <- pathways[!pathways$Pathways %in% disease_pathways,]
  }else if(disease == "yes"){
    pathways <- pathways[pathways$Pathways %in% disease_pathways,]
  }
  
  
  
  pws <- table(pathways$Pathways) %>% sort(decreasing = T) %>% names()
  pathways <- pathways[factor(pathways$Pathways,levels=pws) %>% order(),]
  jsonData <- EdgeTransformtoJSON(pathways)
  return(jsonData)
}
