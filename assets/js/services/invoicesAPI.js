import axios from "axios";

function findAll() {
    return axios
        .get("http://127.0.0.1:8000/api/invoices")
        //Get invoices data from DB
        .then(response => response.data['hydra:member']);
}

function deleteInvoice(id) {
    axios.delete("http://127.0.0.1:8000/api/invoices/" + id);
}

//when I export these file i create an object with property findAll, that present my function findAll()
export default {
    //if we export the function in property with function name give only => functionName
    findAll,
    // if we changed the name of function in property we must give => key: functionName
    delete: deleteInvoice
};