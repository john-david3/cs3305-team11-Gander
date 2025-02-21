import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Input/Button";
// @ts-ignore
import ChromeDinoGame from "react-chrome-dino";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const [stars, setStars] = useState<{ x: number; y: number }[]>([]);
  const starSize = 20;

  useEffect(() => {
    const loop = setInterval(() => {
      if (Math.random() < 0.1) {
        const newStar = {
          x: Math.random() * (window.innerWidth - starSize),
          y: -starSize,
        };
        setStars((prev) => [...prev, newStar]);
      }

      setStars((prev) => {
        const newStars = prev.filter((star) => {
          if (
            star.y > window.innerHeight - starSize &&
            star.y < window.innerHeight
          ) {
            return false;
          }
          if (star.y > window.innerHeight) return false;
          return true;
        });

        return newStars.map((star) => ({
          ...star,
          y: star.y + 5,
        }));
      });
    }, 10);

    return () => clearInterval(loop);
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-900 text-white overflow-hidden relative">
      <div>
        {stars.map((star, index) => (
          <div
            key={index}
            className="absolute w-5 h-5 text-yellow-300"
            style={{ left: `${star.x}px`, top: `${star.y}px` }}
          >
            ★
          </div>
        ))}
      </div>
      <div className="absolute flex justify-center items-center h-full z-0 inset-0 bg-[radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[length:50px_50px]">
        <div className="w-full text-center animate-floating">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <p className="text-2xl mb-8">Page Not Found</p>
          <ChromeDinoGame />
          <Button extraClasses="z-[100]" onClick={() => navigate("/")}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
