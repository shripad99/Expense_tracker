import React, { useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import axiosInstance from '../utils/axiosInstance';

const AddExpense = ({ type, expenseData, onClose, getAllExpenses }) => {
    const [expense_name, setExpenseName] = useState(expenseData?.expense_name || "");
    const [amount, setAmount] = useState(expenseData?.amount || "");
    const [date, setDate] = useState(expenseData?.date || "");
    const [description, setDescription] = useState(expenseData?.description || "");
    const [error, setError] = useState(null);

    useEffect(() => {
        if (expenseData) {
            setExpenseName(expenseData.expense_name || "");
            setAmount(expenseData.amount || "");
            setDate(expenseData.date ? new Date(expenseData.date).toISOString().split('T')[0] : "");
            setDescription(expenseData.description || "");
        }
    }, [expenseData]);

    const addExpense = async () => {
        try {
            const response = await axiosInstance.post('/add-expenses', {  // Ensure correct API endpoint
                expense_name,
                amount,
                date,
                description,
            });

            console.log("Expense Added:", response.data);

            if (response.data && response.data.expense) {
                getAllExpenses();
                onClose();
            }
        } catch (error) {
            console.error("Error Adding Expense:", error);
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            }
        }
    };

   
    const editExpense = async () => {
        if (!expenseData?._id) {
            setError("Invalid Expense ID");
            return;
        }
        const expenseId = expenseData._id;

        try {
            const response = await axiosInstance.put(`/update-expenses/${expenseId}`, {
                expense_name,
                amount,
                date,
                description,
            });

            console.log("Expense Updated:", response.data);

            if (response.data && response.data.expense) {
                getAllExpenses();
                onClose();
            }
        } catch (error) {
            console.error("Error Updating Expense:", error);
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            }
        }
    };

    const handleAddExpense = () => {
        if (!expense_name) {
            setError("Please enter the expense name");
            return;
        }
        if (!amount) {
            setError("Please enter the amount");
            return;
        }
        if (!date) {
            setError("Please enter the date");
            return;
        }
        if (!description) {
            setError("Please enter the description");
            return;
        }

        setError("");

        

        if (type === 'edit') {
            editExpense();
        } else {
            addExpense();
        }
    };

    return (
        <div className='relative'>
            <button className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-7 -right-3' onClick={onClose}>
                <IoMdClose className='text-xl text-slate-400' />
            </button>
            <div className='flex flex-col gap-2'>
                <label className='input-label'>Expense Name</label>
                <input type='text' className='text-sm text-slate-900 outline-none bg-slate-50 p-2 rounded border' placeholder='Name' value={expense_name} onChange={(e) => setExpenseName(e.target.value)} />
            </div>
            <div className='flex flex-col gap-2 mt-4'>
                <label className='input-label'>Amount</label>
                <input type='number' className='text-sm text-slate-900 outline-none bg-slate-50 p-2 rounded border' placeholder='Amount' value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className='flex flex-col gap-2 mt-4'>
                <label className='input-label'>Date</label>
                <input type='date' className='text-sm text-slate-900 outline-none bg-slate-50 p-2 rounded border' value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className='flex flex-col gap-2 mt-4'>
                <label className='input-label'>Description</label>
                <textarea className='text-sm text-slate-900 outline-none bg-slate-50 p-2 rounded border' placeholder='Description' rows={6} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}
            <button className='bg-green-500 text-white font-medium mt-5 p-3 rounded w-full' onClick={handleAddExpense}>
                {type === 'edit' ? 'UPDATE' : 'ADD'}
            </button>
        </div>
    );
};

export default AddExpense;
