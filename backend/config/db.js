import dotenv from 'dotenv';
dotenv.config(); // doit être tout en haut
// Importer dotenv pour charger les variables d'environnement
import mysql from 'mysql';

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
});

export default db;
