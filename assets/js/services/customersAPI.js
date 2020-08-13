import axios from "axios";
import {CUSTOMERS_API} from "../config";
import Cache from "./cache";


async function findAll() {
    const cachedCustomers = await Cache.get("customers");

    if (cachedCustomers) return cachedCustomers;

    return axios
        .get(CUSTOMERS_API)
        //Get costumers data from DB
        .then(response => {
            const customers = response.data['hydra:member'];
            Cache.set("customers", customers);

            return customers;
        });
}

async function find(id) {
    const cachedCustomer = await Cache.get("customers." + id);

    if (cachedCustomer) return cachedCustomer;

    return axios
        .get(CUSTOMERS_API + "/" + id)
        .then(response => {
            const customer = response.data;

            Cache.set("customers." + id, customer);

            return customer;
        });
}

function deleteCustomer(id) {
    return axios
        .delete(CUSTOMERS_API + "/" + id)
        .then(async response => {
            const cachedCustomers = await Cache.get("customers");

            if (cachedCustomers) {
                //Remove deleted customer from cache
                Cache.set("customers", cachedCustomers.filter(c => c.id !== id));
            }

            return response;
        });
}

function update(id, customer) {
    return axios
        .put(CUSTOMERS_API + "/" + id, customer)
        .then(async response => {
            const cachedCustomers = await Cache.get("customers");
            const cachedCustomer = await Cache.get("customers." + id);

            if (cachedCustomer) Cache.set("customers." + id, response.data);

            if (cachedCustomers) {
                //Search in cache the index of modified Customer & give him the new values
                const index = cachedCustomers.findIndex(c => c.id === +id);
                cachedCustomers[index] = response.data;
            }

            return response;
        });
}

function create(customer) {
    return axios
        .post(CUSTOMERS_API, customer)
        .then(async response => {
            const cachedCustomers = await Cache.get("customers");

            if (cachedCustomers) {
                //Get from Cache customers list & add the new created customer in the beginning of list
                Cache.set("customers", [response.data, ...cachedCustomers]);
            }

            return response;
        });
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