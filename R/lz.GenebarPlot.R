lz.GenebarPlot <- function(Genes, Exons, chr, xmin, xmax) {
  if (!length(Genes)==0) {
    #find overlaps ----
    #GRanges to dataframe for ggplot
    rec <- data.frame(
      external_name = Genes$name,
      start = GenomicRanges::start(Genes),
      end = GenomicRanges::end(Genes),
      strand = as.integer(
        gsub('+', 1, gsub("-", -1, as.character(Genes@strand)), fixed = T)),
      id = Genes$gene_id
    )
    #format genes info
    rec$y <- 1
    rec <- rec[order(rec$end, decreasing = F),]
    #calculate overlap to avoid overlapping in plot
    if (nrow(rec) > 1) {
      for (gene in seq(1, nrow(rec))) {
        rec[gene, 'y'] <- max(rec[rec$end>=rec[gene, "start"], 'y'])+1
      }
      rec$y <- rec$y-1 #there always is a +1 for overlap with itself
    }
    #get exon positions
    expos <- merge(Exons, rec, by.x = 'parent', by.y = 'id')
  }
  return(expos)
}
