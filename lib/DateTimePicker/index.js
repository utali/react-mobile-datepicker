import "./index.css";
import React from "react";
import DatePicker from "./picker.js";
import Modal from "../Modal.js";
import { defaultProps } from "../dataSource";

function EnhanceDatePicker({ isOpen, ...props }) {
  function onModalClose(event) {
    if (event.target === event.currentTarget) {
      props.onCancel();
    }
  }

  return (
    <div
      style={{ display: isOpen ? "" : "none" }}
      onClick={onModalClose}
      className="date-time-picker-modal"
    >
      <DatePicker {...props} />
    </div>
  );
}

function ModalDatePicker({ isPopup, ...props }) {
  if (!isPopup) {
    return <DatePicker {...props} />;
  }

  return (
    <Modal {...props}>
      <EnhanceDatePicker />
    </Modal>
  );
}

ModalDatePicker.displayName = "MobileDatePicker";
ModalDatePicker.defaultProps = defaultProps;

export default ModalDatePicker;
