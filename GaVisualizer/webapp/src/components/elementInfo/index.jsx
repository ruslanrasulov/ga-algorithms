import React from 'react';
import './_styles.scss';

const ElementInfo = props => (
    <ul className='element-info'>
        <li className="element-info__item">
            <span className="element-info__title">
                {props.elementType === 0 ? 'Бактерия' : 'Вирус'}
            </span>
        </li>
        <li className="element-info__item">
            <span className="element-info__item__label">Социальность: </span>{props.socialValue.value}
        </li>
        <li className="element-info__item"><span className="element-info__item__label">Продуктивность: </span>{props.productivity.value}</li>
        <li className="element-info__item"><span className="element-info__item__label">Возраст: </span>{props.age}</li>
        {
            props.fitnessValue !== undefined
            ? <li className="element-info__item"><span className="element-info__item__label">Значение фитнес функции: </span>{props.fitnessValue}</li>
            : null
        }
    </ul>
);

export default ElementInfo;