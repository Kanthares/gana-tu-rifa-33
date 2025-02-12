import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Home, Upload, CheckSquare, XSquare, HelpCircle } from "lucide-react";
import TicketModal from "@/components/TicketModal";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Estados para el manejo de tickets
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketRange, setTicketRange] = useState<string>("");

  // Estados para el manejo de eventos
  const [events, setEvents] = useState<any[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showDeleteList, setShowDeleteList] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  // Estos son tickets de prueba, lo puedes quitar, era pa ve como se veian
  const [tickets, setTickets] = useState<any[]>([]);

  // Estado para almacenar los datos del evento
  const [eventData, setEventData] = useState({
    id: "", // Agrega esta línea para almacenar el ID
    title: "",
    description: "",
    propertyName: "",
    rooms: "",
    bathrooms: "",
    carStalls: "",
    squareMeters: "",
    duration: 7,
    startNumber: "",
    quantity: "",
    images: [] as File[],
    endDate: new Date(
      new Date().getTime() + 7 * 24 * 60 * 60 * 1000
    ).toISOString(),
    ticketRange: "",
  });

  // { id: 1, number: "001", status: "in-review" },
  //   { id: 2, number: "002", status: "in-review" },
  // Función para obtener eventos desde el servidor
  const fetchEvents = async () => {
    try {
      const response = await fetch(
        "https://ganaturifa.com/api/controller/Evento.php"
      );
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        throw new Error("Error al obtener eventos");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los eventos",
      });
    }
  };
  //Obtenet los tickets en reservados
  const fetchTickets = async () => {
    try {
      const response = await fetch(
        "https://ganaturifa.com/api/controller/Tickets.php"
      );
      if (response.ok) {
        const data = await response.json();
        setTickets(data); // Actualiza el estado de los ticket con los datos obtenidos del fetch
      } else {
        throw new Error("Error al obtener tickets");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los tickets",
      });
    }
  };

  // Obtener la lista de eventos al montar el componente
  useEffect(() => {
    fetchEvents();
    fetchTickets();
  }, []);

  // Maneja el cambio de imágenes al seleccionar archivos
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setEventData({
        ...eventData,
        images: [...eventData.images, ...filesArray],
      });
    }
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //Dependiendo del id se envia un PUT Json o un POST formData
    if (eventData.id) {
      //PUT
      try {
        const response = await fetch(
          "https://ganaturifa.com/api/controller/Evento.php",
          {
            method: "PUT",
            body: JSON.stringify(eventData),
          }
        );

        if (response.ok) {
          fetchEvents();
          toast({
            title: "Success",
            description: selectedEvent
              ? "Event updated successfully"
              : "Event created successfully",
          });
        } else {
          throw new Error("Error al enviar los datos");
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo enviar el evento",
        });
      }
    } else {
      //POST
      //Se agregan los datos a la variable
      const formData = new FormData();
      formData.append("title", eventData.title);
      formData.append("description", eventData.description);
      formData.append("propertyName", eventData.propertyName);
      formData.append("rooms", eventData.rooms);
      formData.append("bathrooms", eventData.bathrooms);
      formData.append("carStalls", eventData.carStalls);
      formData.append("squareMeters", eventData.squareMeters);
      formData.append("duration", eventData.duration.toString());
      formData.append("startNumber", eventData.startNumber);
      formData.append("quantity", eventData.quantity);

      // eventData.images.forEach((image, index) => {
      //   formData.append(`images[${index}]`, image);
      // });

      try {
        const response = await fetch(
          "https://ganaturifa.com/api/controller/Evento.php",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          fetchEvents();
          toast({
            title: "Success",
            description: selectedEvent
              ? "Event updated successfully"
              : "Event created successfully",
          });
        } else {
          throw new Error("Error al enviar los datos");
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo enviar el evento",
        });
      }
    }

    setShowEventForm(false);
    setSelectedEvent(null);
    setEventData({
      id: "", //  Almacenar el ID
      title: "",
      description: "",
      propertyName: "",
      rooms: "",
      bathrooms: "",
      carStalls: "",
      squareMeters: "",
      duration: 7,
      startNumber: "",
      quantity: "",
      images: [],
      endDate: new Date(
        new Date().getTime() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      ticketRange: "",
    });
  };

  // Maneja la eliminación de un evento
  const handleDeleteEvent = async (eventToDelete: any) => {
    try {
      const response = await fetch(
        `https://ganaturifa.com/api/controller/Evento.php?id=${eventToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchEvents();
        toast({
          title: "Success",
          description: "Event has been successfully deleted",
        });
      } else {
        throw new Error("Error al eliminar el evento");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  // Maneja la selección de tickets
  const handleTicketSubmit = (startNumber: number, quantity: number) => {
    const range = `${startNumber} to ${startNumber + quantity - 1}`;
    setTicketRange(range);
    setEventData({ ...eventData, ticketRange: range });
    toast({
      title: "Tickets Selected",
      description: `Selected tickets from ${range}`,
    });
  };

  // Función para manejar el clic en "Ticket Status"
  const handleTicketStatusClick = () => {
    // Aquí puedes redirigir a una página de estado de tickets o abrir un modal
    toast({
      title: "Ticket Status",
      description: "Mostrando el estado de los tickets...",
    });
    // Ejemplo: navigate('/ticket-status');
  };

  // Función para manejar el cambio de estado de los tickets
  const handleStatusChange = async (ticketId: number,eventId: number, newStatus: string) => {
    try {
      const response = await fetch(
        `https://ganaturifa.com/api/controller/Tickets.php`,
        {
          method: "PUT", // O "PATCH" dependiendo de tu API
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: ticketId, event: eventId, status: newStatus }), // Envía el nuevo estado
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data); 
        fetchTickets();
      } else {
        throw new Error("Error al obtener tickets");
      }


      // Actualiza el estado local de los tickets
      // fetchTickets();

      toast({
        title: "Estado Actualizado",
        description: `El estado del ticket ha sido actualizado a ${newStatus}`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black text-white">
      {/* Barra de navegación */}
      <nav className="bg-white/10 backdrop-blur-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-white"
          >
            <Home className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Panel de Administrador</h1>
          <Button
            variant="ghost"
            onClick={() => {
              localStorage.removeItem("isAdmin");
              navigate("/");
            }}
            className="text-white"
          >
            Logout
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Event Management</h2>
            <div className="flex gap-4 mb-4">
              <Button
                onClick={() => {
                  setShowEventForm(true);
                  setShowDeleteList(false);
                  setSelectedEvent(null);
                  setEventData({
                    id: "", // Agrega esta línea para almacenar el ID
                    title: "",
                    description: "",
                    propertyName: "",
                    rooms: "",
                    bathrooms: "",
                    carStalls: "",
                    squareMeters: "",
                    duration: 7,
                    startNumber: "",
                    quantity: "",
                    images: [],
                    endDate: new Date(
                      new Date().getTime() + 7 * 24 * 60 * 60 * 1000
                    ).toISOString(),
                    ticketRange: "",
                  });
                }}
                variant="default"
              >
                Create Event
              </Button>
              <Button
                onClick={() => setShowDeleteList(true)}
                variant="destructive"
              >
                Delete Event
              </Button>
              {/* Botón de Ticket Status */}
              <Button variant="outline" onClick={handleTicketStatusClick}>
                Ticket Status
              </Button>
            </div>

            {showDeleteList && events.length > 0 && (
              <div className="mt-4 space-y-4">
                <h3 className="text-lg font-semibold mb-2">
                  Select an event to delete:
                </h3>
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 bg-white/10 rounded-lg"
                  >
                    <div>
                      <p className="text-lg font-medium">{event.title}</p>
                      <p className="text-sm text-gray-300">
                        {event.propertyName}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteEvent(event)}
                      size="sm"
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {events.length > 0 && !showDeleteList && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Current Events:</h3>
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 mb-4 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
                    onClick={() => {
                      setSelectedEvent(event);
                      setEventData(event);
                      setShowEventForm(true);
                    }}
                  >
                    <p className="text-lg font-medium">{event.title}</p>
                    <p className="text-sm text-gray-300">
                      {event.propertyName}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sección de Status Tickets */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 mb-6">
            <h2 className="text-xl font-medium mb-4">Status Tickets</h2>
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center gap-4 p-4 bg-white/10 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-yellow-500" />
                    <span>Ticket #{ticket.nroTicket} - Event #{ticket.evento_id} - In Review</span>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusChange(ticket.id, ticket.evento_id,"approved")}
                      className="hover:bg-green-500/20"
                    >
                      <CheckSquare className="h-5 w-5 text-green-500" />
                      <span className="ml-2">Approved</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusChange(ticket.id, ticket.evento_id,"denied")}
                      className="hover:bg-red-500/20"
                    >
                      <XSquare className="h-5 w-5 text-red-500" />
                      <span className="ml-2">Denied</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showEventForm && (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 space-y-6">
              <h2 className="text-2xl font-bold">
                {selectedEvent ? "Edit Event" : "New Event"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campos del formulario */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title
                  </label>
                  <Input
                    value={eventData.title}
                    onChange={(e) =>
                      setEventData({ ...eventData, title: e.target.value })
                    }
                    className="bg-white/10 border-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Property Name
                  </label>
                  <Input
                    value={eventData.propertyName}
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        propertyName: e.target.value,
                      })
                    }
                    className="bg-white/10 border-white/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rooms
                    </label>
                    <Input
                      type="number"
                      value={eventData.rooms}
                      onChange={(e) =>
                        setEventData({ ...eventData, rooms: e.target.value })
                      }
                      min="0"
                      className="bg-white/10 border-white/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Bathrooms
                    </label>
                    <Input
                      type="number"
                      value={eventData.bathrooms}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          bathrooms: e.target.value,
                        })
                      }
                      min="0"
                      className="bg-white/10 border-white/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Car Stalls
                    </label>
                    <Input
                      type="number"
                      value={eventData.carStalls}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          carStalls: e.target.value,
                        })
                      }
                      min="0"
                      className="bg-white/10 border-white/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Square Meters
                    </label>
                    <Input
                      type="number"
                      value={eventData.squareMeters}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          squareMeters: e.target.value,
                        })
                      }
                      min="0"
                      className="bg-white/10 border-white/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <Textarea
                    value={eventData.description}
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        description: e.target.value,
                      })
                    }
                    className="bg-white/10 border-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Duration (days)
                  </label>
                  <Input
                    type="number"
                    value={eventData.duration}
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        duration: parseInt(e.target.value),
                      })
                    }
                    min="1"
                    className="bg-white/10 border-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Starting Number
                  </label>
                  <Input
                    type="number"
                    value={eventData.startNumber}
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        startNumber: e.target.value,
                      })
                    }
                    className="bg-white/10 border-white/20"
                    placeholder="Enter starting number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Quantity
                  </label>
                  <Input
                    type="number"
                    value={eventData.quantity}
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        quantity: e.target.value,
                      })
                    }
                    min="0"
                    className="bg-white/10 border-white/20"
                    placeholder="Enter quantity"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Images
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        multiple
                        className="bg-white/10 border-white/20"
                      />
                      <Upload className="h-5 w-5" />
                    </div>

                    {eventData.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-4">
                        {/* {eventData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                const newImages = eventData.images.filter(
                                  (_, i) => i !== index
                                );
                                setEventData({
                                  ...eventData,
                                  images: newImages,
                                });
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))} */}
                      </div>
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  {selectedEvent ? "Update Event" : "Create Event"}
                </Button>
              </form>
            </div>
          )}
        </div>

        <TicketModal
          open={isTicketModalOpen}
          onOpenChange={setIsTicketModalOpen}
          onSubmit={handleTicketSubmit}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
