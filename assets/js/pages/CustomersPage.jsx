import React, {useEffect, useState} from 'react';
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/customersAPI.js";


const CustomersPage = () => {
    //Initialize state customers with empty value
    const [customers, setCustomers] = useState([]);
    //Initialize state pagination pages with page number 1
    const [currentPage, setCurrentPage] = useState(1);
    //Initialize state search with page empty string
    const [search, setSearch] = useState("");
    //Get customers
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
        } catch (error) {
            console.log(error.response);
        }
    };
    //By component loading, effect will be launched through the callback function
    useEffect(() => {
        fetchCustomers();
    }, []);

    /*
    *Other way to make promesses instate of fetchCustomers()
    useEffect(() => {
        CustomersAPI.delete(id)
        CustomersAPI.findAll()
            //Save received data customers in State
            .then(data => setCustomers(data))
            .catch(error => console.log(error.response));

    }, []);
    */
    //Manage deleting a customer
    /*
     * Save out customers list, before delete
     * Try to delete customer from DB
     * Remove customer from DOM
     * if Delete == Ok do nothing ifNot display Removed customer on the list
     */
    const handleDelete = async id => {

        const originalCustomers = [...customers];
        // Remove deleted customer from list
        setCustomers(customers.filter(customer => customer.id !== id));

        try {
            await CustomersAPI.delete(id);
        } catch (error) {
            console.log(error.response);
            setCustomers(originalCustomers);
        }

        /*  Other way to make promesses, don'T forget to remove 'async' from const handleDelete
        CustomersAPI.delete(id)
            .then(response => console.log("Costumer is deleted OK!"))
            .catch(error => {
                setCustomers(originalCustomers);
                console.log(error.response);
            });
         */
    };
    //Manage change page
    const handlePageChange = page => setCurrentPage(page);
    //Mange Search
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    const itemsPerPage = 10;
    // Filter customers based on search
    const filteredCustomers = customers.filter(
        c =>
            c.firstName.toLowerCase().includes(search.toLowerCase()) ||
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    );
    //Data pagination
    const paginatedCustomers = Pagination.getPaginatedData(
        filteredCustomers,
        currentPage,
        itemsPerPage
    );

    return (
        <>
            <h1>Liste der Kunden</h1>

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control"
                       placeholder="Suchen..."/>
            </div>

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
                {paginatedCustomers.map(customer => (
                    <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td><a href="#">{customer.firstName} {customer.lastName}</a></td>
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
                                Löschen
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {itemsPerPage < filteredCustomers.length && <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={filteredCustomers.length}
                onPageChanged={handlePageChange}
            />}
        </>
    );
};

export default CustomersPage;