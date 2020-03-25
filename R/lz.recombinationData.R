lz.recombinationData <- function(chr, start, end) {
  #take the recombination data from the correct file
  recomb <- conquer.db::recombinationRate
  recomb <- recomb[[paste0("recomb_chr",chr)]]
  recomb <- subset(recomb, V1>start&V1<end)
  colnames(recomb) <- c("start","recombination")
  return(recomb)
}
