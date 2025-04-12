// models/ambulance.js
const db = require('../config/db');

const Ambulance = {
    createTable: () => {
        const sql = `
        CREATE TABLE IF NOT EXISTS ambulances (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(20) NOT NULL UNIQUE,
            password VARCHAR(20) NOT NULL,
            license_number VARCHAR(20) NOT NULL,
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
        const sql = 'SELECT * FROM ambulances';
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
        const sql = 'SELECT * FROM ambulances WHERE id = ?';
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
        const sql = 'SELECT * FROM ambulances WHERE username = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, [username], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result[0]);
            });
        });
    },
    create: (username, password, license_number) => {
        const sql = 'INSERT INTO ambulances (username, password, license_number) VALUES (?, ?, ?)';
        return new Promise((resolve, reject) => {
            db.query(sql, [username, password, license_number], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },
    update: (id, username, license_number) => {
        const sql = 'UPDATE ambulances SET username = ?, license_number = ? WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, [username, license_number, id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },
    delete: (id) => {
        const sql = 'DELETE FROM ambulances WHERE id = ?';
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
        const sql = 'SELECT COUNT(*) AS count FROM ambulances';
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

Ambulance.createTable()
    .then(() => console.log('Ambulances table created or already exists'))
    .catch(err => console.error('Error creating ambulances table:', err));

module.exports = Ambulance;
