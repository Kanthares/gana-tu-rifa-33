import { useState } from "react";
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
  const [events, setEvents] = useState<any[]>(() => {
    const storedEvents = localStorage.getItem('events');
    return storedEvents ? JSON.parse(storedEvents) : [];
  });
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    propertyName: "",
    rooms: "",
    bathrooms: "",
    carStalls: "",
    squareMeters: "",
    duration: 7,
    images: [] as File[], // Asegúrate de que las imágenes sean archivos
    endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setEventData({ ...eventData, images: [...eventData.images, ...filesArray] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Crear el FormData
    const formData = new FormData();

    formData.append("titulo", eventData.title);
    formData.append("nombrePropiedad", eventData.propertyName);
    formData.append("habitaciones", eventData.rooms);
    formData.append("baños", eventData.bathrooms);
    formData.append("puestoAuto", eventData.carStalls);
    formData.append("tamaño", eventData.squareMeters);
    formData.append("descripcion", eventData.description);
    formData.append("duracion", eventData.duration.toString());

    // Agregar imágenes al FormData
    eventData.images.forEach((image) => {
      formData.append("img[]", image);
    });

    try {
      const response = await fetch("http://localhost/tu-archivo-php.php", { // Asegúrate de actualizar la URL
        method: "POST",
        body: formData, // Usar FormData para enviar los datos
      });

      const data = await response.json();

      if (data.status === "error") {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message, // Mostrar mensaje de error
        });
      } else {
        toast({
          title: "Success",
          description: selectedEvent ? "Event edited successfully" : "Event created successfully",
        });
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
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to connect to the server",
      });
    }
  };

  const removeImage = (index: number) => {
    setEventData({
      ...eventData,
      images: eventData.images.filter((_, i) => i !== index),
    });
  };

  const handleEventAction = (action: 'edit' | 'delete') => {
    if (events.length === 0) {
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

  const handleDeleteEvent = (eventToDelete: any) => {
    const newEvents = events.filter(event => event !== eventToDelete);
    setEvents(newEvents);
    localStorage.setItem('events', JSON.stringify(newEvents));
    toast({
      title: "Success",
      description: "Event has been successfully deleted",
    });
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
              navigate("/"); // Redirigir después del logout
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
              <Button onClick={() => handleEventAction('edit')} variant="outline">
                Edit Event
              </Button>
              <Button onClick={() => {
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
                  endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                });
              }} variant="default">
                Create Event
              </Button>
              <Button onClick={() => handleEventAction('delete')} variant="destructive">
                Delete Event
              </Button>
            </div>

            {/* Delete List */}
            {showDeleteList && events.length > 0 && (
              <div className="mt-4 space-y-4">
                <h3 className="text-lg font-semibold mb-2">Select an event to delete:</h3>
                {events.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                    <div>
                      <p className="text-lg font-medium">{event.title}</p>
                      <p className="text-sm text-gray-300">{event.propertyName}</p>
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
            {events.length > 0 && !showDeleteList && (
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
                  <p className="text-sm text-gray-300">{events[0].propertyName}</p>
                </div>
              </div>
            )}
          </div>

          {/* Event Form */}
          {showEventForm && (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 space-y-6">
              <h2 className="text-2xl font-bold">{selectedEvent ? "Edit Event" : "New Event"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={eventData.title}
                    onChange={(e) =>
                      setEventData({ ...eventData, title: e.target.value })
                    }
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
                  <label className="block text-sm font-medium mb-2">Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="bg-white/10 border-white/20 p-2"
                  />
                  <div className="mt-4 space-x-4">
                    {eventData.images.map((image, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-white/10 rounded-lg"
                      >
                        <span>{image.name}</span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="mt-4 w-full" variant="default">
                  {selectedEvent ? "Edit Event" : "Create Event"}
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
