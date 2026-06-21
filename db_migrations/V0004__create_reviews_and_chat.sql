CREATE TABLE IF NOT EXISTS t_p53623239_sport_predictions_si.reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES t_p53623239_sport_predictions_si.users(id),
  user_name VARCHAR(200) NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p53623239_sport_predictions_si.chat_messages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES t_p53623239_sport_predictions_si.users(id),
  user_name VARCHAR(200) NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
