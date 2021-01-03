library(tidyr)
library(plyr)
library(dplyr)
setwd(dirname(rstudioapi::getActiveDocumentContext()$path))

# Declare colnames matching expected CSV data as well as DB schema. We only identify CSV columns we will need, in the correct order so we can rename with schema colnames list. 
CSV.MODULE.CODE <- "Module.Code"
CSV.MODULE.TITLE <- "Module.Title"
CSV.DESCRIPTION <- "Description"
CSV.STAFF.ID <- "Staff.ID"

FACULTY_CSV_COLNAMES <- c(CSV.STAFF.ID, "Email", "Full.Name")
FACULTY_DB_COLNAMES <- c("id", "email", "name")
COURSE_CSV_COLNAMES <-  c(CSV.MODULE.CODE, CSV.MODULE.TITLE, CSV.DESCRIPTION)
COURSE_DB_COLNAMES <- c("module_code", "title", "desc", "semester_code")
TAGGED_AS_DB_COLNAMES <- c("module_code", "tag_label", "semester_code")
COURSE_GROUP_CSV_COLNAMES <- c(CSV.MODULE.CODE, "Group", CSV.STAFF.ID)
COURSE_GROUP_DB_COLNAMES <- c("module_code", "group_code", "faculty_id", "semester_code")
COURSE_SCHEDULE_COLNAMES <- c("module_code", "semester_code", "group_code", "weeks", "day", "start", "end", "location_code")
SEMINAR_DB_COLNAMES <- c("module_code", "semester_code", "group_code", "week", "date", "start", "end", "location_code")
TAG_COLUMNS <- 3:8

# Declare some value constants. 
SEMESTER_CODE <- "AY1819-1"
TIMEZONE <- "+08:00"
DATE_FORMAT <- "%d-%m-%Y"
STARTING_SUNDAY_DATE <- as.Date("12-8-2018", DATE_FORMAT) # Sunday of week 1.
WEEK_MAPPING <- list("1-6, 8-14" = c(1:6, 8:14), "1-6, 7-13"= c(1:6, 7:13))
FILENAMES <- list(
  faculty = "faculty",
  course = "course",
  course_group = "course_group",
  course_schedule = "course_schedule",
  seminar = "seminar",
  tag = "tag",
  tagged_as = "tagged_as"
)
INPUT_FILENAMES <- FILENAMES %>% sapply(paste, ".csv", sep="")
OUTPUT_FILENAMES <- FILENAMES %>% sapply(paste, "_formatted_for_db.csv", sep="")

################# Get faculty table. 
faculty <- read.csv("~/Dropbox/open-classroom-backend-scripts/staff_list.csv",stringsAsFactors = FALSE)
faculty <- faculty[, FACULTY_CSV_COLNAMES]
colnames(faculty) <- FACULTY_DB_COLNAMES
write.csv(faculty, "faculty_formatted_for_db.csv", row.names = FALSE)

################# Get course table.
course_info <- read.csv("~/Dropbox/open-classroom-backend-scripts/course_Info.csv", stringsAsFactors = FALSE)
course <- course_info[, COURSE_CSV_COLNAMES]
course <- cbind(course, semester_code=SEMESTER_CODE)
colnames(course) <- COURSE_DB_COLNAMES
write.csv(course, "course_formatted_for_db.csv", row.names = FALSE)

################# Get tag and tagged_as table. 
tags <- character()
tagged_as <- data.frame(matrix(ncol=length(TAGGED_AS_DB_COLNAMES), nrow=0, dimnames=list(NULL, TAGGED_AS_DB_COLNAMES)))
for (i in 1:nrow(course_info)) {
  new_module <- course_info[i, CSV.MODULE.CODE]
  for (j in TAG_COLUMNS) {
    new_tag <- course_info[i, j]
    if (!is.na(new_tag) && new_tag != "") {
      tags <- c(tags, new_tag)
      tagged_as <- rbind(tagged_as, data.frame(module_code=new_module,
                                               tag_label=new_tag, 
                                               semester_code=SEMESTER_CODE))
    }
  }
}
tag <- data.frame(label=unique(tags))
write.csv(tag, "tag_formatted_for_db.csv", row.names = FALSE)
write.csv(tagged_as, "tagged_as_formatted_for_db.csv", row.names = FALSE)


