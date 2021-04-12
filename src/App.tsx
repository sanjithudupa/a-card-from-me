import React from "react";
import "./index.css";
import {HashRouter, Route, Redirect, BrowserRouter} from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Edit from "./pages/Edit";
import View from "./pages/View";
import ViewDirect from "./pages/ViewDirect";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#489FB5'
        },
        secondary: {
            main: '#DB504A'
        }
    }
});

function App() {
    return (
        <div style={{fontFamily: "Nunito"}}>
            <MuiThemeProvider theme={theme}>
                <BrowserRouter>
                    <Route path="/" exact component={Home}/>
                    <Route path="/redirect" component={ViewDirect}/>
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
                </BrowserRouter>
            </MuiThemeProvider>
        </div>
    )
}

export default App;