const cache = {};

function set(key, data) {
    cache[key] = {
        data,
        expiredAt: new Date().getTime() + (15 * 60 * 1000) //Expired in 15mn
    };
}

function get(key) {
    return new Promise(resolve => {
        resolve(cache[key] && cache[key].expiredAt > new Date().getTime() ? cache[key].data : null);
    });
}

export default {
    set,
    get
};