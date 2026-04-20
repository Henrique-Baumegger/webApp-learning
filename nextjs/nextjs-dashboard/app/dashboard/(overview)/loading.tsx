
// loading.tsx is a special Next.js file that automatically creates an instant loading UI
// by wrapping your page in a React Suspense boundary. 
// It displays a skeleton or spinner while data is being fetched, 
// allowing the rest of your layout to remain interactive during navigation.


/*
Route groups allow you to organize files into logical groups 
without affecting the URL path structure. 
When you create a new folder using parentheses (), 
the name won't be included in the URL path. 
So "/dashboard/(overview)/page.tsx" becomes "/dashboard"


Here, you're using a route group to ensure loading.tsx only applies to your dashboard overview page.
 However, you can also use route groups to separate your application into sections 
 (e.g. (marketing) routes and (shop) routes) or by teams for larger applications.
*/

import DashboardSkeleton from '@/app/ui/skeletons';


export default function Loading() {
  return <DashboardSkeleton />;
}