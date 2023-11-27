import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import { SignIn, Beta, SignUp } from "@/pages/auth";
import { AddUser } from "@/pages/onboarding";

import {
  Data,
  Stock,
  StockAnalysis,
  CreateStrategy,
  Strategy,
  Strategies,
  Screener,
  
} from "@/pages/dashboard";

import FAQPage from "./pages/dashboard/screener/FAQ";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "FAQPage",
        path: "/faq",
        element: <FAQPage />,
        hide: true,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Screener",
        path: "/screener",
        element: <Screener />,
        hide: true,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Explore",
        path: "/explore",
        element: <Data />,
        hide: true,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "stock",
        path: "/stock",
        element: <Stock />,
        hide: true,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "analyze",
        path: "/analysis",
        element: <StockAnalysis />,
        hide: true,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "strategy",
        path: "/strategy/create",
        element: <CreateStrategy />,
        hide: true,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "strategy",
        path: "/strategy",
        element: <Strategy />,
        hide: true,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "strategy",
        path: "/strategies",
        element: <Strategies />,
        hide: true,
      },
    ],
  },
  {
    layout: "auth",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "SignIn",
        path: "/signIn",
        hide: true,
        element: <SignIn />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Beta",
        path: "/welcome",
        element: <Beta />,
        hide: true,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "SignUp",
        path: "/signUp",
        hide: true,
        element: <SignUp />,
      },
    ],
  },

  {
    layout: "onboarding",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Onboarding",
        path: "/add",
        hide: true,
        element: <AddUser />,
      },
    ],
  },
];

export default routes;
