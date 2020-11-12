INSERT INTO answer_votes(user_id, answer_id, vote) VALUES($1, $2, $3)
ON CONFLICT(user_id, answer_id)
DO UPDATE SET vote = $3;
