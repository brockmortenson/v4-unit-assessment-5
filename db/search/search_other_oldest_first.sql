-- Not quite sure how to complete this one. It seems complete already from what I can see (I copied it over from search_all_oldest_first)

SELECT p.id AS post_id, title, content, img, profile_pic, date_created, username AS author_username FROM helo_posts p
JOIN helo_users u ON u.id = p.author_id
WHERE lower(title) LIKE $1
ORDER BY date_created ASC;