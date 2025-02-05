require("dotenv").config()

var express = require('express');

var app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI);

const User = require("./models/user.model");
const Expense = require("./models/expense.model");

const cors = require("cors");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require('./utilities');

app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
);

app.get('/', (req, res) =>{
    res.json({ data: 'hello world'})
})

app.post('/register', async (req, res) =>{
    const { username, password, email, full_name } = req.body;
    
    if(!username){
        return res
        .status(400)
        .json({ error: true, message: "Username is required"});
    }

    if(!password){
        return res
        .status(400)
        .json({ error: true, message: "Password is required"});
    }

    if(!email){
        return res
        .status(400)
        .json({ error: true, message: "Email is required"});
    }

    if(!full_name){
        return res
        .status(400)
        .json({ error: true, message: "Full Name is required"});
    }

    const isUser = await User.findOne({ email: email})

    if(isUser){
        return res.json({
            error: true,
            message: "User already exists",
        })
    }

    const user = new User({
        full_name,
        username,
        password,
        email,
    })
    console.log(user);

    await user.save();

    const accessToken = jwt.sign({user}, process.env.ACCESS, {
        expiresIn: "36000m",
    })
    res.json({
        error: false,
        user,
        accessToken,
        message: 'Registration Successfull'
    })
})

app.post('/login', async (req, res) =>{
    const { username, password } = req.body;

    if(!username){
        return res.status(400).json({ message: "Username is required" });
    }

    if(!password){
        return res.status(400).json({ message: "Password is required" });
    }

    const userInfo = await User.findOne({ username: username });

    if(!userInfo){
        return res.status(400).json({ message: "User does not exist" });
    }

    if(userInfo.username == username && userInfo.password == password){
            const user = { user: userInfo };
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "36000m",
            });
    
            return res.json({
                error: false,
                message: "Login Successful",
                username,
                accessToken,
            });
        }else{
            return res.status(400).json({
                error: true,
                message: "Invalid Credentials",
        });
    }
})


app.get('/dashboard', (req, res) =>{
    res.json({ data: 'Hello register Page'})
})

// Add expenses
app.post('/add-expenses', authenticateToken, async(req, res) =>{
    const { expense_name, amount, date, description } = req.body;
    const { user } = req.user;

    if(!expense_name){  
        return res.status(400).json({ message: "Expense name is required" });
    }

    if(!amount){    
        return res.status(400).json({ message: "Amount is required" });
    }

    if (!date) {
        return res.status(400).json({ message: "Date is required" });
    }

    if (!description) { 
        return res.status(400).json({ message: "Description is required" });
    }

    try{
        const expense = new Expense({
            expense_name,
            amount,
            date,
            description,
            userId: user._id,
        });

        await expense.save();

        return res.json({
            error: false,
            expense,
            message: "Expenses added successfully",
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
})

app.put('/update-expenses/:expenseId', authenticateToken, async(req, res) => {
    const expenseId = req.params.expenseId;
    const { expense_name, amount, date, description } = req.body;

    if (!expense_name && !amount && !date && !description) {
        return res.status(400).json({ message: "No changes provided" });
    }

    try {
        console.log("User ID:", req.user._id);
        console.log("Expense ID:", expenseId);

        const expense = await Expense.findOne({ _id: expenseId, user: req.user._id });

        if (!expense) {
            console.log("Expense not found");
            return res.status(400).json({ message: "Expense not found" });
        }

        console.log("Expense found:", expense);

        if (expense_name) expense.expense_name = expense_name;
        if (amount) expense.amount = amount;
        if (date) expense.date = date;
        if (description) expense.description = description;

        await expense.save();

        return res.json({
            error: false,
            expense,
            message: "Expense updated successfully",
        });
    } catch (error) {
        console.error("Error updating expense:", error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
            details: error.message,
        });
    }
});

app.get("/get-expenses/", authenticateToken, async(req, res) =>{

    try{
        const expenses = await Expense.find({ user: req.user._id });
        return res.json({
            error: false,
            expenses,
            message: "All Expenses fetched successfully",
        });
    }catch(error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
})

app.delete('/delete-expense/:expenseId', authenticateToken, async(req, res) =>{
    const expenseId = req.params.expenseId;

    try{
        const expense = await Expense.findOne({ _id: expenseId, user: req.user._id });

        if(!expense){
            return res.status(400).json({ message: "Expense not found" });
        }

        await Expense.deleteOne({ _id: expenseId, user: req.user._id });

        return res.json({
            error: false,
            message: "Expense deleted successfully",
        });
    }catch(error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
})

app.listen(PORT);
console.log('Listening to port 3000');
module.exports = app;