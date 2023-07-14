import React, { useState } from "react";
import styles from './styles.module.css';
import logoImage from '../../assets/supera.jpeg';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [id, setId] = useState("");
  const navigate = useNavigate();

  const handleIdChange = (event) => {
    setId(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/userId/${id}`);

      if (!response.ok) {
        throw new Error("Erro ao obter o ID da conta. Insira um ID válido.");
      }

      localStorage.setItem("id", id);
      navigate("/extrato");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className={styles.containerId}>
      <form className={styles.formContainer} onSubmit={handleFormSubmit}>
        <h3>por padrão, temos salvo na base de dados as contas 1 e 2</h3>
        <p>
          para fazer mais testes, acesse a documentação da API:{" "}
          <a href="http://localhost:8080/swagger-ui/index.html" target="_blank" rel="noopener noreferrer">
            http://localhost:8080/swagger-ui/index.html
          </a>
        </p>
        <label>
          Número da conta:
          <input type="number" value={id} onChange={handleIdChange} />
        </label>
        <button type="submit">Avançar</button>
      </form>
    </div>
  );
}
