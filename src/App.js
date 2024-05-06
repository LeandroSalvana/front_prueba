import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [responseData, setResponseData] = useState(null); // Estado para almacenar la respuesta del backend

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('imagen', file);

    fetch('http://localhost:5000/procesar_imagen', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log('Respuesta del backend:', data);
      setResponseData(data); // Actualizar el estado con la respuesta del backend
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
    <div>
      <h1>Enviar Imagen al Backend</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Enviar</button>
      </form>
      
        {/* Mostrar la respuesta del backend */}
        {responseData && (
          <div>
            <h2>Respuesta del Backend:</h2>
            <ul>
      {Object.keys(responseData).map((key, index) => (
        <li key={index}>
          <strong>{key}:</strong> {responseData[key]}
        </li>
      ))}
    </ul>

          </div>
        )}
      
    </div>
  );
}

export default App;
