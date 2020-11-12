SELECT q.id, q.message, q.signature, q.up_votes, q.down_votes, q.date_created, q.last_modified, 
       u.user, tag_list.tags, link_list.links, answer_list.answers FROM questions AS q
LEFT JOIN 
    (SELECT users.id, row_to_json(users) AS user FROM users) AS u 
ON q.user_id = u.id
LEFT JOIN
    (SELECT tag.question_id, json_agg(tags) AS tags FROM tags
    INNER JOIN tag
    ON tag.tag_id = tags.id
    GROUP BY question_id) AS tag_list
ON q.id = tag_list.question_id
LEFT JOIN 
    (SELECT links.question_id, json_agg(links) AS links FROM links
    GROUP BY links.question_id) AS link_list
ON q.id = link_list.question_id
WHERE questions.id = $1;