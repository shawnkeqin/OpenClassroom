CREATE TABLE public.course (
    module_code character varying NOT NULL,
    semester_code character varying NOT NULL,
    title character varying NOT NULL,
    "desc" text,
    module_brief_link character varying,
    id integer NOT NULL
);
CREATE TABLE public.course_group (
    id integer NOT NULL,
    module_code character varying NOT NULL,
    group_code character varying NOT NULL,
    faculty_id character varying NOT NULL,
    syllabus text,
    schedule_desc text,
    notes text,
    semester_code character varying NOT NULL,
    is_open boolean DEFAULT true NOT NULL,
    course_group_desc text,
    teaching_mode character varying,
    visitor_capacity integer DEFAULT 2 NOT NULL
);
CREATE SEQUENCE public.course_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.course_id_seq OWNED BY public.course_group.id;
CREATE SEQUENCE public.course_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.course_id_seq1 OWNED BY public.course.id;
CREATE TABLE public.course_schedule (
    module_code character varying NOT NULL,
    semester_code character varying NOT NULL,
    group_code character varying NOT NULL,
    weeks text NOT NULL,
    day integer NOT NULL,
    start time without time zone NOT NULL,
    "end" time without time zone NOT NULL,
    location_code character varying NOT NULL,
    id integer NOT NULL,
    area character varying,
    teaching_mode character varying
);
CREATE SEQUENCE public.course_schedule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.course_schedule_id_seq OWNED BY public.course_schedule.id;
CREATE TABLE public.division (
    label character varying NOT NULL
);
CREATE TABLE public.faculty (
    email character varying NOT NULL,
    name character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    id character varying NOT NULL,
    has_consented boolean DEFAULT false NOT NULL,
    notif_new_request boolean DEFAULT true NOT NULL,
    notif_request_update boolean DEFAULT true NOT NULL,
    division character varying
);
CREATE TABLE public.location (
    code character varying NOT NULL,
    full_name character varying,
    capacity integer,
    link_code character varying,
    building character varying
);
CREATE TABLE public.semester (
    code character varying NOT NULL,
    full_name character varying NOT NULL
);
CREATE TABLE public.seminar (
    id integer NOT NULL,
    title text,
    "desc" text,
    date date NOT NULL,
    start time without time zone NOT NULL,
    "end" time without time zone NOT NULL,
    location_code character varying NOT NULL,
    visitor_capacity integer DEFAULT 2 NOT NULL,
    is_open boolean DEFAULT true NOT NULL,
    group_code character varying NOT NULL,
    module_code character varying NOT NULL,
    semester_code character varying NOT NULL,
    week integer NOT NULL,
    conference_link character varying,
    is_archived boolean DEFAULT false NOT NULL,
    area character varying,
    teaching_mode character varying
);
CREATE SEQUENCE public.seminar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.seminar_id_seq OWNED BY public.seminar.id;
CREATE TABLE public.tag (
    label character varying NOT NULL
);
CREATE TABLE public.tagged_as (
    tag_label character varying NOT NULL,
    module_code character varying NOT NULL,
    semester_code character varying NOT NULL
);
CREATE TABLE public.teaching_mode (
    label character varying NOT NULL
);
CREATE TABLE public.visit (
    id integer NOT NULL,
    seminar_id integer NOT NULL,
    visitor_id character varying NOT NULL,
    visit_status character varying DEFAULT 'PENDING'::character varying NOT NULL,
    time_requested timestamp with time zone DEFAULT now() NOT NULL,
    time_responded timestamp with time zone,
    request_msg text,
    response_msg text,
    is_cancelled boolean DEFAULT false NOT NULL,
    is_archived boolean DEFAULT false NOT NULL
);
CREATE SEQUENCE public.visit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.visit_id_seq OWNED BY public.visit.id;
CREATE TABLE public.visit_status (
    status character varying NOT NULL
);
ALTER TABLE ONLY public.course ALTER COLUMN id SET DEFAULT nextval('public.course_id_seq1'::regclass);
ALTER TABLE ONLY public.course_group ALTER COLUMN id SET DEFAULT nextval('public.course_id_seq'::regclass);
ALTER TABLE ONLY public.course_schedule ALTER COLUMN id SET DEFAULT nextval('public.course_schedule_id_seq'::regclass);
ALTER TABLE ONLY public.seminar ALTER COLUMN id SET DEFAULT nextval('public.seminar_id_seq'::regclass);
ALTER TABLE ONLY public.visit ALTER COLUMN id SET DEFAULT nextval('public.visit_id_seq'::regclass);
ALTER TABLE ONLY public.course_group
    ADD CONSTRAINT course_group_id_key UNIQUE (id);
