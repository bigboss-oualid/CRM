import React, {useContext} from 'react';
import {NavLink} from "react-router-dom";
import {toast} from "react-toastify";
import AuthContext from "../contexts/AuthContext";
import AuthAPI from "../services/authAPI";


const Navbar = ({history}) => {

    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);
    const logoPath = '../images/crm-logo.png';

    const handleLogout = () => {
        AuthAPI.logout();
        setIsAuthenticated(false);
        toast.info("Sie sind jetzt abgemeldet ☺");
        history.push('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <NavLink className="navbar-brand" to="/"><img src={logoPath} alt="Logo"/></NavLink>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01"
                        aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/customers">Kunden</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/invoices">Rechnungen</NavLink>
                        </li>
                    </ul>
                    <ul className="navbar-nav ml-auto">
                        {(!isAuthenticated && (
                            <>
                                <li className="nav-item">
                                    <NavLink to="/register" className="nav-link">
                                        Neu anmelden
                                    </NavLink>
                                </li>
                                <li className="nav-item mt-1 mr-2">
                                    <NavLink to="/login" className="btn btn-success">
                                        Einloggen!
                                    </NavLink>
                                </li>
                            </>
                        )) || (
                            <li className="nav-item mt-1">
                                <button onClick={handleLogout} className="btn btn-danger">
                                    Ausloggen
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;


