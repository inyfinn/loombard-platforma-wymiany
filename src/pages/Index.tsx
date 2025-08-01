import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Przekieruj na dashboard jako główną stronę
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  return null;
};

export default Index;
