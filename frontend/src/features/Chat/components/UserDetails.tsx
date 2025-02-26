// UserDetails.tsx
import React from "react";

interface UserDetailsProps {
  user?: {
    _id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  isPending: boolean;
  error: unknown;
}

const UserDetails: React.FC<UserDetailsProps> = ({
  user,
  isPending,
  error,
}) => {
  if (isPending) return <p>Loading user details...</p>;
  if (error) return <p>Error loading user details.</p>;
  if (!user) return <p>No user details available.</p>;

  return (
    <div className="border p-4">
      <h2 className="text-lg font-bold">User Details</h2>
      <p>
        <strong>Name:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
      <p>
        <strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}
      </p>
      <p>
        <strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}
      </p>
    </div>
  );
};

export default UserDetails;
