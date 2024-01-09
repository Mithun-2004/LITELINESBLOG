import {Link} from 'react-router-dom';
import { FaAngleDoubleRight } from "react-icons/fa";

const Post = ({title, summary, cover, content, author, createdAt, _id}) => {
    return (
          <div className="post">
             {/* <Link to={`/post/${_id}`} className="single-post-link">  */}
              <div className="image"><img src={'http://localhost:4000/'+cover} alt="blog-img" className="post-img"/></div>
              {/* </Link> */}
              <div className="post-info">
              <p className="post-author">{author.userName}</p>
              <h1 className="post-title">{title}</h1> 
                <p className="post-summary">{summary}</p>
              </div>
              <div className="read-more-btn"><Link to={`/post/${_id}`} className="single-post-link">READ MORE<FaAngleDoubleRight /></Link></div>
            </div>
     );
}
 
export default Post;