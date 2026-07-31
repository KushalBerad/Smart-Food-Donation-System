import axios from "axios";


const API =
"http://localhost:5000/api/v1/donor";


export const updateProfile = async(data)=>{

 const token = localStorage.getItem("token");


 const response = await axios.put(

 `${API}/profile`,

 data,

 {
 headers:{
  Authorization:`Bearer ${token}`
 }
 }

 );


 return response.data;

};