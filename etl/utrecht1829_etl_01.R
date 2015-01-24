# File: utrecht1829_etl_01.R
# date: 2015-01-24
# Author: richard.zijdeman@iisg.nl

# Laste change: -


# packages and libraries
# install.packages("gdata")
library(gdata)

# working directory
setwd("~/git/qber/")

# functions
# trim leading and trailing spaces: see 
# http://stackoverflow.com/questions/2261079/how-to-trim-leading-and-trailing-whitespace-in-r
trim <- function (x) gsub("^\\s+|\\s+$", "", x) # 


# read in data
# for documentation see: http://socialhistory.org/nl/research/database-nieuwkomers-de-utrechtse-volkstelling-van-1829-en-1839
file <- "http://socialhistory.org/sites/default/files/docs/utrecht1829.xls"

u29 <- read.xls(file, sheet = 1, header = TRUE, na.strings = c("~", "NA"),
                fileEncoding="latin1") # latin1 fixes special char issues
# documentation says "~" indicates missing data

# checking dimensions of file
dim(u29) # 1301 254: rows check out, but lot of empty columns, removing those:
u29.1 <- subset(u29, select = -(grep("X", names(u29))))
dim(u29.1) #1301 19

# removing '.' in varnames (if need to replace with '_')
names(u29.1) <-  sub("hoofdbewoner.", "hoofdbewoner", names(u29.1))
names(u29.1)
names(u29.1) <- gsub("\\.", "_", names(u29.1))

# droppping all factors: 
# http://stackoverflow.com/questions/2851015/convert-data-frame-columns-from-factors-to-characters

i <- sapply(u29.1, is.factor)
u29.1[i] <- lapply(u29.1[i], as.character)
str(u29.1)

###################### 
# cleaning variables #
######################

names(u29.1)
# geslacht (sex)
# converting factor to character
str(u29.1$geslacht)
u29.1$geslacht <- as.character(u29.1$geslacht)

table(u29.1$geslacht, useNA = "ifany")
# 8 different values, only 2 reported in code book (m = males, v = females)
# b      m     m  mulder      n      o      v      w 
# 2    770      1      1      5      1    518      3

u29.1$geslacht[u29.1$geslacht == "b" ] <- "v" # qwerty-keyboard coding error
u29.1$geslacht[u29.1$geslacht == "m "] <- "m" # space coding error
u29.1$geslacht[u29.1$geslacht == "mulder" & u29.1$voornaam == "sophia"] <- "v"
u29.1$geslacht[u29.1$geslacht == "n" & u29.1$voornaam == "christoffel"] <- "m"
u29.1$geslacht[u29.1$geslacht == "n" & u29.1$voornaam == "hendrik"    ] <- "m"
u29.1$geslacht[u29.1$geslacht == "n" & u29.1$voornaam == "roselia"    ] <- "v"
u29.1$geslacht[u29.1$geslacht == "n" & u29.1$voornaam == "joh.  "     ] <- NA
u29.1$geslacht[u29.1$geslacht == "n" & u29.1$voornaam == "marie a."   ] <- "v"
u29.1$geslacht[u29.1$geslacht == "o" & u29.1$voornaam == "elizabeth"]   <- "v"
u29.1$geslacht[u29.1$geslacht == "w" & u29.1$voornaam == "mijntje" ]    <- "v"
u29.1$geslacht[u29.1$geslacht == "w" & u29.1$voornaam == "maria t."]    <- "v"
u29.1$geslacht[u29.1$geslacht == "w" & u29.1$voornaam == "anna m." ]    <- "v"
# table(u29.1$geslacht, useNA = "ifany") # checks out now
#    m    v <NA> 
#  773  527    1 

# leaving achternaam (family name) and voornaam (given name) as they are

# leeftijd
table(u29.1$leeftijd, useNA = "ifany") # 5 missings
summary(u29.1$leeftijd) # all values between 1 and 93
hist(u29.1$leeftijd, 
     breaks=length(unique(u29.1$leeftijd)), 
     freq = TRUE,
     col = "blue") # somewhat right skewed

# huwelijkse_staat (marriage status)
table(u29.1$huwelijkse_staat, useNA = "ifany")
# ~     b    c    m    n    o    v    w    x <NA> 
#   1  155    1    3  427  511    2  131   24   46 
# o = unmarried
# b = married to foreigner
# n = married to Dutch
# x = married, but partner not present in city
# w = widow

