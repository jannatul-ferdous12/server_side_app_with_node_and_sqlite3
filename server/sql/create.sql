CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    city TEXT,
    dept_no INTEGER
);
