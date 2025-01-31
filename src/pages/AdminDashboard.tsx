import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Home, Upload } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Estado para almacenar los eventos, inicializando desde el servidor.
  const [events, setEvents] = useState<any[]>([]);

  // Estado para controlar la visibilidad del formulario y la lista de eliminación.
  const [showEventForm, setShowEventForm] = useState(false);
  const [showDeleteList, setShowDeleteList] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Estado para almacenar los datos del evento.
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    propertyName: "",
    rooms: "",
    bathrooms: "",
    carStalls: "",
    squareMeters: "",
    duration: 7,
    images: [] as File[],
    endDate: new Date(
      new Date().getTime() + 7 * 24 * 60 * 60 * 1000
    ).toISOString(),
  });

  // Obtener la lista de eventos al montar el componente
  useEffect(() => {
    fetch("https://ganaturifa.com/api/controller/Evento.php")
      .then((response) => {
        if (response.ok) {
          return response.json(); // Suponiendo que el servidor devuelve un JSON con la lista de eventos
        }
        throw new Error("Error al obtener eventos");
      })
      .then((data) => {
        setEvents(data); // Actualiza el estado con la lista de eventos
      })
      .catch((error) => {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los eventos",
        });
      });
  }, []); // El array vacío asegura que esto solo se ejecute una vez al montar

  // Maneja el cambio de imágenes al seleccionar archivos.
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setEventData({
        ...eventData,
        images: [...eventData.images, ...filesArray],
      });
    }
  };

  // Maneja el envío del formulario.
  // Maneja el envío del formulario.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    fetch("https://ganaturifa.com/api/controller/Evento.php", {
      method: selectedEvent ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (selectedEvent) {
          // Actualiza el evento existente
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event.id === selectedEvent.id ? { ...event, ...eventData } : event
            )
          );
        } else {
          // Agrega el nuevo evento
          setEvents((prevEvents) => [...prevEvents, eventData]);
        } // Asegúrate de que `setEvents` sea la función para actualizar tu lista de eventos
      })
      .catch((error) => console.error(error));

    setShowEventForm(false);
    setSelectedEvent(null);
    setEventData({
      title: "",
      description: "",
      propertyName: "",
      rooms: "",
      bathrooms: "",
      carStalls: "",
      squareMeters: "",
      duration: 7,
      images: [],
      endDate: new Date(
        new Date().getTime() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
    });
  };

  const removeImage = (index: number) => {
    setEventData({
      ...eventData,
      images: eventData.images.filter((_, i) => i !== index), // Filtra las imágenes, excluyendo la eliminada.
    });
  };
  // Maneja acciones de eventos como editar o eliminar.
  const handleEventAction = (action: "edit" | "delete") => {
    if (events.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There is no event",
      });
      return;
    }

    if (action === "edit") {
      setSelectedEvent(events[0]);
      setEventData(events[0]);
      setShowEventForm(true);
      setShowDeleteList(false);
    } else {
      setShowDeleteList(true);
      setShowEventForm(false);
    }
  };

  // Maneja la eliminación de un evento.
  const handleDeleteEvent = (eventToDelete: any) => {
    const newEvents = events.filter((event) => event !== eventToDelete);
    setEvents(newEvents);

    // Aquí puedes hacer la solicitud `DELETE` al servidor para eliminar el evento
    fetch(
      `https://ganaturifa.com/api/controller/Evento.php?id=${eventToDelete.id}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (response.ok) {
          toast({
            title: "Success",
            description: "Event has been successfully deleted",
          });
        } else {
          throw new Error("Error al eliminar el evento");
        }
      })
      .catch((error) => {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      });

    // Guarda la nueva lista en localStorage si es necesario
    // localStorage.setItem('events', JSON.stringify(newEvents));
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
              {/* <Button
                onClick={() => handleEventAction("edit")}
                variant="outline"
              >
                Edit Event
              </Button> */}
              <Button
                onClick={() => {
                  setShowEventForm(true);
                  setShowDeleteList(false);
                  setSelectedEvent(null);
                  setEventData({
                    title: "",
                    description: "",
                    propertyName: "",
                    rooms: "",
                    bathrooms: "",
                    carStalls: "",
                    squareMeters: "",
                    duration: 7,
                    images: [],
                    endDate: new Date(
                      new Date().getTime() + 7 * 24 * 60 * 60 * 1000
                    ).toISOString(),
                  });
                }}
                variant="default"
              >
                Create Event
              </Button>
              <Button
                onClick={() => handleEventAction("delete")}
                variant="destructive"
              >
                Delete Event
              </Button>
            </div>

            {showDeleteList && events.length > 0 && (
              <div className="mt-4 space-y-4">
                <h3 className="text-lg font-semibold mb-2">
                  Select an event to delete:
                </h3>
                {events.map((event) => (
                  <div
                    key={event.id} // Usa el ID único del evento
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
                    key={event.id} // Usa el ID único del evento
                    className="p-4 mb-2 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
                    onClick={() => {
                      setSelectedEvent(event); // Selecciona el evento actual
                      setEventData(event); // Carga los datos del evento en el formulario
                      setShowEventForm(true); // Muestra el formulario de eventos
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

          {showEventForm && (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 space-y-6">
              <h2 className="text-2xl font-bold">
                {selectedEvent ? "Edit Event" : "New Event"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campo para el título del evento */}
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

                {/* Campo para el nombre de la propiedad */}
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

                {/* Campos para habitaciones y baños */}
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

                {/* Campos para espacios de estacionamiento y metros cuadrados */}
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

                {/* Campo para la descripción del evento */}
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

                {/* Campo para la duración del evento */}
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

                {/* Campo para cargar imágenes */}
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
                        {eventData.images.map((image, index) => (
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
                              onClick={() => removeImage(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
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
      </div>
    </div>
  );
};

export default AdminDashboard;
