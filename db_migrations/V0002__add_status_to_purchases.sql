ALTER TABLE t_p53623239_sport_predictions_si.purchases
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_note TEXT;

COMMENT ON COLUMN t_p53623239_sport_predictions_si.purchases.status IS 'pending - ожидает подтверждения, confirmed - подтверждена, rejected - отклонена';
