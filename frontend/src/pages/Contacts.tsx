import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import GoogleMaps from "@/components/GoogleMaps";
import { Button } from "@/components/ui/button";

const Contacts = () => {
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
          <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input type="text" id="fullName" placeholder="Full Name" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="contacts">Contacts</Label>
              <Input type="text" id="contacts" placeholder="Contacts" />
            </div>
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="Email" />
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="message">Message</Label>
            <Textarea placeholder="Type your message here." id="message" />
          </div>
          <Button className="w-full">Send Message </Button>
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
