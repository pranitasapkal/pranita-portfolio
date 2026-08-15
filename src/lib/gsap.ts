/**
 * Central GSAP plugin registration — import this once before any GSAP usage.
 * All plugins are registered here so they register exactly once.
 */
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export { gsap, ScrollTrigger, useGSAP }
