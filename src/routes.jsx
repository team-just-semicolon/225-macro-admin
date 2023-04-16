import {
  ComputerDesktopIcon
} from "@heroicons/react/24/solid";

import Workers from "@/pages/dashboard/workers/Main";
import Processes from "@/pages/dashboard/Processes/Main";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [

      {
        icon: <ComputerDesktopIcon {...icon} />,
        name: "Workers",
        path: "/Workers",
        element: <Workers />,
      },
      {
        icon: <ComputerDesktopIcon {...icon} />,
        name: "Process List",
        path: "/Processes",
        element: <Processes />,
      },
    ],
  },
];

export default routes;
