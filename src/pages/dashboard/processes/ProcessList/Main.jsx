import { useState } from "react";
import Modal from "react-modal";

import ProcessList from './ProcessList';
import JobConsult from "./JobConsult";

export default function List() {
  const [showModal, setShowModal] = useState(false);
  const [processList, setProcessList] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  const handleCreateProcessClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const getProcessList = (page, size) => {
    fetch(`http://141.164.51.175:225/api/process?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        data.data.content.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setProcessList(data.data);
        // setProcessList(ProcessListtDataDummy);
      })
      // .then((data) => setWorkList(data.data.content))
      .catch((error) => console.error("Error fetching client count:", error));
  }


  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <div>
        <ProcessList
          handleCreateProcessClick={handleCreateProcessClick}
          getProcessList={getProcessList}
          processList={processList}
          page={page}
          setPage={setPage}
          size={size}
          setSize={setSize}
        />
      </div>
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
            maxHeight: '750px', // or any value according to your needs
            overflowY: 'auto'
          },
        }}
      >
        <JobConsult
          handleModalClose={handleModalClose}
          getProcessList={getProcessList}
          page={page}
          setPage={setPage}
          size={size}
          setSize={setSize}
        />
      </Modal>
    </div>
  );
}

