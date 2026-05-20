"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { BiEdit, BiUser } from "react-icons/bi";

const UpdateUserModal=()=> {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    const form = e.target;
    const name = form.name.value;
    const image = form.image.value;

    try {
      await authClient.updateUser({
        name,
        image,
      });

      form.reset();
      document.getElementById("update_user_modal").close();
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Open Modal Button */}
      <button
        className="btn bg-gradient-to-r from-[#C9A227] to-[#D4AF37] text-[#0F3D2E] font-bold border-none hover:from-[#B8941F] hover:to-[#C9A227]"
        onClick={() =>
          document.getElementById("update_user_modal").showModal()
        }
      >
        <BiEdit className="text-xl" />
        Update Profile
      </button>

      {/* DaisyUI Modal */}
      <dialog id="update_user_modal" className="modal">
        <div className="modal-box max-w-md rounded-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-yellow-100 p-3 rounded-full">
              <BiUser className="text-2xl text-yellow-700" />
            </div>
            <h3 className="font-bold text-xl">Update User</h3>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Name */}
            <div className="form-control">
              <label className="label font-semibold">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Image URL */}
            <div className="form-control">
              <label className="label font-semibold">Image URL</label>
              <input
                type="url"
                name="image"
                placeholder="Enter image URL"
                className="input input-bordered w-full"
              />
            </div>

            {/* Footer Buttons */}
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() =>
                  document.getElementById("update_user_modal").close()
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn bg-gradient-to-r from-[#C9A227] to-[#D4AF37] text-[#0F3D2E] border-none"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
export default UpdateUserModal