import React from 'react';
import './_styles.scss';

const ElementInfo = ({ element: { id, elementType, socialValue, productivity, age, fitnessValue } }) => (
    <ul className='element-info'>
        <li className="element-info__item">
            <span className="element-info__title">
                {elementType === 0 ? 'Бактерия' : 'Вирус'}
            </span>
        </li>
        <li className="element-info__item">
            <span className="element-info__item__label">Идентификатор: </span>{id}
        </li>
        <li className="element-info__item">
            <span className="element-info__item__label">Социальность: </span>{socialValue.value.toFixed(3)}
        </li>
        <li className="element-info__item"><span className="element-info__item__label">Продуктивность: </span>{productivity.value.toFixed(3)}</li>
        <li className="element-info__item"><span className="element-info__item__label">Возраст: </span>{age}</li>
        {
            fitnessValue !== undefined
            ? <li className="element-info__item"><span className="element-info__item__label">Значение фитнес функции: </span>{fitnessValue.toFixed(3)}</li>
            : null
        }
    </ul>
);

export default ElementInfo;