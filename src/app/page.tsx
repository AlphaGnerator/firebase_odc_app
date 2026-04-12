
'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { LandingHeader } from '@/components/landing-header';
import { ChefHat, Shield, Check, ArrowRight, IndianRupee, Flame, Soup, Activity, Loader2, Sparkles, Baby, HeartPulse } from 'lucide-react';
import { BottomNav } from '@/components/bottom-nav';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"
import * as React from 'react';
import { MaidServiceTab } from '@/components/maid-service-tab';
import { MaidValueProps } from '@/components/maid-value-props';
import { MaidPricingPlans } from '@/components/maid-pricing-plans';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCulinaryStore } from '@/hooks/use-culinary-store';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

const heroCarouselDishes = [
    {
        id: 1,
        name: 'Avocado Toast',
        tags: ['Low-oil', 'Chef-curated', 'Delhi Cook'],
        image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1547&auto=format&fit=crop',
        hint: 'avocado toast',
        calories: 350,
        protein: 12,
        carbs: 25,
    },
    {
        id: 2,
        name: 'Grilled Salmon',
        tags: ['High-protein', 'Chef-curated', 'Mumbai Cook'],
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1770&auto=format&fit=crop',
        hint: 'grilled salmon',
        calories: 550,
        protein: 40,
        carbs: 5,
    },
    {
        id: 3,
        name: 'Quinoa Salad',
        tags: ['Vegan', 'Chef-curated', 'Bangalore Cook'],
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1770&auto=format&fit=crop',
        hint: 'quinoa salad',
        calories: 420,
        protein: 15,
        carbs: 35,
    },
    {
        id: 4,
        name: 'Chicken Curry',
        tags: ['Authentic', 'Chef-curated', 'Chennai Cook'],
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1674&auto=format&fit=crop',
        hint: 'chicken curry',
        calories: 600,
        protein: 35,
        carbs: 20,
    },
    {
        id: 5,
        name: 'Paneer Bowl',
        tags: ['High-protein', 'Chef-curated', 'Pune Cook'],
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1636&auto=format&fit=crop',
        hint: 'paneer bowl',
        calories: 480,
        protein: 25,
        carbs: 30,
    },
    {
        id: 6,
        name: 'Millet Khichdi',
        tags: ['Gut-friendly', 'Chef-curated', 'Hyderabad Cook'],
        image: 'https://picsum.photos/seed/khichdi/600/400',
        hint: 'millet khichdi',
        calories: 380,
        protein: 14,
        carbs: 45,
    }
];

const pricingPlans = [
  {
    name: "One-Time Visit",
    price: "₹299",
    period: "/ visit",
    tagline: "Perfect for emergencies or trying out our service quality.",
    features: [
      "Single visit without any long-term commitment.",
      "Vetted background-checked professionals.",
      "Access to standard slot availability.",
      "Pay-per-use, completely flexible.",
    ],
    cta: "Book a Visit",
    plan: "day",
    highlight: false,
  },
  {
    name: "Monthly Disruption-Free",
    price: "₹4,999",
    period: "/ month",
    tagline: "The ultimate premium peace of mind for your household.",
    features: [
      "Zero-Disruption Guarantee: We send a substitute instantly if someone is on leave.",
      "Dedicated multi-cuisine cook or premium maid assigned.",
      "Highest priority for scheduling and customized instructions.",
      "Free access to nutritionist consultation (for cooks).",
      "Complimentary access to Pure Pantry early deals.",
      "Save up to 40% compared to daily visits.",
    ],
    cta: "Subscribe Now",
    plan: "monthly",
    highlight: true,
  },
  {
    name: "Weekly Flex Plan",
    price: "₹1,499",
    period: "/ week",
    tagline: "For those needing structured help without a full month lock-in.",
    features: [
      "7 consecutive scheduled visits.",
      "Priority slot booking over direct walk-ins.",
      "Option to pause for 1 day a week without penalty.",
      "Flexible task assignment based on daily needs.",
    ],
    cta: "Choose Weekly",
    plan: "weekly",
    highlight: false,
  },
]

