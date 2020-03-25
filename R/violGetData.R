violGetData <- function(SNP, gene, tissue){
  require(magrittr)
  
  rawData <- jsonlite::fromJSON(
    sprintf("https://gtexportal.org/rest/v1/association/dyneqtl?gencodeId=%s&variantId=%s&tissueSiteDetailId=%s&datasetId=gtex_v8",
            gene,
            SNP,
            tissue))
  
  data <- data.frame(genotype = round(rawData$genotypes), nes= rawData$data)
  # Meta data
  meta <- rio::import(sprintf("https://gtexportal.org/rest/v1/dataset/variant?format=tsv&snpId=%s&datasetId=gtex_v8",SNP), format="\t")
  
  # Assign alleles
  data$genotype[data$genotype==0] <- paste0(meta$ref,meta$ref)
  data$genotype[data$genotype==1] <- paste0(meta$ref,meta$alt)
  data$genotype[data$genotype==2] <- paste0(meta$alt,meta$alt)
  
  jsonOut <- jsonlite::toJSON(data)
  dataMedian <- by(data = data$nes, INDICES = data$genotype, quantile) %>%
    do.call(what=rbind) %>%
    as.data.frame()
  
  dataMedian$genotype <- rownames(dataMedian)
  
  dataMedian$label <- sprintf("Levels:%s[%s-%s]",
                              round(dataMedian$`50%`, 3),
                              round(dataMedian$`25%`, 2),
                              round(dataMedian$`75%`, 2)
  )
  
  title.new <- sprintf("Gene:%s SNP:%s Tissue:%s", gene, SNP , tissue)
  medianOut <- data.frame(genotype = dataMedian$genotype, median = dataMedian$`50%`, label=dataMedian$label, title=title.new)
  jsonMedianOut<- jsonlite::toJSON(medianOut)
  return(list(jsonOut,jsonMedianOut))
}
