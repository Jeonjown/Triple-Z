import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question:
      "What makes Triple Z Coffee’s website different from other coffee shop websites?",
    answer:
      "Triple Z Coffee’s website allows customers to book walk-in and event reservations seamlessly. We also take pride in offering authentic Arabic food, making it a great place for OFWs who miss the flavors of the UAE.",
  },
  {
    question: "How can I make a reservation for an event?",
    answer: (
      <>
        <p>
          Click "Book Now" or Go to Events – On our homepage, click the "Book
          Now" button or navigate to the "Events" section, then click
          "Schedule."
        </p>
        <br />
        <p>
          Choose a Date and Time – Use the scheduling system to select your
          preferred date and time.
        </p>
        <br />
        <p>
          Provide Event Details – Enter your event type, the number of guests,
          and any special requests.
        </p>
        <br />
        <p>
          Confirm Your Booking – Review your details and click "Confirm
          Booking." You’ll receive a confirmation email shortly!
        </p>
      </>
    ),
  },
  {
    question: "Do I need an account to book an event?",
    answer:
      "Yes, creating an account is required to prevent fake reservations and ensure secure bookings.",
  },
  {
    question: "Can I book the space for a private event on short notice?",
    answer:
      "No, bookings must be made at least two weeks to one month in advance to allow sufficient time for preparing the place and food.",
  },
  {
    question: "Can I modify or cancel my booking?",
    answer: (
      <>
        <p>
          Yes, you can modify or cancel your booking, but certain conditions
          apply:
        </p>
        <br />
        <p>
          <strong>Modification Requests</strong> – Changes to the event date,
          time, or menu must be made at least one week before the scheduled
          event and are subject to availability.
        </p>
        <br />
        <p>
          <strong>Cancellation Requests</strong> – Cancellations follow the
          refund policy outlined below.
        </p>
      </>
    ),
  },
  {
    question: "Is there a cancellation or refund policy for bookings?",
    answer: (
      <>
        <p>
          <strong>For Event Reservation Cancellation & Refund Policy</strong>
        </p>
        <ul>
          <li>
            Cancellations made at least 7 days before the event → Only 50% of
            the reservation fee is refundable.
          </li>
          <li>
            Full refund available if canceled at least 5 days before the event.
          </li>
          <li>
            No refunds or exchanges for food reservations made within 3 days of
            the event.
          </li>
          <li>
            Last-minute cancellations (less than 3 days before the event) will
            not be eligible for refunds.
          </li>
        </ul>
        <br />
        <p>
          <strong>For Group Reservation Cancellation Policy</strong>
        </p>
        <p>Cancellations allowed up to 3 hours before the scheduled time.</p>
      </>
    ),
  },
  {
    question: "Can I customize the setup or menu for my event?",
    answer:
      "Yes! You can request a custom theme or menu. However, additional charges will apply for decorations, props, and special setup requests. Our team will discuss the costs with you during the booking process.",
  },
  {
    question:
      "Are walk-in customers still welcome even if there are reserved events?",
    answer:
      "Yes, but only for takeout orders. Dine-in service may not be available during private events.",
  },
  {
    question: "What are your operating hours?",
    answer:
      "Triple Z Coffee is open from 4:00 PM to 10:00 PM, seven days a week.",
  },
];

const FAQPage = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      {" "}
      {/* Added sm:px-6 for mobile padding */}
      <h2 className="mb-8 text-center text-3xl font-bold">
        Frequently Asked Questions
      </h2>
      <Accordion
        type="single"
        collapsible
        className="mx-auto w-full md:w-2/3 lg:w-1/2"
      >
        {faqData.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="flex w-full justify-between py-4 font-medium rtl:flex-row-reverse">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-sm text-gray-600 dark:text-gray-400 lg:text-base">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQPage;
