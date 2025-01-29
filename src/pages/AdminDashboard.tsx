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

  const [showEventForm, setShowEventForm] = useState(false);
  const [showDeleteList, setShowDeleteList] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);

  const [eventData, setEventData] = useState({
    id: "", // Nuevo campo para el ID
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

  // Función para obtener todos los eventos
  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost/GanaTuRifa/controller/Evento.php");
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch events",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setEventData({ ...eventData, images: [...eventData.images, ...filesArray] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id, title, description, propertyName, rooms, bathrooms, carStalls, squareMeters, duration } = eventData;

    const method = id ? "PUT" : "POST"; // Usar PUT si hay un ID, sino usara POST 
    const url = id
      ? `http://localhost/GanaTuRifa/controller/Evento.php?id=${id}`
      : "http://localhost/GanaTuRifa/controller/Evento.php";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id, // Incluir el ID en la solicitud
          titulo: title,
          propietario: propertyName,
          cuartos: rooms,
          baños: bathrooms,
          estacionamientos: carStalls,
          metrosCuadrados: squareMeters,
          descripcion: description,
          duracion: duration,
          img: "",
        }),
      });

      if (response.status === 201) {
        toast({
          title: "Success",
          description: id ? "Event updated successfully" : "Event created successfully",
        });
        fetchEvents(); // Refrescar la lista de eventos
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save event",
        });
      }
    } catch (error) {
      console.error(error);
    }

    setShowEventForm(false);
    setSelectedEvent(null);
    setEventData({
      id: "", // Reiniciar el ID
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

  const removeImage = (index: number) => {
    setEventData({
      ...eventData,
      images: eventData.images.filter((_, i) => i !== index),
    });
  };

  // Función para seleccionar un evento para editar
  const handleEditEvent = (event: any) => {
    setSelectedEvent(event);
    setEventData(event); // Llenar el formulario con los datos del evento seleccionado
    setShowEventForm(true);
    setShowDeleteList(false);
  };

  // Función para eliminar un evento
  const handleDeleteEvent = async (eventToDelete: any) => {
    try {
      const response = await fetch(`http://localhost/GanaTuRifa/controller/Evento.php?id=${eventToDelete.id}`, {
        method: "DELETE",
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "El evento se ha eliminado correctamente.",
        });
        fetchEvents(); // Refrescar la lista de eventos
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo eliminar el evento",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black text-white">
      <nav className="bg-white/10 backdrop-blur-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-white">
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
                    id: "", // Reiniciar el ID
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
                }}
                variant="default"
              >
                Create Event
              </Button>
              <Button onClick={() => setShowDeleteList(true)} variant="destructive">
                Delete Event
              </Button>
            </div>

            {/* Lista de eventos */}
            <div className="mt-4 space-y-4">
              <h3 className="text-lg font-semibold mb-2">Event List:</h3>
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 bg-white/10 rounded-lg"
                >
                  <div>
                    <p className="text-lg font-medium">{event.title}</p>
                    <p className="text-sm text-gray-300">{event.propertyName}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleEditEvent(event)}>
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeleteEvent(event)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulario de evento */}
          {showEventForm && (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 space-y-6">
              <h2 className="text-2xl font-bold">
                {selectedEvent ? "Edit Event" : "New Event"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={eventData.title}
                    onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                    className="bg-white/10 border-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Property Name</label>
                  <Input
                    value={eventData.propertyName}
                    onChange={(e) =>
                      setEventData({ ...eventData, propertyName: e.target.value })
                    }
                    className="bg-white/10 border-white/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rooms</label>
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
                    <label className="block text-sm font-medium mb-2">Bathrooms</label>
                    <Input
                      type="number"
                      value={eventData.bathrooms}
                      onChange={(e) =>
                        setEventData({ ...eventData, bathrooms: e.target.value })
                      }
                      min="0"
                      className="bg-white/10 border-white/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Car Stalls</label>
                    <Input
                      type="number"
                      value={eventData.carStalls}
                      onChange={(e) =>
                        setEventData({ ...eventData, carStalls: e.target.value })
                      }
                      min="0"
                      className="bg-white/10 border-white/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Square Meters</label>
                    <Input
                      type="number"
                      value={eventData.squareMeters}
                      onChange={(e) =>
                        setEventData({ ...eventData, squareMeters: e.target.value })
                      }
                      min="0"
                      className="bg-white/10 border-white/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={eventData.description}
                    onChange={(e) =>
                      setEventData({ ...eventData, description: e.target.value })
                    }
                    className="bg-white/10 border-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Duration (days)</label>
                  <Input
                    type="number"
                    value={eventData.duration}
                    onChange={(e) =>
                      setEventData({ ...eventData, duration: parseInt(e.target.value) })
                    }
                    min="1"
                    className="bg-white/10 border-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Images</label>
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