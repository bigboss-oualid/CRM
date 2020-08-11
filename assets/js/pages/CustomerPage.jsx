import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import Field from "../components/forms/Field";
import CustomersAPI from "../services/customersAPI";


const CustomerPage = ({match, history}) => {

    const {id} = match.params;

    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [editing, setEditing] = useState(false);

    //Get customer through his ID
    const fetchCustomer = async id => {
        try {
            const {firstName, lastName, email, company} = await CustomersAPI.find(id);
            setCustomer({firstName, lastName, email, company});
        } catch (error) {
            // TODO : Flash error notification
            history.replace("/customers");
        }
    };

    // Customer loading if necessary when loading the component or changing the identifier
    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);

    // Manage input changing in form
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setCustomer({...customer, [name]: value});
    };
    // Manage submission of form
    const handleSubmit = async event => {
        event.preventDefault();
        try {
            if (editing) {
                await CustomersAPI.update(id, customer);
                setErrors({});
                // TODO : Flash success
            } else {
                await CustomersAPI.create(customer);
                // TODO : Flash success notification
                history.replace("/customers");
            }
        } catch ({response}) {
            const {violations} = response.data;
            if (violations) {
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                    if (message === "The field is required!") {
                        message = "Der Feld ist erforderlich";
                    } else if (message === "The field must be between 3 and 255 characters!") {
                        message = "Der Feld muss zwischen 3 und 255 Zeichen enthalten!";
                    } else if (message === "The email address must have a valid format!") {
                        message = "Die E-Mail Adresse muss ein gültiges Format haben!";
                    }
                    apiErrors[propertyPath] = message;
                    //TODO : Flash Errors
                });
                setErrors(apiErrors);
            }
        }
    };
    return (
        <>
            {!editing && <h1>Kunden erstellen</h1> || <h1>Kunden Daten Ändern</h1>}

            <form onSubmit={handleSubmit}>
                <Field
                    name="lastName"
                    label="Nachname"
                    placeholder="Nachname des Kunden"
                    value={customer.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
                <Field
                    name="firstName"
                    label="Vorname"
                    placeholder="Vorname des Kunden"
                    value={customer.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                />
                <Field
                    name="email"
                    label="email"
                    placeholder="E-mail Adresse des Kunden"
                    type="email"
                    value={customer.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <Field
                    name="company"
                    label="Unternehmen"
                    placeholder="Unternehmen des Kunden"
                    value={customer.company}
                    onChange={handleChange}
                    error={errors.company}
                />

                <div className="form-group">
                    <button className="btn btn-success">Speichern</button>
                    <Link to="/customers" className="btn btn-link">Zurück zur Kundenliste</Link>
                </div>
            </form>
        </>
    );
};

export default CustomerPage;