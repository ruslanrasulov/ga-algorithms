import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import AlgorithmPage from '../algorithmPage';
import 'reset-css';
import './_styles.scss';

const App = () => {
    return (
        <div>
            <main className='container'>
                <Switch>
                    <Route path='/algorithms' exact component={AlgorithmPage} />
                    <Redirect to='/algorithms' />
                </Switch>
            </main>
        </div>
    );
};

export default App;
