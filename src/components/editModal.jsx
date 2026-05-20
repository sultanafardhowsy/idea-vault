"use client";

import { Envelope } from "@gravity-ui/icons";
import {
  Label,
  TextField,
  Input,
  FieldError
} from "react-aria-components";

import {
  Button,
  TextArea,
  Modal
} from "@heroui/react";

import { BiEdit } from "react-icons/bi";

export function EditModal({destination}) {
 console.log(idea);
  const {_id,title,category, imageUrl, funding, founder, status,tags, description } = idea;


    const onSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const destination = Object.fromEntries(formData.entries())

        console.log(destination)


        const res = await fetch(`http://localhost:5000/showalldata/${_id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(destination)
        })

        const data = await res.json()
        console.log(data);

    }
    return (
        <Modal>
            
                <Button variant='outline' className={'rounded-none mt-5 mb-3'}><BiEdit></BiEdit>Edit</Button>
            
            <Modal.Backdrop>
                <Modal.Container placement="auto">
                    <Modal.Dialog className="sm:max-w-lg">
                        <Modal.CloseTrigger />
                        <Modal.Header>
            
                            <Modal.Heading>Edit Destination</Modal.Heading>
                            <p className="mt-1.5 text-sm leading-5 text-muted">
                                Fill out the form below and we'll get back to you. The modal adapts automatically
                                when the keyboard appears on mobile.
                            </p>
                        </Modal.Header>
                        <Modal.Body className="p-6">
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md">
                                <form
                                    onSubmit={onSubmit}
                                    className="p-6 space-y-6 w-full"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Destination Name */}
                                        <div className="md:col-span-2">
                                            <TextField name="destinationName" isRequired defaultValue={destinationName}>
                                                <Label>Destination Name:</Label>
                                                <Input
                                        
                                                  className="rounded-2xl" />
                                                <FieldError />
                                            </TextField>
                                        </div>

                                        {/* Country */}
                                        <TextField name="country" isRequired defaultValue={country}>
                                            <Label>Country</Label>
                                            <Input placeholder="Indonesia" className="rounded-2xl" />
                                            <FieldError />
                                        </TextField>

                                        {/* Category - Updated Select Component */}
                                        <div>
                                            <label className="block mb-2 text-sm font-medium">
                                                Category
                                            </label>

                                            <select
                                                name="category"
                                                className="w-full rounded-2xl border p-3"
                                                defaultValue={category}
                                                required
                                            >
                                                <option value="" disabled>
                                                    Select category
                                                </option>

                                                <option value="beach">Beach</option>
                                                <option value="mountain">Mountain</option>
                                                <option value="city">City</option>
                                            </select>
                                        </div>

                                        {/* Price */}
                                        <TextField name="price" type="number" isRequired defaultValue={price}>
                                            <Label>Price (USD)</Label>
                                            <Input
                                                type="number"
                                                placeholder="1299"
                                                className="rounded-2xl"
                                            />
                                            <FieldError />
                                        </TextField>

                                        {/* Duration */}
                                        <TextField name="duration" isRequired defaultValue={duration}>
                                            <Label>Duration</Label>
                                            <Input
                                                placeholder="7 Days / 6 Nights"
                                                className="rounded-2xl"
                                            />
                                            <FieldError />
                                        </TextField>

                                        {/* Departure Date */}
                                        <div className="md:col-span-2">
                                            <TextField name="departureDate" type="date" isRequired defaultValue={departureDate}>
                                                <Label>Departure Date</Label>
                                                <Input type="date" className="rounded-2xl" />
                                                <FieldError />
                                            </TextField>
                                        </div>

                                        {/* Image URL - Removed preview */}
                                        <div className="md:col-span-2">
                                            <TextField name="imageUrl" isRequired defaultValue={imageUrl}>
                                                <Label>Image URL</Label>
                                                <Input
                                                    type="url"
                                                    placeholder="https://example.com/bali-paradise.jpg"
                                                    className="rounded-2xl"
                                                />
                                                <FieldError />
                                            </TextField>
                                        </div>

                                        {/* Description */}
                                        <div className="md:col-span-2">
                                            <TextField name="description" isRequired defaultValue={description}>
                                                <Label>Description</Label>
                                                <TextArea
                                                    placeholder="Describe the travel experience..."
                                                    className="rounded-3xl"
                                                />
                                                <FieldError />
                                            </TextField>
                                        </div>
                                    </div>

                                    {/* Buttons */}

                                    <Modal.Footer>
                            <Button type="submit" slot="close" variant="secondary">
                                Save
                            </Button>
                            
                        </Modal.Footer>
                                </form>
                            </div>
                        </Modal.Body>
                        
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
