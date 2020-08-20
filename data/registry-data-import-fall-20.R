library(tidyr)
library(plyr)
library(dplyr)
setwd(dirname(rstudioapi::getActiveDocumentContext()$path))

INPUT_FILEPATH <-
  "~/github/OpenClassroom/data/semester-1-fall-2020-formatted-20200708.csv"
CC_LECTURES_FILEPATH <-
  "~/github/OpenClassroom/data/cc-lectures-sem-1-fall-2020.csv"
# Declare some value constants.;
SEMESTER_CODE <- "AY2021-1"
TIMEZONE <- "+08:00"
DATE_FORMAT <- "%d-%m-%Y"
STARTING_SUNDAY_DATE <-
  as.Date("9-8-2020", DATE_FORMAT) # Sunday of week 1.
WEEK_MAPPING <-
  list("1-6, 8-14" = c(1:6, 8:14),
       "1-6, 7-13" = c(1:6, 7:13))

################# Get faculty table.
FACULTY_SCHEMA <- c("id", "name", "email")
validated <- read.csv(INPUT_FILEPATH, stringsAsFactors = FALSE) %>%
  filter(!is.na(Staff.ID)) %>%
  filter(nchar(Staff.ID) > 0) %>%
  mutate(across(where(is.character), trimws))
faculty <- validated %>%
  rename(id = Staff.ID, name = Instructor) %>%
  distinct(id, name, .keep_all = TRUE) %>%
  mutate(email = paste(id, "@nus.edu.sg", sep = "")) %>%
  select(FACULTY_SCHEMA)
write.csv(faculty, "db_faculty.csv", row.names = FALSE)

################# Get course table.
COURSE_SCHEMA <-  c("title", "module_code", "semester_code")
course <- validated %>%
  mutate(semester_code = SEMESTER_CODE) %>%
  rename(title = Module.Title,
         module_code = Module.Code) %>%
  distinct(module_code, .keep_all = TRUE) %>%
  select(COURSE_SCHEMA)
write.csv(course, "db_course.csv", row.names = FALSE)


################# Get course_group table.
COURSE_GROUP_SCHEMA <-
  c("faculty_id",
    "module_code",
    "group_code",
    "semester_code",
    "teaching_mode")
course_group <- validated %>%
  mutate(semester_code = SEMESTER_CODE) %>%
  rename(
    faculty_id = Staff.ID,
    module_code = Module.Code,
    group_code = Section,
    teaching_mode = Mode.of.Teaching
  ) %>%
  mutate(
    teaching_mode = recode(
      teaching_mode,
      "Remote" = "REMOTE",
      "Remote/\nF2F" = "REMOTE_F2F",
      "Remote in YNC Classroom" = "REMOTE_IN_YNC_CLASSROOM"
    )
  ) %>%
  distinct(faculty_id, module_code, group_code, .keep_all = TRUE) %>%
  select(COURSE_GROUP_SCHEMA)
write.csv(course_group, "db_course_group.csv", row.names = FALSE)


################# Get course_schedule table.
COURSE_SCHEDULE_SCHEMA <-
  c(
    "module_code",
    "group_code",
    "semester_code",
    "weeks",
    "day",
    "start",
    "end",
    "location_code",
    "area",
    "teaching_mode"
  )

course_schedule <- validated %>%
  mutate(semester_code = SEMESTER_CODE) %>%
  mutate(weeks = "1-6, 8-14") %>%
  rename(
    module_code = Module.Code,
    group_code = Section,
    day = Day,
    start = Start,
    end = End,
    location_code = Room,
    area = Location,
    teaching_mode = Mode.of.Teaching
  ) %>%
  mutate(day = recode(
    day,
    "Mon" = 1,
    "Tue" = 2,
    "Wed" = 3,
    "Thu" = 4,
    "Fri" = 5,
    "Sat" = 6
  )) %>%
  select(COURSE_SCHEDULE_SCHEMA)
write.csv(course_schedule, "db_course_schedule.csv", row.names = FALSE)

################# Get seminar table.
# Given an integer day of the week from 1-6 (which we use to offset from the date of first sunday) and a sequence of week numbers, return a sequence of dates for selected weeks.
weekly_date_seq <-
  function (week_day, weeks, starting_sunday_date = STARTING_SUNDAY_DATE) {
    last_week <- weeks[length(weeks)] # last value
    start <- starting_sunday_date + week_day
    date_seq <- seq(from = start,
                    by = "week",
                    length.out = last_week)
    date_seq <- date_seq[weeks] # get only desired weeks
    return(date_seq)
  }
# Initialize seminar table using seminar table schema.
SEMINAR_SCHEMA <-
  c(
    "module_code",
    "group_code",
    "semester_code",
    "week",
    "date",
    "start",
    "end",
    "location_code",
    "area",
   "teaching_mode"
  )
