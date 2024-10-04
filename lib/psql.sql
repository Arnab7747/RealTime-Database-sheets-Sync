CREATE DATABASE friends;

\c friends;

CREATE TABLE placement (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    branch VARCHAR(50),
    domain VARCHAR(50),
    placed BOOLEAN DEFAULT false,
    age INT
);

INSERT INTO placement (name, branch, domain, age)
VALUES ('Akash', 'Computer Science', 'AIML', 23),
       ('Sparsh', 'Computer Science', 'APPD', 22),
       ('Adil', 'Computer Science', 'AIML', 22),
       ('Ayuri', 'Computer Science', 'MBA', 22),
       ('DP', 'Computer Science', 'AIML', 22),
       ('Aornab', 'Computer Science', 'CLOUD', 23),
       ('Piddi', 'Computer Science', 'WEBD', 19),
       ('Venky', 'Computer Science', 'AIML', 20),
       ('Faysal', 'Computer Science', 'CLOUD', 22);

CREATE OR REPLACE FUNCTION notify_changes() RETURNS trigger AS $$
BEGIN
   PERFORM pg_notify('table_changes', 'Changes detected by trigger: ' || TG_NAME);
   RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER my_trigger
AFTER UPDATE ON placement
FOR EACH ROW
EXECUTE FUNCTION notify_changes();

CREATE TRIGGER my_delete_trigger
AFTER DELETE ON placement
FOR EACH ROW
EXECUTE FUNCTION notify_changes();

CREATE TRIGGER my_insert_trigger
AFTER INSERT ON placement
FOR EACH ROW
EXECUTE FUNCTION notify_changes();

UPDATE placement
SET placed = true
WHERE id in (1,8);

INSERT INTO placement (name, branch, domain, age)
VALUES ('Piyush', 'Computer Science', 'GOAT', 21);