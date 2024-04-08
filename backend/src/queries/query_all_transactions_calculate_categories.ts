export default function transactionsCalculateCategories(user_id:number){
	return `
	-- Clear existing categories from transactions
	UPDATE transaction
	SET category_ids = array[]::integer[]
	WHERE transaction.user_id = ${user_id}
	AND category_ids != array[]::integer[];

	-- Re-determine categories from scratch
	WITH regex AS ( -- unnest the arrays into a table called regex
		SELECT category_id AS pattern_category_id, unnest(match_array) AS "match", unnest(regex_array) AS regex
		FROM pattern
		WHERE user_id = ${user_id}
	),
	matched_descriptions AS ( --define a table called "matched descriptions"
		SELECT t1.transaction_id, t1.user_id, t1.description, regex.pattern_category_id, 
			CASE 
				WHEN EVERY( -- when every result is true
					CASE 
						WHEN regex.match = true THEN -- if set to match, look for a match
							t1.description ~* regex.regex
						ELSE --else look for no match
							t1.description !~* regex.regex
					END) THEN
						t1.description
				ELSE NULL -- null if every doesn't return true. Meaning not every match returned a result.
			END AS matched_description --put results in a column called "matched_description" within the matched_descriptions table
		FROM 
			transaction t1, regex
		WHERE t1.user_id = ${user_id}
		GROUP BY t1.transaction_id, regex.pattern_category_id
	)

	UPDATE transaction
	SET category_ids = array_append(category_ids, matched_descriptions.pattern_category_id)
	FROM matched_descriptions
	WHERE matched_description IS NOT NULL
	AND transaction.transaction_id = matched_descriptions.transaction_id;
	`;
}