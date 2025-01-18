import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../features/admin/api/admin";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const ManageUsers = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <>
      <h3 className="font-bold">Users:</h3>
      {data?.length &&
        data.map((user: User) => (
          <ul key={user._id} className="mb-4 border border-black p-4">
            <li>ID: {user._id}</li>
            <li>USERNAME: {user.username}</li>
            <li>EMAIL: {user.email}</li>
            <li>ROLE: {user.role}</li>
          </ul>
        ))}
    </>
  );
};

export default ManageUsers;
