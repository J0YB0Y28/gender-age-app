import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [useWebcam, setUseWebcam] = useState(true);
  const [paused, setPaused] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [videoStream, setVideoStream] = useState(null);

  const emojiMap = {
    Male: "👨",
    Female: "👩",
    Unknown: "❓",
  };

  const colorMap = {
    Male: "text-blue-500",
    Female: "text-pink-500",
    Unknown: "text-gray-400",
  };

  useEffect(() => {
    if (useWebcam) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }
        setVideoStream(stream);
      });
    } else {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
        setVideoStream(null);
      }
    }
  }, [useWebcam]);

  useEffect(() => {
    if (result && !result.error) {
      setHistory((prev) => [...prev, result]);
    }
  }, [result]);

  const captureAndSend = async () => {
    if (useWebcam && webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      const blob = await fetch(imageSrc).then((res) => res.blob());
      sendImageToAPI(blob);
    } else if (selectedImage) {
      sendImageToAPI(selectedImage);
    }
  };

  const sendImageToAPI = async (imageBlob) => {
    const formData = new FormData();
    formData.append("image", imageBlob, "image.jpg");

    try {
      const res = await axios.post("https://gender-age-app.onrender.com/predict", formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setResult({ error: "Erreur lors de la prédiction." });
    }
  };

  const handleImageUpload = (e) => {
    setSelectedImage(e.target.files[0]);
    setUseWebcam(false);
    setResult(null);
  };

  const stopWebcam = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
    setUseWebcam(false);
    setResult(null);
  };

  return (
    <div className="text-center mt-5 w-full max-w-md mx-auto">

      {/* Toggle Webcam / Image */}
      <div className="mb-4 space-x-2">
        <button
          className={`px-4 py-2 rounded-l bg-blue-600 text-white ${useWebcam ? 'opacity-100' : 'opacity-50'}`}
          onClick={() => {
            setUseWebcam(true);
            setSelectedImage(null);
            setResult(null);
          }}
        >
          Webcam
        </button>
        <button
          className={`px-4 py-2 rounded-r bg-blue-600 text-white ${!useWebcam ? 'opacity-100' : 'opacity-50'}`}
          onClick={() => {
            setUseWebcam(false);
            setResult(null);
          }}
        >
          Image
        </button>
        {useWebcam && (
          <button
            onClick={stopWebcam}
            className="ml-2 px-4 py-2 bg-red-600 text-white rounded"
          >
            🛑 Stop Webcam
          </button>
        )}
      </div>

      {/* Webcam or Image Preview */}
      {useWebcam ? (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={320}
          height={240}
        />
      ) : (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0 file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
          />
          {selectedImage && (
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Prévisualisation"
              className="rounded-md shadow-md mx-auto mb-4 max-h-64"
            />
          )}
        </>
      )}

      {/* Bouton analyser */}
      <button
        onClick={captureAndSend}
        disabled={!useWebcam && !selectedImage}
        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        Analyser
      </button>

      {/* Résultat */}
      {result && (
        <div className={`mt-4 text-xl font-bold ${colorMap[result.gender]}`}>
          {emojiMap[result.gender]} {result.gender} — {result.age}
        </div>
      )}

      {/* Historique */}
      {history.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Historique 📜</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {history.map((item, index) => (
              <li key={index} className="opacity-80">
                {emojiMap[item.gender]} {item.gender} — {item.age}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
