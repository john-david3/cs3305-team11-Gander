import React, { useState, useEffect } from "react";
import Button from "../components/Input/Button";
// @ts-ignore
import ChromeDinoGame from "react-chrome-dino";

const NotFoundPage: React.FC = () => {
	const [stars, setStars] = useState<{ x: number; y: number; xChange: number; yChange: number }[]>([]);
	const starSize = 30;

	const [score, setScore] = useState(0);
	const [isGameOver, setIsGameOver] = useState(false);

	useEffect(() => {
		const loop = setInterval(() => {
			if (Math.random() < 0.1) {
				const newStar = {
					x: score > 20000 ? window.innerWidth + starSize : Math.random() * (window.innerWidth - starSize),
					y: score > 20000 ? Math.random() * (window.innerHeight - starSize) : -starSize,
					xChange: score * 0.001,
					yChange: 5,
				};
				setStars((prev) => [...prev, newStar]);
			}

			setStars((prev) => {
				const newStars = prev.filter((star) => {
					if (star.y > window.innerHeight - starSize && star.y < window.innerHeight) {
						return false;
					}
					if (star.y > window.innerHeight) return false;
					return true;
				});

				return newStars.map((star) => ({
					x: star.x - star.xChange,
					y: star.y + star.yChange,
					xChange: score * 0.001,
					yChange: star.yChange,
				}));
			});

			if (isGameOver) {
				setScore(score * 0.99);
			}
		}, 10);

		return () => {
			clearInterval(loop);
		};
	}, [isGameOver, score]);

	useEffect(() => {
		const gameMonitor = setInterval(() => {
			// Access the Runner instance (which the code stores in Runner.instance_)
			const runner = (window as any).Runner?.instance_;
			setIsGameOver(runner?.crashed);
			if (!runner?.crashed) setScore(runner?.distanceRan);
		}, 500);

		return () => {
			clearInterval(gameMonitor);
		};
	}, []);

	return (
		<div
			className={`h-screen w-screen ${
				score > 25000 ? "bg-black" : score > 10000 ? "bg-[#0f0024]" : "bg-slate-900"
			} text-white overflow-hidden relative transition-colors duration-[5s]`}
		>
			<div>
				{stars.map((star, index) => (
					<div key={index} className="absolute w-5 h-5 text-yellow-300" style={{ left: `${star.x}px`, top: `${star.y}px` }}>
						★
					</div>
				))}
			</div>
			<div className="absolute flex justify-center items-center h-full z-0 inset-0 bg-[radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[length:50px_50px]">
				<div
					className={`${
						score > 30000 && "drop-shadow-[0_0_5px_rgb(220,20,60)]"
					} w-full text-center animate-floating transition-all duration-[5s]`}
				>
					<h1 className="text-6xl font-bold mb-4">404</h1>
					<p className="text-2xl mb-8">Page Not Found</p>
					<ChromeDinoGame />
					<Button extraClasses="z-[100]" onClick={() => (window.location.href = "/")}>
						Go Home
					</Button>
				</div>
			</div>
		</div>
	);
};

/*
Re: ChromeDinoGame
The MIT License (MIT)

Copyright (c) 2020 M. Hasbini

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

export default NotFoundPage;
