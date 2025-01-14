import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Timer from "@/components/Timer";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Car, House, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const PropertyDetails = () => {
  const navigate = useNavigate();
  // Set end date to 7 days from now (same as Index page)
  const endDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);

  const propertyImages = [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg"
  ];

  const propertyFeatures = [
    { icon: <Bed className="h-6 w-6" />, label: "4 Habitaciones" },
    { icon: <Bath className="h-6 w-6" />, label: "3 Baños" },
    { icon: <Car className="h-6 w-6" />, label: "2 Puestos de Autos" },
    { icon: <House className="h-6 w-6" />, label: "2,500 Mt2" }
  ];

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
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Slider and Timer */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4">
              <Timer endDate={endDate} />
            </div>
            
            <Carousel className="w-full">
              <CarouselContent>
                {propertyImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-video relative rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`Property image ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Right Column - Property Details */}
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-3xl font-bold mb-4">Nombre de la propiedad</h2>
              <p className="text-gray-300 mb-6">
                Localizada en Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {propertyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-200">
                    {feature.icon}
                    <span>{feature.label}</span>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full text-lg py-6"
                onClick={() => console.log("Buy tickets clicked")}
              >
                Comprar Tickets
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;