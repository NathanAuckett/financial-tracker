export default function transactionsCalculateCategories(user_id:number){
	return `
	TRUNCATE transaction_category;

	WITH users_groups AS (
		SELECT *
		FROM pattern_group
		WHERE user_id = ${user_id}
	),
	matched_descriptions AS (
		SELECT 
			t.transaction_id, 
			t.user_id, 
			t.description, 
			ug.category_id AS pattern_category_id,
			p.pattern_group_id,
			MAX(CASE
				WHEN EVERY(
					CASE 
						WHEN r."match" THEN t.description ~* r.regex
						ELSE NOT (t.description ~* r.regex)
					END
				) THEN 1
				ELSE 0
			END) OVER (PARTITION BY t.transaction_id, p.pattern_id) AS match_flag
		FROM 
			transaction t
		CROSS JOIN 
			users_groups ug
		JOIN 
			pattern p ON p.pattern_group_id = ug.pattern_group_id
		JOIN 
			unnest(p.match_array, p.regex_array) AS r("match", regex) ON true
		WHERE 
			t.user_id = ${user_id}
		GROUP BY t.transaction_id, ug.category_id, p.pattern_group_id, p.pattern_id
	)

	INSERT INTO transaction_category ("transaction_id", "category_id", "createdAt", "updatedAt")
	SELECT matched_descriptions.transaction_id, matched_descriptions.pattern_category_id, NOW(), NOW()
	FROM matched_descriptions, transaction
	WHERE matched_descriptions.match_flag = 1
	AND transaction.transaction_id = matched_descriptions.transaction_id
	ON CONFLICT DO NOTHING;
	`;
}