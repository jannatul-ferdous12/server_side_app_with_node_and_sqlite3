import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = resolve(__dirname, './database.db');
const db = new sqlite3.Database(dbPath);

export const createUsersTable = async (req, res, next) => {
  try {
    const createSqlScriptPath = resolve(__dirname, './sql/create.sql');
    const createSqlScript = await fs.readFile(createSqlScriptPath, 'utf-8');

    db.exec(createSqlScript, function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).send('Error creating table');
      } else {
        console.log('Table created successfully');
        next();
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating table');
  }
};

export const insertUser = async (req, res, next) => {
  try {
    const checkExistenceQuery = 'SELECT COUNT(*) as count FROM users';
    db.get(checkExistenceQuery, [], async (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error checking user existence');
      } else {
        if (row.count === 0) {
          const insertSqlScriptPath = resolve(__dirname, './sql/insert.sql');
          const insertSqlScript = await fs.readFile(
            insertSqlScriptPath,
            'utf-8'
          );

          db.exec(insertSqlScript, function (err) {
            if (err) {
              console.error(err.message);
              res.status(500).send('Error inserting users');
            } else {
              console.log('Users inserted successfully');
              next();
            }
          });
        } else {
          console.log('Users already exist. Skipping insertion.');
          next();
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error inserting users');
  }
};


export const getAllUsers = (req, res) => {
  const queryParams = req.query;

  const query = 'SELECT * FROM users' + buildWhereClause(queryParams);

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving users');
    } else {
      res.json(rows);
    }
  });
};

const buildWhereClause = (queryParams) => {
  const conditions = [];

  for (const key in queryParams) {
    if (queryParams.hasOwnProperty(key)) {
      const values = queryParams[key].split(',').map((value) => value.trim());
      const condition = values
        .map((value) => `LOWER(${key}) = LOWER('${value.toLowerCase()}')`)
        .join(' OR ');
      conditions.push(`(${condition})`);
    }
  }

  return conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';
};


export const getUserById = (req, res) => {
  const userId = req.params.id;

  const query = 'SELECT * FROM users WHERE id = ?';

  db.get(query, [userId], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving user');
    } else if (!row) {
      res.status(404).send('User not found');
    } else {
      res.json(row);
    }
  });
};

export const createUser = (req, res) => {
  try {
    const { first_name, last_name, city, dept_no } = req.body;

    if (!first_name || !last_name || !city || !dept_no) {
      return res.status(400).send('Missing required fields');
    }

    const query =
      'INSERT INTO users (first_name, last_name, city, dept_no) VALUES (?, ?, ?, ?)';

    db.run(query, [first_name, last_name, city, dept_no], function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).send(`Error creating user: ${err.message}`);
      } else {
        console.log('User created successfully');
        return res.status(201).json({ id: this.lastID });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Error creating user: ${error.message}`);
  }
};

export const updateUser = (req, res) => {
  const userId = req.params.id;
  const { first_name, last_name, city, dept_no } = req.body;

  const query =
    'UPDATE users SET first_name = ?, last_name = ?, city = ?, dept_no = ? WHERE id = ?';

  db.run(query, [first_name, last_name, city, dept_no, userId], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error updating user');
    } else if (this.changes === 0) {
      res.status(404).send('User not found');
    } else {
      console.log('User updated successfully');
      res.status(200).send('User updated successfully');
    }
  });
};

export const deleteUser = (req, res) => {
  const userId = req.params.id;

  const query = 'DELETE FROM users WHERE id = ?';

  db.run(query, [userId], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error deleting user');
    } else if (this.changes === 0) {
      res.status(404).send('User not found');
    } else {
      console.log('User deleted successfully');
      res.status(200).send('User deleted successfully');
    }
  });
};


