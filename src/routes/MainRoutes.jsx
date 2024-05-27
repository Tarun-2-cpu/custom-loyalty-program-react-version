import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const Dashboard = Loadable(lazy(() => import('pages/extra-pages/member-dashboard')));
const Redeem = Loadable(lazy(() => import('pages/extra-pages/Redeem')));
const Transaction = Loadable(lazy(() => import('pages/extra-pages/Transaction')));

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'member-dashboard',
      element: <Dashboard />
    },
    {
      path: 'redeem',
      element: <Redeem />
    },
    {
      path: 'transaction',
      element: <Transaction />
    }
  ]
};

export default MainRoutes;
