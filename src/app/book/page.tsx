"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Wind,
    Droplets,
    Zap,
    Flame,
    Wrench,
    Paintbrush,
    ChevronRight,
    ChevronLeft,
    Calendar,
    Clock,
    MapPin,
    CheckCircle2,
    ArrowRight,
    Home,
    Loader2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Service Categories
const services = [
    { id: "ac", name: "AC & Cooling", icon: Wind, color: "from-sky-500 to-cyan-400", description: "Maintenance, repair & installation" },
    { id: "plumbing", name: "Plumbing", icon: Droplets, color: "from-blue-500 to-indigo-400", description: "Leaks, pipes & fixtures" },
    { id: "electrical", name: "Electrical", icon: Zap, color: "from-amber-500 to-yellow-400", description: "Wiring, outlets & repairs" },
    { id: "heating", name: "Heating", icon: Flame, color: "from-orange-500 to-red-400", description: "Heaters, boilers & HVAC" },
    { id: "painting", name: "Painting", icon: Paintbrush, color: "from-purple-500 to-pink-400", description: "Interior & exterior painting" },
    { id: "general", name: "General Repair", icon: Wrench, color: "from-neutral-500 to-slate-400", description: "Handyman & misc repairs" },
];

// Time Slots
const timeSlots = [
    "9:00 AM - 11:00 AM",
    "11:00 AM - 1:00 PM",
    "1:00 PM - 3:00 PM",
    "3:00 PM - 5:00 PM",
    "5:00 PM - 7:00 PM",
];

// Steps
const steps = [
    { id: 1, title: "Service", description: "Choose service type" },
    { id: 2, title: "Schedule", description: "Pick date & time" },
    { id: 3, title: "Location", description: "Enter address" },
    { id: 4, title: "Confirm", description: "Review & submit" },
];

