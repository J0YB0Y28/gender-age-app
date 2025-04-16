import React, { useEffect, useState } from "react";
import WebcamCapture from "./WebcamCapture";

function App() {
  const [isDark, setIsDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
      <div className="w-full flex justify-between items-center px-6 pt-4">
        <h1 className="text-2xl font-bold">Gender & Age Detector 👁️‍🗨️</h1>
        <button
          onClick={toggleTheme}
          className="text-xl p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-800 transition"
        >
          {isDark ? "🌙" : "🌞"}
        </button>
      </div>
      <div className="flex-grow flex items-center justify-center w-full">
        <WebcamCapture />
      </div>
      <footer className="mt-16 text-center text-sm text-gray-600 dark:text-gray-400 px-4 pb-6">
  <p>
    Projet réalisé par <strong>Teddy Kana</strong> — Étudiant en Génie logiciel à l’Université Laval
  </p>
  <p className="mt-2">
    📧{" "}
    <a href="mailto:kanaboumkwoiit@outlook.com" className="text-blue-500 hover:underline">
      kanaboumkwoiit@outlook.com
    </a>{" "}
    | 💻{" "}
    <a
      href="https://github.com/J0YB0Y28"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 hover:underline"
    >
      GitHub
    </a>{" "}
    | 💼{" "}
    <a
      href="https://www.linkedin.com/in/teddy-kana-6a26832b9/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 hover:underline"
    >
      LinkedIn
    </a>{" "}
    | 🌐{" "}
    <a
      href="https://teddy-kana-portfolio.vercel.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 hover:underline"
    >
      Portfolio
    </a>
  </p>
</footer>

    </div>
  );
}

export default App;
