import React from 'react';
import './_styles.scss';

const ElementInfo = props => (
    <ul className='element-info'>
        <li className="element-info__item">{props.elementType === 0 ? 'Bacterium' : 'Virus'}</li>
        <li className="element-info__item">Social value: {props.socialValue}</li>
        <li className="element-info__item">Productivity: {props.productivity}</li>
        {
            props.fitnessValue !== undefined
            ? <li className="element-info__item">Fitness value: {props.fitnessValue}</li>
            : null
        }
    </ul>
);

export default ElementInfo;