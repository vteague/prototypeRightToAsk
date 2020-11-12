UPDATE questions 
SET up_votes = up_votes + $2, 
    down_votes = down_votes + $3  
WHERE id = $1; 