export default function BookServicePage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const [currentStep, setCurrentStep] = React.useState(1);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [bookingId, setBookingId] = React.useState("");

    // Form Data
    const [selectedService, setSelectedService] = React.useState<string | null>(null);
    const [selectedDate, setSelectedDate] = React.useState<string>("");
    const [selectedTime, setSelectedTime] = React.useState<string>("");
    const [address, setAddress] = React.useState("");
    const [addressType, setAddressType] = React.useState<"home" | "office" | "other">("home");
    const [description, setDescription] = React.useState("");

    // Redirect if not logged in
    React.useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    // Generate dates for next 14 days
    const availableDates = React.useMemo(() => {
        const dates = [];
        const today = new Date();
        for (let i = 1; i <= 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push({
                value: date.toISOString().split("T")[0],
                label: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
                day: date.toLocaleDateString("en-US", { weekday: "short" }),
                date: date.getDate(),
                month: date.toLocaleDateString("en-US", { month: "short" }),
            });
        }
        return dates;
    }, []);

    const canProceed = () => {
        switch (currentStep) {
            case 1: return !!selectedService;
            case 2: return !!selectedDate && !!selectedTime;
            case 3: return address.trim().length > 5;
            case 4: return true;
            default: return false;
        }
    };

    const handleSubmit = async () => {
        if (!user) return;

        setIsSubmitting(true);

        try {
            const serviceData = services.find(s => s.id === selectedService);

            const docRef = await addDoc(collection(db, "requests"), {
                userId: user.uid,
                userPhone: user.phoneNumber,
                userName: user.displayName || "User",
                service: serviceData?.name,
                serviceType: selectedService,
                scheduledDate: selectedDate,
                scheduledTime: selectedTime,
                address: address,
                addressType: addressType,
                description: description,
                status: "pending",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            setBookingId(docRef.id.substring(0, 8).toUpperCase());
            setIsSuccess(true);
        } catch (error) {
            console.error("Error creating booking:", error);
            alert("Failed to create booking. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-neutral-50/50 flex flex-col">
                <Navbar />
                <main className="flex-grow flex items-center justify-center px-4 py-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-8 sm:p-12 text-center max-w-md w-full shadow-xl"
                    >
                        <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-3">Booking Confirmed!</h1>
                        <p className="text-neutral-600 mb-6">
                            Your service request has been submitted successfully. We'll contact you shortly.
                        </p>
                        <div className="bg-neutral-50 rounded-xl p-4 mb-6">
                            <p className="text-sm text-neutral-500 mb-1">Booking Reference</p>
                            <p className="text-xl font-mono font-bold text-neutral-900">REQ-{bookingId}</p>
                        </div>
                        <div className="space-y-3">
                            <Button onClick={() => router.push("/requests")} className="w-full">
                                View My Requests
                            </Button>
                            <Button variant="outline" onClick={() => router.push("/")} className="w-full">
                                Back to Home
                            </Button>
                        </div>
                    </motion.div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50/50 flex flex-col">
            <Navbar />

            <main className="flex-grow pt-20 sm:pt-24 pb-8 sm:pb-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">Book a Service</h1>
                        <p className="text-sm sm:text-base text-neutral-600">Schedule a service in just a few steps</p>
                    </motion.div>

                    {/* Progress Steps */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between relative">
                            <div className="absolute top-5 left-0 right-0 h-0.5 bg-neutral-200" />
                            <div
                                className="absolute top-5 left-0 h-0.5 bg-emerald-500 transition-all duration-500"
                                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                            />
                            {steps.map((step) => (
                                <div key={step.id} className="relative flex flex-col items-center">
                                    <div className={cn(
                                        "h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all z-10",
                                        currentStep >= step.id
                                            ? "bg-emerald-500 text-white"
                                            : "bg-neutral-200 text-neutral-500"
                                    )}>
                                        {currentStep > step.id ? <CheckCircle2 className="h-5 w-5" /> : step.id}
                                    </div>
                                    <p className="hidden sm:block text-xs font-medium text-neutral-600 mt-2">{step.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm"
                        >
                            {/* Step 1: Service Selection */}
                            {currentStep === 1 && (
                                <div>
                                    <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-4 sm:mb-6">What service do you need?</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                        {services.map((service) => (
                                            <button
                                                key={service.id}
                                                onClick={() => setSelectedService(service.id)}
                                                className={cn(
                                                    "relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all text-left",
                                                    selectedService === service.id
                                                        ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100"
                                                        : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                                                )}
                                            >
                                                <div className={cn(
                                                    "h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-3",
                                                    service.color
                                                )}>
                                                    <service.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                                </div>
                                                <p className="font-medium text-neutral-900 text-sm sm:text-base">{service.name}</p>
                                                <p className="text-xs text-neutral-500 mt-1 hidden sm:block">{service.description}</p>
                                                {selectedService === service.id && (
                                                    <div className="absolute top-2 right-2">
                                                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Date & Time */}
                            {currentStep === 2 && (
                                <div>
                                    <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-4 sm:mb-6">When would you like the service?</h2>

                                    {/* Date Selection */}
                                    <div className="mb-6">
                                        <label className="text-sm font-medium text-neutral-700 mb-3 flex items-center gap-2">
                                            <Calendar className="h-4 w-4" /> Select Date
                                        </label>
                                        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                                            {availableDates.slice(0, 7).map((d) => (
                                                <button
                                                    key={d.value}
                                                    onClick={() => setSelectedDate(d.value)}
                                                    className={cn(
                                                        "flex-shrink-0 w-16 sm:w-20 p-3 rounded-xl border-2 text-center transition-all",
                                                        selectedDate === d.value
                                                            ? "border-emerald-500 bg-emerald-50"
                                                            : "border-neutral-200 hover:border-neutral-300"
                                                    )}
                                                >
                                                    <p className="text-xs text-neutral-500">{d.day}</p>
                                                    <p className="text-lg font-bold text-neutral-900">{d.date}</p>
                                                    <p className="text-xs text-neutral-500">{d.month}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Time Selection */}
                                    <div>
                                        <label className="text-sm font-medium text-neutral-700 mb-3 flex items-center gap-2">
                                            <Clock className="h-4 w-4" /> Select Time Slot
                                        </label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                                            {timeSlots.map((slot) => (
                                                <button
                                                    key={slot}
                                                    onClick={() => setSelectedTime(slot)}
                                                    className={cn(
                                                        "p-3 rounded-xl border-2 text-sm font-medium transition-all",
                                                        selectedTime === slot
                                                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                            : "border-neutral-200 hover:border-neutral-300 text-neutral-700"
                                                    )}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Address */}
                            {currentStep === 3 && (
                                <div>
                                    <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-4 sm:mb-6">Where should we come?</h2>

                                    {/* Address Type */}
                                    <div className="mb-4">
                                        <label className="text-sm font-medium text-neutral-700 mb-3 flex items-center gap-2">
                                            <MapPin className="h-4 w-4" /> Location Type
                                        </label>
                                        <div className="flex gap-2">
                                            {["home", "office", "other"].map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => setAddressType(type as any)}
                                                    className={cn(
                                                        "flex-1 py-2 px-4 rounded-lg border-2 text-sm font-medium capitalize transition-all",
                                                        addressType === type
                                                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                            : "border-neutral-200 hover:border-neutral-300 text-neutral-700"
                                                    )}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Address Input */}
                                    <div className="mb-4">
                                        <label className="text-sm font-medium text-neutral-700 mb-2 block">Full Address</label>
                                        <textarea
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Enter your complete address with building/villa number, street, area..."
                                            rows={3}
                                            className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="text-sm font-medium text-neutral-700 mb-2 block">Additional Details (Optional)</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Describe the issue or any special instructions..."
                                            rows={2}
                                            className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Confirmation */}
                            {currentStep === 4 && (
                                <div>
                                    <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-4 sm:mb-6">Review Your Booking</h2>

                                    <div className="space-y-4">
                                        {/* Service */}
                                        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                {(() => {
                                                    const service = services.find(s => s.id === selectedService);
                                                    if (!service) return null;
                                                    return (
                                                        <>
                                                            <div className={cn("h-10 w-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white", service.color)}>
                                                                <service.icon className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-neutral-500">Service</p>
                                                                <p className="font-medium text-neutral-900">{service.name}</p>
                                                            </div>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                            <button onClick={() => setCurrentStep(1)} className="text-sm text-emerald-600 hover:text-emerald-700">Edit</button>
                                        </div>

                                        {/* Date & Time */}
                                        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <Calendar className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-neutral-500">Date & Time</p>
                                                    <p className="font-medium text-neutral-900">
                                                        {new Date(selectedDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                                    </p>
                                                    <p className="text-sm text-neutral-600">{selectedTime}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => setCurrentStep(2)} className="text-sm text-emerald-600 hover:text-emerald-700">Edit</button>
                                        </div>

                                        {/* Address */}
                                        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                                    <Home className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-neutral-500">Location ({addressType})</p>
                                                    <p className="font-medium text-neutral-900 truncate">{address}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => setCurrentStep(3)} className="text-sm text-emerald-600 hover:text-emerald-700 flex-shrink-0 ml-2">Edit</button>
                                        </div>

                                        {description && (
                                            <div className="p-4 bg-amber-50 rounded-xl">
                                                <p className="text-xs text-amber-600 mb-1">Additional Notes</p>
                                                <p className="text-sm text-amber-800">{description}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentStep(prev => prev - 1)}
                            disabled={currentStep === 1}
                            className={cn(currentStep === 1 && "opacity-0 pointer-events-none")}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Back
                        </Button>

                        {currentStep < 4 ? (
                            <Button
                                onClick={() => setCurrentStep(prev => prev + 1)}
                                disabled={!canProceed()}
                            >
                                Continue
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Confirm Booking
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
