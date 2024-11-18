# Expense Tracker API

An API built with Node.js, Express, and MongoDB to manage personal expenses. This project supports multilingual functionality (English and Thai) and features such as authentication, expense tracking, and account management with file upload capabilities. Encourage ones to keep track of income, expenses. Benefitting for your money management, point out potential money risk, expense problem etc.

## Features

- User authentication (Register/Login).
- CRUD operations for accounts and expenses.
- File uploads for transaction slips.
- Multilingual support (English and Thai).
- Pagination for accounts, expenses, and expense types.
- Filtering of expenses by date, account, and expense type.
- Profanity filtering for notes in expenses.

## Planned
- validate query, payload, (parameter optional) for every request.
- export to doc for summary page.
- import data from docs.
---

## Installation

Clone the repository
git clone https://github.com/chatchawatt/expense-tracker.git
cd expense-tracker

## Install dependencies
npm install

## Create an .env file in the root directory with the following environment variables
PORT=3000
MONGO_URI=mongodb+srv://user1:MNEQ0tfyLQ6ZBoc1@expensetracker.vi3b2.mongodb.net/?retryWrites=true&w=majority&appName=expenseTracker
JWT_SECRET=itssecret

## Start the server
npm run dev

## API Endpoints

# Authentication
- Register a user
    POST /api/users/register
    Body : {
        "name": "John Doe",
        "email": "john@example.com",
        "password": "password123"
    }  

- Login
    POST /api/login
    Body:
    {
        "email": "john@example.com",
        "password": "password123"
    }
    Response:
    {
        "token": "JWT_TOKEN"
    }

# Users
- Get all users
    GET /api/users
    Query Parameters:

    userId (optional): Get accounts for a specific user.
    page: Page number for pagination.
    limit: Number of records per page. 
    
- Delete a user
    DELETE /api/users/:id
    Headers:
    Authorization: JWT_TOKEN

# Accounts
- Get all accounts
    GET /api/accounts
    Query Parameters:

    userId (optional): Get accounts for a specific user.
    accountId (optional): Get specific account.
    page: Page number for pagination.
    limit: Number of records per page. 
    
- Add an account
    POST /api/accounts
    Headers:
    Authorization: JWT_TOKEN
    Body:
    {
        "name": "Savings Account",
        "balance": 1000
    }
- Delete an account
    DELETE /api/accounts/:id
    Headers:
    Authorization: JWT_TOKEN

# Expenses
- Get all expenses
    GET /api/expenses/

- Get filtered expenses
    GET /api/expenses/filter
    Query Parameters:
    startDate (optional): Start date for filtering.
    endDate (optional): End date for filtering.
    accountId (optional): Filter by account ID.
    userId (optional): Filter by user ID.
    expenseTypeId (optional): Filter by expense type ID.
    page: Page number for pagination.
    limit: Number of records per page.

- Get summary of expenses
     GET /api/expenses/summary
    Query Parameters:
    startDate (optional): Start date for filtering.
    endDate (optional): End date for filtering.
    accountId (optional): Filter by account ID.
    expenseTypeId (optional): Filter by expense type ID.

- Add an expense
    POST /api/expenses
    Headers:
    Authorization: JWT_TOKEN
    Body:
    {
        "accountId": "account_id",
        "expenseTypeId": "expense_type_id",
        "amount": 100,
        "date": "2024-11-18",
        "note": "7-11"
        "transactionSlip": "xxxx"
    }
    To include a transaction slip, use multipart/form-data with the field name transactionSlip.

- Delete an expense
    DELETE /api/expenses/:id
    Headers:
    Authorization: JWT_TOKEN

# Expenses Type

- Get all expense types
    GET /api/expense-types
    Query Parameters:
    page: Page number.
    limit: Number of records per page.

- Add an expense-type
    POST /api/expenses-types
    Headers:
    Authorization: JWT_TOKEN
    Body:
    {
        "name": "any name",
    }

- Delete an expense types
    DELETE /api/expenses-types/:id
    Headers:
    Authorization: JWT_TOKEN

# Multilingual Support

The API supports English and Thai. Use the lang query parameter to specify the language:
eg.
GET /api/accounts?lang=th

