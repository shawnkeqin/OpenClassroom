library(tidyr)
library(plyr)
library(dplyr)
setwd(dirname(rstudioapi::getActiveDocumentContext()$path))

INPUT1_FILEPATH <-
  "~/github/OpenClassroom/data/semester-1-fall-2020-formatted-20200708.csv"

INPUT2_FILEPATH <- 
  "~/github/OpenClassroom/data/semester-1-fall-2020-raw-latest.csv"
reformat <- read.csv(INPUT2_FILEPATH, stringsAsFactors = FALSE)
write.csv(reformat, "semester-1-fall-2020-raw-latest.csv",row.names = FALSE)

validated1 <- read.csv(INPUT1_FILEPATH, stringsAsFactors = FALSE) %>%
  filter(!is.na(Staff.ID)) %>%
  filter(nchar(Staff.ID) > 0) %>%
  mutate(across(where(is.character), trimws))
faculty <- validated1 %>%
  distinct(Staff.ID, Instructor)

validated2 <- read.csv(INPUT2_FILEPATH, stringsAsFactors = FALSE) %>%
  mutate(across(where(is.character), trimws))
input2_with_faculty_names <- validated2 %>%
  merge(faculty, by="Instructor", all.x=TRUE, all.y=FALSE)
write.csv(input2_with_faculty_names, "semester-1-fall-2020-raw-latest-with-id.csv",row.names = FALSE)


