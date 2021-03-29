import React from "react";
import "./index.css";
import {HashRouter, Route, Redirect, BrowserRouter} from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Edit from "./pages/Edit";
import View from "./pages/View";

function App() {
    let path = localStorage.getItem('path');
    if(path) {
        localStorage.removeItem('path');
        return (
            <Redirect to={`/${path}`}></Redirect>
        )
    }

    return (
        <div style={{fontFamily: "Nunito"}}>
            <HashRouter>
                <Route path="/" exact component={Home}/>
                <Route path="/about" component={About}/>
                <Route path="/dashboard" component={Dashboard}/>

                <Route path="/edit" exact>
                    <Redirect to="/"></Redirect>
                </Route>

                <Route path="/view" exact>
                    <Redirect to="/"></Redirect>
                </Route>

                <Route path="/edit/:id" component={Edit}/>
                <Route path="/view/:id" component={View}/>
            </HashRouter>
        </div>
    )
}

export default App;