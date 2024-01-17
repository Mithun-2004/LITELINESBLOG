import Post from '../post';
import {useEffect, useState} from 'react';

const IndexPage = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        try{
            fetch(process.env.REACT_APP_API+'/post').then(response => {
                response.json().then(data => {
                    if (data.success){
                        setPosts(data.message);
                    }else{
                        alert(data.message);
                    } 
                });
            });
        }
        catch (err){
            console.log(err);
            alert("Error occured.");
        }
        
    }, [])

    return ( 
        <div className="posts">
            {posts.length > 0 && (posts.map((post, index) => {
                return <Post {...post} key={index} />
            }))}
            {posts.length <= 0 && (
                <p>Loading...</p>
            )}
        </div>
     );
}
 
export default IndexPage;