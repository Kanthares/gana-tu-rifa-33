import { motion } from 'framer-motion';
import Timer from '../components/Timer';
import Prize from '../components/Prize';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, LogIn } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { useEffect, useState } from 'react';

const Index = () => {
  const [events, setEvents] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  const truncateDescription = (description: string, maxLength: number = 100) => {
    if (description.length <= maxLength) return description;
    return `${description.substring(0, maxLength)}...`;
  };

  const handleEventClick = (event: any) => {
    localStorage.setItem('selectedEvent', JSON.stringify(event));
    navigate('/property');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black text-white">
      {/* Navigation Menu */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="../files/logo.png" alt="Logo" className="h-10 w-10" />
              <h1 className="text-xl font-bold">Gana Tu Rifa</h1>
            </div>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2"
                    onClick={() => navigate('/')}
                  >
                    <Home className="h-4 w-4" />
                    Inicio
                  </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2"
                    onClick={() => navigate('/admin/login')}
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>

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
          {events.length > 0 && <Timer endDate={new Date(events[0].endDate || new Date().getTime() + 7 * 24 * 60 * 60 * 1000)} />}
        </div>

        {/* Events Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Eventos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <div key={index} onClick={() => handleEventClick(event)} className="cursor-pointer">
                <Prize 
                  title={event.propertyName || "Property"}
                  description={truncateDescription(event.description) || "Click for more details"}
                  imageUrl={event.images && event.images.length > 0 ? URL.createObjectURL(event.images[0]) : "/placeholder.svg"}
                />
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <motion.button 
            className="px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg transition-all duration-300 hover:bg-primary/90 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/property')}
          >
            PARTICIPAR
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Index;