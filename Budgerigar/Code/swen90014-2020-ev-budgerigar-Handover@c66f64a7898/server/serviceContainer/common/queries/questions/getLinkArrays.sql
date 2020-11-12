SELECT links.question_id, json_agg(links.link) FROM links
GROUP BY links.question_id;