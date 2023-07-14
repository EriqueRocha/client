import React from "react";
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Login from './pages/escolherId/index';
import Extrato from './pages/extrato/index';

export default function Rotas(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" exact Component={Login}/>
                <Route path="extrato" Component={Extrato}/>
            </Routes>
        </BrowserRouter>
    );
}




