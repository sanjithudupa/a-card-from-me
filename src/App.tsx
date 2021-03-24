import React from "react";
import "./index.css";
import {Route, BrowserRouter as Router, Redirect} from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Edit from "./pages/Edit";

function App() {
    return (
        <div style={{fontFamily: "Nunito"}}>
            <Router>
                <Route path="/" exact component={Home}/>
                <Route path="/about" component={About}/>
                <Route path="/dashboard" component={Dashboard}/>

                <Route path="/edit" exact>
                    <Redirect to="/"></Redirect>
                </Route>

                <Route path="/edit/:id" component={Edit}/>
            </Router>
        </div>
    )
}

export default App;