u29.1$huwelijkse_staat[u29.1$huwelijkse_staat == "~ "] <- NA
u29.1$huwelijkse_staat[u29.1$huwelijkse_staat == "c"] <- "x" # c/x keyboard + english
u29.1$huwelijkse_staat[u29.1$huwelijkse_staat == "v"] <- "x" # c/x keyboard + german, 2 rows
u29.1$huwelijkse_staat[u29.1$huwelijkse_staat == "m"] <- "n" # m/n keyboard, 3 rows
table(u29.1$huwelijkse_staat)
barplot(table(u29.1$huwelijkse_staat))

# geboorteplaats
table(u29.1$geboorteplaats) # not cleaned
table(u29.1$geboorteregio) # not cleaned
table(u29.1$geboorteland)
u29.1$geboorteland[u29.1$geboorteland == "belgie"]      <- "belgië"
u29.1$geboorteland[u29.1$geboorteland == "italie"]      <- "italië"
u29.1$geboorteland[u29.1$geboorteland == "zuid afrika"] <- "zuid-afrika"
u29.1$geboorteland[u29.1$geboorteland == "zwiterland"]  <- "zwitserland"
# what to do with 'op zee'?, leaving it for now
table(u29.1$geboorteland)
barplot(sort(table(u29.1$geboorteland), decreasing = TRUE), las = 2)

# beroep (occupation)
table(u29.1$beroep) # some issues with trailing and perhaps leading spaces
u29.1$beroep <- trim(u29.1$beroep)

# religie (religion)
# 'afg' == afgescheiden,
# 'dg'  == doopsgezind,
# 'epi' == episcopaal,
# 'ger' == gereformeerd, 
# 'isr' == joods,
# 'lut' == luthers, 
# 'or'  == oud-rooms
# 'rk'  == katholiek,  
# 'wg'  == Waals gereformeerd
 
table(u29.1$religie)
# cle, g, pre # are not in codebook: setting these to NA
u29.1$religie[u29.1$religie == "cle"] <- NA
u29.1$religie[u29.1$religie == "g"]   <- NA
u29.1$religie[u29.1$religie == "pre"] <- NA
table(u29.1$religie)

# straatnaam (streetname)
table(u29.1$straatnaam) # no obvious issues

# huisnummer (house number)
table(u29.1$huisnummer)
hist(u29.1$huisnummer,
     breaks=length(unique(u29.1$huisnummer)), 
     freq = TRUE,
     col = "blue") # somewhat right skewed and irregular frequency distribution

# achtervoegsel (housenumber addition)
table(u29.1$achtervoegsel) # not changing anything

# wijknumer (neighbourhood number)
table(u29.1$wijknummer) # not changing anything 
# (NB: j was never used)
# see: http://nl.wikipedia.org/wiki/Wijken_in_Utrecht

# hoofdbewoner
u29.1$hoofdbewoner[u29.1$hoofdbewoner == "b"] <- "n"  #b/n keyboard and already other head
                                                      # of household on same address
u29.1$hoofdbewoner[u29.1$hoofdbewoner == "n "] <- "n" #b/n keyboard and already other head
table(u29.1$hoofdbewoner)
barplot(table(u29.1$hoofdbewoner))

# geboorteplaats.hb (place of birth head of household)
table(u29.1$geboorteplaats_hb)
u29.1$geboorteplaats_hb <- trim(u29.1$geboorteplaats_hb)

# geboorteland.hb (country of birth head of household)
table(u29.1$geboorteland_hb)
u29.1$geboorteland_hb[u29.1$geboorteland_hb == "italie"]      <- "italië"
u29.1$geboorteland_hb[u29.1$geboorteland_hb == "zuid afrika"] <- "zuid-afrika"

# beroep hoofdbewoner (occupation head of household)
table(u29.1$beroep_hb)
u29.1$beroep_hb <- trim(u29.1$beroep_hb)

# religie hoofdbewoner (religion head of household)
table(u29.1$religie_hb, useNA = "ifany")
u29.1$religie_hb[u29.1$religie_hb == "cl"]  <- NA
u29.1$religie_hb[u29.1$religie_hb == "cle"] <- NA
u29.1$religie_hb[u29.1$religie_hb == "gg"]  <- NA
table(u29.1$religie_hb, useNA = "ifany")

##
summary(u29.1)

## reset character variables to factors
u29.2 <- u29.1
i <- c("geslacht", "huwelijkse_staat", "religie", "wijknummer", "hoofdbewoner", 
       "religie_hb")
ilist <- names(u29.2) %in% i
u29.2[ilist] <- lapply(u29.2[ilist], as.factor)
str(u29.2)
write.csv(u29.2, "./data/derived/utrecht_1829_clean_01.csv", 
          fileEncoding = "UTF-8")
