import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import AlgorithmView from '../algorithmView';
import 'reset-css';
import './_styles.scss';

const App = () => {
    return (
        <div>
            <main className="container">
                <Switch>
                    <Route path="/algorithms" exact component={AlgorithmView} />
                    <Redirect to="/algorithms" />
                </Switch>
            </main>
        </div>
    );
};

export default App;
