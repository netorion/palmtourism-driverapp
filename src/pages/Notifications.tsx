import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/useNotifications";

const Notifications = () => {
  const { driver } = useAuth();
  const queryClient = useQueryClient();
  const { notifications } = useNotifications();

  const deleteNotification = useMutation({
    mutationFn: async (notificationId: string) => {
      await fetch(`https://www.palmtourism-uae.net/api/notification/delete/${notificationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Success",
        description: "Notification deleted successfully",
      });
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      await fetch(`https://www.palmtourism-uae.net/api/notification/view/${notificationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  if (!notifications) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 pt-16">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      
      <div className="space-y-4">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card 
              key={notification.id}
              className={notification.is_read === "0" ? "border-primary" : ""}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <span>{notification.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteNotification.mutate(notification.id)}
                  >
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent 
                className="space-y-2 cursor-pointer"
                onClick={() => {
                  if (notification.is_read === "0") {
                    markAsRead.mutate(notification.id);
                  }
                }}
              >
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground">No notifications</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;