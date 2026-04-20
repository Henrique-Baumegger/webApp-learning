'use server';
// 'use server' marks server-side functions that can be called from client-side code.
// (or at the top of file for all exports)

// not-'use client' code is always server sided, but it only run once, on the initial rendering.
// 'use client' makes so that the code (tsx) keeps running on the browser (slow and visible)

// 'use server' makes so that you can do 'use client' shananigans but with the code running on the server
// The way it does it, is by (under the hood) creating routes (a POST API endpoint) and and calling them 

// Alternative explanation: 
// By adding the 'use server', you mark all the exported functions within the file as Server Actions.
// These server functions can then be imported and used in Client and Server components.

// Regarding location:
// You can also write Server Actions directly inside Server Components by adding "use server" inside the action. 
// But for this course, we'll keep them all organized in a separate file. 
// We recommend having a separate file for your actions.



import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';



// "zod" is a library where define data Schemas and validade types
import { z } from 'zod';
 
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});
const CreateInvoice = FormSchema.omit({ id: true, date: true });




export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};





export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
      };
    }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];


  // Basic way to use SQL
  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;


  // Once the database has been updated, the /dashboard/invoices path will be revalidated, 
  // and fresh data will be fetched from the server.
    revalidatePath('/dashboard/invoices');


  // redirect the user back to the "/dashboard/invoices" page
    redirect('/dashboard/invoices');


  // Since 'use server' made this server sided, 
  // this will print on the server terminal, 
  // not on the browser
  // console.log(amount);
}





// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
 
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
 
  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}




export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}