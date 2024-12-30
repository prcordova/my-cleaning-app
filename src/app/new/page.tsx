"use client";
import StripeProvider from "@/components/stripeProvider";
import CreateJob from "./createJob";

export default function NewJobPage() {
  return (
    <StripeProvider>
      <CreateJob />
    </StripeProvider>
  );
}
