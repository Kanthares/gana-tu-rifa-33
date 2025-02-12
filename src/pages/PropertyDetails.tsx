import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Timer from "@/components/Timer";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Car, House, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";

const PropertyDetails = () => {
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    const storedEvent = localStorage.getItem("selectedEvent");
    if (storedEvent) {
      setEvent(JSON.parse(storedEvent));
    }
  }, []);

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-black text-white flex items-center justify-center">
        <p>No event selected</p>
      </div>
    );
  }

  const propertyFeatures = [
    { icon: <Bed className="h-6 w-6" />, label: `${event.rooms} Habitaciones` },
    { icon: <Bath className="h-6 w-6" />, label: `${event.bathrooms} Baños` },
    {
      icon: <Car className="h-6 w-6" />,
      label: `${event.carStalls} Puestos de Autos`,
    },
    { icon: <House className="h-6 w-6" />, label: `${event.squareMeters} Mt2` },
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
                    onClick={() => navigate("/")}
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
              <Timer
                endDate={
                  new Date(
                    event.endDate ||
                      new Date().getTime() +
                        event.duration * 24 * 60 * 60 * 1000
                  )
                }
              />
            </div>

            <Carousel className="w-full">
              <CarouselContent>
                {Array.isArray(event.images) && event.images.length > 0 ? (
                  event.images.map((image: File, index: number) => (
                    <CarouselItem key={index}>
                      <div className="aspect-video relative rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Property image ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem>
                    <div className="aspect-video relative rounded-lg overflow-hidden">
                      <img
                        src="/placeholder.svg"
                        alt="Placeholder image"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Right Column - Property Details */}
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-3xl font-bold mb-4">{event.propertyName}</h2>
              <p className="text-gray-300 mb-6">{event.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {propertyFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-gray-200"
                  >
                    {feature.icon}
                    <span>{feature.label}</span>
                  </div>
                ))}
              </div>

              <Button
                className="w-full text-lg py-6"
                onClick={() => navigate("/buy-tickets")}
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
