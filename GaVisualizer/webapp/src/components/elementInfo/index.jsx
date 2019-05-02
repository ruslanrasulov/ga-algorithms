import React from 'react';
import './_styles.scss';

const ElementInfo = props => (
    <ul className='element-info'>
        <li className="element-info__item">
            <span className="element-info__title">
                {props.elementType === 0 ? 'Bacterium' : 'Virus'}
            </span>
        </li>
        <li className="element-info__item">
            <span className="element-info__item__label">Social value: </span>{props.socialValue}
        </li>
        <li className="element-info__item"><span className="element-info__item__label">Productivity: </span>{props.productivity}</li>
        <li className="element-info__item"><span className="element-info__item__label">Age: </span>{props.age}</li>
        {
            props.fitnessValue !== undefined
            ? <li className="element-info__item"><span className="element-info__item__label">Fitness value: </span>{props.fitnessValue}</li>
            : null
        }
    </ul>
);

export default ElementInfo;