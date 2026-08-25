import React, { useEffect, useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LandingNavbar, Hero } from '../../components/landing/Hero';
import Features from '../../components/landing/Features';
import Demo from '../../components/landing/Demo';
import AnalyticsPreview from '../../components/landing/AnalyticsPreview';
import CTA from '../../components/landing/CTA';
import Footer from '../../components/landing/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const pageRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        const offset = Number(el.getAttribute('data-parallax')) || -60;
        gsap.to(el, {
          y: offset,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="relative min-h-screen overflow-x-hidden">
      <motion.div
        className="fixed left-0 top-0 z-[60] h-0.5 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400"
        style={{ width: progressWidth }}
      />
      <LandingNavbar />
      <Hero />
      <div
        data-parallax="-40"
        className="pointer-events-none absolute left-[-10%] top-[40%] h-64 w-64 rounded-full bg-primary-400/10 blur-3xl"
      />
      <div
        data-parallax="-80"
        className="pointer-events-none absolute right-[-5%] top-[55%] h-72 w-72 rounded-full bg-navy-400/10 blur-3xl"
      />
      <Features />
      <Demo />
      <AnalyticsPreview />
      <CTA />
      <Footer />
    </div>
  );
}
