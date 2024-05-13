import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const handleCapture = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          stream.getTracks().forEach(track => track.stop());
          canvas.toBlob(blob => setFile(blob), 'image/jpeg', 0.9);
        };
      })
      .catch(error => {
        console.error('Error al acceder a la cámara:', error);
        alert('No se encontró ninguna cámara en su dispositivo.');
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    {/*if (!file) {
      alert('Por favor, capture una imagen antes de enviar.');
      return;
    }*/}
    
    const formData = new FormData();
    formData.append('imagen', file);

    fetch('http://localhost:5000/procesar_imagen', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log('Respuesta del backend:', data);
      setResponseData(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
    <div>
      <h1>Enviar Imagen al Backend</h1>
      <button onClick={handleCapture}>Capturar Imagen</button>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
        <button type="submit" disabled={!file}>Enviar</button>
      </form>

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
