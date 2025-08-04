"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import ProductPreview from "@/components/ProductPreview.jsx";
import {
  ShoppingCart,
  Star,
  Shield,
  Truck,
  Award,
  Users,
  ChevronLeft,
  ChevronRight,
  Quote,
  ArrowUp,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const router = useRouter();

  const heroSlides = [
    {
      image: "/Banner1.mp4",
    },
    {
      image: "/Banner3.mp4",
    },
    {
      image: "/Banner4.mp4",
    },
    {
      image: "/Banner5.mp4",
    },
  ];

  const testimonials = [
    {
      name: "Aman Gupta",
      role: "Professional Bodybuilder",
      // image: "/placeholder.svg?height=80&width=80&text=RS",
      quote:
        "Mixes well in cold as well as warm water. Overpriced a little but giving quality at its best. Tastes well enough to crave more n more. Go for it as results are quite good. No digestive issues faced optimum sugar content.",
      rating: 5,
    },
    {
      name: "Ridhima",
      role: "Fitness Enthusiast",
      // image: "/placeholder.svg?height=80&width=80&text=PP",
      quote:
        "Easily soluble. And effective. Its my first time using this product. And am happy with it.",
      rating: 5,
    },
    {
      name: "Mayank jadhav",
      role: "Personal Trainer",
      // image: "/placeholder.svg?height=80&width=80&text=AS",
      quote:
        "The packaging was good, one thing a like the most that they provide a code to check whether the product is authenticated or not.",
      rating: 5,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [currentSlide, heroSlides.length]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!sessionStorage.getItem("reloaded")) {
      sessionStorage.setItem("reloaded", "true");
      window.location.reload();
    } else {
      sessionStorage.removeItem("reloaded");
    }
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      {/* Watermark Pattern */}
      {/* <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.02] text-black text-8xl font-bold transform rotate-12 select-none overflow-hidden">
          <div className="grid grid-cols-6 gap-32 h-full w-full">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col justify-center items-center space-y-32"
              >
                <span>MC</span>
                <span>MC</span>
                <span>MC</span>
                <span>MC</span>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Top Promotional Banner */}
      <div className="relative  bg-gradient-to-r from-red-500 to-orange-500 text-white text-center py-2 text-sm  z-10">
        <div className="container mx-auto px-4">
          <span className="font-medium">
            🎉 FREE SHIPPING on orders above ₹999 | Use code: FREESHIP
          </span>
        </div>
      </div>

      {/* Hero Slider */}
      <section className="relative h-[300px] md:h-[600px] overflow-hidden z-10">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide
                ? "translate-x-0"
                : index < currentSlide
                ? "-translate-x-full"
                : "translate-x-full"
            }`}
          >
            <div className="relative h-full">
              <video
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                fill
                className="md:w-full md:h-full object-cover"
                controls={false}
                autoPlay={true}
                loop={true}
                muted={true}
                playsInline={true}
                poster="/placeholder.svg?height=600&width=1200&text=Hero+"
              />
              {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-blue-900/60 to-indigo-900/60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-4xl px-4">
                  <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 animate-fade-in-delay text-blue-100">
                    {slide.subtitle}
                  </p>
                  <Button
                    onClick={() => router.push("/products")}
                    size="lg"
                    className="bg-gradient-cta hover:bg-gradient-cta-hover text-white text-lg px-8 py-3 animate-fade-in-delay-2 shadow-lg"
                  >
                    {slide.cta}
                  </Button>
                </div>
              </div> */}
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Slider Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-gradient-to-r from-red-500 to-orange-500"
                  : "bg-white bg-opacity-50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gradient-primary mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600">
              Premium supplements for your fitness goals
            </p>
          </div>
          <ProductPreview />

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent"
              onClick={() => (window.location.href = "/products")}
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-gray-200 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center space-y-2 group hover:scale-105 transition-transform bg-white p-6 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center group-hover:bg-gradient-secondary transition-all">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">100% Authentic</h3>
              <p className="text-sm text-gray-600">Genuine products only</p>
            </div>
            <div className="flex flex-col items-center space-y-2 group hover:scale-105 transition-transform bg-white p-6 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center group-hover:bg-gradient-secondary transition-all">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders above ₹999</p>
            </div>
            <div className="flex flex-col items-center space-y-2 group hover:scale-105 transition-transform bg-white p-6 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center group-hover:bg-gradient-secondary transition-all">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">Lab Tested</h3>
              <p className="text-sm text-gray-600">Quality guaranteed</p>
            </div>
            <div className="flex flex-col items-center space-y-2 group hover:scale-105 transition-transform bg-white p-6 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center group-hover:bg-gradient-secondary transition-all">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">100+ Customers</h3>
              <p className="text-sm text-gray-600">Trusted Products</p>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      {/* <section className="py-8 bg-gradient-cta relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="text-white">
              <h2 className="text-2xl md:text-3xl font-bold">
                🔥 MEGA SALE - UP TO 50% OFF!
              </h2>
              <p className="text-lg">Limited time offer on all supplements</p>
            </div>
            <Button
              size="lg"
              className="bg-white text-red-500 hover:bg-gray-100 font-semibold shadow-lg"
            >
              Shop Sale Now
            </Button>
          </div>
        </div>
      </section> */}

      {/* Benefits Section */}
      <section className="py-16 bg-gray-200 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gradient-secondary mb-4">
              Why Choose Muscle Decode?
            </h2>
            <p className="text-xl text-gray-600">
              Your trusted partner in fitness nutrition
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow group">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gradient-secondary transition-all">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Premium Quality
              </h3>
              <p className="text-gray-600">
                All products are third-party tested and certified for purity and
                potency.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow group">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gradient-secondary transition-all">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Expert Support
              </h3>
              <p className="text-gray-600">
                Get personalized nutrition advice from certified fitness
                experts.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow group">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gradient-secondary transition-all">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Fast Delivery
              </h3>
              <p className="text-gray-600">
                Quick and secure delivery to your doorstep within 2-3 business
                days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gradient-primary mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Real reviews from real customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow bg-white border border-gray-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-orange-500 fill-current"
                      />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-gray-300 mb-2" />
                  <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-primary relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-xl text-blue-100 mb-8">
            Get the latest fitness tips and exclusive offers
          </p>

          <div className="max-w-md mx-auto flex space-x-4">
            <Input placeholder="Enter your email" className="flex-1 bg-white" />
            <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3">
        {/* Scroll to Top */}
        {showScrollTop && (
          <Button
            onClick={scrollToTop}
            size="lg"
            className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowUp className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  );
}
