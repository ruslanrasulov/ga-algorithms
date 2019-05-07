import React from 'react';
import './_styles.scss';

const Modal = (props) => (
    <div className='modal'>
        <div className='modal__main'>
            <div className='modal__main__header'>{props.title}</div>
            <div className='modal__main__body'>{props.children}</div>
            <div className='modal__main__footer'>
                <button className='modal__main__footer__btn' onClick={props.onClick}>Добавить</button>
                <button className='modal__main__footer__btn' onClick={props.onClose}>Закрыть</button>
            </div>
        </div>
    </div>
);

export default Modal;