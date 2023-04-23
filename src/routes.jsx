import {
  ComputerDesktopIcon
} from "@heroicons/react/24/solid";

import Workers from "@/pages/dashboard/workers/Main";
import Processes from "@/pages/dashboard/processes/ProcessList/Main";
import ProcessDetail from "@/pages/dashboard/processes/Detail";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [

      {
        icon: <ComputerDesktopIcon {...icon} />,
        sideShow: true,
        name: "Workers",
        path: "/workers",
        element: <Workers />,
      },
      {
        icon: <ComputerDesktopIcon {...icon} />,
        sideShow: true,
        name: "Process List",
        path: "/processes",
        element: <Processes />,
      },
      {
        icon: <ComputerDesktopIcon {...icon} />,
        sideShow: false,
        name: "Process List",
        path: "/processes/:id",
        element: <ProcessDetail />,
      },
    ],
  },
];

export default routes;
