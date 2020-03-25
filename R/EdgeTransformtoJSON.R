EdgeTransformtoJSON <- function(pathways){
  pathways <- pathways[order(pathways$Tissue),]
  p1 <- sprintf('{"name":"%s.tissue.%s","size":3938,"imports":["All.pathway.%s"]}',pathways$Tissue,pathways$Tissue,pathways$Pathways,pathways$Pathways) %>%
    as.list() %>%
    do.call(what = function(...){paste(...,sep = ",")})
  pws <- unique(pathways$Pathways)
  p2 <- lapply(pws, FUN = function(pwsx){
    pws.sel <- pathways[pathways$Pathways %in% pwsx,]
    imp <- sprintf('"%s.tissue.%s"',pws.sel$Tissue, pws.sel$Tissue) %>%
      as.list() %>%
      do.call(what = function(...){paste(...,sep = ",")})
    pw.json <- sprintf('{"name":"All.pathway.%s","size":3938,"imports":[%s]}', pwsx, imp)
    pw.json
  }) %>%
    do.call(what = function(...){paste(...,sep = ",")})

  out.json <- sprintf("[%s,%s]",p1,p2)
  return(jsonlite::toJSON(out.json))
}
