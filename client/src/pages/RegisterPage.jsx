import {useState, useContext} from 'react';
import {Link, Navigate} from 'react-router-dom';
import {UserContext} from '../UserContext';

const RegisterPage = () => {
    const [registerName, setRegisterName] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [registerInfo, setRegisterInfo] = useState('');
    const {setUserInfo} = useContext(UserContext);

    const register = async (e) => {
        e.preventDefault();
        setRegisterInfo("Loading...");
        try{
            const response = await fetch(process.env.REACT_APP_API+"/register", {
                method: 'POST',
                body: JSON.stringify({userName: registerName, password: registerPassword}),
                headers: {'Content-Type':'application/json'}, 
                credentials: 'include'
            })
            const data = await response.json();
            if (data.success === true){
                setUserInfo(data.message);
                setRedirect(true);
                setRegisterName("");
                setRegisterPassword("");
                setRegisterInfo("");
            }else{
                setRegisterInfo(data.message);
            }
        }
        catch (err){
            console.log(err);
            setRegisterInfo("Error occured.");
        }
    }

    if (redirect){
        return <Navigate to={'/'} />
    }

    return ( 
        <form className="register-form" onSubmit={register}>
            <h1>Register</h1>
            <div>
                <label htmlFor="register-username">UserName</label>
                <input type="text" id="register-username" placeholder="Enter Username" value={registerName} onChange={(e) => {setRegisterName(e.target.value)}} />
            </div>
            <div>
                <label htmlFor="register-password">Password</label>
                <input type="password" id="register-password" placeholder="Enter Password" value={registerPassword} onChange={(e) => {setRegisterPassword(e.target.value)}} />
            </div>
            <div className="register-buttons">
                <button id="register-btn" type="submit">Register</button>
                <button id="register-reset" onClick={(e) => {e.preventDefault(); setRegisterName(""); setRegisterPassword("")}}>Reset</button>
            </div>
            <p>Already have an account? <Link to="/login">Login</Link></p>
            <p className="error-info">{registerInfo}</p>
        </form>
     );
}
 
export default RegisterPage;