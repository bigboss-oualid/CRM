import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import CustomersAPI from "../services/customersAPI";
import InvoicesAPI from "../services/invoicesAPI";


const InvoicePage = ({match, history}) => {

    const {id} = match.params;

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    });

    const [customers, setCustomers] = useState([]);

    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    });

    //Get customers
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            //If we add amount without change customer and status, we add a copy of invoice and add first customer in our array data
            if (!invoice.customer) setInvoice({...invoice, customer: data[0].id});
        } catch (error) {
            // TODO : Flash error notification
            history.replace("/invoices");
        }
    };

    //Get one invoice
    const fetchInvoice = async () => {
        try {
            //Extract data to give only customer ID instate of customer as object
            const {amount, status, customer} = await InvoicesAPI.find(id);
            setInvoice({amount, status, customer: customer.id});
        } catch (error) {
            //TODO: Flash error
            history.replace("/invoices");
        }
    };

    // Get list of customers by every loading of the component
    useEffect(() => {
        fetchCustomers();
    }, []);
    // Get the correct invoice if id in URL change
    useEffect(() => {
        if (id !== "new") {
            fetchInvoice(id);
        }
    }, [id]);

    // Manage input changing in form
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setInvoice({...invoice, [name]: value});
    };

    // Manage submission of form
    const handleSubmit = async event => {
        event.preventDefault();
        try {
            if (id === "new") {
                await InvoicesAPI.create(invoice);
                // TODO: Flash notification success
                history.replace("/invoices");
            } else {
                await InvoicesAPI.update(id, invoice);
                setErrors({});
                // TODO: Flash notification success
            }

        } catch ({response}) {
            const {violations} = response.data;
            if (violations) {
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                    if (message === "The invoice amount must be numeric!") {
                        message = "Der Rechnungsbetrag muss numerisch sein!";
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
            {id === "new" && <h1>Rechnung erstellen</h1> || <h1>Rechnung ändern</h1>}

            <form onSubmit={handleSubmit}>
                <Field
                    name="amount"
                    type="number"
                    label="Betrag"
                    placeholder="Rechnung Betrag"
                    value={invoice.amount}
                    onChange={handleChange}
                    error={errors.amount}
                />

                <Select
                    name="customer"
                    label="Kunde"
                    value={invoice.customer}
                    error={errors.customer}
                    onChange={handleChange}
                >
                    {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                            {customer.firstName} {customer.lastName}
                        </option>
                    ))}
                </Select>

                <Select
                    name="status"
                    label="Status"
                    value={invoice.status}
                    error={errors.status}
                    onChange={handleChange}
                >
                    <option value="SENT">Gesendet</option>
                    <option value="PAID">Bezahlt</option>
                    <option value="CANCELLED">Storniert</option>
                </Select>
                <div className="form-group">
                    <button className="btn btn-success">Speichern</button>
                    <Link to="/invoices" className="btn btn-link">Zurück zur Rechnungsliste</Link>
                </div>
            </form>
        </>
    );
};

export default InvoicePage;