// models/hospital.js
const db = require('../config/db');

const Hospital = {
    createTable: () => {
        const sql = `
        CREATE TABLE IF NOT EXISTS hospitals (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(20) NOT NULL UNIQUE,
            password VARCHAR(20) NOT NULL,
            hospital_name VARCHAR(20) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;
        return new Promise((resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },
    getAll: () => {
        const sql = 'SELECT * FROM hospitals';
        return new Promise((resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },
    findById: (id) => {
        const sql = 'SELECT * FROM hospitals WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, [id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result[0]);
            });
        });
    },
    findByUsername: (username) => {
        const sql = 'SELECT * FROM hospitals WHERE username = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, [username], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result[0]);
            });
        });
    },
    create: (username, password, hospital_name) => {
        const sql = 'INSERT INTO hospitals (username, password, hospital_name) VALUES (?, ?, ?)';
        return new Promise((resolve, reject) => {
            db.query(sql, [username, password, hospital_name], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },
    update: (id, username, hospital_name) => {
        const sql = 'UPDATE hospitals SET username = ?, hospital_name = ? WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, [username, hospital_name, id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },
    delete: (id) => {
        const sql = 'DELETE FROM hospitals WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, [id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },
      getCount: () => {
        const sql = 'SELECT COUNT(*) AS count FROM hospitals';
        return new Promise((resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result[0].count);
            });
        });
    }
};

Hospital.createTable()
    .then(() => console.log('Hospitals table created or already exists'))
    .catch(err => console.error('Error creating hospitals table:', err));

module.exports = Hospital;
