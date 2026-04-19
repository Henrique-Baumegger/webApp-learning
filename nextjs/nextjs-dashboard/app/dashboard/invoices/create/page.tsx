import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
 
export default async function Page() {

  const customers = await fetchCustomers();
 
  return (
    <main>
      {/* "breadcrumbs" prop recives data of type Breadcrumb[] */}
      {/* We defined "Breadcrumb" with "type Breadcrumb" */}
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices',       href: '/dashboard/invoices' },
          { label: 'Create Invoice', href: '/dashboard/invoices/create', active: true }, // active = current page (styled differently)
        ]}
      />
      {/* "customers" prop recives data of type CustomerField[] */}
      {/* We defined "CustomerField" with "type CustomerField" */}
      <Form customers={customers} />
    </main>
  );
}