'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Label,
  TextField,
  Input,
  FieldError,
} from 'react-aria-components';

import {
  Button,
  TextArea,
  Modal,
} from '@heroui/react';

import { BiEdit } from 'react-icons/bi';

export function EditIdeaModal({ ideaId, refetch }) {
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch the data securely on component mount / ID change
  useEffect(() => {
    const fetchIdea = async () => {
      if (!ideaId) return;

      try {
        setLoading(true);

        // Retrieve token safely from wherever your auth client saves it
        const token = localStorage.getItem('token'); 

const {data:tokenData} = await authClient.token()

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/showalldata/${ideaId}`,
          {
            method: 'GET',
            headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${tokenData?.token}`
        },
            credentials: 'include',
          }
        );

        if (!res.ok) {
          // Extract backend message if it exists
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `Server responded with status ${res.status}`);
        }

        const data = await res.json();
        setIdea(data);
      } catch (err) {
        console.error("Fetch Error details:", err);
        toast.error(`Failed to load idea: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchIdea();
  }, [ideaId]);

  // 2. Submit changes via PATCH
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const updatedIdea = Object.fromEntries(formData.entries());

      // Parse tags back into array format for MongoDB
      if (updatedIdea.tags) {
        updatedIdea.tags = updatedIdea.tags.split(',').map(t => t.trim()).filter(Boolean);
      }

      const token = localStorage.getItem('token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/showalldata/${ideaId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
          credentials: 'include',
          body: JSON.stringify(updatedIdea),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update idea');
      }

      toast.success('Idea updated successfully');
      refetch?.();
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading idea data...</div>;
  if (!idea) return <div className="p-6 text-center text-danger">No idea found.</div>;

  // Format array tags to string representation for input presentation
  const initialTagsString = Array.isArray(idea.tags) ? idea.tags.join(', ') : '';

  return (
    <Modal>
      <Button variant="outline" className="rounded-none mt-5 mb-3">
        <BiEdit /> Edit
      </Button>
      <Modal.Backdrop>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-2xl">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Edit Idea</Modal.Heading>
              <p className="mt-1.5 text-sm text-muted">Update your idea information</p>
            </Modal.Header>
            <Modal.Body className="p-6">
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Title */}
                  <div className="md:col-span-2">
                    <TextField name="title" isRequired defaultValue={idea.title}>
                      <Label>Title</Label>
                      <Input className="w-full border rounded-xl px-3 py-2" />
                      <FieldError />
                    </TextField>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block mb-2 text-sm font-medium">Category</label>
                    <select name="category" defaultValue={idea.category} required className="w-full border rounded-xl px-3 py-2">
                      <option value="Tech">Tech</option>
                      <option value="Health">Health</option>
                      <option value="Education">Education</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>

                  {/* Tags */}
                  <div className="md:col-span-2">
                    <TextField name="tags" defaultValue={initialTagsString}>
                      <Label>Tags</Label>
                      <Input className="w-full border rounded-xl px-3 py-2" placeholder="AI, Startup" />
                      <FieldError />
                    </TextField>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <TextField name="description" defaultValue={idea.description}>
                      <Label>Description</Label>
                      <TextArea className="w-full border rounded-xl px-3 py-2" />
                      <FieldError />
                    </TextField>
                  </div>

                </div>
                <Modal.Footer>
                  <Button type="submit" color="primary">Save Changes</Button>
                </Modal.Footer>
              </form>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}