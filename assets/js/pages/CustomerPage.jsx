import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import Field from "../components/forms/Field";
import FormContentLoader from "../components/loaders/FormContentLoader";
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

    const [loading, setLoading] = useState(false);

    const [editing, setEditing] = useState(false);

    //Get customer through his ID
    const fetchCustomer = async id => {
        try {
            const {firstName, lastName, email, company} = await CustomersAPI.find(id);
            setCustomer({firstName, lastName, email, company});
            setLoading(false);
        } catch (error) {
            toast.error("Der angeforderte Kunde kann nicht geladen werden");
            history.replace("/customers");
        }
    };

    // Customer loading if necessary when loading the component or changing the identifier
    useEffect(() => {
        if (id !== "new") {
            setLoading(true);
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
            setErrors({});

            if (editing) {
                await CustomersAPI.update(id, customer);
                toast.success(`Der Kunde n° ${id} wurde geändert`);
            } else {
                await CustomersAPI.create(customer);
                toast.success("Der Kunde wurde gespeichert");
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
                    toast.error("Fehler in Ihrem Formular!");
                });
                setErrors(apiErrors);
            }
        }
    };
    return (
        <>
            {!editing && <h1>Kunden erstellen</h1> || <h1>Kunden Daten Ändern</h1>}

            {loading && <FormContentLoader/>}

            {!loading && (
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
            )}
        </>
    );
};

export default CustomerPage;