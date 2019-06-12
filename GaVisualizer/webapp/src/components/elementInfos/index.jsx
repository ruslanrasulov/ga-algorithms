import React from 'react';
import './_styles.scss';

const ElementInfos = ({ title, elements }) => (
    <div className='element-infos'>
        <div className='element-infos__title'>{title}</div>
        <table className='element-infos__table'>
            <thead>
                <tr>
                    <th>№</th>
                    <th>Тип элемента</th>
                    <th>Идентификатор</th>
                    <th>Социальность</th>
                    <th>Продуктивность</th>
                    <th>Возраст</th>
                    <th>Значение финтес-функции</th>
                </tr>
            </thead>
            <tbody>
                {elements.map((e, i) => 
                    <tr key={e.id}>
                        <td>{i + 1}</td>
                        <td>{e.elementType === 0 ? 'Бактерия' : 'Вирус'}</td>
                        <td>{e.id}</td>
                        <td>{e.socialValue.value.toFixed(3)}</td>
                        <td>{e.productivity.value.toFixed(3)}</td>
                        <td>{e.age}</td>
                        <td>{e.fitnessValue !== undefined ? e.fitnessValue.toFixed(3) : 0}</td>
                    </tr>)}
            </tbody>
        </table>
    </div>
);

export default ElementInfos;