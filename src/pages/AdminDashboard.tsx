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
    images: [] as File[],
    endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setEventData({ ...eventData, images: [...eventData.images, ...filesArray] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvents = selectedEvent 
      ? events.map(event => event === selectedEvent ? eventData : event)
      : [eventData, ...events];
    setEvents(newEvents);
    localStorage.setItem('events', JSON.stringify(newEvents));
    toast({
      title: "Success",
      description: selectedEvent ? "Event updated successfully" : "Event created successfully",
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
    } else {
      const newEvents = events.slice(1);
      setEvents(newEvents);
      localStorage.setItem('events', JSON.stringify(newEvents));
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black text-white">
      <nav className="bg-white/10 backdrop-blur-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-white">
            <Home className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">'Panel de Administrador'</h1>
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
            <h2 className="text-2xl font-bold mb-4">Editor de Eventos</h2>
            <div className="flex gap-4 mb-4">
              <Button onClick={() => handleEventAction('edit')} variant="outline">
                Edit Event
              </Button>
              <Button onClick={() => setShowEventForm(true)} variant="default">
                Create Event
              </Button>
              <Button onClick={() => handleEventAction('delete')} variant="destructive">
                Delete Event
              </Button>
            </div>
            {events.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Event:</h3>
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
