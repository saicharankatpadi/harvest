
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to the tax loss harvesting page
    navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-koinx-dark">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">Loading KoinX Tax Loss Harvesting Tool</h1>
        <p className="text-xl text-gray-400">Please wait...</p>
      </div>
    </div>
  );
};

export default Index;
