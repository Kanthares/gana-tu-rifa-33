import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input"; 
import { Textarea } from "@/components/ui/textarea"; 
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Home, Upload } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast(); 

  // Visibilidad del formulario y la lista de eliminación.
  const [showEventForm, setShowEventForm] = useState(false);
  const [showDeleteList, setShowDeleteList] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null); 
  
  // Estado para almacenar los eventos.
  const [events, setEvents] = useState<any[]>([]);

  // Obtener los eventos desde el archivo JSON en la carpeta "public".
  useEffect(() => {
    fetch("/eventos.json") // Ruta del JSON en la carpeta "public"
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Datos cargados:", data); // Verifica los datos cargados
        if (Array.isArray(data)) {
          setEvents(data); // Asigna los datos si es un array
        } else {
          console.error("El archivo JSON no es un array:", data);
          setEvents([]); // Asigna un array vacío si el JSON no es válido
        }
      })
      .catch((error) => console.error("Error al obtener datos:", error));
  }, []);

  // Esto es para guardar los datos del evento que se está creando o editando.
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
    endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), 
  });

  // Maneja el cambio de imágenes al seleccionar archivos.
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) { // Verifica si hay archivos seleccionados.
      const filesArray = Array.from(e.target.files); // Convierte los archivos a un array.
      // Actualiza el estado de eventData para incluir las nuevas imágenes.
      setEventData({ ...eventData, images: [...eventData.images, ...filesArray] });
    }
  };

  // Maneja el envío del formulario.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const titulo = eventData.title;
    const propietario = eventData.propertyName;
    const cuartos = eventData.rooms;
    const baños = eventData.bathrooms;
    const estacionamientos = eventData.carStalls;
    const metrosCuadrados = eventData.squareMeters;
    const descripcion = eventData.description;
    const duracion = eventData.duration;
    const img = "";

    fetch("http://localhost/GanaTuRifa/controller/Evento.php", {
      method: selectedEvent ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        titulo,
        propietario,
        cuartos,
        baños,
        estacionamientos,
        metrosCuadrados,
        descripcion,
        duracion,
        img,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          const newEvent = { ...eventData }; 
          setEvents((prevEvents) =>
            selectedEvent
              ? prevEvents.map((event) =>
                  event === selectedEvent ? newEvent : event
                )
              : [newEvent, ...prevEvents]
          );
          toast({
            title: "Success",
            description: selectedEvent
              ? "Event edited successfully"
              : "Event created successfully",
          });
        } else if (response.status === 404) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Event not found",
          });
        }
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
      endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  };

  // Elimina una imagen del estado de eventData.
  const removeImage = (index: number) => {
    setEventData({
      ...eventData,
      images: eventData.images.filter((_, i) => i !== index), // Filtra las imágenes, excluyendo la eliminada.
    });
  };

  // Maneja acciones de eventos como editar o eliminar.
  const handleEventAction = (action: 'edit' | 'delete') => {
    if (events.length === 0) { // Verifica si hay eventos disponibles.
      // Muestra un mensaje de error si no hay eventos.
      toast({
        variant: "destructive",
        title: "Error",
        description: "There is no event",
      });
      return; 
    }
    
    if (action === 'edit') { 
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
    const newEvents = events.filter(event => event !== eventToDelete); // Filtra el evento a eliminar.
    setEvents(newEvents); // Actualiza el estado de eventos.
    
    toast({
      title: "Success",
      description: "Event has been successfully deleted",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black text-white">
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
          {/* Event Management Options */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Event Management</h2>
            <div className="flex gap-4 mb-4">
              <Button
                onClick={() => handleEventAction("edit")}
                variant="outline"
              >
                Edit Event
              </Button>
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

            {/* Delete List */}
            {showDeleteList && Array.isArray(events) && events.length > 0 && (
              <div className="mt-4 space-y-4">
                <h3 className="text-lg font-semibold mb-2">
                  Select an event to delete:
                </h3>
                {events.map((event, index) => (
                  <div
                    key={index}
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

            {/* Current Event Display */}
            {Array.isArray(events) && events.length > 0 && !showDeleteList && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Current Event:</h3>
                <div
                  className="p-4 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
                  onClick={() => {
                    setSelectedEvent(events[0]);
                    setEventData(events[0]);
                    setShowEventForm(true);
                  }}
                >
                  <p className="text-lg font-medium">{events[0].title}</p>
                  <p className="text-sm text-gray-300">
                    {events[0].propertyName}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Event Form */}
          {showEventForm && (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 space-y-6">
              <h2 className="text-2xl font-bold">
                {selectedEvent ? "Edit Event" : "New Event"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
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