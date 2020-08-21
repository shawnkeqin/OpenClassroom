
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

DELETE 
FROM seminar
WHERE semester_code = 'AY1819-1' AND                 
      date > '2018-09-01';

DELETE 
FROM visit v  
     USING seminar s
WHERE v.seminar_id = s.id AND
      s.semester_code = 'AY1819-1' AND                 
      s.date > '2018-09-01';

UPDATE seminar s
SET teaching_mode = (
    SELECT teaching_mode
    FROM course_group c
    WHERE c.module_code = s.module_code and c.group_code = s.group_code and c.semester_code=s.semester_code
    );
