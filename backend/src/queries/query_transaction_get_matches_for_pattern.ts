export default function transactionsGetRegexMatchesForPattern(user_id:number, pattern_id:number){
	return `
	WITH regex AS ( -- unnest the arrays into a table called regex
		SELECT unnest(match_array) AS "match", unnest(regex_array) AS regex
		FROM pattern
		WHERE pattern_id = ${pattern_id}
	),
	matched_descriptions AS ( --define a table called "matched descriptions"
		SELECT t1.* , 
			CASE 
				WHEN EVERY( -- when every result is true
					CASE 
						WHEN regex.match = true THEN -- if set to match, look for a match
							t1.description ~* regex.regex --does equal
						ELSE --else look for no match
							t1.description !~* regex.regex --does not equal
					END) THEN
						t1.description
				ELSE NULL -- null if every doesn't return true. Meaning not every match returned a result.
			END AS matched_description --put results in a column called "matched_description" within the matched_descriptions table
		FROM 
			transaction t1, regex
		WHERE t1.user_id = ${user_id}
		GROUP BY t1.transaction_id
	)
	-- Finally perform the select where matched_description is not null. If it is null then one or more rules did not match
	SELECT *
	FROM matched_descriptions
	WHERE user_id = ${user_id}
	AND matched_description IS NOT NULL;
	`;
}