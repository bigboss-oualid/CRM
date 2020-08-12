import axios from "axios";
import {INVOICES_API} from "../config";
import Cache from "./cache";


async function findAll() {
    const cachedInvoices = await Cache.get("invoices");

    if (cachedInvoices) return cachedInvoices;

    return axios
        .get(INVOICES_API)
        //Get invoices data from DB
        .then(response => {
            const invoices = response.data['hydra:member'];
            Cache.set("invoices", invoices);

            return invoices;
        });
}

async function find(id) {
    const cachedInvoice = await Cache.get("invoices." + id);

    if (cachedInvoice) return cachedInvoice;

    return axios
        .get(INVOICES_API + "/" + id)
        .then(response => {
            const invoice = response.data;

            Cache.set("invoices." + id, invoice);

            return invoice;
        });
}

function create(invoice) {
    return axios
        .post(INVOICES_API, {
            ...invoice,
            customer: `/api/customers/${invoice.customer}`
        })
        .then(async response => {
            const cachedInvoices = await Cache.get("invoices");

            if (cachedInvoices) {
                Cache.set("invoices", [response.data, ...cachedInvoices]);
            }

            return response;
        });
}

function update(id, invoice) {
    return axios.put(INVOICES_API + "/" + id, {
        ...invoice,
        customer: `/api/customers/${invoice.customer}`
    })
        .then(async response => {

            const cachedInvoices = await Cache.get("invoices");
            const cachedInvoice = await Cache.get("invoices." + id);

            if (cachedInvoice) Cache.set("invoices." + id, response.data);


            if (cachedInvoices) {
                const index = cachedInvoices.findIndex(i => i.id === +id);
                cachedInvoices[index] = response.data;
            }

            return response;
        });
}

function deleteInvoice(id) {
    return axios
        .delete(INVOICES_API + "/" + id)
        .then(async response => {
            const cachedInvoices = await Cache.get("invoices");

            if (cachedInvoices) {
                Cache.set("invoices", cachedInvoices.filter(i => i.id !== id));
            }

            return response;
        });
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