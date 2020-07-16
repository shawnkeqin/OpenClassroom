
INSERT INTO faculty as t
SELECT * FROM faculty_temp
ON CONFLICT (id)
DO UPDATE SET email = EXCLUDED.email,
        name = EXCLUDED.name;

