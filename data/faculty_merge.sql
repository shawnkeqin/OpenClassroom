
INSERT INTO faculty
SELECT * FROM faculty_temp
ON CONFLICT (id)
DO UPDATE SET email = EXCLUDED.email,
        name = EXCLUDED.name;


-- INSERT INTO course_group
-- SELECT * FROM course_group_temp
-- ON CONFLICT (module_code, group_code, semester_code)
-- DO UPDATE SET teaching_mode = EXCLUDED.teaching_mode;


UPDATE course_group c
SET course_group_desc = null
FROM course_group_temp t
WHERE c.module_code = t.module_code and c.group_code = t.group_code and c.semester_code=t.semester_code;