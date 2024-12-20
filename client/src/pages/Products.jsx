import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
uuidv4();

const Products = () => {
      const [inventory, setInventory] = useState([]);
      const [form, setForm] = useState({name: "", room: '', category: ''});
      const [currentId, setCurrentId] = useState(null);
      const [isEditing, setIsEditing] = useState(false);
      const [searchTerm, setSearhTerm] = useState("");

      // Handle Search Input
      const handleSearchChange =(e)=>{
            setSearhTerm(e.target.value)
      }

      // Handle Input Changes
      const handleInputChange = (e) => {
            const { name, value } = e.target; // Extract the name and value
            setForm({ ...form, [name]: value }); // Update state dynamically
      };

      //Clear  the form
      const ClearForm =()=>{
            setForm({name: '', room: '', category: ''});
      };

      //Add New Item
      const addItem=()=>{
            const newItem ={id: uuidv4(), ...form};
            setInventory([...inventory, newItem]);
            ClearForm()
      }

      //Update Item
      const updateItem=()=>{
            setInventory(inventory.map((item)=>item.id === currentId ? {...item, ...form}: item));
            ClearForm();
            setIsEditing(false);
            setCurrentId(null);
      }

      //Edit Item
      const editItem=(id)=>{
            const itemtoEdit = inventory.find((item)=> item.id === id);
            setForm({name: itemtoEdit.name, room: itemtoEdit.room, category: itemtoEdit.category});
            setIsEditing(false);
            setCurrentId(id);
      }

      //Delete item
      const deleteItem=(id)=>{
            setInventory(inventory.filter((item)=> item.id !== id));
      };

      const filteredInventory =  inventory.length> 0 ? inventory.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) : inventory ;

  return (
    <div className='w-3/5 flex h-screen justify-center  flex-col px-3 my-5 '>
            <h2 className='text-center text-2xl font-bold '>Products Inventory</h2>

            {/* Search Bar Item */}
      
            <div className='w-full flex justify-center mt-12 '>
                  <input type="text" value={searchTerm} name='search' placeholder='Search...' onChange={handleSearchChange} className='border w-full h-12 rounded-full placeholder:text-lg pl-5'/>
            </div>

            {/* Product Form  */}
            <div className='flex justify-center items-center flex-col gap-3 my-10'>

                  {/* Name */}
                  <div className='flex flex-col w-full '>
                        <label className='text-lg pl-1 mb-1 '>Name</label>
                        <input type="text" placeholder='Enter Name' name='name'  value={form.name} onChange={handleInputChange} className='border w-full h-12 rounded-xl pl-3 placeholder:text-lg capitalize  focus:outline-green-300 '/>
                  </div>

                  {/* Room  */}
                  <div className='flex flex-col w-full '>
                        <label className='text-lg pl-1 mb-1 '>Room</label>
                        <input type="text" placeholder='Enter Room' value={form.room} name='room' onChange={handleInputChange} className='border w-full h-12 rounded-xl pl-3 placeholder:text-lg capitalize  focus:outline-green-300 ' />
                  </div>

                  {/* Category */}
                  <div className='flex flex-col w-full '>
                        <label className='text-lg pl-1 mb-1 '>Category</label>
                        <input type="text" placeholder='Enter Category' value={form.category} name='category' onChange={handleInputChange} className='border w-full h-12 rounded-xl pl-3 placeholder:text-lg capitalize  focus:outline-green-300 ' />
                  </div>
                  <button className='bg-green-600 text-center items-center flex justify-center rounded-full cursor-pointer capitalize text-lg text-white font-bold p-2 w-1/5 h-8 mt-5' onClick={isEditing? updateItem : addItem}>{isEditing ? "Update Item" : "Add  Item"}</button>
                  <button className='text-lg font-semibold w-1/5 h-8 bg-gray-500 hover:bg-gray-600 transition-all ease-in-out duration-150 border-none outline-none hover:shadow-md rounded-full text-white' onClick={ClearForm}>Reset</button> 
                  
            </div>    

            {/* Inventory List */}
            <ul className='list-none w-full flex justify-center items-center mb-10 '>
                  {filteredInventory.length > 0 ? (
                        filteredInventory.map((item)=>(
                              
                              <li key={item?.id} className=''>
                                    <h2 className='text-xl font-bold text-center my-5'>User Data</h2>
                                    <div className='flex flex-col'>
                                         <p><strong>Name: </strong>{item?.name} </p> 
                                          <p> <strong>Room: </strong>|{item?.room} </p> 
                                        <p> <strong>Category:</strong>{item?.category}</p> 
                                    </div>
                                    <div className='w-full flex items-center justify-around '>
                                          <button className='bg-yellow-600 cursor-pointer flex items-center justify-center capitalize text-white font-bold px-3 py-2 w-full h-8 rounded-lg' onClick={()=> editItem(item.id)}>Edit</button>
                                          <button className='bg-red-600 cursor-pointer flex items-center justify-center capitalize text-white font-bold px-3 py-2 w-full h-8 rounded-lg' onClick={()=> deleteItem(item.id)}>Delete</button>
                                    </div>
                              </li>
                        ))
                  ):
                  (
                        <p className='text-lg font-bold text-center text-red-500 '>No Items Found! Add Products</p>
                  )
                  }
            </ul>
    </div>
  )
}

export default Products