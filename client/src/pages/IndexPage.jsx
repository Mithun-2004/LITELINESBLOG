import Post from '../post';
import {useEffect, useState} from 'react';

const IndexPage = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        try{
            fetch('http://localhost:4000/post').then(response => {
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
                <p>No posts to display.</p>
            )}
        </div>
     );
}
 
export default IndexPage;