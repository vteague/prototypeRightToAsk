SELECT questions.*, tag_list.ls, link_list.ls FROM questions 
LEFT JOIN
    (SELECT tag.question_id, json_agg(tags.tag) as ls FROM tags
    INNER JOIN tag
    ON tag.tag_id = tags.id
    GROUP BY question_id) AS tag_list
ON questions.id = tag_list.question_id
LEFT JOIN 
    (SELECT links.question_id, json_agg(links.link) AS ls FROM links
    GROUP BY links.question_id) AS link_list
ON questions.id = link_list.question_id
WHERE questions.id = $1;