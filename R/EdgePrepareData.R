EdgePrepareData <- function(conquerSummary, disease="all"){
  enrichmentResults <- conquerSummary["canOR",]

  pathways <- lapply(1:length(enrichmentResults),function(i){
    tissueSpecific <- enrichmentResults[[i]]
    if(length(tissueSpecific) != 0)
    {
      out <- lapply(tissueSpecific, function(temp)
      {
        temp$ID <- rownames(temp)
        return(temp)
      }) %>% do.call(what = rbind)

      if(nrow(out) != 0)
      {
        out$Tissue <- names(enrichmentResults)[i]
      }
      return(out)

    }

  }) %>% do.call(what = rbind)
  kegg <- conquer.d3js::KEGG_CLASSIFICATION
  disease_pathways <- kegg[kegg$main_class == "Human Diseases","ID"]

  if(disease == "all")
  {}else if(disease == "no")
  {
    pathways <- pathways[!pathways$ID %in% disease_pathways,]
  }else if(disease == "yes"){
    pathways <- pathways[pathways$ID %in% disease_pathways,]
  }

  pathways <- data.frame("Pathways" = pathways$PathwayName,
                         "Tissue" = gsub("[[:digit:]]+","",pathways$Tissue)) %>% unique()



  pws <- table(pathways$Pathways) %>% sort(decreasing = T) %>% names()
  pathways <- pathways[factor(pathways$Pathways,levels=pws) %>% order(),]
  jsonData <- EdgeTransformtoJSON(pathways)
  return(jsonData)
}