seminar_generator <- function(schedule) {
  seminar <-
    data.frame(matrix(
      ncol = length(SEMINAR_SCHEMA),
      nrow = 0,
      dimnames = list(NULL, SEMINAR_SCHEMA)
    ))
  # For every entry in course_schedule, generate a list of seminar entries for all weeks specified. Append all into the seminar table.
  for (i in 1:nrow(schedule)) {
    schedule_entry <- schedule[i,]
    # Map the week range string to a list of week numbers.
    weeks_list <- WEEK_MAPPING[[schedule_entry$weeks]]
    # Generate weekly date sequence.
    new_dates <-
      weekly_date_seq(as.integer(schedule_entry$day), weeks_list)
    # Repeat schedule entries to match new dates.
    new_seminars <-
      schedule_entry[c(rep(1, length(new_dates))),] %>%
      # Insert correct date and week number for every schedule entry.
      mutate(date = new_dates, week = weeks_list) %>%
      # Get rid of extraneous columns to match seminar table schema.
      select(SEMINAR_SCHEMA)
    # Add to seminar table.
    seminar <- seminar %>% rbind(new_seminars)
  }
  return(seminar)
}
seminar <- seminar_generator(course_schedule)
write.csv(seminar, "db_seminar.csv", row.names = FALSE)

################# Get tagged_as table.
# To add affiliated major.
TAGGED_AS_SCHEMA <- c("module_code", "tag_label", "semester_code")
tagged_as <- validated %>%
  rename(module_code = Module.Code, tag_label = Primary.Major) %>%
  distinct(module_code, tag_label) %>%
  mutate(
    tag_label = recode(
      tag_label,
      "MCS but not count towards the major (service module)" = "MCS (service module)",
      "Physical Sciences but not count towards the major (service module)" = "Physical Sciences (service module)"
    )
  ) %>%
  mutate(semester_code = SEMESTER_CODE) %>%
  select(TAGGED_AS_SCHEMA)
write.csv(tagged_as, "db_tagged_as.csv", row.names = FALSE)

################# Get tag table.
TAG_SCHEMA <- c("label")
tag <- tagged_as %>%
  rename(label = tag_label) %>%
  distinct(label) %>%
  select(TAG_SCHEMA)
write.csv(tag, "db_tag.csv", row.names = FALSE)


################## Get CC lecture course groups..
# COURSE_GROUP_SCHEMA <-  c("faculty_id", "module_code", "group_code", "semester_code", "teaching_mode")
lectures_raw <-
  read.csv(CC_LECTURES_FILEPATH, stringsAsFactors = FALSE)
lecture_groups <- lectures_raw  %>%
  mutate(semester_code = SEMESTER_CODE) %>%
  rename(
    faculty_id = Staff.ID,
    module_code = Module.Code,
    group_code = Section,
    teaching_mode = Mode.of.Teaching
  ) %>%
  mutate(
    teaching_mode = recode(
      teaching_mode,
      "Remote" = "REMOTE",
      "Remote/\nF2F" = "REMOTE_F2F",
      "Remote in YNC Classroom" = "REMOTE_IN_YNC_CLASSROOM"
    )
  ) %>%
  distinct(faculty_id, module_code, group_code, .keep_all = TRUE) %>%
  select(COURSE_GROUP_SCHEMA)
write.csv(lecture_groups, "db_lecture_groups.csv", row.names = FALSE)

################## Get CC lecture schedule.
# COURSE_SCHEDULE_SCHEMA <-  c("module_code", "group_code", "semester_code", "weeks", "day", "start", "end", "location_code", "area")
lecture_schedule <- lectures_raw %>%
  mutate(semester_code = SEMESTER_CODE) %>%
  mutate(weeks = "1-6, 8-14") %>%
  rename(
    module_code = Module.Code,
    group_code = Section,
    day = Day,
    start = Start,
    end = End,
    location_code = Room,
    area = Location,
    teaching_mode = Mode.of.Teaching;
  ) %>%
  mutate(day = recode(
    day,
    "Mon" = 1,
    "Tue" = 2,
    "Wed" = 3,
    "Thu" = 4,
    "Fri" = 5,
    "Sat" = 6
  )) %>%
  select(COURSE_SCHEDULE_SCHEMA)

################## Get CC lecture sessions, i.e. equivalent "seminar" objects.
lectures <- seminar_generator(lecture_schedule)
write.csv(lectures, "db_lectures.csv", row.names = FALSE)

################## Get location table.
location <-
  read.csv(
    "~/github/OpenClassroom/data/room-legend-formatted.csv",
    stringsAsFactors = FALSE,
    header = FALSE
  ) %>% mutate(across(where(is.character), trimws))
write.csv(location, "db_location.csv", row.names = FALSE)

# TODO:
# course_group ignores any entry with faculty_id that does not exist.
# course_group ignores any entry with course that does not exist.
# course_group remove all NA faculty_id and group code.
# course_schedule ignores any entry with course_group that does not exist.
# Account for CC lectures with NA faculty ID.
