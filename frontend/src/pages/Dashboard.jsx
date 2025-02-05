import React, {useState, useEffect} from 'react';
import AddExpense from './AddExpense';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance';
import { MdDelete } from "react-icons/md";
import { MdEdit } from 'react-icons/md';

const Dashboard = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown:false,
    type: 'add',
    data: null,
  });

  Modal.setAppElement('#root'); 

  const [allExpenses, setAllExpenses] = useState([]);

  const navigate = useNavigate();

  const getAllExpenses = async () => {
    try{
      const response = await axiosInstance.get('/get-expenses');
      setAllExpenses(response.data.expenses);
    }catch(error){
      console.log(error);
    }
  }

  const deleteExpense = async (expenseId) => {
        try{
            const response = await axiosInstance.delete(`/delete-expense/${expenseId}`);
            if(response.data && response.data.message){
                getAllExpenses();
            }
        }catch(error){
          console.error("Error Deleting Expense:", error);
        }
    }

  useEffect(() => {
    getAllExpenses();
  }, []);

  return (
    <div className='bg-gray-100 h-screen m-auto pt-10'>
      <div className='bg-white w-full max-w-4xl mx-auto p-10 shadow-lg rounded'> 
        <h1 className='text-center text-2xl'>Welcome to Expense Tracker</h1>
        <div>
          <div className='flex justify-center mt-10 gap-5'>
            <button className='btn text-green-500 border border-green-400 px-4 py-2' onClick={() => setOpenAddEditModal({isShown:true, type: 'add', data: null})}>Add Expense</button>
            <button className='btn text-green-500 border border-green-400 px-4 py-2'>View Expenses</button>
          </div>
        </div>
        <div className='mt-5'>
          <h1 className='text-gray-500 text-xl'>Transactions</h1>
          {allExpenses.length > 0 ? (
            allExpenses.map((expense, index) => (
              <li key={expense._id} className='flex justify-between border items-center border-gray-200 py-4 px-3 rounded bg-[#f3f4f6] mt-3 shadow-md'>
                <span className='text-green-600'>{expense.expense_name}</span>
                <span>{expense.amount}</span>
                {/* <span>{new Date(expense.date).toLocaleDateString('en-GB')}</span> */}
                <p className='text-2xl flex gap-2'>
                  <MdDelete onClick={() => deleteExpense(expense._id)}/>
                  <MdEdit onClick={() => setOpenAddEditModal({isShown:true, type: 'edit', data: expense})}/>
                </p>
              </li>
            ))
          ) : (
            <p className='text-center text-gray-400 mt-5'>No expenses found </p>  
            )
          }
        </div>
        <Modal isOpen={openAddEditModal.isShown} onRequestClose={()=>setOpenAddEditModal({isShown: false, type: 'add', data: null})} style={{overlay: {backgroundColor:"rgba(0,0,0,0.2)",},}} contentLabel="" className="w-[60%] max-h-3/4 bg-white rounded-md mx-auto mt-14 px-5 py-9 shadow-lg">
          <AddExpense type={openAddEditModal.type} expenseData={openAddEditModal.data} onClose={() => {setOpenAddEditModal({ isShown: false, type: 'add', data: null})}} getAllExpenses={getAllExpenses}/>
        </Modal>
      </div>
    </div>
  )
}

export default Dashboard