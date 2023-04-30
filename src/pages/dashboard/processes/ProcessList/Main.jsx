import { useState } from "react";
import Modal from "react-modal";

import ProcessList from './ProcessList';
import JobConsult from "./JobConsult";

export default function List() {
  const [showModal, setShowModal] = useState(false);
  const [processList, setProcessList] = useState([]);


  const handleCreateProcessClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const getProcessList = () => {
    fetch(`http://141.164.51.175:225/api/process?page=1&size=20`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setProcessList(data.data.content);
      })
      // .then((data) => setWorkList(data.data.content))
      .catch((error) => console.error("Error fetching client count:", error));
  }


  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <ProcessList
        handleCreateProcessClick={handleCreateProcessClick}
        getProcessList={getProcessList}
        processList={processList}
      />
      <Modal
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
          getProcessList={getProcessList}
        />
        <button onClick={handleModalClose}>Close</button>
      </Modal>
    </div>
  );
}

