import { useState } from "react";

import WorkerList from "./WorkerList";

export default function List() {
  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <WorkerList/>
    </div>
  );
}

