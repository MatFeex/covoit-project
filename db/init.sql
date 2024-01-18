SET check_function_bodies = false
;

CREATE TABLE users(
  id integer NOT NULL,
  fname varchar,
  "name" varchar,
  "password" varchar,
  email varchar,
  date date,
  CONSTRAINT users_pkey PRIMARY KEY(id)
);

CREATE TABLE course(
  id integer NOT NULL,
  users_id integer NOT NULL,
  "start" varchar,
  "end" varchar,
  date date,
  creation_date date,
  CONSTRAINT course_pkey PRIMARY KEY(id)
);

CREATE TABLE passager(
  users_id integer NOT NULL,
  course_id integer NOT NULL,
  status integer,
  note integer,
  CONSTRAINT passager_pkey PRIMARY KEY(users_id, course_id)
);

ALTER TABLE course
  ADD CONSTRAINT course_users_id_fkey FOREIGN KEY (users_id) REFERENCES users (id)
  ;

ALTER TABLE passager
  ADD CONSTRAINT passager_users_id_fkey
    FOREIGN KEY (users_id) REFERENCES users (id);

ALTER TABLE passager
  ADD CONSTRAINT passager_course_id_fkey
    FOREIGN KEY (course_id) REFERENCES course (id);