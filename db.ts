import { DatabaseError, Pool } from "pg";
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "bookstore",
  password: "123",
  port: 3030,
});
export default pool;
