import {useState} from 'react';
import {Navigate} from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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



const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [createInfo, setCreateInfo] = useState("");

    const createNewPost = async (e) => {
        const info = new FormData();
        info.set('title', title);
        info.set('summary', summary);
        info.set('content', content);
        info.set('file', files[0]);
        e.preventDefault();
        setCreateInfo("Loading...")
        try{
            const response = await fetch(process.env.REACT_APP_API+'/post', {
                method: 'POST',
                body: info,
                credentials: 'include'
            })

            const data = await response.json();

            if (data.success){
                setRedirect(true);
                setCreateInfo('');
            }else{
                setCreateInfo(data.message);
            }
        }
        catch (err){
            console.log(err);
            setCreateInfo("Error occured");
        }
        
    }

    if (redirect){
        return <Navigate to={"/"} />
    }

    return ( 
        <form className="create-form" onSubmit={createNewPost}>
            <h1>Create Post</h1>
            <div className="create-inputs"><input type="text" placeholder="Title" id="create-title" value={title} onChange={(e) => setTitle(e.target.value)} required/></div>
            <div className="create-inputs"><input type="text" placeholder="Summary" id="create-summary" value={summary} onChange={(e) => setSummary(e.target.value)} /></div>
            <div className="create-inputs"><input type="file" id="create-file" onChange={e => setFiles(e.target.files)}/></div>
            <ReactQuill modules={modules} formats={formats} theme="snow" value={content} onChange={setContent}/>
            <div className="create-inputs"><button type="submit" id="create-btn">Create</button></div>
            <p class="error-info">{createInfo}</p>
        </form>
     );
}
 
export default CreatePost;