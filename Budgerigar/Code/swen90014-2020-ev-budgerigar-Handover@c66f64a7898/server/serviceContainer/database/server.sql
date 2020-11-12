-- Last modification date: 2020-10-25 
-- (Sam -> remove unique constraint from username and public key)

-- tables
-- Table: answer_votes
CREATE TABLE answer_votes (
    user_id int NOT NULL,
    answer_id int  NOT NULL,
    vote smallint  NOT NULL,
    CONSTRAINT answer_votes_pk PRIMARY KEY (user_id,answer_id)
);

-- Table: answers
CREATE TABLE answers (
    id SERIAL,
    question_id int  NOT NULL,
    user_id int  NOT NULL,
    message varchar(2048)  NOT NULL,
    up_votes int  NOT NULL DEFAULT 0,
    down_votes int  NOT NULL DEFAULT 0,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT answers_pk PRIMARY KEY (id)
);

CREATE INDEX answers_modified_index on answers (last_modified DESC);

-- Table: links
CREATE TABLE links (
    id SERIAL,
    question_id int  NOT NULL,
    link varchar(128)  NOT NULL,
    CONSTRAINT links_pk PRIMARY KEY (id),
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Table: question_votes
CREATE TABLE question_votes (
    user_id int  NOT NULL,
    question_id int  NOT NULL,
    vote smallint  NOT NULL,
    CONSTRAINT question_votes_pk PRIMARY KEY (user_id,question_id)
);

-- Table: questions
CREATE TABLE questions (
    id SERIAL,
    user_id int  NOT NULL,
    message varchar(2048)  NOT NULL,
    up_votes int  NOT NULL  DEFAULT 0,
    down_votes int  NOT NULL  DEFAULT 0,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT questions_pk PRIMARY KEY (id)
);

CREATE INDEX questionsModifiedIndex on questions (last_modified DESC);

-- Table: reports
CREATE TABLE reports (
    user_id int  NOT NULL,
    question_id int  NOT NULL,
    CONSTRAINT reports_pk PRIMARY KEY (user_id,question_id)
);

-- Table: tag
CREATE TABLE tag (
    tag_id int  NOT NULL,
    question_id int  NOT NULL,
    CONSTRAINT tag_pk PRIMARY KEY (tag_id,question_id),
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Table: tags
CREATE TABLE tags (
    id SERIAL,
    tag varchar(32)  NOT NULL,
    CONSTRAINT tags_pk PRIMARY KEY (id),
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Table: users
CREATE TABLE users (
    id SERIAL,
    is_mp boolean NOT NULL DEFAULT FALSE,
    username varchar(128)  NOT NULL,
    public_key varchar(512)  NOT NULL,
    email varchar(128),
    verification_code varchar(6),
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_pk PRIMARY KEY (id)
);

-- foreign keys
-- Reference: answer_votes_answers (table: answer_votes)
ALTER TABLE answer_votes ADD CONSTRAINT answer_votes_answers
    FOREIGN KEY (answer_id)
    REFERENCES answers (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: answer_votes_users (table: answer_votes)
ALTER TABLE answer_votes ADD CONSTRAINT answer_votes_users
    FOREIGN KEY (user_id)
    REFERENCES users (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: answers_questions (table: answers)
ALTER TABLE answers ADD CONSTRAINT answers_questions
    FOREIGN KEY (question_id)
    REFERENCES questions (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: answers_users (table: answers)
ALTER TABLE answers ADD CONSTRAINT answers_users
    FOREIGN KEY (user_id)
    REFERENCES users (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: questions_user (table: questions)
ALTER TABLE questions ADD CONSTRAINT questions_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: links_questions (table: links)
ALTER TABLE links ADD CONSTRAINT links_questions
    FOREIGN KEY (question_id)
    REFERENCES questions (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: reports_questions (table: reports)
ALTER TABLE reports ADD CONSTRAINT reports_questions
    FOREIGN KEY (question_id)
    REFERENCES questions (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: reports_user (table: reports)
ALTER TABLE reports ADD CONSTRAINT reports_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: tags_questions (table: tag)
ALTER TABLE tag ADD CONSTRAINT tags_questions
    FOREIGN KEY (question_id)
    REFERENCES questions (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: tags_tag (table: tag)
ALTER TABLE tag ADD CONSTRAINT tags_tag
    FOREIGN KEY (tag_id)
    REFERENCES tags (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: votes_questions (table: question_votes)
ALTER TABLE question_votes ADD CONSTRAINT votes_questions
    FOREIGN KEY (question_id)
    REFERENCES questions (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: votes_user (table: question_votes)
ALTER TABLE question_votes ADD CONSTRAINT votes_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- functions
CREATE OR REPLACE FUNCTION update_modified_column()   
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_modified = now();
    RETURN NEW;   
END;
$$ language 'plpgsql';

-- triggers
CREATE TRIGGER update_answer_modtime BEFORE UPDATE ON answers FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_answer_modtime BEFORE UPDATE ON questions FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_answer_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_answer_modtime BEFORE UPDATE ON tags FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_answer_modtime BEFORE UPDATE ON tag FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_answer_modtime BEFORE UPDATE ON links FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- End of file.
