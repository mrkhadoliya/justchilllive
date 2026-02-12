"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import Link from "next/link"
import { Video, MessageCircle, Users, Zap, Globe, Heart, Shield, Sparkles } from "lucide-react"

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-primary rounded-xl flex items-center justify-center shadow-lg">
              <Video className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Connect
            </span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors duration-300">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors duration-300">
              How It Works
            </a>
            <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors duration-300">
              Community
            </a>
            <Link href="/chat">
              <Button className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 text-white">
                Start Chatting
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-4 text-center relative">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Introducing Connect - Global Video Chatting</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-bold text-pretty leading-tight tracking-tight">
              Connect With
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                The World Instantly
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              Meet amazing people from across the globe through crystal-clear live video. Anonymous, secure, and ready
              for meaningful connections right now.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-12">
            <Link href="/chat" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 text-lg px-10 py-7 w-full sm:w-auto text-white font-semibold"
              >
                Start Free Now
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-7 w-full sm:w-auto font-semibold border-2 hover:bg-secondary/5 bg-transparent"
            >
              Watch Demo
            </Button>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-20 max-w-4xl mx-auto">
            {[
              { label: "Active Users", value: "500K+", icon: "👥" },
              { label: "Conversations Daily", value: "1M+", icon: "💬" },
              { label: "Countries", value: "180+", icon: "🌍" },
              { label: "Avg Rating", value: "4.9/5", icon: "⭐" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <p className="text-3xl mb-2">{stat.icon}</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-4 bg-gradient-to-b from-transparent to-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-pretty">Premium Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Everything you need for seamless video connections with people around the world
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Video,
                title: "HD Video",
                description: "Crystal clear video streaming optimized for any connection speed",
              },
              {
                icon: MessageCircle,
                title: "Live Chat",
                description: "Real-time messaging with emoji reactions during calls",
              },
              {
                icon: Globe,
                title: "Global Network",
                description: "Connect with people from 180+ countries worldwide",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "End-to-end encryption with no data collection or logging",
              },
              {
                icon: Zap,
                title: "Instant Matching",
                description: "Get connected in seconds with intelligent matching",
              },
              {
                icon: Users,
                title: "Random Discovery",
                description: "Meet interesting new people with each connection",
              },
              {
                icon: Heart,
                title: "Safe Environment",
                description: "Community guidelines and moderation for everyone",
              },
              {
                icon: Sparkles,
                title: "Advanced Controls",
                description: "Volume control, screen sharing, and camera settings",
              },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className="bg-card border border-border rounded-2xl p-8 transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/10 cursor-pointer group"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-pretty">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Get started in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Allow Camera & Mic",
                description: "Grant permissions for video and audio to enable real-time communication",
              },
              {
                step: "02",
                title: "Get Matched Instantly",
                description: "Our algorithm connects you with someone new in seconds",
              },
              {
                step: "03",
                title: "Start Chatting",
                description: "Enjoy video chat, send messages, and make meaningful connections",
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 rounded-2xl p-10 text-center h-full flex flex-col justify-center">
                  <div className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-6 w-12 h-12 items-center justify-center">
                    <div className="w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent absolute -left-6"></div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold">
                      →
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials/Community Section */}
      <section id="testimonials" className="py-32 px-4 bg-gradient-to-b from-secondary/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-pretty">Loved by Millions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join a thriving community of people making real connections
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                location: "New York, USA",
                quote: "Made friends from all over the world. Super easy to use!",
                rating: 5,
              },
              {
                name: "Alex K.",
                location: "Berlin, Germany",
                quote: "The video quality is amazing. Best experience I've had!",
                rating: 5,
              },
              {
                name: "Priya N.",
                location: "Mumbai, India",
                quote: "Love the simplicity and safety features. Highly recommended!",
                rating: 5,
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <span key={j} className="text-lg">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-lg mb-6 leading-relaxed text-muted-foreground">"{testimonial.quote}"</p>
                <div className="border-t border-border pt-4">
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 border border-primary/50 rounded-3xl p-16 text-center backdrop-blur-sm">
          <h2 className="text-5xl font-bold mb-6 text-pretty">Ready to Connect Today?</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of people making meaningful connections. Start chatting with random people from around the
            world right now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:shadow-primary/40 text-lg px-12 py-8 w-full font-bold text-white"
              >
                Start Chatting Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 text-center text-muted-foreground">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12 text-left">
            <div>
              <h4 className="font-bold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <p className="border-t border-border pt-8">
            &copy; 2025 Connect. All rights reserved. Your privacy and safety are our top priority.
          </p>
        </div>
      </footer>
    </div>
  )
}
