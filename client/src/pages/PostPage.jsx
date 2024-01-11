import {useEffect, useState, useContext} from 'react';
import {useParams, Link} from 'react-router-dom';
import {formatISO9075} from 'date-fns';
import {UserContext} from '../UserContext';
import { HiMiniPencilSquare } from "react-icons/hi2";

const PostPage = () => {
    const {id} = useParams();
    const [postInfo, setPostInfo] = useState(null);
    const {userInfo} = useContext(UserContext);

    useEffect(() => {
        try{
            if (id){
                fetch(process.env.REACT_APP_API+`/post/${id}`)
                .then(response => response.json().then(data => {
                    if (data.success){
                        const info = data.message;
                        setPostInfo(info);
                    }else{
                        alert(data.message);
                    } 
                }))
            } 
        }
        catch (err){
            console.log(err);
        }
        
    }, [])

    if (!postInfo) return '';

    return ( 
        <div className="single-post">
            <h1 className="single-post-title">{postInfo.title}</h1>
            <p className="single-post-time">{formatISO9075(new Date(postInfo.createdAt))}</p>
            <p className="single-post-info">by <span className="single-post-author">{postInfo.author.userName}</span></p>
            {userInfo.id === postInfo.author._id && (
                <div className="edit-row">
                    <Link to={`/edit/${postInfo._id}`} className="edit-btn"><span><HiMiniPencilSquare /></span><span>Edit this post</span></Link>
                    
                </div>
            )}
            <div className="single-post-image">
                <img src={process.env.REACT_APP_API+`/${postInfo.cover}`} alt="" />
            </div>
            <div className="single-post-content" dangerouslySetInnerHTML={{__html:postInfo.content}}></div>
        </div>
     );
}
 
export default PostPage;