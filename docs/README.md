# Financial Tracker

### The problem
Many banking apps do not provide a method to properly review transactions in an informative way.
Bank statements are often not enough on their own to provide in depth understanding of spendings/earnings.

### The Purpose of Financial Tracker
Financial Tracker, name likely to be changed, is an application to take in and review csv data exported from banking apps.<br>
Allows users to review graphs showing balance over time.<br>
Allows users to apply categories to their transactions helping to see where money is being spent and earned.

Taking in CSV data allows it to be widely compatible with many different banking apps as CSV is a standard format which most banks export to.


# Requirements

## Data ingestion
Users should be able to import data from a CSV file.<br>
That data should be inserted into a database where no matching transactions already exist.<br>
You should be able to import CSV files containing duplicate transactions and have only the non-duplicates be added to the database.

## Security
Data should only ever be stored locally.<br>
Data should be stored in a mostly non-sensitive way.<br>
Data will need to show things such as account number, description and amount to be useful but should not contain things like bsb numbers. This will help to prevent data being useful for malicious intent as the information required to make a transaction will not be stored in the database.

## Category matching
Should function based on rule matching on transaction descriptions.
App should check the transaction description against user created rules.
Rules should be made to check description for
* Matching a word
* Containing a word
* NOT containing a word
* Matching a regex pattern

Rules should be chainable. So a category might be assigned when a transaction contains a word and does not contain another. All checks should be true for a match to apply.<br>
First match will always be used to make app behaviour fast and predictable.


## Categories
Categories will primarily be used as a means to simply categorise transactions.<br>
You should be able to view category credit and debit amounts separately.<br>
You should be able to view category totals as in credit and debit combined.<br>
You should be able to view category frequencies and average over time.<br>
It might be useful to see how often a transaction for this category is made.<br>


## Visualisation
Data should be displayed in a table and graph format.

A total should always be displayed based on queried data.<br>
So if the user has narrowed down the view to show 1 month, there should be a total for that time period<br>
If the user is viewing by category, there should be a total for that category.

A pie graph should be used to show spendings per category for easy visualisation of where the most money is being spent.


## Searching
You should be able to search data by:
- Description
- Category
- Amount (debit/credit)
Searching will be done via the api and a database query.
Pagination will likely be required.
Totals can be displayed via a sum query to allow for easier pagination.

## Accounts
Users should be able to create an account with name, email and password.<br>
This will allow for more than one person to make use of the app on a single system.<br>
Email should be used to allow the potential of data exporting. For example emailing an export of transactions for a particular category.<br>
The app should only use user ids to manage data. This will allow for user information to be changed without breaking any systems.