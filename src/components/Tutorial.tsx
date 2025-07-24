import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  arrow: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right';
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'header',
    title: '🚀 Добро пожаловать в Горхон.Online!',
    description: 'Здесь твоя база для исследования города',
    target: 'header',
    position: 'bottom',
    arrow: 'top-left'
  },
  {
    id: 'search',
    title: '🔍 Поиск мест',
    description: 'Найди любое место в городе быстро',
    target: 'search-input',
    position: 'bottom',
    arrow: 'top-right'
  },
  {
    id: 'map',
    title: '🗺️ Карта города',
    description: 'Исследуй Горхон в 360° формате',
    target: 'city-map',
    position: 'top',
    arrow: 'bottom-left'
  },
  {
    id: 'categories',
    title: '📂 Категории',
    description: 'Выбери что тебя интересует',
    target: 'categories',
    position: 'top',
    arrow: 'bottom-right'
  }
];

const ChalkArrow: React.FC<{ direction: string; className?: string }> = ({ direction, className = '' }) => {
  const getArrowPath = () => {
    switch (direction) {
      case 'top-left':
        return "M10,50 Q20,20 50,10 M40,5 L50,10 L45,20";
      case 'top-right':
        return "M50,50 Q30,20 10,10 M5,20 L10,10 L20,5";
      case 'bottom-left':
        return "M10,10 Q20,40 50,50 M40,55 L50,50 L45,40";
      case 'bottom-right':
        return "M50,10 Q30,40 10,50 M5,40 L10,50 L20,55";
      case 'left':
        return "M50,30 Q20,30 10,30 M15,25 L10,30 L15,35";
      case 'right':
        return "M10,30 Q40,30 50,30 M45,25 L50,30 L45,35";
      default:
        return "M10,30 Q40,30 50,30 M45,25 L50,30 L45,35";
    }
  };

  return (
    <svg 
      className={`w-16 h-16 absolute pointer-events-none ${className}`}
      viewBox="0 0 60 60"
      style={{
        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
      }}
    >
      <path
        d={getArrowPath()}
        stroke="#e5f7dc"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: '3,3',
          animation: 'chalk-draw 2s ease-in-out infinite alternate'
        }}
      />
    </svg>
  );
};

const Tutorial: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Проверяем, первый ли раз пользователь на сайте
    const hasVisited = localStorage.getItem('gorkhon-tutorial-completed');
    if (!hasVisited) {
      setIsFirstVisit(true);
      setTimeout(() => setIsVisible(true), 1000); // Задержка для плавного появления
    }
  }, []);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const skipTutorial = () => {
    completeTutorial();
  };

  const completeTutorial = () => {
    setIsVisible(false);
    localStorage.setItem('gorkhon-tutorial-completed', 'true');
  };

  const getTooltipPosition = (step: TutorialStep) => {
    const element = document.querySelector(`[data-tutorial="${step.target}"]`);
    if (!element) return { top: '50%', left: '50%' };

    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    let top = rect.top + scrollTop;
    let left = rect.left + scrollLeft;

    switch (step.position) {
      case 'top':
        top -= 120;
        left += rect.width / 2;
        break;
      case 'bottom':
        top += rect.height + 20;
        left += rect.width / 2;
        break;
      case 'left':
        left -= 300;
        top += rect.height / 2;
        break;
      case 'right':
        left += rect.width + 20;
        top += rect.height / 2;
        break;
    }

    return { top: `${top}px`, left: `${left}px` };
  };

  const getArrowPosition = (step: TutorialStep) => {
    const element = document.querySelector(`[data-tutorial="${step.target}"]`);
    if (!element) return { top: '50%', left: '50%' };

    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    let top = rect.top + scrollTop;
    let left = rect.left + scrollLeft;

    switch (step.arrow) {
      case 'top-left':
        top -= 80;
        left -= 40;
        break;
      case 'top-right':
        top -= 80;
        left += rect.width + 10;
        break;
      case 'bottom-left':
        top += rect.height + 20;
        left -= 40;
        break;
      case 'bottom-right':
        top += rect.height + 20;
        left += rect.width + 10;
        break;
      case 'left':
        top += rect.height / 2 - 30;
        left -= 80;
        break;
      case 'right':
        top += rect.height / 2 - 30;
        left += rect.width + 20;
        break;
    }

    return { top: `${top}px`, left: `${left}px` };
  };

  if (!isFirstVisit || !isVisible) return null;

  const currentStepData = tutorialSteps[currentStep];
  const tooltipPosition = getTooltipPosition(currentStepData);
  const arrowPosition = getArrowPosition(currentStepData);

  return (
    <>
      <style>{`
        @keyframes chalk-draw {
          0% { stroke-dashoffset: 20; opacity: 0.7; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        
        .tutorial-overlay {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(2px);
        }
        
        .tutorial-tooltip {
          background: linear-gradient(135deg, #2a5a3a, #1e3d2a);
          border: 2px solid #4ade80;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          animation: tutorial-bounce 0.5s ease-out;
        }
        
        @keyframes tutorial-bounce {
          0% { transform: scale(0.8) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        
        .tutorial-highlight {
          border: 3px solid #4ade80;
          border-radius: 8px;
          box-shadow: 0 0 20px rgba(74, 222, 128, 0.5);
          animation: tutorial-glow 2s ease-in-out infinite alternate;
        }
        
        @keyframes tutorial-glow {
          0% { box-shadow: 0 0 20px rgba(74, 222, 128, 0.5); }
          100% { box-shadow: 0 0 30px rgba(74, 222, 128, 0.8); }
        }
      `}</style>

      {/* Overlay */}
      <div className="fixed inset-0 z-50 tutorial-overlay">
        {/* Highlight current element */}
        <div
          className="absolute tutorial-highlight pointer-events-none"
          style={{
            ...(() => {
              const element = document.querySelector(`[data-tutorial="${currentStepData.target}"]`);
              if (!element) return {};
              const rect = element.getBoundingClientRect();
              return {
                top: `${rect.top + window.pageYOffset - 10}px`,
                left: `${rect.left + window.pageXOffset - 10}px`,
                width: `${rect.width + 20}px`,
                height: `${rect.height + 20}px`
              };
            })()
          }}
        />

        {/* Chalk Arrow */}
        <ChalkArrow
          direction={currentStepData.arrow}
          className="z-10"
          style={arrowPosition}
        />

        {/* Tooltip */}
        <div
          className="absolute z-20 tutorial-tooltip rounded-lg p-6 max-w-sm transform -translate-x-1/2 -translate-y-1/2"
          style={tooltipPosition}
        >
          <div className="text-white">
            <h3 className="text-lg font-bold mb-2 text-gorkhon-green">
              {currentStepData.title}
            </h3>
            <p className="text-sm mb-4 text-white/90">
              {currentStepData.description}
            </p>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-1">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStep ? 'bg-gorkhon-green' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={skipTutorial}
                  className="px-3 py-1 text-xs text-white/70 hover:text-white transition-colors"
                >
                  Пропустить
                </button>
                <button
                  onClick={nextStep}
                  className="px-4 py-2 bg-gorkhon-green text-white text-sm rounded hover:bg-gorkhon-green/80 transition-colors flex items-center space-x-1"
                >
                  {currentStep === tutorialSteps.length - 1 ? (
                    <>
                      <span>Понятно!</span>
                      <Icon name="Check" size={14} />
                    </>
                  ) : (
                    <>
                      <span>Далее</span>
                      <Icon name="ArrowRight" size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tutorial;