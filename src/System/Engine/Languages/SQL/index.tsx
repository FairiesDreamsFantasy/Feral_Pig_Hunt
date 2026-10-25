/**
 * System/Engine/Languages/SQL Module
 * Relational DB queries and MySQL dialects for score reporting, parameters, and audits.
 */

export const GeneralSQL = {
  selectTopScores: 'SELECT user_id, score, tusk_size, date FROM high_scores ORDER BY score DESC LIMIT 10;',
  insertScore: 'INSERT INTO high_scores (user_id, score, tusk_size) VALUES (?, ?, ?);'
};

export const MySQL = {
  engineType: 'InnoDB',
  createTable: `CREATE TABLE IF NOT EXISTS high_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    score INT NOT NULL,
    tusk_size DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
};

export default {
  GeneralSQL,
  MySQL,
};
