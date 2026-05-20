"use client";

import UpdateUserModal from "@/components/UpdateUserModal";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

const ProfilePage = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex justify-center mt-10">
        <p className="text-lg font-semibold text-red-500">
          Please log in first.
        </p>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="flex justify-center mt-10 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border">
        <div className="card-body items-center text-center">
          {/* Avatar */}
          <div className="avatar mb-4">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={96}
                  height={96}
                  className="rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-primary text-white text-3xl font-bold">
                  {user.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <h2 className="card-title text-2xl font-bold">
            {user.name || "Unknown User"}
          </h2>

          <p className="text-gray-500 mb-4">
            {user.email || "No email available"}
          </p>

          <UpdateUserModal />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;