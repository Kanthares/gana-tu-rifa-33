import { motion } from 'framer-motion';
import Timer from '../components/Timer';
import Prize from '../components/Prize';

const Index = () => {
  // Set end date to 7 days from now
  const endDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-up">
          <motion.span 
            className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-primary/10 text-primary rounded-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Eventos por tiempo limitado
          </motion.span>
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            ¡No Te Quedes Fuera! Tu Oportunidad de Ganar Está Aquí
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            ¿Que esperas? Participa para ganar antes que se acabe el tiempo
          </motion.p>
        </div>

        {/* Timer Section */}
        <div className="mb-16">
          <Timer endDate={endDate} />
        </div>

        {/* Prizes Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Prizes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Prize 
              title="Grand Prize"
              description="An incredible package worth over $1,000"
              imageUrl="/placeholder.svg"
            />
            <Prize 
              title="Second Prize"
              description="Amazing tech gadgets and accessories"
              imageUrl="/placeholder.svg"
            />
            <Prize 
              title="Third Prize"
              description="Exclusive merchandise and collectibles"
              imageUrl="/placeholder.svg"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <motion.button 
            className="px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg transition-all duration-300 hover:bg-primary/90 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Enter Raffle Now
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Index;