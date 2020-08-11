import React, {useContext, useState} from 'react';
import Field from "../components/forms/Field";
import AuthContext from "../contexts/AuthContext";
import AuthAPI from "../services/authAPI";


const LoginPage = ({history}) => {

    const {setIsAuthenticated} = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState("");

    // Mange input fields
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        //const value = currentTarget.value;
        //const name = currentTarget.name;

        //Get the last values of credentials(username & password) and then overwrite them by doing[name]: value (ex: username: "test@mail.com")
        setCredentials({...credentials, [name]: value});
    };

    // Manage submit
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            history.replace("/customers");
        } catch (error) {
            setError("Es gibt kein Konto mit dieser Adresse oder die Informationen stimmen nicht überein");
        }
    };
    return (
        <>
            <h1>Einloggen</h1>
            <form onSubmit={handleSubmit}>
                <Field
                    label="E-Mail Adresse"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    type="email" error={error}
                />

                <Field
                    label="Passwort"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    type="password" error=""
                />

                <div className="form-group">
                    <button className="btn btn-success">Einloggen</button>
                </div>
            </form>
        </>
    );
};

export default LoginPage;