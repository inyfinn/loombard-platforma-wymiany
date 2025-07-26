import { useNavigate } from "react-router-dom";

export function Logo() {
  const navigate = useNavigate();

  return (
    <div 
      className="flex flex-col cursor-pointer group" 
      onClick={() => navigate('/dashboard')}
    >
      <div className="logo-l text-3xl select-none group-hover:scale-105 transition-transform duration-300">
        L
      </div>
      <div className="flex flex-col text-xs leading-tight">
        <span className="font-bold text-foreground">Loombard</span>
        <span className="text-muted-foreground text-[10px]">Platforma wymiany walut</span>
      </div>
    </div>
  );
}