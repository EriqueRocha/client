import React, { useState, useEffect } from "react";
import "./styles.css";
import axios from "axios";

export default function Extrato() {
  const [contaId, setContaId] = useState("");
  const [operador, setOperador] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [valorPrimeiraRequisicao, setValorPrimeiraRequisicao] = useState(0);
  const [valorUltimaRequisicao, setValorUltimaRequisicao] = useState(0);
  const savedId = localStorage.getItem("id");

  const handleContaIdChange = (event) => {
    setContaId(event.target.value);
  };

  const handleOperadorChange = (event) => {
    setOperador(event.target.value);
  };

  const handleDataInicioChange = (event) => {
    setDataInicio(event.target.value);
  };

  const handleDataFimChange = (event) => {
    setDataFim(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
  
    let url = "";
  
    if (savedId && operador && dataInicio && dataFim) {
      url = `http://localhost:8080/transferencias/${savedId}/${operador}?dataInicio=${dataInicio}&dataFim=${dataFim}`;
    } else if (savedId && operador && !dataInicio && !dataFim) {
      url = `http://localhost:8080/userId/${savedId}/operador/${operador}`;
    } else if (savedId && !operador && dataInicio && dataFim) {
      url = `http://localhost:8080/transferencias/conta/${savedId}?dataInicio=${dataInicio}&dataFim=${dataFim}`;
    }
  
    axios
      .get(url)
      .then((response) => {
        const responseData = response.data.body;
  
        if (Array.isArray(responseData) && responseData.length > 0) {
          responseData.sort((a, b) => {
            const dateA = new Date(a.dataTransferencia);
            const dateB = new Date(b.dataTransferencia);
            return dateB - dateA;
          });
  
          setData(responseData);
          setCurrentPage(1);
          const valores = responseData.map((item) => item.valor);
          const valorTotal = valores.reduce((total, valor) => total + valor, 0);
          setValorUltimaRequisicao(valorTotal);
        } else {
          setData([]);
          setCurrentPage(1);
          setValorUltimaRequisicao(0);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  

  const handleLimparClick = () => {
    setContaId("");
    setOperador("");
    setDataInicio("");
    setDataFim("");

    const url = `http://localhost:8080/userId/${savedId}`;
    axios
      .get(url)
      .then((response) => {
        const responseData = response.data.body;

        if (Array.isArray(responseData) && responseData.length > 0) {
          setData(responseData);
          setCurrentPage(1);
          const valores = responseData.map((item) => item.valor);
          const valorTotal = valores.reduce((total, valor) => total + valor, 0);
          setValorUltimaRequisicao(valorTotal);
        } else {
          setData([]);
          setCurrentPage(1);
          setValorUltimaRequisicao(0);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (savedId) {
      const url = `http://localhost:8080/userId/${savedId}`;
      axios
        .get(url)
        .then((response) => {
          const responseData = response.data.body;
  
          if (Array.isArray(responseData) && responseData.length > 0) {
            responseData.sort((a, b) => {
              const dateA = new Date(a.dataTransferencia);
              const dateB = new Date(b.dataTransferencia);
              return dateB - dateA;
            });
  
            setData(responseData);
            const valores = responseData.map((item) => item.valor);
            const valorTotal = valores.reduce((total, valor) => total + valor, 0);
            setValorPrimeiraRequisicao(valorTotal);
            setValorUltimaRequisicao(valorTotal);
          } else {
            setData([]);
            setValorPrimeiraRequisicao(0);
            setValorUltimaRequisicao(0);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const ROWS_PER_PAGE = 4;
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="container">
      <form onSubmit={handleFormSubmit}>
        <label>
          Operador:
          <input type="text" value={operador} onChange={handleOperadorChange} />
        </label>
        <label>
          Data de início:
          <input type="date" value={dataInicio} onChange={handleDataInicioChange} />
        </label>
        <label>
          Data de fim:
          <input type="date" value={dataFim} onChange={handleDataFimChange} />
        </label>
        <button type="submit">Pesquisar</button>
        <button type="button" onClick={handleLimparClick}>
          Limpar
        </button>
        <div className="saldo-container">
          <div className="saldo">Saldo total R$: {valorPrimeiraRequisicao}</div>
          <div className="saldo">Saldo do período R$: {valorUltimaRequisicao}</div>
        </div>
      </form>

      {data.length > 0 ? (
        <div>
          <table>
            <thead>
              <tr>
                <th>Dados</th>
                <th>Valentia</th>
                <th>Tipo</th>
                <th>Nome Operador Transacionado</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(startIndex, endIndex).map((item) => (
                <tr key={item.id}>
                  <td>{item.dataTransferencia}</td>
                  <td>{item.valor}</td>
                  <td>{item.tipo}</td>
                  <td>{item.nomeOperadorTransacao || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="buttons-container">
            {currentPage > 1 ? (
              <button
                type="button"
                onClick={handlePreviousPage}
                className="previousButton"
              >
                Página anterior
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePreviousPage}
                className="disabledButton"
                disabled
              >
                Página anterior
              </button>
            )}
            <span>
              Página {currentPage} de {totalPages}
            </span>
            {endIndex < data.length ? (
              <button
                type="button"
                onClick={handleNextPage}
                className="nextButton"
              >
                Próxima página
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextPage}
                className="disabledButton"
                disabled
              >
                Próxima página
              </button>
            )}
          </div>
        </div>
      ) : (
        <div>Nenhum dado encontrado.</div>
      )}
    </div>
  );
}
