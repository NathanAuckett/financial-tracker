export const query = `
SELECT *
FROM "transaction"
Where "account_id" IN (
	SELECT "account_id"
	FROM "transaction"
	GROUP BY "account_id"
	HAVING COUNT(*) > 1
)
AND "transaction_date" IN (
	SELECT "transaction_date"
	FROM "transaction"
	GROUP BY "transaction_date"
	HAVING COUNT(*) > 1
)
AND "credit" IN (
	SELECT "credit"
	FROM "transaction"
	GROUP BY "credit"
	HAVING COUNT(*) > 1
)
AND "debit" IN (
	SELECT "debit"
	FROM "transaction"
	GROUP BY "debit"
	HAVING COUNT(*) > 1
)
AND "description" IN (
	SELECT "description"
	FROM "transaction"
	GROUP BY "description"
	HAVING COUNT(*) > 1
)
`;