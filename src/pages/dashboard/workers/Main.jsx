import { useState } from "react";
import Modal from "react-modal";

import WorkerList from "./WorkerList";
import JobConsult from "./JobConsult";

export default function List() {
  const [showModal, setShowModal] = useState(false);

  const handleCreateTaskClick = () => {
    console.log(showModal);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <WorkerList handleCreateTaskClick={handleCreateTaskClick}  />
      <Modal
        isOpen={showModal}
        onRequestClose={handleModalClose}
        contentLabel="Job Consult Modal"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            // maxWidth: "80%", maxHeight: "80%" 
          },
        }}
      >
        <JobConsult handleModalClose={handleModalClose} />
        <button onClick={handleModalClose}>Close</button>
      </Modal>
    </div>
  );
}

