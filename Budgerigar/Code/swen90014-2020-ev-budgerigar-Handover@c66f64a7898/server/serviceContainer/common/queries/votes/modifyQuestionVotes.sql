INSERT INTO question_votes(user_id, question_id, vote) VALUES($1, $2, $3)
ON CONFLICT(user_id, question_id)
DO UPDATE SET vote = $3;
