import { motion } from 'framer-motion';

interface PrizeProps {
  title: string;
  description: string;
  imageUrl: string;
}

const Prize = ({ title, description, imageUrl }: PrizeProps) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
      <div className="relative bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 transition-all duration-300 hover:transform hover:scale-[1.01]">
        <div className="aspect-square rounded-lg overflow-hidden mb-4">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default Prize;