ALTER TABLE ONLY public.course_group
    ADD CONSTRAINT course_group_pkey PRIMARY KEY (module_code, group_code, semester_code);
ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_id_key UNIQUE (id);
ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey1 PRIMARY KEY (module_code, semester_code);
ALTER TABLE ONLY public.course_schedule
    ADD CONSTRAINT course_schedule_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.division
    ADD CONSTRAINT division_pkey PRIMARY KEY (label);
ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_email_key UNIQUE (email);
ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_staff_id_key UNIQUE (id);
ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_pkey PRIMARY KEY (code);
ALTER TABLE ONLY public.semester
    ADD CONSTRAINT semester_pkey PRIMARY KEY (code);
ALTER TABLE ONLY public.seminar
    ADD CONSTRAINT seminar_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (label);
ALTER TABLE ONLY public.tagged_as
    ADD CONSTRAINT tagged_as_pkey PRIMARY KEY (tag_label, module_code, semester_code);
ALTER TABLE ONLY public.teaching_mode
    ADD CONSTRAINT teaching_mode_pkey PRIMARY KEY (label);
ALTER TABLE ONLY public.visit
    ADD CONSTRAINT visit_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.visit_status
    ADD CONSTRAINT visit_status_pkey PRIMARY KEY (status);
ALTER TABLE ONLY public.course_group
    ADD CONSTRAINT course_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.course_group
    ADD CONSTRAINT course_group_semester_code_fkey FOREIGN KEY (semester_code) REFERENCES public.semester(code) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.course_group
    ADD CONSTRAINT course_group_semester_code_module_code_fkey FOREIGN KEY (semester_code, module_code) REFERENCES public.course(semester_code, module_code) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.course_group
    ADD CONSTRAINT course_group_teaching_mode_fkey FOREIGN KEY (teaching_mode) REFERENCES public.teaching_mode(label) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.course_schedule
    ADD CONSTRAINT course_schedule_module_code_semester_code_group_code_fkey FOREIGN KEY (module_code, semester_code, group_code) REFERENCES public.course_group(module_code, semester_code, group_code) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.course_schedule
    ADD CONSTRAINT course_schedule_teaching_mode_fkey FOREIGN KEY (teaching_mode) REFERENCES public.teaching_mode(label) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_semester_code_fkey FOREIGN KEY (semester_code) REFERENCES public.semester(code) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_division_fkey FOREIGN KEY (division) REFERENCES public.division(label) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.seminar
    ADD CONSTRAINT seminar_location_code_fkey FOREIGN KEY (location_code) REFERENCES public.location(code) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.seminar
    ADD CONSTRAINT seminar_semester_code_fkey FOREIGN KEY (semester_code) REFERENCES public.semester(code) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.seminar
    ADD CONSTRAINT seminar_semester_code_group_code_module_code_fkey FOREIGN KEY (semester_code, group_code, module_code) REFERENCES public.course_group(semester_code, group_code, module_code) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.seminar
    ADD CONSTRAINT seminar_teaching_mode_fkey FOREIGN KEY (teaching_mode) REFERENCES public.teaching_mode(label) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.tagged_as
    ADD CONSTRAINT tagged_as_semester_code_module_code_fkey FOREIGN KEY (semester_code, module_code) REFERENCES public.course(semester_code, module_code) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.tagged_as
    ADD CONSTRAINT tagged_as_tag_label_fkey FOREIGN KEY (tag_label) REFERENCES public.tag(label) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.visit
    ADD CONSTRAINT visit_seminar_id_fkey FOREIGN KEY (seminar_id) REFERENCES public.seminar(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.visit
    ADD CONSTRAINT visit_visit_status_fkey FOREIGN KEY (visit_status) REFERENCES public.visit_status(status) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.visit
    ADD CONSTRAINT visit_visitor_id_fkey FOREIGN KEY (visitor_id) REFERENCES public.faculty(id) ON UPDATE CASCADE ON DELETE RESTRICT;
