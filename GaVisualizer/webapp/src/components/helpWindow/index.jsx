import React from 'react';
import './_styles.scss';

const HelpWindow = props => (
    <div className='help-window-bg'>
        <div className='help-window'>
            <div className='help-window__header'>
                <span className='help-window__title'>Справка</span>
                <i className='help-window__close-btn fa fa-close' onClick={props.onClose}></i>
            </div>
            <div className='help-window__content'>
            <div className='note'>Программное обеспечение визуализации работы генетических алгоритмов формирует прямоугольное поле, на котором располагаются хромосомы двух видов: бактерия и вирус. Каждая бактерия и каждый вирус имеют следующие гены:</div>
            <ul>
                <li><span className='text-bold'>Продуктивность (П)</span> – параметр, значение которого прямо пропорционально влияет на шанс данной хромосомы быть выбранной для последующей селекции.</li>
                <li><span className='text-bold'>Социальность (С)</span> – параметр, значение которого прямо связано с влиянием соседних хромосом и их фитнес-функций.</li>
            </ul>
            <div className='note'>Также у клеток есть параметр <span className='text-bold'>Возраст (В)</span> указывающий на количество пережитых поколений.</div>
            <div className='note'>Фитнес-функция вычисляется по следующей формуле: (<span className='text-bold'>кол-во однотипных клеток рядом</span> * <span className='text-bold'>С</span>) - <span className='text-bold'>П</span></div>
            <div className='note'>Также в программном обеспечении визуализации работы генетических алгоритмов предусмотрен пошаговый запуск алгоритма, с детальной демонстрацией всех процессов генетического алгоритма (вычисления фитнес-функции, селекции, скрещивания, мутации).</div>
            </div>
        </div>
    </div>
);

export default HelpWindow;