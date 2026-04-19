import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';


// We have the "[id]" folder. Such a folder makes so that you can put anything in there
//  Pages that are a child of can access it like a "page parameter"
export default async function Page( props:              { params: Promise<{ id: string }> }          ) {
  
    const params = await props.params; // This is how you get the parameter on [id]
    const id = params.id;
  

    const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  
  return (

    <main>

      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />

      <Form invoice={invoice} customers={customers} />

    </main>

  );
}