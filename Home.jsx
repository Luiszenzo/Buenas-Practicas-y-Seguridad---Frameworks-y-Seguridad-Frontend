import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import FloatingMessage from "../components/Floatingmessage";

const Home = () => {
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          localStorage.removeItem("token");
          setMessage("La sesión ha expirado");
          setTimeout(() => navigate("/"), 2000);
        } else {
          // Calcular el tiempo restante en segundos
          const remainingTime = Math.floor(decoded.exp - currentTime);
          setTimeLeft(remainingTime);
        }
      } else {
        navigate("/");
      }
    };

    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 1000); // Chequea cada segundo

    return () => clearInterval(interval);
  }, [navigate]);

  // Función para formatear el tiempo restante en minutos y segundos
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div style={{
      textAlign: 'center',
      padding: '20px',
      backgroundColor: '#fff3e0',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '600px',
      margin: '50px auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ color: '#ff8a65', fontSize: '2rem', marginBottom: '20px' }}>🐾 Bienvenido al Mundo de los Perritos 🐾</h2>
      <p style={{ color: '#555', fontSize: '1.2rem', marginBottom: '20px' }}>
        ¡Aquí encontrarás todo sobre nuestros amigos peludos!
      </p>
      <div style={{ marginBottom: '20px' }}>
        <img 
          src="https://images.dog.ceo/breeds/labrador/n02099712_7418.jpg" 
          alt="Perrito feliz" 
          style={{ width: '100%', borderRadius: '10px' }}
        />
      </div>
      <p style={{ color: '#555', fontSize: '1rem' }}>
        Explora nuestras secciones para conocer más sobre razas, cuidados y adopción.
      </p>
      {timeLeft !== null && (
        <p style={{ color: '#ff8a65', fontSize: '1.2rem', marginTop: '20px' }}>
          Tu sesión expira en: <strong>{formatTime(timeLeft)}</strong>
        </p>
      )}
      {message && <FloatingMessage message={message} />}
    </div>
  );
};

export default Home;