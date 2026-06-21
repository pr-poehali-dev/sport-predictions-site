CREATE TABLE IF NOT EXISTS t_p53623239_sport_predictions_si.predictions (
  id SERIAL PRIMARY KEY,
  sport VARCHAR(10) NOT NULL,
  match_name VARCHAR(255) NOT NULL,
  league VARCHAR(255),
  analyst VARCHAR(100),
  description TEXT,
  price INTEGER NOT NULL DEFAULT 990,
  match_date VARCHAR(50),
  prediction_text TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