function NewsletterForm() {
    const [isClient, setIsClient] = React.useState(false);
    React.useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <div className="mt-8 max-w-lg mx-auto h-12"></div>;
    }

    return (
        <form className="mt-8 max-w-lg mx-auto flex gap-2">
            <input type="email" placeholder="Enter your email" className="flex h-12 w-full rounded-md border border-surface-border bg-surface px-3 py-2 text-base ring-offset-background placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" />
            <Button type="submit" variant="cta" size="lg" className="h-12 touch-manipulation active:scale-95">Subscribe</Button>
        </form>
    );
}


function HeroBookingDialog() {
  const { user, isUserLoading } = useUser();
  const [open, setOpen] = React.useState(false);
  const [familySize, setFamilySize] = React.useState("2");
  const [pincode, setPincode] = React.useState("");
  const { setGuestConfig } = useCulinaryStore();
  const router = useRouter();

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length >= 5) {
      setGuestConfig({
        pincode,
        familySize: parseInt(familySize, 10),
      });
      router.push('/booking/menu');
      setOpen(false);
    }
  };

  if (!mounted || isUserLoading) {
    return (
      <Button variant="cta" size="cta" disabled className="w-full sm:w-auto relative z-30 opacity-50">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        LOADING...
      </Button>
    );
  }

  if (user) {
    return (
      <Button
          variant="cta"
          size="cta"
          onClick={() => router.push('/dashboard')}
          className="w-full sm:w-auto relative z-30 touch-manipulation shadow-xl active:scale-95"
      >
          GO TO DASHBOARD
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="cta" size="cta" className="w-full sm:w-auto relative z-30 touch-manipulation shadow-xl active:scale-95">
            BOOK NOW
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Check Availability</DialogTitle>
          <DialogDescription>
            Enter your details to see what's cooking in your area.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-3">
            <Label>Household Size</Label>
            <RadioGroup
              value={familySize}
              onValueChange={setFamilySize}
              className="grid grid-cols-3 gap-2"
            >
              {[1, 2, 3, 4, 5, 6].map(size => (
                <Label key={size} htmlFor={`size-${size}`} className={cn("flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all cursor-pointer touch-manipulation active:scale-95", familySize === String(size) ? "border-primary bg-primary/5" : "border-border hover:bg-muted")}>
                  <RadioGroupItem value={String(size)} id={`size-${size}`} className="sr-only" />
                  <span className="text-lg font-bold">{size}</span>
                  <span className="text-[10px] uppercase">people</span>
                </Label>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pincode">Area Pincode</Label>
            <Input
              id="pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="e.g. 110011"
              maxLength={6}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" variant="cta" className="w-full h-12 text-lg font-bold touch-manipulation active:scale-95" disabled={pincode.length < 5}>
              Explore Menu
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const heroSlides = [
    { 
        id: 'cook',
        title: 'Authentic Indian Meals', 
        subtitle: 'Chef-designed, home-cooked daily. Starting at just ₹200/visit.',
        badge: 'Disruption-Free Monthly Plans',
        cta: 'Find a Cook',
        link: '#services',
        imageUrl: '/carousel/carousel_cook_v4.png'
    },
    { 
        id: 'maid',
        title: 'Trusted Home Keepers', 
        subtitle: 'Vetted, reliable maids that respect your space. Zero absenteeism.',
        badge: '100% Disruption-Free Guarantee',
        cta: 'Book a Maid',
        link: '#services',
        imageUrl: '/carousel/carousel_maid_v4.png'
    },
    { 
        id: 'elder',
        title: 'Compassionate Elder Care', 
        subtitle: 'Warm, trained specialists for your loved ones at home.',
        badge: 'Trained & Vetted',
        cta: 'Get Support',
        link: '#services',
        imageUrl: '/carousel/carousel_elderly_v4.png'
    },
    { 
        id: 'pantry',
        title: '100% Pure Pantry', 
        subtitle: 'A2 Kulfis, ancient grains, and cold-pressed oils. Zero adulteration.',
        badge: 'Zero Chemicals',
        cta: 'Shop Pure Grocery',
        link: '#services',
        imageUrl: '/carousel/carousel_pantry_v4.png'
    }
];

export default function WelcomePage() {
  const firestore = useFirestore();
  const carouselRef = useMemoFirebase(() => firestore ? collection(firestore, 'carouselImages') : null, [firestore]);
  const { data: dbImages } = useCollection<{ title: string; imageUrl: string }>(carouselRef);
  
  const [activeService, setActiveService] = React.useState('Cook');

  // Persistence Logic
  React.useEffect(() => {
    const savedService = localStorage.getItem('bookeato_active_service');
    if (savedService) {
      setActiveService(savedService);
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('bookeato_active_service', activeService);
  }, [activeService]);

  const carouselImages = React.useMemo(() => {
      return heroSlides;
  }, []);

  const services = [
    { id: 'Cook', name: 'Cook', icon: '/icons/icon_cook.png', color: 'bg-orange-500/10 text-orange-600 ring-orange-500/20' },
    { id: 'Maid', name: 'Maid', icon: '/icons/icon_maid.png', color: 'bg-green-500/10 text-green-600 ring-green-500/20' },
    { id: 'Elder help', name: 'Elder Care', icon: '/icons/icon_elder.png', color: 'bg-purple-500/10 text-purple-600 ring-purple-500/20' },
    { id: 'Pure Pantry', name: 'Pure Pantry', icon: '/icons/icon_pantry.png', color: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20' },
  ];

  return (
    <>
      <LandingHeader />
      <div className="pt-16 md:pt-20 bg-surface">
        <main>
          {/* Bookeato Live Banner */}
          <div className="bg-orange-600 text-white px-4 py-3 text-center flex flex-col sm:flex-row items-center justify-center gap-2 relative z-50">
             <Badge className="bg-white/20 text-white hover:bg-white/30 border-none px-2 border-none rounded-md inline-flex font-black tracking-widest text-[10px]">NEW</Badge>
             <span className="font-medium text-sm">We are setting up Live Kitchens in select societies!</span>
             <Link href="/live" className="font-black text-sm underline hover:text-stone-200 transition-colors ml-2 flex items-center gap-1">
                Order from Bookeato Live <ArrowRight className="w-4 h-4" />
             </Link>
          </div>

          {/* Coast-to-Coast Hero Section */}
          <section className="relative w-full h-[75vh] md:h-[85vh] overflow-hidden flex items-center justify-center bg-stone-950 group">
             <Carousel
                 key={carouselImages.length}
                 opts={{ align: "start", loop: true }}
                 plugins={[ Autoplay({ delay: 5000, stopOnInteraction: false }) ]}
                 className="w-full h-full absolute inset-0"
             >
                 <CarouselContent className="h-full ml-0">
                     {carouselImages.map((slide, idx) => (
                         <CarouselItem key={slide.id + idx} className="h-full pl-0 relative">
                             <div className="relative w-full h-full flex flex-col justify-end bg-stone-950">
                                 <div className="absolute inset-0 w-full h-full">
                                   <Image 
                                       data-ai-hint="hero authentic image"
                                       src={slide.imageUrl}
                                       alt={slide.title}
                                       fill
                                       className="object-contain md:object-contain transition-transform duration-[30s] ease-linear scale-100 group-hover:scale-105"
                                       priority={idx === 0}
                                   />
                                 </div>
                                 <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent pointer-events-none" />
                                 
                                 {/* Slide Specific Content */}
                                 <div className="relative z-20 container mx-auto px-6 pb-20 md:pb-32 text-left flex flex-col items-start gap-4">
                                     <Badge className="bg-orange-500/90 text-white border-none shadow-lg px-4 py-1.5 text-sm uppercase tracking-widest font-black">{slide.badge}</Badge>
                                     <div className="max-w-2xl">
                                       <h3 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight drop-shadow-2xl leading-tight">{slide.title}</h3>
                                       <p className="text-lg md:text-2xl text-stone-200 font-bold max-w-[90%] drop-shadow-md">{slide.subtitle}</p>
                                     </div>
                                     <div className="flex gap-4 mt-6 items-center flex-wrap">
                                       <Button asChild variant="cta" size="lg" className="rounded-2xl shadow-2xl touch-manipulation active:scale-95 group/btn border border-white/20 relative z-30 font-bold text-lg h-14 px-8">
                                           <a href="#services" onClick={(e) => { e.preventDefault(); setActiveService(slide.title.includes('Cook') ? 'Cook' : slide.title.includes('Maid') ? 'Maid' : slide.title.includes('Elder') ? 'Elder help' : 'Pure Pantry'); document.getElementById('services-grid')?.scrollIntoView({behavior: 'smooth'}); }}>
                                               {slide.cta} <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                                           </a>
                                       </Button>
                                     </div>
                                 </div>
                             </div>
                         </CarouselItem>
                     ))}
                 </CarouselContent>
             </Carousel>

             {/* Global Floating Header OVER the carousel */}
             <div className="absolute top-8 md:top-12 left-0 right-0 z-30 pointer-events-none">
                <div className="container mx-auto px-6">
                    <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-2xl">
                        <span className="text-stone-100">Urban</span> <span className="text-orange-400">Problems,</span> <span className="text-green-400">Sorted.</span>
                    </h1>
                    <p className="text-stone-200 font-semibold mt-2 drop-shadow-lg max-w-md hidden md:block">Premium home care and pure dining, automated.</p>
                </div>
             </div>
             
             {/* Simple Glassmorphic Booking Widget */}
             <div className="absolute bottom-20 md:bottom-28 right-6 md:right-10 z-30 hidden lg:block">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[2rem] shadow-2xl w-80 pointer-events-auto">
                   <h4 className="text-white font-bold mb-4 text-lg drop-shadow-md">Quick Availability</h4>
                   <HeroBookingDialog />
                </div>
             </div>
          </section>

          {/* Service Hub Section - 2x2 Grid for Mobile Fluidity */}
          <section id="services-grid" className="bg-white pt-16 md:pt-24 pb-8 relative z-20">
            <div className="container mx-auto px-6 text-center mb-10 md:mb-12">
               <Badge className="bg-primary/10 text-primary font-bold py-1 px-4 text-[10px] md:text-xs uppercase tracking-widest border-none mb-4">Explore Our Services</Badge>
               <h2 className="text-3xl md:text-5xl font-black text-stone-900 tracking-tight leading-tight">What do you need help with today?</h2>
            </div>

            <div className="container mx-auto px-4 md:px-6">
              {/* Grid layout: 2 cols on mobile, 4 on desktop */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 max-w-6xl mx-auto">
                {services.map((service) => {
                  const isActive = activeService === service.id;
                  return (
                    <button
                      key={service.id}
                      onClick={() => setActiveService(service.id)}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] border transition-all duration-300 group relative overflow-hidden h-[160px] md:h-[280px] cursor-pointer shadow-sm hover:shadow-lg",
                        isActive 
                          ? `bg-white border-transparent ${service.color.split(' ')[2]} ring-4 md:ring-8 ring-stone-100 scale-[1.02] z-10 shadow-xl` 
                          : "bg-surface border-surface-border hover:border-primary/30 hover:-translate-y-1"
                      )}
                    >
                      {isActive && (
                        <div className={cn("absolute inset-0 opacity-10 pointer-events-none", service.color.split(' ')[0])} />
                      )}

                      <div className={cn(
                        "relative w-16 h-16 md:w-32 md:h-32 rounded-xl md:rounded-[2rem] transition-transform duration-300 p-1",
                        isActive ? "scale-110 drop-shadow-md" : "scale-100 group-hover:scale-105"
                      )}>
                        <Image 
                          src={service.icon}
                          alt={service.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div className="text-center mt-3 md:mt-4">
                        <span className={cn(
                          "font-black text-sm md:text-2xl transition-all block tracking-tight leading-none",
                          isActive ? "text-stone-900" : "text-stone-600 group-hover:text-stone-900"
                        )}>
                          {service.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Connecting Pointer (NOTCH) - Desktop Only */}
            <div className="hidden lg:block container mx-auto px-6 relative h-12 max-w-6xl">
               <div 
                 className="absolute bottom-0 transition-all duration-500 ease-in-out flex justify-center"
                 style={{ 
                   width: '25%', 
                   left: `${services.findIndex(s => s.id === activeService) * 25}%` 
                 }}
               >
                 <div className={cn(
                   "w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[20px] transition-colors duration-500",
                   services.find(s => s.id === activeService)?.color.split(' ')[1].replace('text-', 'border-b-') || 'border-b-primary'
                 )}></div>
               </div>
            </div>
          </section>

          {/* Dynamic Content Container with Thematic Border & Mobile Badge */}
          <div className={cn(
            "relative z-10 border-t-[6px] md:border-t-[8px] transition-colors duration-500 py-12 md:py-20 bg-background",
            services.find(s => s.id === activeService)?.color.split(' ')[1].replace('text-', 'border-') || 'border-primary'
          )}>
            {/* Mobile Context Badge */}
            <div className="container mx-auto px-6 flex justify-center -translate-y-16">
               <div className={cn(
                 "px-6 py-2 rounded-full text-white font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-2",
                 services.find(s => s.id === activeService)?.color.split(' ')[1].replace('text-', 'bg-') || 'bg-primary'
               )}>
                 <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                 Now Viewing: {activeService}
               </div>
            </div>

            {activeService === 'Cook' && (
              <section className="dish-slider">
                <div className="container slider-header text-center mb-12">
                  <h2 className="section-title">Today’s chef-crafted picks</h2>
                  <p className="slider-subtitle max-w-2xl mx-auto mt-4 text-text-secondary text-lg">
                    A peek into what our cooks are plating right now — balanced, colourful, and tuned to real-life cravings.
                  </p>
                </div>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    plugins={[
                        Autoplay({
                          delay: 3500,
                          stopOnInteraction: true,
                        }),
                    ]}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4 px-4">
                        {heroCarouselDishes.map((dish) => (
                            <CarouselItem key={dish.id} className="pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/4">
                                 <div className="p-1 h-full">
                                    <Card className="overflow-hidden rounded-[2rem] shadow-sm hover:shadow-md transition-shadow border-none h-full bg-surface">
                                        <CardContent className="p-0 flex flex-col h-full">
                                            <Image 
                                                data-ai-hint={dish.hint}
                                                src={dish.image} 
                                                alt={dish.name} 
                                                width={400}
                                                height={300}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="p-5 bg-[#fde047] flex-1 flex flex-col">
                                                <h3 className="font-semibold text-lg text-text-primary mb-2">{dish.name}</h3>
                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                {dish.tags.map(tag => (
                                                    <Badge key={tag} variant="secondary" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border-none">{tag}</Badge>
                                                ))}
                                                </div>
                                                 <div className="grid grid-cols-3 gap-2 text-center mt-auto pt-4 border-t border-black/10">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Kcal</p>
                                                        <p className="text-sm font-bold text-foreground">{dish.calories}</p>
                                                    </div>
                                                    <div className="border-x border-black/10 px-1">
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Prot</p>
                                                        <p className="text-sm font-bold text-foreground">{dish.protein}g</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Carb</p>
                                                        <p className="text-sm font-bold text-foreground">{dish.carbs}g</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="hidden md:block">
                        <CarouselPrevious className="left-8 shadow-lg touch-manipulation active:scale-90" />
                        <CarouselNext className="right-8 shadow-lg touch-manipulation active:scale-90" />
                    </div>
                </Carousel>
                 <div className="text-center mt-12 px-4">
                  <Button asChild variant="cta" size="lg" className="w-full sm:w-auto h-14 px-12 font-bold text-lg shadow-xl touch-manipulation active:scale-95 transition-all">
                    <Link href="/pricing">Explore Today's Menu</Link>
                  </Button>
                </div>
              </section>
            )}

            {activeService === 'Maid' && (
              <MaidServiceTab />
            )}

            {activeService === 'Pure Pantry' && (
              <section className="container mx-auto px-6 text-center py-10">
                <Badge className="bg-emerald-500/10 text-emerald-600 font-bold py-1 px-4 text-xs uppercase tracking-widest border-none mb-4">New Launch</Badge>
                <h2 className="section-title">Pure Pantry</h2>
                <p className="text-text-secondary max-w-2xl mx-auto mt-4 text-lg">
                  The ultimate destination for unadulterated goodness. Only verified healthy items: from cold-pressed oils and ancient grain millet ladoos, to premium Kashmiri saffron and natural A2 Cow Kulfi. Zero chemicals, zero compromise.
                </p>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div className="flex gap-6 text-left p-6 rounded-3xl bg-surface border shadow-sm hover:border-emerald-500/30 transition-all">
                    <div className="bg-emerald-500/10 text-emerald-600 p-4 rounded-2xl h-fit shrink-0">
                      <Sparkles className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Artisan & Cold-Pressed</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">Authentic A2 cow milk treats, pure Kashmiri saffron, apples, and traditionally milled cold-pressed oils. Your body will thank you.</p>
                    </div>
                  </div>
                  <div className="flex gap-6 text-left p-6 rounded-3xl bg-surface border shadow-sm hover:border-emerald-500/30 transition-all">
                    <div className="bg-emerald-500/10 text-emerald-600 p-4 rounded-2xl h-fit shrink-0">
                      <Shield className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Strictly Curated Inventory</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">We strictly prohibit anything that harms the human system. If it's on Pure Pantry, it's 100% wholesome and lab-verified.</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeService === 'Elder help' && (
              <section className="container mx-auto px-6 text-center py-10">
                <Badge className="bg-primary/10 text-primary font-bold py-1 px-4 text-xs uppercase tracking-widest border-none mb-4">Coming Soon</Badge>
                <h2 className="section-title">Compassionate Elder Care</h2>
                <p className="text-text-secondary max-w-2xl mx-auto mt-4 text-lg">
                  Dedicated support for your loved ones. Our elder care specialists provide companionship and assistance with daily living activities.
                </p>
                <div className="mt-12 space-y-6 max-w-3xl mx-auto">
                  <div className="bg-surface border-2 border-primary/10 p-6 rounded-3xl flex items-center justify-between text-left group hover:border-primary/30 transition-all">
                    <div>
                      <h3 className="text-xl font-bold text-text-primary">Companion Care</h3>
                      <p className="text-sm text-muted-foreground mt-1">Mental stimulation and companionship through shared activities and conversation.</p>
                    </div>
                    <HeartPulse className="h-10 w-10 text-primary/20 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="bg-surface border-2 border-primary/10 p-6 rounded-3xl flex items-center justify-between text-left group hover:border-primary/30 transition-all">
                    <div>
                      <h3 className="text-xl font-bold text-text-primary">Assistance with Chores</h3>
                      <p className="text-sm text-muted-foreground mt-1">Light housekeeping and assistance with errands to ensure comfort and safety.</p>
                    </div>
                    <HeartPulse className="h-10 w-10 text-primary/20 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </section>
            )}
          </div>

          
          {/* Why Choose Us Section */}
          {activeService === 'Cook' && (
            <>
              <section className="section bg-primary/5">
            <div className="container mx-auto px-6 text-center">
              <Badge className="bg-badge-bg text-badge-text font-medium py-1 px-4 text-sm border-none">Why People Choose Us</Badge>
              <h2 className="section-title mt-2">Designed for Safety, Taste & Trust</h2>
              <p className="text-text-secondary max-w-3xl mx-auto mt-4">Every part of your meal — from curation to cooking to delivery — is built for consistency, transparency, and peace of mind.</p>
              <div className="grid md:grid-cols-3 gap-8 mt-12 text-left px-4">
                <article className="bg-white border-2 border-green-primary/20 rounded-[2rem] p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="bg-green-primary/10 text-green-primary inline-block p-4 rounded-2xl mb-6">
                        <ChefHat className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-3">Chef-Curated Menus</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">Designed by experienced chefs and cooked by vetted home cooks. Real ingredients. Real nutrition. Real taste.</p>
                </article>
                <article className="bg-white border-2 border-green-primary/20 rounded-[2rem] p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="bg-green-primary/10 text-green-primary inline-block p-4 rounded-2xl mb-6">
                        <Shield className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0B1A2E] mb-3">Zero Compromise</h3>
                    <p className="text-sm leading-relaxed text-[#355067]">Enjoy portions tailored to you. Since everything is cooked fresh in your kitchen, you always eat fully, without paying extra.</p>
                </article>
                <article className="bg-white border-2 border-green-primary/20 rounded-[2rem] p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="bg-green-primary/10 text-green-primary inline-block p-4 rounded-2xl mb-6">
                        <IndianRupee className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-3">Healthy & Fresh</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">Track ingredients and hygiene in real time. No hidden shortcuts, no mystery oils — just pure home cooking.</p>
                </article>
              </div>
            </div>
          </section>

          {/* New Pricing Section */}
          <section className="section bg-background">
            <div className="container mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto px-4">
                  <Badge className="bg-badge-bg text-badge-text font-medium py-1 px-4 text-sm border-none">Plans & Pricing</Badge>
                  <h2 className="section-title mt-2">Flexible Plans for Real Life</h2>
                  <p className="text-text-secondary mt-4">
                    Choose how deeply you want to plug us into your routine. Whether you want to try us for a day, settle into a weekly rhythm, or forget about food planning for the entire month — we’ve got a plan that keeps taste and nutrition on the same plate.
                  </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8 mt-12 items-stretch px-4">
                  {pricingPlans.map((plan) => (
                      <Card 
                          key={plan.name} 
                          className={cn(
                              "flex flex-col rounded-[2.5rem] shadow-none transition-all duration-300 border-2",
                              plan.highlight ? "lg:scale-105 bg-surface border-green-primary/30 shadow-xl" : "bg-surface/70 border-surface-border hover:border-primary/20"
                          )}
                      >
                          <CardHeader className="p-8 relative">
                              {plan.highlight && (
                                <Badge className="absolute top-0 -translate-y-1/2 bg-primary text-white font-bold py-1 px-4 text-xs uppercase tracking-widest border-none">Most Popular</Badge>
                              )}
                              <h3 className="font-bold text-2xl text-text-primary">{plan.name}</h3>
                              <div className="flex items-baseline gap-1 pt-2">
                                <span className="text-4xl font-black text-text-primary">{plan.price}</span>
                                <span className="text-text-secondary font-bold text-sm">{plan.period}</span>
                              </div>
                              <CardDescription className="text-text-secondary pt-2 text-sm font-medium leading-relaxed">{plan.tagline}</CardDescription>
                          </CardHeader>
                          <CardContent className="p-8 pt-0 flex-1">
                              <ul className="space-y-4">
                                  {plan.features.map((feature, i) => (
                                      <li key={i} className="flex items-start gap-3">
                                          <Check className="h-5 w-5 text-green-primary mt-0.5 shrink-0" />
                                          <span className="text-text-secondary text-sm font-medium">{feature}</span>
                                      </li>
                                  ))}
                              </ul>
                          </CardContent>
                          <CardFooter className="p-8 pt-0">
                               <Button asChild variant="cta" size="lg" className="w-full h-14 text-base font-bold rounded-2xl touch-manipulation active:scale-95 shadow-lg">
                                  <Link href={`/booking?plan=${plan.plan}`}>{plan.cta}</Link>
                              </Button>
                          </CardFooter>
                      </Card>
                  ))}
              </div>
              <div className="text-center mt-12 space-y-4 px-4">
                  <Button asChild size="lg" variant="cta" className="w-full sm:w-auto h-12 px-10 font-bold shadow-xl touch-manipulation active:scale-95">
                      <Link href="/pricing">Get Started with a Plan <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                  <p className="text-sm text-text-muted font-medium">
                      Not sure which plan fits you? <a href="/contact" className="underline hover:text-primary transition-colors">Talk to us.</a>
                  </p>
              </div>
            </div>
          </section>
            </>
          )}

          {activeService === 'Maid' && (
            <>
              <MaidValueProps />
              <MaidPricingPlans />
            </>
          )}

          {/* Newsletter Section */}
          <section className="section relative overflow-hidden bg-surface py-20">
             <div className="container mx-auto px-6 text-center relative z-10">
                <h2 className="section-title tracking-tight">Stay updated with fresh menus</h2>
                <p className="text-text-secondary mt-2 font-medium">Get the latest seasonal specials and early-access deals.</p>
                 <NewsletterForm />
             </div>
          </section>
        </main>
        
        <div className="md:hidden pb-16"></div>
        <BottomNav isGuest={true} />

        {/* Footer */}
        <footer className="bg-[#0F172A] text-[#9CA3AF] relative pt-32 pb-12 overflow-hidden px-4">
            <div className="absolute top-0 left-0 w-full h-32 bg-surface" style={{clipPath: "ellipse(100% 55% at 48% 44%)"}}></div>
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-5 gap-12 text-center md:text-left">
                    <div className="col-span-2 md:col-span-2">
                        <h3 className="font-black text-2xl text-white tracking-tighter">Bookeato</h3>
                        <p className="text-sm opacity-80 mt-4 max-w-xs leading-relaxed">Connecting food lovers with talented home cooks. Healthy, fresh, and authentically yours.</p>
                        <div className="flex gap-4 mt-6 justify-center md:justify-start">
                            <a href="#" className="bg-white/5 p-3 rounded-full hover:bg-white/10 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
                             <a href="#" className="bg-white/5 p-3 rounded-full hover:bg-white/10 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
                        </div>
                    </div>
                     <div>
                        <h3 className="font-bold text-white text-sm uppercase tracking-widest">Support</h3>
                        <ul className="space-y-2 mt-4 text-sm font-medium">
                            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-bold text-white text-sm uppercase tracking-widest">Company</h3>
                        <ul className="space-y-2 mt-4 text-sm font-medium">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm uppercase tracking-widest">Portals</h3>
                        <ul className="space-y-2 mt-4 text-sm font-medium">
                            <li><Link href="/cook/login" className="hover:text-white transition-colors">Cook Login</Link></li>
                            <li><Link href="/cook/signup" className="hover:text-white transition-colors">Join as Cook</Link></li>
                            <li><Link href="/maid/dashboard" className="hover:text-white transition-colors">Maid Dashboard</Link></li>
                            <li><Link href="/maid/signup" className="hover:text-white transition-colors">Join as Maid Partner</Link></li>
                            <li><Link href="/admin/login" className="hover:text-white transition-colors">Admin Panel</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-white/10 mt-16 pt-8 text-center text-xs font-bold uppercase tracking-widest opacity-40">
                    <p>&copy; 2024 Bookeato. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
      </div>
    </>
  );
}
