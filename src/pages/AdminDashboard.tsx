import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Home, Upload, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showEventForm, setShowEventForm] = useState(false);
  const [events, setEvents] = useState<any[]>([]); // In a real app, this would be fetched from an API
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
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setEventData({ ...eventData, images: [...eventData.images, ...filesArray] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: "Event created successfully",
    });
    setShowEventForm(false);
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
    // Handle the action (edit or delete) here
    if (action === 'edit') {
      setShowEventForm(true);
    } else {
      // Handle delete
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
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
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
            <div className="flex gap-4">
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
          </div>

          {/* Event Form */}
          {showEventForm && (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 space-y-6">
              <h2 className="text-2xl font-bold">Create New Event</h2>
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
                  Create Event
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