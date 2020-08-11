import React, {useState} from 'react';
import {Link} from "react-router-dom";
import Field from "../components/forms/Field";
import UserApi from "../services/usersAPI";


const RegisterPage = ({history}) => {

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    // Manage input changing in form
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setUser({...user, [name]: value});
    };

    // Manage form submission
    const handleSubmit = async event => {
        event.preventDefault();
        //TODO : Optimize errors to syncronize confirm password with other inputs errors
        const apiErrors = {};

        if (user.password !== user.passwordConfirm) {
            apiErrors.passwordConfirm = "Ihr bestätigtes Passwort stimmt nicht mit dem ursprünglichen Passwort überein!";
            setErrors(apiErrors);
            return;
        }
        try {
            await UserApi.register(user);
            setErrors({});
            //TODO : Flash success
            history.replace("/login");
        } catch (error) {
            console.log(error.response);
            const {violations} = error.response.data;
            if (violations) {
                violations.forEach(({propertyPath, message}) => {
                    if (message === "The field is required!") {
                        message = "Der Feld ist erforderlich";
                    } else if (message === "The field must be between 3 and 255 characters!") {
                        message = "Der Feld muss zwischen 3 und 255 Zeichen enthalten!";
                    } else if (message === "The email address must have a valid format!") {
                        message = "Die E-Mail-Adresse muss ein gültiges Format haben!";
                    }
                    apiErrors[propertyPath] = message;
                    //TODO : Flash Errors
                });
                setErrors(apiErrors);
            }

            //TODO : Flash success
        }
    };

    return (
        <>
            <h1>Anmeldung</h1>
            <form onSubmit={handleSubmit}>
                <Field
                    name="firstName"
                    label="Vorname"
                    placeholder="Ihre Vorname"
                    value={user.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                />
                <Field
                    name="lastName"
                    label="Nachname"
                    placeholder="Ihre Nachname"
                    value={user.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
                <Field
                    name="email"
                    label="E-mail Adresse"
                    placeholder="Ihre E-mail Adresse"
                    type="email"
                    value={user.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <Field
                    name="password"
                    label="Passwort"
                    type="password"
                    placeholder="Ihre starke Passwort"
                    value={user.password}
                    onChange={handleChange}
                    error={errors.password}
                />
                <Field
                    name="passwordConfirm"
                    label="Passwort Bestätigung"
                    type="password"
                    value={user.passwordConfirm}
                    onChange={handleChange}
                    error={errors.passwordConfirm}
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Anmelden</button>
                    <Link to="/login" className="btn btn-link">Ich habe schon ein Konto</Link>
                </div>
            </form>
        </>
    );
};

export default RegisterPage;