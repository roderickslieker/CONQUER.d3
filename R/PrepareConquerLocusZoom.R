PrepareConquerLocusZoom <- function(plotData){
  # LD
  ld.temp <- plotData$LD

  # Define var
  minld <- (min(ld.temp$start) %>% as.numeric())
  maxld <- (max(ld.temp$start) %>% as.numeric())

  # Calculate range
  deltald <- maxld-minld
  tophits.temp <- plotData$topHits
  #Take correlated SNPs
  tempR2 <- data.frame(ld.temp$r2, col=NA) %>% unique()
  tempR2 <- tempR2[order(tempR2$ld.temp.r2),]
  #Set colors
  tempR2$col <- viridis::viridis_pal()(length(unique(ld.temp$r2)))
  ld.temp$col <- tempR2[match(ld.temp$r2, tempR2$ld.temp.r2),"col"]
  #Prep label
  ld.temp$label <- sprintf("SNP: %s<br/>Position: %s<br/>r<sup>2</sup>: %s<br/>Consequence:%s",
                           ld.temp$variation,
                           ld.temp$start,
                           ld.temp$r2,
                           ld.temp$consequence_type
  )
  ld.temp$strokeweight <- 0
  ld.temp[ld.temp$variation %in% plotData$SNP$variation,"strokeweight"] <- 1
  ##############################################################################

  ##############################################################################
  # Recomb
  recomb.data <- lz.recombinationData(chr = unique(ld.temp$chr), start = minld, end = maxld)
  recomb.data <- recomb.data[order(recomb.data$start),]

  ##############################################################################

  ##############################################################################
  # Genes
  genes.gr <- plotData$genes
  exons.gr <- plotData$Exons



  rm.exons <- c(which(exons.gr$exstart < minld & exons.gr$exend < minld),
                which(exons.gr$exstart > maxld & exons.gr$exend > maxld))
  if(length(rm.exons) >= 1) exons.gr <- exons.gr[-rm.exons,]

  genes <- lz.GenebarPlot(Genes = genes.gr, Exons = exons.gr,
                       chr = unique(ld.temp$chr), xmin = minld, xmax = maxld)
  genes$middle <- ((genes$exend + genes$exstart)/2)
  genes <- genes[!genes$exend <= genes$exstart,]
  genes$width <- genes$exend - genes$exstart
  #Subset data
  genes.all <- genes[,c("external_name","start","end","strand","y")] %>% unique()
  genes.all$start <- as.numeric(genes.all$start)
  genes.all$end <- as.numeric(genes.all$end)
  #Normalize to zero when outside plot range
  genes.all$start <- ifelse(genes.all$start <= minld, minld ,genes.all$start)
  genes.all$end <- ifelse(genes.all$end > maxld, maxld, genes.all$end)
  genes.all$middle <- ((genes.all$end + genes.all$start)/2)
  strand <- ifelse(genes.all$strand == 1, "&#x2192;", "&#x2190;")
  genes.all$label <- sprintf("%s%s",genes.all$external_name,strand)


  ##############################################################################

  #Scale in kb
  ld.temp$start <- lz.scaleData(ld.temp$start)
  recomb.data$start <- lz.scaleData(recomb.data$start)

  #To JSON
  for(col in c("start","end","exstart","exend","middle","width"))
  {
    genes[,col] <- lz.scaleData(genes[,col])
  }

  for(col in c("start","end","middle"))
  {
    genes.all[,col] <- lz.scaleData(genes.all[,col])
  }

  #Covert to JSON
  ld <- jsonlite::toJSON(ld.temp)
  genes.all <- jsonlite::toJSON(genes.all)
  exons.all <- jsonlite::toJSON(genes)
  rc <- jsonlite::toJSON(recomb.data)

  outdata <- list(ld,rc, genes.all,exons.all)
  return(outdata)
}
