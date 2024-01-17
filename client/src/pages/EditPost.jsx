import {useState} from 'react';
import {Navigate, useParams} from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect } from 'react';

const EditPost = () => {
    const modules = {
        toolbar: [
            [{'header': [1, 2, false]}], 
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list':'ordered'}, {'list':'bullet'}, {'indent' : '+1'}],
            ['link', 'image'],
            ['clean']
        ]
    };
    
    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [cover, setCover] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [editInfo, setEditInfo] = useState('');

    useEffect(() => {
        fetch(process.env.REACT_APP_API+"/post/"+id)
        .then(response => {
            response.json().then(data => {
                if (data.success){
                    const postInfo = data.message;
                    setTitle(postInfo.title);
                    setContent(postInfo.content);
                    setSummary(postInfo.summary);
                }
            })
        })
    }, [])

    async function updatePost(e){
        e.preventDefault();
        setEditInfo('Loading...');
        const info = new FormData();
        info.set('title', title);
        info.set('summary', summary);
        info.set('content', content);
        info.set('id', id);
        if (files?.[0]){
            info.set('file', files?.[0])
        }
        info.set('file', files?.[0]);

        try{
            const response = await fetch(process.env.REACT_APP_API+'/post', {
                method: 'PUT',
                body: info,
                credentials:'include'
            });
            const data = await response.json();

            if (data.success){
                setRedirect(true);
                setEditInfo('');
            }
            else{
                setEditInfo(data.message);
            }
        }
        catch (err) {
            console.log(err);
            setEditInfo("Error occured");
        }
        
    }

     if (redirect){
        return <Navigate to={"/post/"+id} />
    }

    return ( 
        <form className="create-form" onSubmit={updatePost}>
            <h1>Edit Post</h1>
            <div className="create-inputs"><input type="text" placeholder="Title" id="create-title" value={title} onChange={(e) => setTitle(e.target.value)} required/></div>
            <div className="create-inputs"><input type="text" placeholder="Summary" id="create-summary" value={summary} onChange={(e) => setSummary(e.target.value)} /></div>
            <div className="create-inputs"><input type="file" id="create-file" onChange={e => setFiles(e.target.files)}/></div>
            <ReactQuill modules={modules} formats={formats} theme="snow" value={content} onChange={setContent}/>
            <div className="create-inputs"><button type="submit" id="create-btn">Update</button></div>
            <p className="error-info">{editInfo}</p>
        </form>
     );
}
 
export default EditPost;