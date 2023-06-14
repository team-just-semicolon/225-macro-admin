import { useState } from "react";
import Modal from "react-modal";

import WorkerList from "./WorkerList";

export default function List() {
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  const handleCreateProcessClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <WorkerList
        handleCreateProcessClick={handleCreateProcessClick}
      />
      {/* <Modal
        isOpen={showModal}
        onRequestClose={handleModalClose}
        contentLabel="Job Consult Modal"
        style={{
          content: {
            top: "50%",
            left: "60%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            // maxWidth: "60%"
          },
        }}
      >
        <JobConsult
          handleModalClose={handleModalClose}
          getProcessList={() => { }}
          page={page}
          setPage={setPage}
          size={size}
          setSize={setSize}
        />
      </Modal> */}
    </div>
  );
}

