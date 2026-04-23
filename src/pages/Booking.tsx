import { motion, AnimatePresence } from "framer-motion"; 
import { Calendar as CalendarIcon, Clock, ArrowRight, ChevronLeft, ChevronRight, Loader2, ArrowLeft, Mail, User, Phone, Briefcase, Zap, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type BookingStep = "datetime" | "details" | "confirm" | "success";

interface BookingSlot {
  id: string;
  time: string;
  available: boolean;
}

export default function Booking() {
  const [currentStep, setCurrentStep] = useState<BookingStep>("datetime");
  const [direction, setDirection] = useState(1);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessType: "",
    automationNeed: ""
  });
  
  const [submitting, setSubmitting] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const isPastMonth = year === today.getFullYear() && month <= today.getMonth();

  useEffect(() => {
    if (selectedDate) {
      const fetchSlots = async () => {
        setLoadingSlots(true);
        setSelectedTime(null); // Reset time when date changes

        try {
          const formattedMonth = String(month + 1).padStart(2, '0');
          const formattedDay = String(selectedDate).padStart(2, '0');
          const formattedDateStr = `${year}-${formattedMonth}-${formattedDay}`;
          
          const selectedDateObj = new Date(year, month, selectedDate);
          const dayName = selectedDateObj.toLocaleDateString('en-US', { weekday: 'long' });

          const [bookingsRes, scheduleRes] = await Promise.all([
            supabase.from('bookings').select('booking_time').eq('booking_date', formattedDateStr),
            supabase.from('schedule_rules').select('slots').eq('day_name', dayName).single()
          ]);

          if (bookingsRes.error) throw bookingsRes.error;
          
          const takenTimes = bookingsRes.data ? bookingsRes.data.map(b => b.booking_time) : [];
          
          const fallbackTimes = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];
          const allTimes: string[] = scheduleRes.data ? scheduleRes.data.slots : fallbackTimes;

          const isToday = selectedDateObj.getTime() === today.getTime();
          const now = new Date();

          const availableSlots = allTimes.map(time => {
            const [timeStr, modifier] = time.split(' ');
            let [hours, minutes] = timeStr.split(':').map(Number);
            if (modifier === 'PM' && hours !== 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;

            let isPastTime = false;
            if (isToday) {
              if (hours < now.getHours() || (hours === now.getHours() && minutes <= now.getMinutes())) {
                isPastTime = true;
              }
            }

            return {
              id: time,
              time: time,
              available: !takenTimes.includes(time) && !isPastTime 
            };
          });

          setSlots(availableSlots);
        } catch (error) {
          console.error("Failed to fetch slots:", error);
        } finally {
          setLoadingSlots(false);
        }
      };
      fetchSlots();
    }
  }, [selectedDate, month, year]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const goToStep = (step: BookingStep, dir: number) => {
    setDirection(dir);
    setCurrentStep(step);
  };

  // --- FINAL SUBMIT LOGIC ---
  const handleFinalSubmit = async () => {
    if (selectedDate && selectedTime) {
      setSubmitting(true);
      try {
        const formattedMonth = String(month + 1).padStart(2, '0');
        const formattedDay = String(selectedDate).padStart(2, '0');
        const formattedDateStr = `${year}-${formattedMonth}-${formattedDay}`;
        
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();

        // 1. Send data to Supabase
        const { error } = await supabase
          .from('bookings')
          .insert([
            { 
              name: fullName, 
              email: formData.email, 
              phone: formData.phone,
              business_type: formData.businessType,
              automation_need: formData.automationNeed,
              booking_date: formattedDateStr, 
              booking_time: selectedTime 
            }
          ]);

        // 2. Check if Supabase rejected it
        if (error) {
          throw error; // This triggers the catch block below
        }

        // 3. Success! Move to the final screen
        goToStep("success", 1);
      } catch (error: any) {
        // 4. Log the exact error to the console for debugging
        console.error("Supabase Error details:", error);
        alert("Error saving booking: " + error.message);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const isEmailValid = formData.email.includes('@') && formData.email.includes('.');

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <div className="pt-32 pb-24 min-h-screen relative overflow-hidden flex flex-col items-center">
      
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full max-w-5xl flex-grow flex flex-col">
        
        {currentStep !== "success" && (
          <div className="max-w-3xl mx-auto w-full mb-12 shrink-0">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-bold text-primary mb-6 tracking-widest uppercase backdrop-blur-md">
                <Zap size={12} className="text-primary" /> Free Strategy Session
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
                Book Your <span className="gradient-text">Free Call</span>
              </h1>
              <p className="text-white/50 font-medium">30-minute consultation — we'll map your automation strategy.</p>
            </div>

            <div className="flex items-center justify-between relative max-w-xl mx-auto px-4">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -z-10 -translate-y-1/2" />
              
              <div className="flex flex-col items-center gap-2 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors ${currentStep === 'datetime' ? 'gradient-bg shadow-lg shadow-primary/30' : 'bg-primary/20 text-primary border border-primary/30'}`}>1</div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 hidden sm:block">Date & Time</span>
              </div>
              
              <div className={`h-[2px] flex-1 transition-colors duration-500 mx-2 ${currentStep === 'details' || currentStep === 'confirm' ? 'bg-primary/50' : 'bg-transparent'}`} />
              
              <div className="flex flex-col items-center gap-2 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors ${currentStep === 'details' ? 'gradient-bg shadow-lg shadow-primary/30' : currentStep === 'confirm' ? 'bg-primary/20 text-primary border border-primary/30' : 'glass text-white/30'}`}>2</div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 hidden sm:block">Your Details</span>
              </div>

              <div className={`h-[2px] flex-1 transition-colors duration-500 mx-2 ${currentStep === 'confirm' ? 'bg-primary/50' : 'bg-transparent'}`} />

              <div className="flex flex-col items-center gap-2 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors ${currentStep === 'confirm' ? 'gradient-bg shadow-lg shadow-primary/30' : 'glass text-white/30'}`}>3</div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 hidden sm:block">Confirm</span>
              </div>
            </div>
          </div>
        )}

        <div className="relative bg-[#0A0A0F]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] md:rounded-[40px] p-6 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full overflow-hidden flex-grow flex flex-col min-h-[600px]">
          <div className="relative w-full h-full flex-grow flex">
            <AnimatePresence mode="wait" custom={direction}>
              
              {currentStep === "datetime" && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute inset-0 flex flex-col lg:flex-row gap-10 lg:gap-16 w-full h-full"
                >
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                        <CalendarIcon size={20} className="text-primary" /> Select a Date
                      </h3>
                      <div className="flex gap-2">
                        <button onClick={handlePrevMonth} disabled={isPastMonth} className={`p-2 rounded-lg transition-colors ${isPastMonth ? "opacity-20 cursor-not-allowed" : "bg-white/5 hover:bg-white/10"}`}>
                          <ChevronLeft size={16} />
                        </button>
                        <span className="font-bold text-sm flex items-center w-24 justify-center">{monthName} {year}</span>
                        <button onClick={handleNextMonth} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {days.map(day => <div key={day} className="text-center text-[10px] font-black uppercase tracking-widest text-white/30">{day}</div>)}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: startDayOffset }).map((_, i) => <div key={`empty-${i}`} />)}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const date = i + 1;
                        const dateObj = new Date(year, month, date);
                        const isPast = dateObj < today; 

                        return (
                          <button
                            key={date}
                            disabled={isPast}
                            onClick={() => setSelectedDate(date)}
                            className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                              isPast ? "text-white/10 cursor-not-allowed" : 
                              selectedDate === date ? "gradient-bg shadow-lg shadow-primary/20 scale-110 z-10" : 
                              "bg-white/5 hover:bg-white/10"
                            }`}
                          >
                            {date}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col h-full border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-16">
                    <h3 className="text-xl font-black tracking-tight flex items-center gap-2 mb-8">
                      <Clock size={20} className="text-accent" /> Select a Time
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-8 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                      {loadingSlots ? (
                        <div className="col-span-2 flex justify-center py-20">
                          <Loader2 className="animate-spin text-primary" size={32} />
                        </div>
                      ) : !selectedDate ? (
                        <div className="col-span-2 text-center py-20 text-white/20 font-bold uppercase tracking-widest text-xs h-full flex flex-col items-center justify-center gap-4">
                          <CalendarIcon size={40} className="opacity-20 mb-2" />
                          Please select a date first
                        </div>
                      ) : slots.length === 0 ? (
                        <div className="col-span-2 text-center py-16 text-white/40 font-bold uppercase tracking-widest text-xs border border-white/5 bg-white/[0.02] rounded-2xl">
                          <p className="mb-2 text-2xl">🌴</p>
                          No slots available on this day.
                        </div>
                      ) : (
                        slots.map(slot => (
                          <button
                            key={slot.id}
                            disabled={!slot.available}
                            onClick={() => setSelectedTime(slot.time)}
                            className={`py-4 rounded-xl text-sm font-bold transition-all border ${
                              !slot.available ? "line-through text-white/20 cursor-not-allowed bg-white/5 border-transparent decoration-red-500/30 decoration-2" :
                              selectedTime === slot.time ? "gradient-bg border-transparent shadow-lg shadow-primary/20 scale-105" : 
                              "bg-white/[0.03] border-white/10 hover:border-primary/50 hover:bg-primary/5 text-white/80"
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))
                      )}
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between shrink-0">
                      <p className="text-xs text-white/40 font-bold uppercase tracking-widest">
                        {selectedDate && selectedTime ? (
                          <span className="text-primary flex items-center gap-2"><CheckCircle2 size={14}/> Time Selected</span>
                        ) : "Step 1 of 3"}
                      </p>
                      <button
                        disabled={!selectedDate || !selectedTime}
                        onClick={() => goToStep("details", 1)}
                        className={`px-8 py-4 rounded-full font-black text-sm flex items-center gap-2 transition-all ${
                          selectedDate && selectedTime ? "bg-white text-black hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]" : "bg-white/5 text-white/20 cursor-not-allowed"
                        }`}
                      >
                        Next: Details <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === "details" && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute inset-0 flex flex-col w-full h-full overflow-y-auto pr-2 custom-scrollbar"
                >
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center gap-3 mb-8 shrink-0">
                    <CalendarIcon className="text-primary shrink-0" size={20} />
                    <p className="text-sm font-semibold text-white/90">
                      Booking for <span className="font-black text-white">{monthName} {selectedDate}, {year}</span> at <span className="font-black text-white">{selectedTime}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 flex-grow">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">First Name *</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required placeholder="John" className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-primary focus:bg-primary/5 transition-colors text-white placeholder:text-white/20" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">Last Name *</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required placeholder="Doe" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-primary focus:bg-primary/5 transition-colors text-white placeholder:text-white/20" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="john@company.com" className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-primary focus:bg-primary/5 transition-colors text-white placeholder:text-white/20" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">WhatsApp Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="+1 234 567 8900" className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-primary focus:bg-primary/5 transition-colors text-white placeholder:text-white/20" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">Business Type</label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                        <select name="businessType" value={formData.businessType} onChange={handleInputChange} className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-primary focus:bg-primary/5 transition-colors text-white appearance-none cursor-pointer">
                          <option value="" className="bg-[#0A0A0F] text-white/50">Select your business...</option>
                          <option value="E-commerce" className="bg-[#0A0A0F]">E-commerce / Retail</option>
                          <option value="Agency" className="bg-[#0A0A0F]">Agency / Services</option>
                          <option value="SaaS" className="bg-[#0A0A0F]">SaaS / Tech</option>
                          <option value="Local Business" className="bg-[#0A0A0F]">Local Business / Clinic</option>
                          <option value="Other" className="bg-[#0A0A0F]">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">What do you want to automate?</label>
                      <input type="text" name="automationNeed" value={formData.automationNeed} onChange={handleInputChange} placeholder="e.g. Lead capture, Customer support..." className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-primary focus:bg-primary/5 transition-colors text-white placeholder:text-white/20" />
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between shrink-0">
                    <button onClick={() => goToStep("datetime", -1)} className="px-6 py-4 rounded-full font-bold text-sm flex items-center gap-2 text-white/50 hover:text-white hover:bg-white/5 transition-all">
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      disabled={!formData.firstName || !formData.lastName || !isEmailValid || !formData.phone}
                      onClick={() => goToStep("confirm", 1)}
                      className={`px-8 py-4 rounded-full font-black text-sm flex items-center gap-2 transition-all ${
                        formData.firstName && formData.lastName && isEmailValid && formData.phone ? "bg-white text-black hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]" : "bg-white/5 text-white/20 cursor-not-allowed"
                      }`}
                    >
                      Review Booking <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === "confirm" && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute inset-0 flex flex-col w-full h-full max-w-2xl mx-auto overflow-y-auto pr-2 custom-scrollbar"
                >
                  <div className="text-center mb-8 shrink-0">
                    <h3 className="text-2xl font-black tracking-tight mb-2">Review Your Details</h3>
                    <p className="text-white/50 text-sm">Please confirm your strategy session details below.</p>
                  </div>

                  <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 mb-8 space-y-6 flex-grow">
                    <div className="flex items-start gap-4 pb-6 border-b border-white/5">
                      <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                        <CalendarIcon size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Date & Time</p>
                        <p className="text-lg font-black">{monthName} {selectedDate}, {year} at {selectedTime}</p>
                        <p className="text-xs text-white/50 mt-1">30 Minute Strategy Session via Google Meet</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Name</p>
                        <p className="font-bold text-white/90">{formData.firstName} {formData.lastName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Contact</p>
                        <p className="font-bold text-white/90">{formData.email}</p>
                        <p className="text-sm text-white/60">{formData.phone}</p>
                      </div>
                      {formData.businessType && (
                        <div className="md:col-span-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Business</p>
                          <p className="font-bold text-white/90">{formData.businessType}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex items-start gap-3 mb-8 shrink-0">
                    <AlertCircle className="text-orange-400 shrink-0 mt-0.5" size={16} />
                    <p className="text-xs text-orange-200/80 font-medium leading-relaxed">
                      By confirming, you agree to receive a calendar invitation and SMS reminder for this session.
                    </p>
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between shrink-0">
                    <button onClick={() => goToStep("details", -1)} className="px-6 py-4 rounded-full font-bold text-sm flex items-center gap-2 text-white/50 hover:text-white hover:bg-white/5 transition-all">
                      <ArrowLeft size={16} /> Edit Details
                    </button>
                    <button
                      disabled={submitting}
                      onClick={handleFinalSubmit}
                      className={`px-8 py-4 rounded-full font-black text-sm flex items-center gap-2 transition-all gradient-bg hover:scale-105 shadow-lg shadow-primary/30`}
                    >
                      {submitting ? <Loader2 className="animate-spin" size={18} /> : "Confirm Booking"} <CheckCircle2 size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === "success" && (
                <motion.div
                  key="step4"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center w-full h-full"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                    className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(147,51,234,0.5)]"
                  >
                    <CheckCircle2 size={48} className="text-white" />
                  </motion.div>
                  
                  <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">You're All Set!</h2>
                  <p className="text-lg text-white/60 mb-8 max-w-md leading-relaxed font-medium">
                    Your strategy session has been confirmed for <span className="text-white font-bold">{monthName} {selectedDate} at {selectedTime}</span>. 
                    <br /><br />
                    We've sent a calendar invitation to <span className="text-primary">{formData.email}</span>.
                  </p>
                  
                  <button 
                    onClick={() => window.location.href = "/"}
                    className="px-10 py-4 rounded-full bg-white text-black font-black text-sm hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  >
                    Return to Home
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}