import {Pool} from 'pg'

export const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'admin22501234',
    database: 'financial_tracker',
    port: 5432
});