export default function transactionsCalculateCategories(user_id:number){
	return `
	TRUNCATE transaction_category;

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

	INSERT INTO transaction_category ("transaction_id", "category_id", "createdAt", "updatedAt")
	SELECT matched_descriptions.transaction_id, matched_descriptions.pattern_category_id, NOW(), NOW()
	FROM matched_descriptions, transaction
	WHERE matched_description IS NOT NULL
	AND transaction.transaction_id = matched_descriptions.transaction_id;
	`;
}