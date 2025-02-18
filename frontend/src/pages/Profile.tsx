import useAuthStore from "@/features/Auth/stores/useAuthStore";
import useGetReservations from "@/features/Events/hooks/useGetReservations";
import { CircleUserRound } from "lucide-react";

// Define interfaces for explicit types
interface User {
  _id: string;
  username: string;
  email: string;
}

interface CartItem {
  _id: string;
  title: string;
  quantity: number;
  totalPrice: number;
  image: string;
}

interface Reservation {
  _id: string;
  userId: User;
  fullName: string;
  contactNumber: string;
  partySize: number;
  date: string;
  startTime: string;
  endTime: string;
  eventType: string;
  cart: CartItem[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ReservationData {
  reservations: Reservation[];
}

const Profile = () => {
  const { user } = useAuthStore();
  // Cast hook data to our ReservationData type
  const { data } = useGetReservations() as { data?: ReservationData };

  // Extract the logged-in user's ID
  const userId: string | undefined = user?._id;

  // Filter reservations to include only those for the current user
  const userReservations: Reservation[] =
    data?.reservations.filter(
      (reservation: Reservation) => reservation.userId._id === userId,
    ) || [];

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl md:border">
      {/* Header Section */}
      <div className="relative h-32 bg-primary"></div>

      {/* Profile Info */}
      <div className="px-5">
        <div className="relative flex flex-col items-center">
          {/* Profile Image */}
          <CircleUserRound className="absolute -top-10 h-20 w-20 rounded-full bg-white p-1 shadow-md" />
          <h3 className="mt-12 text-lg font-semibold">{user?.username}</h3>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-4 w-full bg-gray-100">
        <ul className="flex flex-wrap justify-between gap-2 px-5 py-3 text-sm font-medium text-gray-600 lg:px-20">
          <li className="border-b-2 border-black pb-2 text-black">Schedule</li>
          <li>History</li>
          <li>Cancelled</li>
          <li>Favorites</li>
          <li>Notifications</li>
        </ul>
      </div>

      {/* User Reservations */}
      <div className="p-5">
        <h3 className="text-lg font-semibold">Your Reservations</h3>
        {userReservations.length > 0 ? (
          userReservations.map((reservation: Reservation) => (
            <div key={reservation._id} className="my-4 rounded border p-3">
              <p>
                <strong>Date:</strong>{" "}
                {new Date(reservation.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Event:</strong> {reservation.eventType}
              </p>
              <p>
                <strong>Party Size:</strong> {reservation.partySize}
              </p>
              <p>
                <strong>Status:</strong> {reservation.status}
              </p>
              {/* Map over the cart items */}
              {reservation.cart.map((item: CartItem) => (
                <div key={item._id} className="my-2 flex items-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-12 w-12 rounded object-cover"
                  />
                  <div className="ml-4">
                    <p className="font-semibold">{item.title}</p>
                    <p>
                      {item.quantity} x ₱{item.totalPrice}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No reservations found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
