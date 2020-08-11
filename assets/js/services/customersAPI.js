import axios from "axios";

function findAll() {
    return axios
        .get("http://127.0.0.1:8000/api/customers")
        //Get costumers data from DB
        .then(response => response.data['hydra:member']);
}

function find(id) {
    return axios
        .get("http://localhost:8000/api/customers/" + id)
        .then(response => response.data);
}

function deleteCustomer(id) {
    axios.delete("http://127.0.0.1:8000/api/customers/" + id);
}

function update(id, customer) {
    return axios.put(
        "http://localhost:8000/api/customers/" + id, customer
    );
}

function create(customer) {
    return axios.post("http://localhost:8000/api/customers", customer);
}

//when I export these file i create an object with property findAll, that present my function findAll()
export default {
    //if we export the function in property with function name give only => functionName
    findAll,
    find,
    update,
    create,
    // if we changed the name of function in property we must give => key: functionName
    delete: deleteCustomer
};