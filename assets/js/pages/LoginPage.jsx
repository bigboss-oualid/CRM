import React, {useContext, useState} from 'react';
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
                <div className="form-group">
                    <label htmlFor="username">E-Mail-Adresse</label>
                    <input
                        onChange={handleChange}
                        value={credentials.username}
                        id="username"
                        type="email"
                        placeholder="E-mail Adresse"
                        name="username"
                        className={"form-control " + (error && " is-invalid")}
                    />
                    {error && <p className="invalid-feedback">{error}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Passwort</label>
                    <input
                        onChange={handleChange}
                        value={credentials.password}
                        id="password"
                        type="password"
                        placeholder="Passwort"
                        name="password"
                        className={"form-control " + (error && " is-invalid")}
                    />
                </div>
                <div className="form-group">
                    <button className="btn btn-success">Einloggen</button>
                </div>
            </form>
        </>
    );
};

export default LoginPage;