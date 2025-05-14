import React, { useState, useEffect, useRef } from 'react';

const Ultimate3DBirdCard = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentBird, setCurrentBird] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 12, y: 0 });
  const [birdPos, setBirdPos] = useState({ x: 0, y: 0, z: 0 });
  const [isFlying, setIsFlying] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [energyLevel, setEnergyLevel] = useState(100);
  const cardRef = useRef(null);

  // Handle bird sprite animation
  useEffect(() => {
    let interval;
    if (isHovered || isFlying) {
      interval = setInterval(() => {
        setCurrentBird(prev => prev === 1 ? 2 : 1);
        if (isFlying) {
          setEnergyLevel(prev => Math.max(0, prev - 0.5));
        }
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isHovered, isFlying]);

  // Reset energy over time
  useEffect(() => {
    if (!isFlying && energyLevel < 100) {
      const recovery = setInterval(() => {
        setEnergyLevel(prev => Math.min(100, prev + 1));
      }, 100);
      return () => clearInterval(recovery);
    }
  }, [isFlying, energyLevel]);

  // Handle mouse tracking and 3D rotation
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    setMousePos({ x, y });

    // Calculate rotation based on mouse position
    const rotateY = ((x - centerX) / centerX) * 15;
    const rotateX = ((y - centerY) / centerY) * 15;
    setRotation({ x: 12 + rotateX, y: rotateY });

    // Update bird position in flight mode
    if (isFlying && energyLevel > 0) {
      const dx = (x - birdPos.x) * 0.1;
      const dy = (y - birdPos.y) * 0.1;
      const dz = Math.sin(Date.now() / 1000) * 10; // Gentle floating effect
      setBirdPos(prev => ({
        x: prev.x + dx,
        y: prev.y + dy,
        z: 40 + dz
      }));
    }
  };

  const handleClick = () => {
    if (energyLevel < 20) return; // Not enough energy to fly
    
    setClickCount(prev => prev + 1);
    if (clickCount >= 2) {
      setIsFlying(true);
      setTimeout(() => {
        setIsFlying(false);
        setClickCount(0);
        setBirdPos({ x: 0, y: 0, z: 0 });
      }, 5000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#4a4a9c] to-[#6464d0] perspective-1500">
      {/* Light source effect */}
      <div 
        className="absolute w-96 h-96 rounded-full bg-white/10 blur-3xl"
        style={{
          transform: `translate(${(mousePos.x - 200)}px, ${(mousePos.y - 200)}px)`,
          opacity: isHovered ? 0.15 : 0
        }}
      />

      {/* Main Card Container */}
      <div 
        className="relative transform-style-3d"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
      >
        <div 
          ref={cardRef}
          className="relative w-80 h-96 group transform-style-3d cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setRotation({ x: 12, y: 0 });
            if (!isFlying) setBirdPos({ x: 0, y: 0, z: 0 });
          }}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
        >
          {/* Background layers for parallax effect */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-lg bg-cover transition-transform duration-700 ease-out"
              style={{
                backgroundImage: `url('./BirdCardAnimation/background.avif')`,
                transform: `translateZ(${i * -10}px) ${isHovered ? 'scale(1.05)' : ''}`,
                filter: `blur(${i * 0.5}px)`,
                opacity: 1 - (i * 0.1)
              }}
            />
          ))}

          {/* Main card surface with glass effect */}
          <div 
            className={`
              absolute inset-0 
              rounded-lg 
              bg-white/10 
              backdrop-blur-sm
              transition-all duration-700
              ${isHovered ? 'scale-105' : ''}
            `}
            style={{
              transform: `translateZ(10px)`,
              boxShadow: `
                0 10px 30px -5px rgba(0, 0, 0, 0.3),
                0 0 20px rgba(255, 255, 255, 0.1) inset
              `
            }}
          />

          {/* Bird Container */}
          <div 
            className="absolute w-48 h-48 transition-all duration-300 transform-style-3d"
            style={{
              left: isFlying ? `${birdPos.x - 96}px` : '64px',
              top: isFlying ? `${birdPos.y - 96}px` : '96px',
              transform: `
                translateZ(${isFlying ? birdPos.z : (isHovered ? 40 : 20)}px)
                ${isHovered ? 'scale(1.1)' : ''}
                ${isFlying ? `rotateZ(${Math.atan2(mousePos.y - birdPos.y, mousePos.x - birdPos.x) * 180 / Math.PI}deg)` : ''}
              `,
              filter: `drop-shadow(0 10px 15px rgba(0, 0, 0, 0.3))`
            }}
          >
            <img
              src={currentBird === 1 ? './BirdCardAnimation/bird1.png' : './BirdCardAnimation/bird2.png'}
              alt="Animated bird"
              className="w-full h-full transition-transform duration-300"
            />

            {/* Energy particles */}
            {(isHovered || isFlying) && energyLevel > 20 && (
              <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 rounded-full animate-energy"
                    style={{
                      backgroundColor: `hsl(${energyLevel * 2}, 80%, 60%)`,
                      left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 30}%`,
                      top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 30}%`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Energy Bar */}
          <div 
            className="absolute bottom-6 left-6 right-6 h-2 bg-white/20 rounded-full overflow-hidden transform-style-3d"
            style={{ transform: 'translateZ(30px)' }}
          >
            <div 
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${energyLevel}%`,
                backgroundColor: `hsl(${energyLevel * 2}, 80%, 60%)`
              }}
            />
          </div>

          {/* UI Elements */}
          <div 
            className="absolute inset-x-0 top-6 text-center transform-style-3d"
            style={{ transform: 'translateZ(30px)' }}
          >
            <p className="text-white text-lg font-semibold text-shadow-lg mb-2">
              {!isFlying 
                ? (energyLevel < 20 
                  ? 'Recharging...' 
                  : clickCount === 0 
                    ? 'Double click to free the bird!' 
                    : 'Click once more!')
                : 'Guide the bird with your mouse!'}
            </p>
            {!isFlying && (
              <div className="flex gap-2 justify-center">
                <span className={`w-2 h-2 rounded-full transition-colors ${clickCount >= 1 ? 'bg-green-400' : 'bg-white/50'}`} />
                <span className={`w-2 h-2 rounded-full transition-colors ${clickCount >= 2 ? 'bg-green-400' : 'bg-white/50'}`} />
              </div>
            )}
          </div>

          {/* Particle Effects */}
          <div className="absolute inset-0 pointer-events-none transform-style-3d">
            {(isHovered || isFlying) && [...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full animate-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `translateZ(${20 + Math.random() * 40}px)`,
                  backgroundColor: `hsla(${Math.random() * 60 + 200}, 80%, 70%, 0.3)`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1500 {
          perspective: 1500px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .text-shadow-lg {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        @keyframes particle {
          0% { transform: translate3d(0, 0, 20px) scale(1); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translate3d(0, -100px, 40px) scale(0); opacity: 0; }
        }
        .animate-particle {
          animation: particle 2s ease-out infinite;
        }
        @keyframes energy {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        .animate-energy {
          animation: energy 1s ease-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Ultimate3DBirdCard;