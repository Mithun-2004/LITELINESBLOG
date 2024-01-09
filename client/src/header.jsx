import { useEffect, useContext, useState } from 'react';
import {Link} from 'react-router-dom';
import {UserContext} from './UserContext';

const Header = () => {
  const {setUserInfo, userInfo} = useContext(UserContext);
    useEffect(() => {
      try{
        fetch(process.env.REACT_APP_API, 'profile', {
          credentials:'include',
        }).then( response => {
          response.json().then(data => {
            if (data.success){
              setUserInfo(data.message);
            }
          })
          .catch(err => console.log(err));
        })
      }
      catch (err){
        console.log(err);
      }
      

    }, [])

    function logout(){
      try{
        fetch(process.env.REACT_APP_API+'logout', {
        credentials : 'include',
        method : 'POST'
        });
        setUserInfo({id: null, userName:''});
      }
      catch (err){
        console.log(err);
        alert("Error occured while logging out");
      }
      
    }

    const userName = userInfo?.userName;

    return ( 
    <header>
      <div className="nav">
        <h1 className="logo"><Link to="/">Lite Lines</Link></h1>
        <div className="enter-links">
          {userName && (
            <>
              <Link id="create-link" to="/create">Create new post</Link>
              <button id="logout-btn" onClick={logout}>Logout</button>
            </>
          )}
          {!userName && (
            <>
              <Link to="/login" className="enter-link">Login</Link>
              <Link to="/register" className="enter-link">Register</Link>
            </>
          )}
          
        </div>
      </div>
      <div className="info">
        <div className="info-text">
        <h1>Welcome to Lite Lines Blog</h1>
        <p>Your Gateway to Insightful Narratives and Engaging Perspectives. Explore a diverse tapestry of stories,
        ideas, and expertise that make our blog a vibrant community of knowledge and inspiration.</p>
        </div>
      </div>
    </header>
     );
}
 
export default Header;