import moment from "moment";
import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";
import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/invoicesAPI";


const STATUS_CLASSES = {
    PAID: "success",
    SENT: "info",
    CANCELLED: "danger"
};

const STATUS_LABELS = {
    PAID: "Bezahlt",
    SENT: "Gesendet",
    CANCELLED: "Storniert"
};

const InvoicesPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const itemsPerPage = 10;
    const [loading, setLoading] = useState(true);

    //Get invoices from Api
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesAPI.findAll();
            setInvoices(data);
            setLoading(false);
        } catch (error) {
            toast.error("Fehler beim Laden der Rechnungsliste!");
        }
    };

    // Load invoices by loading component (page: InvoicesPage.jsx)
    useEffect(() => {
        fetchInvoices();
    }, []);

    //Manage deleting a invoice
    const handleDelete = async id => {
        // Copy original invoices
        const originalInvoices = [...invoices];
        // Remove deleted invoice from list
        setInvoices(invoices.filter(invoice => invoice.id !== id));

        try {
            await InvoicesAPI.delete(id);
            //TODO : Replace id with invoice.invoiceNumber
            toast.success(`Die Rechnung n° ${id} wurde gelöscht`);
        } catch (error) {
            toast.error("Ein Fehler ist aufgetreten!");
            setInvoices(originalInvoices);
        }
    };

    //Manage change page
    const handlePageChange = page => setCurrentPage(page);

    //Mange Search
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    //Manage date format
    const formatDate = (str) => moment(str).format('DD.MM.YYYY');

    // Filter invoices based on search
    const filteredInvoices = invoices.filter(
        i =>
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().startsWith(search.toLowerCase()) ||
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    );

    //Data pagination
    const paginatedInvoices = Pagination.getPaginatedData(
        filteredInvoices,
        currentPage,
        itemsPerPage
    );

    return (
        <>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h1>Liste der Rechnungen</h1>
                <Link to="/invoices/new" className="btn btn-primary">Rechnung erstellen</Link>
            </div>

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control"
                       placeholder="Suchen..."/>
            </div>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Rech.Nr:</th>
                    <th>Kunde</th>
                    <th className="text-center">Gesendet am</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Betrag</th>
                    <th></th>
                </tr>
                </thead>
                {!loading && (
                    <tbody>{paginatedInvoices.map(invoice =>
                        <tr key={invoice.id}>
                            <td>{invoice.invoiceNumber}</td>
                            <td>
                                <Link
                                    to={"/customers/" + invoice.customer.id}
                                    className="font-weight-bold"
                                >
                                    {invoice.customer.firstName} {invoice.customer.lastName}
                                </Link>
                            </td>
                            <td className="text-center">{formatDate(invoice.sentAt)}</td>
                            <td className="text-center">
                                    <span
                                        className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                            </td>
                            <td className="text-center">{invoice.amount.toLocaleString("de-DE")} €</td>
                            <td>
                                <Link
                                    to={"/invoices/" + invoice.id}
                                    className="btn btn-sm btn-primary mr-1"
                                >
                                    Bearbeiten
                                </Link>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}
                                >
                                    Löschen
                                </button>
                            </td>
                        </tr>)}
                    </tbody>
                )}
            </table>

            {loading && <TableLoader/>}

            {itemsPerPage < filteredInvoices.length && <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChanged={handlePageChange}
                length={filteredInvoices.length}
            />}
        </>
    );
};

export default InvoicesPage;