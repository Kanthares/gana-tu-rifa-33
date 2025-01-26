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

  // visibilidad del formulario y la lista de eliminación.
  const [showEventForm, setShowEventForm] = useState(false);
  const [showDeleteList, setShowDeleteList] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null); 
  
  // Estado para almacenar los eventos, inicializando desde localStorage.
  const [events, setEvents] = useState<any[]>(() => {
    const storedEvents = localStorage.getItem('events'); // Obtiene los eventos almacenados.
    return storedEvents ? JSON.parse(storedEvents) : []; // Devuelve los eventos parseados o un array vacío.
  });

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
    // Crea una nueva lista de eventos, editando el evento seleccionado o agregando uno nuevo.
    const newEvents = selectedEvent 
      ? events.map(event => event === selectedEvent ? eventData : event) // Edita el evento seleccionado.
      : [eventData, ...events]; // Agrega el nuevo evento al principio.

    setEvents(newEvents); 
    localStorage.setItem('events', JSON.stringify(newEvents)); // Guarda la nueva lista en localStorage.
    
    //Esto es solo para que aparezca un mensaje de guardado, pero no funciona no se por que
    toast({
      title: "Success",
      description: selectedEvent ? "Event edited successfully" : "Event created successfully",
    });

    // Resetea el formulario y el estado del evento seleccionado.
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
    localStorage.setItem('events', JSON.stringify(newEvents)); // Guarda la nueva lista en localStorage.
    
    //Esto tampoco funciona, es otro mensaje
    toast({
      title: "Success",
      description: "Event has been successfully deleted",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black text-white">
      {/* Barra de navegación */}
      <nav className="bg-white/10 backdrop-blur-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Botón de inicio que redirige a la página principal */}
          <Button variant="ghost" onClick={() => navigate("/")} className="text-white">
            <Home className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Panel de Administrador</h1>
          {/* Botón de cierre de sesión */}
          <Button
            variant="ghost"
            onClick={() => {
              localStorage.removeItem("isAdmin"); // Elimina el estado de administrador del localStorage.
              navigate("/"); // Redirige a la página principal.
            }}
            className="text-white"
          >
            Logout
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Opciones de gestión de eventos */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Event Management</h2>
            <div className="flex gap-4 mb-4">
              {/* Botón para editar eventos */}
              <Button onClick={() => handleEventAction('edit')} variant="outline">
                Edit Event
              </Button>
              {/* Botón para crear un nuevo evento */}
              <Button onClick={() => {
                setShowEventForm(true); // Muestra el formulario de eventos.
                setShowDeleteList(false); // Oculta la lista de eliminación.
                setSelectedEvent(null); // Resetea el evento seleccionado.
                // Resetea los datos del evento.
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
              {/* Botón para eliminar eventos */}
              <Button onClick={() => handleEventAction('delete')} variant="destructive">
                Delete Event
              </Button>
            </div>

            {/* Lista de eliminación de eventos */}
            {showDeleteList && events.length > 0 && (
              <div className="mt-4 space-y-4">
                <h3 className="text-lg font-semibold mb-2">Select an event to delete:</h3>
                {events.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                    <div>
                      <p className="text-lg font-medium">{event.title}</p>
                      <p className="text-sm text-gray-300">{event.propertyName}</p>
                    </div>
                    {/* Botón para eliminar un evento específico */}
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

            {/* Muestra el evento actual */}
            {events.length > 0 && !showDeleteList && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Current Event:</h3>
                <div 
                  className="p-4 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
                  onClick={() => {
                    setSelectedEvent(events[0]); // Selecciona el primer evento.
                    setEventData(events[0]); // Carga los datos del evento en el formulario.
                    setShowEventForm(true); // Muestra el formulario de eventos.
                  }}
                >
                  <p className="text-lg font-medium">{events[0].title}</p>
                  <p className="text-sm text-gray-300">{events[0].propertyName}</p>
                </div>
              </div>
            )}
          </div>

          {/* Formulario de eventos */}
          {showEventForm && (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 space-y-6">
              <h2 className="text-2xl font-bold">{selectedEvent ? "Edit Event" : "New Event"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campo para el título del evento */}
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={eventData.title} // Valor del título.
                    onChange={(e) =>
                      setEventData({ ...eventData, title: e.target.value }) // Actualiza el título en el estado.
                    }
                    className="bg-white/10 border-white/20"
                  />
                </div>

                {/* Campo para el nombre de la propiedad */}
                <div>
                  <label className="block text-sm font-medium mb-2">Property Name</label>
                  <Input
                    value={eventData.propertyName} // Valor del nombre de la propiedad.
                    onChange={(e) =>
                      setEventData({ ...eventData, propertyName: e.target.value }) // Actualiza el nombre en el estado.
                    }
                    className="bg-white/10 border-white/20"
                  />
                </div>

                {/* Campos para habitaciones y baños */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rooms</label>
                    <Input
                      type="number" // Campo numérico para habitaciones.
                      value={eventData.rooms} // Valor de habitaciones.
                      onChange={(e) =>
                        setEventData({ ...eventData, rooms: e.target.value }) // Actualiza el número de habitaciones.
                      }
                      min="0" // Valor mínimo de 0.
                      className="bg-white/10 border-white/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bathrooms</label>
                    <Input
                      type="number" // Campo numérico para baños.
                      value={eventData.bathrooms} // Valor de baños.
                      onChange={(e) =>
                        setEventData({ ...eventData, bathrooms: e.target.value }) // Actualiza el número de baños.
                      }
                      min="0" // Valor mínimo de 0.
                      className="bg-white/10 border-white/20"
                    />
                  </div>
                </div>

                {/* Campos para espacios de estacionamiento y metros cuadrados */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Car Stalls</label>
                    <Input
                      type="number" // Campo numérico para espacios de estacionamiento.
                      value={eventData.carStalls} // Valor de espacios de estacionamiento.
                      onChange={(e) =>
                        setEventData({ ...eventData, carStalls: e.target.value }) // Actualiza el número de espacios.
                      }
                      min="0" // Valor mínimo de 0.
                      className="bg-white/10 border-white/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Square Meters</label>
                    <Input
                      type="number" // Campo numérico para metros cuadrados.
                      value={eventData.squareMeters} // Valor de metros cuadrados.
                      onChange={(e) =>
                        setEventData({ ...eventData, squareMeters: e.target.value }) // Actualiza los metros cuadrados.
                      }
                      min="0" // Valor mínimo de 0.
                      className="bg-white/10 border-white/20"
                    />
                  </div>
                </div>

                {/* Campo para la descripción del evento */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={eventData.description} // Valor de la descripción.
                    onChange={(e) =>
                      setEventData({ ...eventData, description: e.target.value }) // Actualiza la descripción en el estado.
                    }
                    className="bg-white/10 border-white/20"
                  />
                </div>

                {/* Campo para la duración del evento */}
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (days)</label>
                  <Input
                    type="number" // Campo numérico para la duración.
                    value={eventData.duration} // Valor de duración.
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        duration: parseInt(e.target.value), // Actualiza la duración en el estado.
                      })
                    }
                    min="1" // Valor mínimo de 1 día.
                    className="bg-white/10 border-white/20"
                  />
                </div>

                {/* Campo para cargar imágenes */}
                <div>
                  <label className="block text-sm font-medium mb-2">Images</label>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file" // Campo para seleccionar archivos.
                        onChange={handleImageChange} // Maneja el cambio de imagen.
                        accept="image/*" // Acepta solo archivos de imagen.
                        multiple // Permite seleccionar múltiples imágenes.
                        className="bg-white/10 border-white/20"
                      />
                      <Upload className="h-5 w-5" /> {/* Icono de carga */}
                    </div>
                    
                    {eventData.images.length > 0 && ( // Si hay imágenes seleccionadas.
                      <div className="grid grid-cols-2 gap-4">
                        {eventData.images.map((image, index) => ( // Mapea sobre las imágenes seleccionadas.
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(image)} // Crea una URL para la vista previa de la imagen.
                              alt={`Preview ${index + 1}`} // Texto alternativo para la imagen.
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            {/* Botón para eliminar la imagen */}
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)} // Maneja la eliminación de la imagen.
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Botón para enviar el formulario */}
                <Button type="submit" className="w-full">
                  {selectedEvent ? "Update Event" : "Create Event"} {/* Cambia el texto según el contexto. */}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; // Exporta el componente para su uso en otras partes de la aplicación.
