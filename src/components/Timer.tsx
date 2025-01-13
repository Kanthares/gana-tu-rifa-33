import { useEffect, useState } from 'react';

interface TimerProps {
  endDate: Date;
}

const Timer = ({ endDate }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +endDate - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [endDate]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center mx-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 w-20 h-20 flex items-center justify-center mb-2 border border-white/20">
        <span className="text-4xl font-bold animate-number-transition">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-sm text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-wrap justify-center items-center p-8 animate-fade-up">
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
};

export default Timer;