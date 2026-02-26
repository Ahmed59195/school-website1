"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, GraduationCap, BookOpen, Users, Trophy, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const stats = [
  { value: "1200+", label: "Students", icon: Users },
  { value: "80+", label: "Expert Teachers", icon: BookOpen },
  { value: "25+", label: "Years Excellence", icon: Trophy },
  { value: "98%", label: "Success Rate", icon: GraduationCap },
]

function AnimatedCounter({ value, duration = 2000 }: { value: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const numericValue = parseInt(value.replace(/\D/g, ""))
  const suffix = value.replace(/\d/g, "")

  useEffect(() => {
    let startTime: number
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * numericValue))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [numericValue, duration])

  return <span>{count}{suffix}</span>
}

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-primary/30">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/3 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl animate-pulse delay-500" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Floating Shapes */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-primary/40 animate-bounce delay-100" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-white/20 animate-bounce delay-300" />
        <div className="absolute bottom-1/4 left-1/3 w-5 h-5 rounded-full bg-emerald-400/30 animate-bounce delay-500" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={cn(
            "text-center lg:text-left transition-all duration-1000",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Admissions Open for 2026-27</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl xl:text-7xl">
              Empowering Minds,{" "}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent">
                  Shaping Futures
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/20 -skew-x-6 rounded" />
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto lg:mx-0 mt-6 max-w-xl text-lg text-slate-300 md:text-xl leading-relaxed">
              Al-Noor Academy provides world-class K-12 education, nurturing tomorrow's leaders with
              <span className="text-white font-medium"> academic excellence</span>,
              <span className="text-white font-medium"> Islamic values</span>, and
              <span className="text-white font-medium"> modern innovation</span>.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                size="lg"
                className="h-14 px-8 text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 group"
                asChild
              >
                <Link href="/admissions/apply">
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base border-white/20 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm group"
                asChild
              >
                <Link href="/about">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Our Story
                </Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Cambridge Affiliated</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>ISO Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Award Winning</span>
              </div>
            </div>
          </div>

          {/* Right Content - Stats Cards */}
          <div className={cn(
            "relative transition-all duration-1000 delay-300",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            {/* Decorative Ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 rounded-full border border-white/10 animate-spin-slow" style={{ animationDuration: '20s' }} />
              <div className="absolute w-96 h-96 rounded-full border border-white/5" />
            </div>

            {/* Stats Grid */}
            <div className="relative grid grid-cols-2 gap-4 p-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105",
                      index === 0 && "col-span-1",
                      index === 1 && "col-span-1 mt-8",
                      index === 2 && "col-span-1 -mt-4",
                      index === 3 && "col-span-1 mt-4"
                    )}
                  >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative">
                      <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                        {mounted ? <AnimatedCounter value={stat.value} /> : stat.value}
                      </div>
                      <div className="text-sm text-slate-400">{stat.label}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  )
}
