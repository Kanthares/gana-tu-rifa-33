import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface TicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (startNumber: number, quantity: number) => void;
}

const TicketModal: React.FC<TicketModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [startNumber, setStartNumber] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const startNum = parseInt(startNumber);
    const qty = parseInt(quantity);

    if (isNaN(startNum) || isNaN(qty)) {
      toast({
        title: "Invalid input",
        description: "Please enter valid numbers",
        variant: "destructive",
      });
      return;
    }

    if (qty <= 0) {
      toast({
        title: "Invalid quantity",
        description: "Quantity must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    try {
      // Enviar datos al servidor
      const response = await fetch("https://ganaturifa.com/api/controller/Tickets.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startNumber: startNum,
          quantity: qty,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Tickets submitted successfully",
        });
        onSubmit(startNum, qty); // Llamar a la función onSubmit del padre
        onOpenChange(false); // Cerrar el modal
        setStartNumber("");
        setQuantity("");
      } else {
        throw new Error("Error submitting tickets");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to submit tickets",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white/90 backdrop-blur-lg border border-gray-200 shadow-lg animate-modal-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light tracking-tight">Select Tickets</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Starting Number
            </label>
            <Input
              type="number"
              value={startNumber}
              onChange={(e) => setStartNumber(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
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
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
              placeholder="Enter quantity"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="hover:bg-gray-100 transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              Confirm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TicketModal;