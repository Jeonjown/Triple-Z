import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import GoogleMaps from "@/components/GoogleMaps";

// Define a schema for form validation using Zod.
const contactSchema = z.object({
  fullName: z.string().nonempty("Full name is required"),
  contacts: z.string().nonempty("Contacts is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().nonempty("Message is required"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contacts: React.FC = () => {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      contacts: "",
      email: "",
      message: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [resultMsg, setResultMsg] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Handle form submission
  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    setResultMsg("");

    try {
      const response = await fetch(`${API_URL}/api/mail/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.text();
      setResultMsg(result);
    } catch (error) {
      console.error("Error sending email:", error);
      setResultMsg("Error sending email.");
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="mx-auto flex w-5/6 flex-col space-y-5 p-5 md:flex-row md:space-x-10 md:space-y-0">
        {/* Left Column - Contact Information */}
        <div className="flex-1 space-y-5">
          <h3 className="font-heading text-2xl">Contacts Information</h3>
          <div className="flex items-center space-x-3">
            <MapPin className="h-6 w-6" />
            <p className="text-primary">
              64 P Burgos St, 1st DISTRICT, Taguig, 1632 Metro Manila
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="h-6 w-6" />
            <p className="text-primary">triplez@gmail.com</p>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="h-6 w-6" />
            <p className="text-primary">090952953232</p>
          </div>
          <div className="flex items-center space-x-3">
            <FaFacebook className="h-6 w-6" />
            <p className="text-primary">Triple Z Coffee Shop</p>
          </div>
        </div>

        {/* Right Column - Contact Form */}
        <div className="flex-1 space-y-4 rounded border p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contacts"
                  render={({ field }) => (
                    <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                      <FormLabel>Contacts</FormLabel>
                      <FormControl>
                        <Input placeholder="Contacts" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="grid w-full gap-1.5">
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Type your message here."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Form>
          {resultMsg && <p className="mt-2 text-center">{resultMsg}</p>}
        </div>
      </div>

      {/* Google Maps Component */}
      <div className="mx-auto mb-20 mt-5 w-5/6">
        <GoogleMaps />
      </div>
    </>
  );
};

export default Contacts;
