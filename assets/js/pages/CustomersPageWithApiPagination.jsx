import axios from "axios";
import React, {useEffect, useState} from 'react';
import Pagination from "../components/Pagination";


const CustomersPageWithApiPagination = () => {
    //Initialize state customers with empty value
    const [customers, setCustomers] = useState([]);

    //Initialize state total items paginated with value 0, get it after from json API
    const [totalItems, setTotalItems] = useState(0);

    //Initialize state pagination pages with page number 1
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    //when component CustomersPage.jsx load Or currentPage change, effect will be launched through the callback function
    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
            //Get costumers, totalItems loaded data from json Api
            .then(response => {
                setCustomers(response.data["hydra:member"]);
                setTotalItems(response.data["hydra:totalItems"]);
                setLoading(false);
            })
            .catch(error => console.log(error.response));
    }, [currentPage]);

    const handleDelete = (id) => {
        /*
         * Save out customers list, before delete
         * Try to delete customer from DB
         * Remove customer from DOM
         * if Delete == Ok do nothing ifNot display Removed customer on the list
         */
        const originalCustomers = [...customers];

        setCustomers(customers.filter(customer => customer.id !== id));
        axios
            .delete("http://127.0.0.1:8000/api/customers/" + id)
            .then(response => console.log("Costumer is deleted OK!"))
            .catch(error => {
                setCustomers(originalCustomers);
                console.log(error.response);
            });
    };

    const handlePageChange = page => {
        setCurrentPage(page);
        setLoading(true);
    };

    return (
        <>
            <h1>Liste der Kunden (Pagination)</h1>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th>ID.</th>
                    <th>Kunde</th>
                    <th>Email</th>
                    <th>Unternehmen</th>
                    <th className="text-center">Rechnungen</th>
                    <th className="text-center">Gesamtsumme</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {loading && (
                    <tr>
                        <td>Downloading...</td>
                    </tr>
                )}
                {!loading && customers.map(customer => (
                    <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td><a href="#">{customer.firstName}{customer.lastName}</a></td>
                        <td>{customer.email}</td>
                        <td>{customer.company}</td>
                        <td className="text-center">
                            <span className="badge badge-success">
                                {customer.invoices.length}
                            </span>
                        </td>
                        <td className="text-center text-warning font-weight-bold">{customer.totalAmount.toLocaleString('DE')} euro</td>
                        <td>
                            <button
                                onClick={() => handleDelete(customer.id)}
                                disabled={customer.invoices.length > 0} className="btn btn-sm btn-danger"
                            >
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={totalItems}
                onPageChanged={handlePageChange}
            />
        </>
    );
};

export default CustomersPageWithApiPagination;