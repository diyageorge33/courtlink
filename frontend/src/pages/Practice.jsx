import { useNavigate } from "react-router-dom";

function Practice() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: "40px",
        cursor: "pointer"
      }}
      onClick={() => {
        console.log("Navigating...");
        navigate("/case-type-guide");
      }}
    >
      <h2>Case Types</h2>
      <p>You will know what kind of case you are into</p>
    </div>
  );
}

export default Practice;