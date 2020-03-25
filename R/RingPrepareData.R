RingPrepareData <- function(Summary, tissue, KEGG_DATA){
  tisSummary <- Summary[,tissue]
  pathways <- Summary[,tissue]$canOR
  SNP_QTLs <-  Summary[,tissue]$Module_SNPs_eQTLs
  modules <- names(pathways)
  #Tissue -> Module
  out1 <- data.frame("source" = rep(tissue,length(modules)),
                     "target" = paste("Module", modules))
  #Module -> Pathways
  pathNames <- sapply(pathways,function(pathway)pathway$PathwayName) %>% stack()
  out2 <- data.frame("source"= pathNames$ind <- paste("Module", pathNames$ind ),
                     "target" = pathNames$values)
  #Pathways -> QTLs
  modQTLs <- sapply(SNP_QTLs,function(module) module$gencodeId) %>% stack()
  modGene <- sapply(SNP_QTLs,function(module) module$gene) %>% stack()
  modSNPs <- sapply(SNP_QTLs,function(module) module$SNP) %>% stack()
  pathIDs <- sapply(pathways,function(pathway)rownames(pathway)) %>% stack()
  colnames(pathIDs) <- "IDs"
  pathInfo <- cbind(pathNames,pathIDs)
  path_QTLs <- sapply(pathInfo$values,function(pathway){
    pathwayID <- pathInfo[pathInfo$values == pathway,"IDs"] %>% unique()
    module <- pathInfo[pathInfo$values == pathway,"ind"] %>% gsub(pattern = "Module ",replacement = "")
    moduleQTLs <- modQTLs[modQTLs$ind == module,"values"]
    pathwayGenes <- KEGG_DATA$ENSG[[pathwayID]]
    return(intersect(pathwayGenes,moduleQTLs))
  }) %>% stack()
  QTLs_snps <- cbind(modQTLs,modSNPs,modGene)[,c(1,3,5,6)]
  colnames(QTLs_snps) <- c("ENS","SNP","gene","Module")
  path_QTLs$values <- QTLs_snps[match(path_QTLs$values,QTLs_snps$ENS),"gene"]

  out3 <- data.frame("source" = path_QTLs$ind,
                     "target" = path_QTLs$values)

  out4 <- data.frame("source" =QTLs_snps$gene,
                     "target" = QTLs_snps$SNP)

  out <- rbind(out1,out2,out3,out4)
  return(out)
}
