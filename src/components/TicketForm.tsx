import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ArrowLeft, Home, TicketIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type FormData = {
  name: string;
  lastName: string;
  email: string;
  phone: string;
};

interface Ticket {
  number: number;
  status: string;
}

const TICKET_PRICE_BS = 65;
const TICKET_PRICE_USD = 1;

const TicketForm = () => {
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [formEnabled, setFormEnabled] = useState(false);
  const [selectedTicketsLabel, setSelectedTicketsLabel] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<FormData>();
  const navigate = useNavigate();

  // Obtener los tickets desde la API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("https://ganaturifa.com/api/controller/Tickets.php");
        if (response.ok) {
          const data = await response.json();
          setTickets(data); // Asume que la API devuelve un array de tickets
        } else {
          throw new Error("Error fetching tickets");
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to fetch tickets",
          variant: "destructive",
        });
      }
    };

    fetchTickets();
  }, []);

  const handleIncrement = () => {
    setTicketCount((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setTicketCount((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleTicketSelect = (ticketNumber: number) => {
    setSelectedTickets(prev => {
      if (prev.includes(ticketNumber)) {
        return prev.filter(t => t !== ticketNumber);
      } else {
        return [...prev, ticketNumber];
      }
    });
  };

  const handleTicketConfirm = () => {
    if (selectedTickets.length > 0) {
      setFormEnabled(true);
      setSelectedTicketsLabel(`Selected tickets: ${selectedTickets.join(', ')}`);
      setIsOpen(false);
      toast({
        title: "Tickets Selected",
        description: `Selected tickets: ${selectedTickets.join(', ')}`,
      });
    }
  };

  const onSubmit = (data: FormData) => {
    console.log({ ...data, ticketCount, selectedTickets });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black text-white">
      {/* Navigation Menu */}
      <nav className="bg-white/10 backdrop-blur-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-white hover:text-white/80"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link to="/">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white/80"
              >
                <Home className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <h1 className="text-xl font-bold">Comprar Tickets</h1>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 space-y-6">
            {/* Ticket Counter */}
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDecrement}
                  className="h-10 w-10 rounded-full p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-2xl font-bold min-w-[3ch] text-center">
                  {ticketCount}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleIncrement}
                  className="h-10 w-10 rounded-full p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Price Display */}
              <div className="space-y-2 text-center">
                <p className="text-lg">
                  Monto en Bs: {(ticketCount * TICKET_PRICE_BS).toFixed(2)} Bs
                </p>
                <p className="text-lg">
                  Monto en $: {(ticketCount * TICKET_PRICE_USD).toFixed(2)} USD
                </p>
              </div>
            </div>

            {/* Ticket Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Select your tickets</h3>
              <div className="space-y-4">
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full bg-black/50 border-gray-700 hover:bg-black/70"
                    >
                      <TicketIcon className="mr-2 h-4 w-4" />
                      Select Tickets
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-black/90 border-gray-700">
                    <DialogHeader>
                      <DialogTitle>Select Your Tickets</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col h-[300px]">
                      <ScrollArea className="flex-grow">
                        <div className="grid grid-cols-5 gap-2 p-4">
                          {tickets.map((ticket) => (
                            <button
                              key={ticket.number}
                              onClick={() => handleTicketSelect(ticket.number)}
                              className={`p-3 rounded-lg text-center transition-all ${
                                selectedTickets.includes(ticket.number)
                                  ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                                  : 'bg-black/50 hover:bg-black/70 text-gray-200'
                              }`}
                            >
                              {ticket.number}
                            </button>
                          ))}
                        </div>
                      </ScrollArea>
                      <div className="p-4 border-t border-gray-700 mt-2">
                        <Button
                          onClick={handleTicketConfirm}
                          disabled={selectedTickets.length === 0}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          Accept
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {selectedTicketsLabel && (
                  <div className="p-2 bg-purple-600/20 rounded-md text-sm">
                    {selectedTicketsLabel}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={`space-y-4 ${!formEnabled && 'opacity-50 pointer-events-none'}`}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese su nombre"
                          {...field}
                          className="bg-white/10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese su apellido"
                          {...field}
                          className="bg-white/10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Ingrese su email"
                          {...field}
                          className="bg-white/10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Ingrese su teléfono"
                          {...field}
                          className="bg-white/10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Confirmar Compra
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;