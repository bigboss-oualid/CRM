import React from 'react';


//Create context for our App
/*the function creatContext() take als params a object that has the form of our information, wich will be passed all our components in App if we need
 */
export default React.createContext({
    isAuthenticated: false,
    setIsAuthenticated: (value) => {
    }
});