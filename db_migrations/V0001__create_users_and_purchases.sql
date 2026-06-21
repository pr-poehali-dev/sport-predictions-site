CREATE TABLE IF NOT EXISTS t_p53623239_sport_predictions_si.users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p53623239_sport_predictions_si.purchases (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES t_p53623239_sport_predictions_si.users(id),
  match_name VARCHAR(255) NOT NULL,
  league VARCHAR(255),
  sport VARCHAR(50),
  analyst VARCHAR(100),
  price INTEGER NOT NULL,
  prediction TEXT,
  purchase_date TIMESTAMP DEFAULT NOW(),
  match_date VARCHAR(50)
);
