import { useState } from "react";
import axios from "axios";
import DashboardLayout from "../../layouts/DashboardLayout";

function UploadOrder() {

  const [caseId,setCaseId] = useState("");
  const [file,setFile] = useState(null);

  const handleUpload = async (e) => {

    e.preventDefault();

    try{

      const formData = new FormData();
      formData.append("order", file);
      formData.append("case_id", caseId);

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/orders/upload",
        formData,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      alert("Order uploaded successfully");

    }catch(err){

      console.error(err);
      alert("Error uploading order");

    }

  };

  return (

    <DashboardLayout role="advocate">

      <div className="add-case-wrapper">

        <div className="add-case-card">

          <h2 style={{marginBottom:"20px", textAlign:"center"}}>
            Upload Court Order
          </h2>

          <form onSubmit={handleUpload} className="add-case-form">

            <div className="form-group">
              <label>Case ID</label>
              <input
                type="number"
                value={caseId}
                onChange={(e)=>setCaseId(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Upload Order File</label>
              <input
                type="file"
                onChange={(e)=>setFile(e.target.files[0])}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Upload Order
            </button>

          </form>

        </div>

      </div>

    </DashboardLayout>

  );

}

export default UploadOrder;