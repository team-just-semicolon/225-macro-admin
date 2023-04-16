import { useState } from "react";
import Modal from "react-modal";
import TaskList from './TaskList'
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
      <TaskList/>
    </div>
  );
}

