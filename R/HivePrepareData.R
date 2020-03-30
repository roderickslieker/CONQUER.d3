#' @import conquer.db
HivePrepareData <- function(SNPData, cis, trans){
  #Get eQTLS in cis from SNP data
  if(cis && trans){
    data.in <- SNPData$eQTLs[SNPData$eQTLs$pValue <= SNPData$eQTLs$pValueThreshold,]
    data.in <- rbind(data.in,
                     SNPData$eQTLsTrans[(SNPData$eQTLsTrans$pValue <= SNPData$eQTLsTrans$pValueThreshold) |
                                                  (SNPData$eQTLsTrans$pValue <= 0.001 & SNPData$eQTLsTrans$Pval.ratio <= 2) ,])
  }else if(cis){
    data.in <- SNPData$eQTLs[SNPData$eQTLs$pValue <= SNPData$eQTLs$pValueThreshold,]
  }else if(trans){
    data.in <- SNPData$eQTLsTrans[(SNPData$eQTLsTrans$pValue <= SNPData$eQTLsTrans$pValueThreshold) |
                                          (SNPData$eQTLsTrans$pValue <= 0.001 & SNPData$eQTLsTrans$Pval.ratio <= 2) ,]
  }else{
    warning("Not possible")
  }


  tissues <- conquer.db::gtexTissuesV8
  nodes.tissues <- data.frame(x = 2, y = seq(0,1,length.out = length(tissues)), id = tissues)
  nodes.tissues$color <- viridis::viridis_pal()(length(tissues))

  genes <- unique(c(SNPData$eQTLs$gene, SNPData$eQTLsTrans$gene))
  nodes.genes <- data.frame(x = 1, y = seq(0,1,length.out = length(genes)), id = genes)
  nodes.genes$color <- ifelse(nodes.genes$id %in% SNPData$eQTLs$gene, "#009AC7", "#132B41")



  snp <- sort(unique(data.in$SNP))
  nodes.snp <- data.frame(x = 0, y = 0.5, id = snp)
  nodes.snp$color <- "#A4A4A4"
  nodes <- rbind(nodes.tissues, nodes.genes, nodes.snp)

  links <- data.frame(Source = c(data.in$SNP,data.in$gene,data.in$tissue),
                      Target = c(data.in$gene, data.in$tissue,data.in$SNP))

  #Remove duplicates
  links <- unique(links)
  #Rename
  nodes$id <- nodes$id %>% as.character() %>% gsub(pattern = "_",replacement = " ")
  links$Source <- links$Source %>% as.character() %>% gsub(pattern = "_",replacement = " ")
  links$Target <- links$Target %>% as.character() %>% gsub(pattern = "_",replacement = " ")
  links <- lapply(1:nrow(links), gen.String.Link, nodes=nodes, links=links) %>% do.call(what = paste02)
  links <- sprintf("[ %s ]",links)
  nodes <- jsonlite::toJSON(nodes)
  return(list(nodes, links))

}

gen.String.Link <- function(i, nodes, links)
{
  node.s <- links[i,"Source"]
  node.e <- links[i,"Target"]

  data.s <- nodes[match(node.s, nodes$id),]
  data.e <- nodes[match(node.e, nodes$id),]


  link.string <- sprintf('{ "source": { "x": %s, "y": %s, "id": "%s" }, "target": { "x": %s, "y": %s, "id": "%s" } }',
                         data.s[,"x"],data.s[,"y"],data.s[,"id"],
                         data.e[,"x"],data.e[,"y"],data.e[,"id"])
  return(link.string)
}

paste02 <- function(...)
{
  paste(...,sep = ",")
}
















