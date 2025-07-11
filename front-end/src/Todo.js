import { useEffect, useState } from "react"

export default function Todo(){
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const apiUrl = "http://localhost:8000";
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);

    const handleSubmit = () => {
        //check inputs
        setError("");
        if(title.trim() !== "" && description.trim() !== ""){
            fetch(apiUrl + "/tasks", {
                method: "POST",
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({title, description})
            }).then((res) => {
                if(res.ok){
                    //add item
                    setTodos([...todos, {title, description}])
                    setTitle("");
                    setDescription("");
                    setMessage("Item Added Succesfully");
                    setTimeout(() => {
                        setMessage("")
                    }, 3000);
                }
                else{
                    //set Error
                    setError("Unable to Create Task");
                }
            }).catch(() => {
                setError("Unable To Create Todo")
            })
        }
    }

    useEffect(() => {
        getItems()
    }, [])

    const getItems = () => {
        fetch(apiUrl + "/tasks")
        .then((res) => res.json())
        .then((res) => {
            setTodos(res)
        })
    }

    const handleEdit = (item) => {
        setEditId(item._id); 
        setEditTitle(item.title); 
        setEditDescription(item.description)
    }

    const handleUpdate = () =>{
        setError("");
        if(editTitle.trim() !== "" && editDescription.trim() !== ""){
            fetch(apiUrl + "/tasks/"+editId, {
                method: "PUT",
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({editTitle, editDescription})
            }).then((res) => {
                if(res.ok){
                    //update item
                    const updatedTodos = todos.map((item) => {
                        if(item._id == editId){
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;
                    })

                    setTodos(updatedTodos)
                    setEditDescription("");
                    setEditTitle("");
                    setMessage("Item Updated Succesfully");
                    setTimeout(() => {
                        setMessage("")
                    }, 3000)

                    setEditId(-1);
                }
                else{
                    //set Error
                    setError("Unable to Create Task");
                }
            }).catch(() => {
                setError("Unable To Create Todo")
            })
        }
    }

    const handleEditCancel = () => {
        setEditId(-1);
    } 

    const handleDelete = (id) => {
        if(window.confirm('Are you sure want to delete?')){
            fetch(apiUrl+"/tasks"+id, {
                method: "DELETE"
            }).then(() => {
                const updatedTodos = todos.filter((item) => item._id !== id)
                setTodos(updatedTodos);
            })
        }
    }

    return <>
    <div className="row p-3 bg-success text-light"> 
        Todo Project Using MERN Stack 
    </div>
    <div className="row">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2">
            <input className="form-control" onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder="Title" />
            <input className="form-control" onChange={(e) => setDescription(e.target.value)} value={description} type="text" placeholder="Description" />
            <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
        </div>
        {error && <p className="text-danger">{error}</p>}
    </div>
    <div className="row mt-3">
        <h3>Tasks</h3>
        <div className="col-md-6">
            <ul className="list-group">
                {
                    todos.map((item) => 
                        <li className="list-group-item bg-info d-flex justify-content-between align-items-centre my-2">
                        <div className="d-flex flex-column me-2">
                        {
                            editId === -1 || editId !== item._id ? <>
                                <span className="fw-bold">{item.title}</span>
                                <span>{item.description}</span>
                            </>: <>
                                <div className="form-group d-flex gap-2">
                                    <input className="form-control" onChange={(e) => setEditTitle(e.target.value)} value={editTitle} type="text" placeholder="Title" />
                                    <input className="form-control" onChange={(e) => setEditDescription(e.target.value)} value={editDescription} type="text" placeholder="Description" />
                                </div>
                            </>
                        }
                    </div>
                    <div className="d-flex gap-2">
                        {editId == -1 ?  <button className="btn btn-warning" onClick = {() => handleEdit(item) } >Edit</button> : <button className = "btn btn-warning" onClick={handleUpdate}>Update</button>}
                        {editId == -1 ? <button className="btn btn-danger" onClick={handleDelete(item._id)}>Delete</button> :
                        <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>}
                    </div>
                </li>
                    )
                }
            </ul>
        </div>
    </div>
    </>
}