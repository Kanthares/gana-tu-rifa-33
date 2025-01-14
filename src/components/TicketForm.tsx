import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ArrowLeft, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type FormData = {
  name: string;
  lastName: string;
  email: string;
  phone: string;
};

const TICKET_PRICE_BS = 65;
const TICKET_PRICE_USD = 1;

const TicketForm = () => {
  const [ticketCount, setTicketCount] = useState(1);
  const form = useForm<FormData>();
  const navigate = useNavigate();

  const handleIncrement = () => {
    setTicketCount((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setTicketCount((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const onSubmit = (data: FormData) => {
    console.log({ ...data, ticketCount });
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

            {/* Contact Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
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