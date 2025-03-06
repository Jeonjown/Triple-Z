import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetReservationSettings } from "@/features/Events/hooks/useGetReservationSettings";
import HourlyTimePicker from "@/features/Events/components/events-form/HourlyTimePicker";
import { useCreateOrUpdateSettings } from "@/features/Events/hooks/useCreateorUpdateSettings";

// Define validation schema using zod
const formSchema = z.object({
  eventReservationLimit: z.coerce
    .number()
    .min(0, { message: "Must be at least 0" }),
  eventMinDaysPrior: z.coerce.number().min(0, { message: "Must be 0 or more" }),
  eventMinGuests: z.coerce.number().min(1, { message: "Must be at least 1" }),
  eventFee: z.coerce.number().min(0, { message: "Must be a positive fee" }),
  groupReservationLimit: z.coerce
    .number()
    .min(0, { message: "Must be 0 or more" }),
  groupMinDaysPrior: z.coerce.number().min(0, { message: "Must be 0 or more" }),
  groupMaxTables: z.coerce
    .number()
    .min(0, { message: "Must be a positive number" }),
  groupAvailableTables: z.coerce
    .number()
    .min(0, { message: "Must be 0 or more" }),
  openingHours: z.string().nonempty({ message: "Required" }),
  closingHours: z.string().nonempty({ message: "Required" }),
});

// Infer TypeScript type from schema
type SettingsFormValues = z.infer<typeof formSchema>;

const Settings: React.FC = () => {
  const { mutate } = useCreateOrUpdateSettings();
  const { data: settings } = useGetReservationSettings();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventReservationLimit: 0,
      eventMinDaysPrior: 0,
      eventMinGuests: 1,
      eventFee: 0,
      groupReservationLimit: 0,
      groupMinDaysPrior: 0,
      groupMaxTables: 0,
      groupAvailableTables: 0,
      openingHours: "",
      closingHours: "",
    },
  });

  // Format time string by removing a leading zero
  const formatTime = (time: string): string => time.replace(/^0/, "");

  // Reset form with fetched settings values
  useEffect(() => {
    if (settings) {
      form.reset({
        eventReservationLimit: settings.eventReservationLimit ?? 0,
        eventMinDaysPrior: settings.eventMinDaysPrior ?? 0,
        eventMinGuests: settings.eventMinGuests ?? 1,
        eventFee: settings.eventFee ?? 0,
        groupReservationLimit: settings.groupReservationLimit ?? 0,
        groupMinDaysPrior: settings.groupMinDaysPrior ?? 0,
        groupMaxTables: settings.groupMaxTables ?? 0,
        groupAvailableTables: settings.groupAvailableTables ?? 0,
        openingHours: settings.openingHours
          ? formatTime(settings.openingHours)
          : "",
        closingHours: settings.closingHours
          ? formatTime(settings.closingHours)
          : "",
      });
    }
  }, [settings, form]);

  const onSubmit = async (values: SettingsFormValues) => {
    console.log("form submitted: ", values);
    mutate(values);
  };

  return (
    <div className="mx-auto max-w-lg p-4">
      <h2 className="mb-6 text-2xl font-bold">Settings</h2>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Time Picker Fields */}
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="openingHours"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Store Opening Hours</FormLabel>
                  <FormControl>
                    <HourlyTimePicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="closingHours"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Store Closing Hours</FormLabel>
                  <FormControl>
                    <HourlyTimePicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Event Reservation Settings */}
          <h2 className="mb-6 text-xl font-bold">Event Reservation Settings</h2>
          <FormField
            control={form.control}
            name="eventReservationLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Reservation Monthly Limit</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventMinDaysPrior"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Days Prior The Event</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventMinGuests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Guests</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Fee</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      ₱
                    </span>
                    <Input type="number" {...field} className="pl-6" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Group Reservation Settings */}
          <h2 className="mb-6 text-xl font-bold">Group Reservation Settings</h2>
          <FormField
            control={form.control}
            name="groupReservationLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Reservation Daily Limit</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="groupMinDaysPrior"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Minimum Days Prior</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="groupMaxTables"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Tables</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="groupAvailableTables"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available Group Tables</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Save Settings</Button>
        </form>
      </Form>
    </div>
  );
};

export default Settings;
