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

const UserDetails: React.FC<UserDetailsProps> = ({
  user,
  isPending,
  error,
}) => {
  if (isPending) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center">
        <SquareUser className="mx-auto size-20 animate-spin text-gray-400" />
        <p className="mt-2 text-center text-lg font-semibold text-gray-500">
          Loading user details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center">
        <SquareUser className="mx-auto size-20 text-red-500" />
        <p className="mt-2 text-center text-lg font-semibold text-red-500">
          Error loading user details.
        </p>
        {/* Conditionally render error details if needed */}
        {/* {typeof error === 'string' && <p className="text-center text-sm text-red-400">{error}</p>}
        {error instanceof Error && <p className="text-center text-sm text-red-400">{error.message}</p>} */}
      </div>
    );
  }

  if (!user || !user.info) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center">
        <SquareUser className="mx-auto size-20 text-gray-400" />
        <p className="mt-2 text-center text-2xl font-bold text-gray-600">
          Guest User
        </p>
        <p className="text-center text-sm text-gray-500">
          No user information available.
        </p>
      </div>
    );
  }

  const userInfo = user.info;

  return (
    <div className="mx-auto mt-8 max-w-md rounded-lg border-gray-200 bg-white p-8">
      <div className="mb-6 flex flex-col items-center">
        <SquareUser className="size-24" />
        <h2 className="mt-2 text-center text-3xl font-semibold text-gray-800">
          User Profile
        </h2>
        <p className="text-center text-gray-500">View account details below</p>
      </div>
      <div className="space-y-4">
        <div>
          <dt className="text-sm font-medium text-gray-500">Username</dt>
          <dd className="mt-1 text-lg font-semibold text-gray-900">
            {userInfo.username}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Email</dt>
          <dd className="mt-1 text-lg text-gray-700">{userInfo.email}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Role</dt>
          <dd className="mt-1 text-lg text-gray-700">{userInfo.role}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Created At</dt>
          <dd className="text-md mt-1 text-gray-600">
            {new Date(userInfo.createdAt).toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Updated At</dt>
          <dd className="text-md mt-1 text-gray-600">
            {new Date(userInfo.updatedAt).toLocaleString()}
          </dd>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
