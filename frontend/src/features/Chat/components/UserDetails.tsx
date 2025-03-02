import { SquareUser } from "lucide-react";
import React from "react";

interface UserInfo {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface UserResponse {
  message: string;
  info?: UserInfo;
}

interface UserDetailsProps {
  user?: UserResponse;
  isPending?: boolean;
  error?: unknown;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  if (!user || !user.info)
    return (
      <div className="mt-6">
        <SquareUser className="mx-auto size-20" />
        <p className="text-center text-2xl font-bold">Guest</p>
      </div>
    );

  const userInfo = user.info;

  return (
    <div className="mx-auto h-screen max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
      <SquareUser className="mx-auto size-20" />
      <h2 className="mb-4 text-center text-2xl font-bold">User Details</h2>
      <div className="space-y-2">
        <p>
          <span className="font-semibold">Name:</span> {userInfo.username}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {userInfo.email}
        </p>
        <p>
          <span className="font-semibold">Role:</span> {userInfo.role}
        </p>
        <p>
          <span className="font-semibold">Created At:</span>{" "}
          {new Date(userInfo.createdAt).toLocaleString()}
        </p>
        <p>
          <span className="font-semibold">Updated At:</span>{" "}
          {new Date(userInfo.updatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default UserDetails;
