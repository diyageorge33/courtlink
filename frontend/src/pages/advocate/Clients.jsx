import { useEffect,useState } from "react";
import axios from "axios";
import DashboardLayout from "../../layouts/DashboardLayout";

function Clients(){

  const [clients,setClients] = useState([]);

  useEffect(()=>{

    const fetchClients = async ()=>{

      try{

        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/advocate/clients",
          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }
        );

        setClients(res.data);

      }catch(err){

        console.error(err);

      }

    };

    fetchClients();

  },[]);

  return(

    <DashboardLayout role="advocate">

      <h2>My Clients</h2>

      <table className="cases-table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
        {clients.map((c) => (
        <tr key={c.user_id}>
        <td>{c.user_id}</td>
        <td>{c.full_name}</td>
        <td>{c.email}</td>
        </tr>
  ))}
</tbody>

      </table>

    </DashboardLayout>

  );

}

export default Clients;