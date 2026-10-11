"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MapPin,
  Phone,
  Mail,
  Truck,
  Send,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { contactSchema, ContactFormData } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        toast.error(result.error || "Failed to send message.");
        setIsSubmitting(false);
        return;
      }

      toast.success("Message sent successfully!");
      setIsSent(true);
      reset();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gold-100 text-gold-900 border border-gold-300">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-950">
          We Are Here to Help
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Have a question about a specific product batch, custom foreign import requests, or existing order tracking? Reach out below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Direct Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-navy-950 text-white rounded-3xl p-8 space-y-6 shadow-luxury border border-navy-800">
            <h3 className="text-xl font-serif font-bold text-white">
              Direct Contact Details
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 text-slate-300">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Store Address:</h4>
                  <p className="mt-0.5">
                    Shop #14, Ground Floor, Foreign Goods Arcade, Liberty Market, Gulberg III, Lahore, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-300">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Direct Helpline / Phone:</h4>
                  <a
                    href="tel:+923001234567"
                    className="mt-0.5 text-emerald-300 hover:underline block font-semibold"
                  >
                    +92 300 1234567
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-300">
                <Mail className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Inquiry Email:</h4>
                  <p className="mt-0.5">support@baharse.pk</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-300">
                <Clock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Operating Hours:</h4>
                  <p className="mt-0.5">Monday to Saturday: 11:00 AM – 10:00 PM (PKT)</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/track-order" className="block">
                <Button variant="gold" size="md" className="w-full gap-2 font-bold">
                  <Truck className="w-4 h-4" /> Track Existing Order
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
          <div>
            <h3 className="text-xl font-serif font-bold text-navy-950">
              Send Us a Message
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Fill out the form below and our customer support team will reply via phone or email.
            </p>
          </div>

          {isSent ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-emerald-950 font-serif">
                Message Received!
              </h4>
              <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                Shukriya for contacting us. We have received your inquiry and will contact you shortly.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSent(false)}
                className="mt-2 text-xs"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-950">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    placeholder="e.g. Asad Ali"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-navy-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500 ${
                      errors.name ? "border-red-500" : "border-slate-300"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-red-600 font-medium">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-950">
                    Mobile Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    placeholder="03001234567"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-navy-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500 ${
                      errors.phone ? "border-red-500" : "border-slate-300"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-red-600 font-medium">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy-950">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="your.email@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-navy-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy-950">
                  Your Message or Product Inquiry <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  {...register("message")}
                  placeholder="Tell us what product you are looking for or any questions regarding our upcoming foreign shipments..."
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-navy-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500 ${
                    errors.message ? "border-red-500" : "border-slate-300"
                  }`}
                />
                {errors.message && (
                  <p className="text-[11px] text-red-600 font-medium">{errors.message.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full font-bold gap-2"
              >
                <Send className="w-4 h-4 text-gold-400" /> Submit Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
