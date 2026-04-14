import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';
import { Suspense } from 'react';
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui/skeletons';
import CardWrapper from '@/app/ui/dashboard/cards';

 
export default async function Page() {



  // All this commented logic was sent to inside the components itselfs, no longer props.
  // We moved data fetches down to the components that need it
  /* We could make this parallel with:
  const [revenue, latestInvoices, dataForCards] = await Promise.all([
  fetchRevenue(),
  fetchLatestInvoices(),
  fetchCardData(),
  ]);
  */
  //const dataForCards = await fetchCardData()
  //const latestInvoices = await fetchLatestInvoices();
  //const revenue = await fetchRevenue()



  
  return (
    <main>

      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
      {/* will become "lusitana_abc123 mb-4 text-xl md:text-2xl" */}
      {/* `` is just a fancy way to concatenate strings, similar to pythons fstring */}

        Dashboard

      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>

      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">



        {/* Suspense component allows us to render our RevenueChartSkeleton
        while RevenueChart still has not rendered
        (RevenueChart is async and has a "await fetchRevenue()" call that takes a while) */}
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>



        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>

      </div>
      
    </main>
  );
}