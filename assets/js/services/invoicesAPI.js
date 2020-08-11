import axios from "axios";

function findAll() {
    return axios
        .get("http://127.0.0.1:8000/api/invoices")
        //Get invoices data from DB
        .then(response => response.data['hydra:member']);
}

function find(id) {
    return axios.get("http://localhost:8000/api/invoices/" + id).then(response => response.data);
}

function create(invoice) {
    return axios.post("http://localhost:8000/api/invoices", {
        ...invoice,
        customer: `/api/customers/${invoice.customer}`
    });
}

function update(id, invoice) {
    return axios.put("http://localhost:8000/api/invoices/" + id, {
        ...invoice,
        customer: `/api/customers/${invoice.customer}`
    });
}

function deleteInvoice(id) {
    axios.delete("http://127.0.0.1:8000/api/invoices/" + id);
}

//when I export these file i create an object with property findAll, that present my function findAll()
export default {
    //if we export the function in property with function name give only => functionName
    findAll,
    find,
    create,
    update,
    // if we changed the name of function in property we must give => key: functionName
    delete: deleteInvoice
};