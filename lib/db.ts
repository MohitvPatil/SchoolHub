import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'education_directory',
};

let connection: mysql.Connection | null = null;

export async function getDbConnection() {
  if (!connection) {
    try {
      connection = await mysql.createConnection(dbConfig);
      console.log('Connected to MySQL database');
    } catch (error) {
      console.error('Error connecting to database:', error);
      throw new Error('Database connection failed');
    }
  }
  return connection;
}

export async function initializeDatabase() {
  const conn = await getDbConnection();
  
  try {
    // Create database if it doesn't exist
    await conn.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await conn.execute(`USE ${dbConfig.database}`);
    
    // Create institutions table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS institutions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type ENUM('School', 'College') NOT NULL,
        image_url TEXT,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        address TEXT,
        contact_number VARCHAR(20),
        email VARCHAR(255),
        rating DECIMAL(2,1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_type (type),
        INDEX idx_city (city),
        INDEX idx_state (state),
        INDEX idx_rating (rating)
      )
    `);

    // Create school_details table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS school_details (
        id INT AUTO_INCREMENT PRIMARY KEY,
        institution_id INT NOT NULL,
        standards_offered VARCHAR(255),
        pattern ENUM('CBSE', 'ICSE', 'State', 'IB', 'Other') NOT NULL,
        medium VARCHAR(100),
        total_strength INT,
        principal_name VARCHAR(255),
        FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE
      )
    `);

    // Create college_details table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS college_details (
        id INT AUTO_INCREMENT PRIMARY KEY,
        institution_id INT NOT NULL,
        fields VARCHAR(255) NOT NULL,
        subfields VARCHAR(255),
        university_type ENUM('Autonomous', 'Affiliated') NOT NULL,
        university_name VARCHAR(255),
        course_duration VARCHAR(100),
        dean_name VARCHAR(255),
        FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE
      )
    `);

    // Create ratings table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        institution_id INT NOT NULL,
        stars INT NOT NULL CHECK (stars >= 1 AND stars <= 5),
        user_ip VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE,
        INDEX idx_institution (institution_id)
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}