################# Get course_group table. 
course_schedule <- read.csv("~/Dropbox/open-classroom-backend-scripts/course_schedule.csv",stringsAsFactors = FALSE)
course_group <- course_schedule[, COURSE_GROUP_CSV_COLNAMES]
course_group <- cbind(course_group, semester_code=SEMESTER_CODE)
colnames(course_group) <- COURSE_GROUP_DB_COLNAMES
# Remove all NA faculty_id and group code.
course_group <- course_group[!is.na(course_group$faculty_id), ]
course_group <- course_group[!is.na(course_group$group_code), ]
# Outer join course_group and faculty to obtain only courses that have a valid faculty_id (exists in faculty table).  
course_group <- merge(x = course_group, y = faculty, by.x = "faculty_id", by.y = "id")
course_group <- course_group[,COURSE_GROUP_DB_COLNAMES]

# Remove dups since this is course_schedule so there are repeated groups. 
course_group <- course_group[!duplicated(course_group[,c('module_code','group_code', 'semester_code')]),]
# Outer join course_group and course to obtain only course_groups that have a valid course. 
course_group <- merge(x = course_group, y = course, by = c("module_code", "semester_code"))
course_group <- course_group[,COURSE_GROUP_DB_COLNAMES]
write.csv(course_group, "course_group_formatted_for_db.csv", row.names = FALSE)

################# Get course_schedule table.
course_schedule <- read.csv("~/Dropbox/open-classroom-backend-scripts/course_schedule.csv",stringsAsFactors = FALSE)
# Add semester column. 
course_schedule$semester_code <- SEMESTER_CODE
# Order and rename columns to match schema
course_schedule <- course_schedule[, c("Module.Code","semester_code", "Group", "Weeks", "Day", "Start", "End", "Room")]
colnames(course_schedule) <- COURSE_SCHEDULE_COLNAMES
# Convert day to integer.
course_schedule$day <- mapvalues(course_schedule$day, from = c("Mon", "Tue", "Wed", "Thu", "Fri"), to = 1:5)
# Outer join course_schedule and course_group to obtain only course_schedules that refer to a valid course_group. Remove extraneous faculty_id column.
course_schedule <- merge(x = course_schedule, y = course_group, by=c("module_code","semester_code", "group_code"))
course_schedule <- subset(course_schedule, select=COURSE_SCHEDULE_COLNAMES)
write.csv(course_schedule, "course_schedule_formatted_for_db.csv", row.names = FALSE)

################# Get seminar table. 
# Given an integer day of the week from 1-5 (which we use to offset from the date of first sunday) and a sequence of week numbers, return a sequence of dates for selected weeks.
 weekly_date_seq <- function (week_day, weeks, starting_sunday_date=STARTING_SUNDAY_DATE) {
   last_week <- weeks[length(weeks)] # last value
   start <- starting_sunday_date + week_day
   date_seq <- seq(from=start, by = "week", length.out = last_week)
   date_seq <- date_seq[weeks] # get only desired weeks
   return(date_seq)
 }
# Initialize seminar table using seminar table schema. 
seminar <- data.frame(matrix(ncol=length(SEMINAR_DB_COLNAMES), nrow=0, dimnames=list(NULL, SEMINAR_DB_COLNAMES)))
# For every entry in course_schedule, generate a list of seminar entries for all weeks specified. Append all into the seminar table. 
for (i in 1:nrow(course_schedule)) {
  schedule_entry <- course_schedule[i,]
  # Map the week range string to a list of week numbers. 
  weeks_list <- WEEK_MAPPING[[schedule_entry$weeks]]
  # Generate weekly date sequence. 
  new_dates <- weekly_date_seq(as.integer(schedule_entry$day), weeks_list)
  # Repeat schedule entries to match new dates.
  new_seminars <- schedule_entry[c(rep(1, length(new_dates))),] %>% 
    # Insert correct date and week number for every schedule entry. 
    mutate(date=new_dates, week=weeks_list) %>% 
    # Get rid of extraneous columns to match seminar table schema.
    select(SEMINAR_DB_COLNAMES)
  # Add to seminar table. 
  seminar <- seminar %>% rbind(new_seminars) 
}
write.csv(seminar, "seminar_formatted_for_db.csv", row.names = FALSE)

# TODO:
# course_group ignores any entry with faculty_id that does not exist.
# course_group ignores any entry with course that does not exist.
# course_group remove all NA faculty_id and group code.
# course_schedule ignores any entry with course_group that does not exist. 
# Account for CC lectures with NA faculty ID.  


