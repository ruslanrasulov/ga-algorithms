import React from 'react';
import './_styles.scss';

const Modal = (props) => (
    <div className="modal">
        <div className="modal__main">
            <div className="modal__main__header">{props.title}</div>
            <div className="modal__main__body">{props.children}</div>
            <div className="modal__main__footer">
                <button onClick={props.onClick}>Add</button>
                <button onClick={props.onClose}>Close</button>
            </div>
        </div>
    </div>
);

export default Modal;