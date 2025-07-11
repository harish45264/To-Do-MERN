//Express
//Calling Express module
const express = require('express');
const mongoose = require('mongoose') 
const cors = require('cors');
//instance of express
const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect('mongodb://localhost:27017/todo-mern')
.then(() => {
    console.log("Connection Successful");
})
.catch((err) => {
    console.log(err);
})

//creating schema
const todoSchema = new mongoose.Schema({
    title : {
        required: true,
        type: String
    },
    description : String
})

//creating model

const todoModel = mongoose.model('Todo', todoSchema);

let list = [];

//post method adding new resource
app.post('/tasks', async (req, res) => {
    const {title, description} = req.body;
    try {
        const newTodo = new todoModel({title, description});
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({message : error.message});
        }
    })
    //get method showing tasks
    app.get('/tasks', async (req, res) => {
        try {
            const todos = await todoModel.find();
            res.status(201).json(todos);
        } catch (error) {
            console.log(error);
            res.status(500).json({message : error.message});
        }
    })
    //put request
    app.put('/tasks/:id', async (req, res) => {
        try {
            const {title, description} = req.body;
            const id = req.params.id;
            const updatedTodo = await todoModel.findByIdAndUpdate(
                id,
                {title, description},
                {new: true}
            );
            if(!updatedTodo){
                return res.status(404).json({message: "todo Id Not found"});
            }
            res.json(updatedTodo);
        } catch (error) {
            console.log(error);
            res.status(500).json({message: error.message});
        }
    })
    // delete item
    app.delete('/tasks/:id', async (req, res) => {
        try {
            const id = req.params.id;
            await todoModel.findByIdAndDelete(id);
            res.status(204).end();
        } catch (error) {
            console.log(error);
            res.status(500).json({message : error.message});
        }
    })
    //Port
    const port = 8000;
    app.listen(port, () => {
        console.log('Listening to port ' + port);
    })