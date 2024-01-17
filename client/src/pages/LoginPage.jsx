import {useState, useContext} from 'react';
import {Link, Navigate} from 'react-router-dom';
import {UserContext} from '../UserContext';

const LoginPage = () => {
    const [loginName, setLoginName] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginInfo, setLoginInfo] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);

    const login = async(e) => {
        e.preventDefault();
        setLoginInfo('Loading...');
        try{
            const response = await fetch(process.env.REACT_APP_API+"/login", {
                method: 'POST',
                body: JSON.stringify({userName: loginName, password: loginPassword}),
                headers: {'Content-type' : 'application/json'},
                credentials: 'include',
            })
            const data = await response.json();
            
            if (data.success === true){
                setUserInfo(data.message);
                setRedirect(true);
                setLoginName("");
                setLoginPassword("");
                setLoginInfo("");
            }else{
                console.log(data.message);
                setLoginInfo(data.message);
            }
        }
        catch (err){
            console.log(err);
            setLoginInfo("Error occured.");
        }
        
    }

    if (redirect){
        return <Navigate to={'/'} />
    }

    return ( 
        <form className="login-form" onSubmit={login}>
            <h1>Login</h1>
            <div>
                <label htmlFor="login-username">UserName</label>
                <input type="text" name="login-username" id="login-username" placeholder="Enter Username" value={loginName} onChange={(e) => {setLoginName(e.target.value)}} required/>
            </div>
            <div>
                <label htmlFor="login-password">Password</label>
                <input type="password" name="login-password" id="login-password" placeholder="Enter Password" value={loginPassword} onChange={(e) => {setLoginPassword(e.target.value)}} required/>
            </div>
            <div className="login-buttons">
                <button id="login-btn" type="submit">Login</button>
                <button id="login-reset" onClick={(e) => {e.preventDefault(); setLoginName(""); setLoginPassword("")}}>Reset</button>
            </div>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
            <p className="error-info">{loginInfo}</p>
        </form>
     );
}
 
export default LoginPage;