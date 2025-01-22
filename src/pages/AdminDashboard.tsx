import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Home, Upload, Clock } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    duration: 7,
    image: null as File | null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEventData({ ...eventData, image: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    toast({
      title: "Success",
      description: "Event created successfully",
    });
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
                <label className="block text-sm font-medium mb-2">Image</label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="bg-white/10 border-white/20"
                  />
                  <Upload className="h-5 w-5" />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Create Event
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;