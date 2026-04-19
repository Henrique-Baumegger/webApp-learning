import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export default async function Page() {
  const [users, customers, invoices, revenue] = await Promise.all([
    sql`SELECT * FROM users`,
    sql`SELECT * FROM customers`,
    sql`SELECT * FROM invoices`,
    sql`SELECT * FROM revenue`,
  ]);

  const data = { users, customers, invoices, revenue };

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
