import { Metadata } from 'next'
import { Layout } from "@/components/layout"
import { Footer } from "@/components/footer"
import { FileText } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const dynamic = 'force-static'
export const revalidate = false 

export const metadata: Metadata = {
  title: 'Changelog',
  description: "Tracking recent fixes and updates to the blog's architecture.",
  openGraph: {
    title: 'Changelog | Vivek Blog',
    description: "Tracking recent fixes and updates to the blog's architecture.",
  },
} 

export default function ChangelogPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <header className="mb-12">
          <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 mb-4">
            <FileText className="w-5 h-5" />
            <span className="font-mono text-sm tracking-wide uppercase">Engineering Log</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">
            Changelog & Architecture Fixes
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            A transparent look into how I diagnose and resolve technical hurdles on this platform.
          </p>
        </header>

        <div className="relative pb-10">
          
          {/* Dashed Timeline Line */}
          <div className="absolute left-[15px] top-2 bottom-0 w-px border-l-2 border-dashed border-zinc-200 dark:border-zinc-800" />

          {/* Timeline Item - Jun 16 (Media Popup Link Interception) */}
          <div className="relative mb-12">
            
            {/* Dot */}
            <div className="absolute left-[11px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white dark:ring-[#09090b] z-10" />
            
            {/* Item Content Container */}
            <div className="pl-10 sm:pl-12">
              
              {/* Date & Category Label (Next to dot) */}
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 flex items-center">
                <span>Jun 16, 2026</span>
                <span className="mx-2">·</span>
                <span>Architecture Update</span>
              </div>
              
              {/* The Card */}
              <div className="w-full bg-white dark:bg-[#09090b] p-2 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger className="hover:no-underline p-0 py-2">
                      <div className="flex items-center w-full pr-2 sm:pr-4">
                        
                        {/* Stacked Date */}
                        <div className="flex flex-col items-center justify-center w-12 sm:w-16 shrink-0 text-zinc-400 dark:text-zinc-500">
                          <span className="text-sm font-medium">16</span>
                          <span className="text-xs uppercase">Jun</span>
                        </div>
                        
                        {/* Vertical Divider */}
                        <div className="w-px h-8 sm:h-10 bg-zinc-100 dark:bg-zinc-800 mx-2 sm:mx-4 shrink-0" />
                        
                        {/* Title */}
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm sm:text-base text-left flex-1 pr-4">
                          Fixed Media Popup Link Interception
                        </h3>
                        
                        {/* Badge */}
                        <div className="shrink-0">
                          <span className="px-2.5 py-1 text-xs font-semibold tracking-wide rounded bg-blue-100/80 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 uppercase">
                            updated
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    {/* Accordion Dropdown Content */}
                    <AccordionContent className="pt-4 sm:pt-6 pb-2">
                      <div className="pl-2 sm:pl-[4.5rem] pr-2 sm:pr-4">
                        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          <p>
                            <strong>The Problem:</strong> When clicking external or internal links embedded in blog posts and notes, the links were supposed to open within a custom `MediaPopup` overlay. Instead, they were overriding the current page entirely, acting like standard HTML navigation.
                          </p>

                          <p>
                            <strong>Diagnosis & Solutions:</strong>
                          </p>
                          
                          <ul className="list-disc pl-4 space-y-3">
                            <li>
                              <strong>Missing Element References:</strong> In the core markdown renderer component, the <code>ref</code> property was missing from the markdown container `div`. Because of this, the `useEffect` hook that attached the popup event listeners exited early, leaving standard links unhandled.
                              <br/><span className="text-zinc-500 italic mt-1 inline-block">Fix: Added the missing <code>ref</code> so the DOM traversal logic could properly locate the links.</span>
                            </li>
                            
                            <li>
                              <strong>Fragile DOM Reconciliation:</strong> Initially, I was using <code>querySelectorAll</code> to attach an event listener to every single <code>&lt;a&gt;</code> tag individually. However, due to React's hydration and strict-mode rendering inside <code>dangerouslySetInnerHTML</code>, these DOM nodes were frequently reconstructed, silently wiping out my attached listeners.
                              <br/><span className="text-zinc-500 italic mt-1 inline-block">Fix: Migrated to <strong>Event Delegation</strong>. By attaching a single, permanent event listener to the parent container, clicks naturally bubble up. The container now intercepts them, checks if they originated from a link, and halts native navigation via <code>e.preventDefault()</code> and <code>e.stopPropagation()</code>.</span>
                            </li>

                            <li>
                              <strong>"Go to Page" Accessibility:</strong> Since external links now forcefully open in the internal overlay, users were trapped inside the iframe without a way to visit the actual site natively.
                              <br/><span className="text-zinc-500 italic mt-1 inline-block">Fix: Added an explicit "Open in new window" button to the <code>MediaPopup</code> header to allow secure <code>target="_blank"</code> escapes.</span>
                            </li>
                          </ul>

                          <p className="pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-6">
                            <strong>Result:</strong> A completely bulletproof pop-up overlay that is fully resilient against React DOM re-renders and handles all URL permutations seamlessly.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>

          {/* Timeline Item - Jun 7 (Social Preview & OG Cards) */}
          <div className="relative mb-12">
            
            {/* Dot */}
            <div className="absolute left-[11px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-[#09090b] z-10" />
            
            {/* Item Content Container */}
            <div className="pl-10 sm:pl-12">
              
              {/* Date & Category Label */}
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 flex items-center">
                <span>Jun 7, 2026</span>
                <span className="mx-2">·</span>
                <span>Social Preview & Core Sharing</span>
              </div>
              
              {/* The Card */}
              <div className="w-full bg-white dark:bg-[#09090b] p-2 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-jun-7-social" className="border-none">
                    <AccordionTrigger className="hover:no-underline p-0 py-2">
                      <div className="flex items-center w-full pr-2 sm:pr-4">
                        
                        {/* Stacked Date */}
                        <div className="flex flex-col items-center justify-center w-12 sm:w-16 shrink-0 text-zinc-400 dark:text-zinc-500">
                          <span className="text-sm font-medium">07</span>
                          <span className="text-xs uppercase">Jun</span>
                        </div>
                        
                        {/* Vertical Divider */}
                        <div className="w-px h-8 sm:h-10 bg-zinc-100 dark:bg-zinc-800 mx-2 sm:mx-4 shrink-0" />
                        
                        {/* Title */}
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm sm:text-base text-left flex-1 pr-4">
                          Dynamic Open Graph Cards & Interactive Share Modal
                        </h3>
                        
                        {/* Badge */}
                        <div className="shrink-0">
                          <span className="px-2.5 py-1 text-xs font-semibold tracking-wide rounded bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 uppercase">
                            new
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    {/* Accordion Dropdown Content */}
                    <AccordionContent className="pt-4 sm:pt-6 pb-2">
                      <div className="pl-2 sm:pl-[4.5rem] pr-2 sm:pr-4">
                        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          <p>
                            <strong>Open Graph Image Overhaul:</strong>
                            <br/>
                            <em>Problem:</em> The dynamic social preview cards (OG Images) had a hardcoded layout, generic logos, and fixed font sizes that broke when long post titles overflowed the 1200x630px canvas.
                            <br/>
                            <em>Solution:</em> Completely rebuilt the <code>/api/og</code> endpoint using <code>@vercel/og</code> to dynamically mirror a premium GitHub-issue style card. Integrated the site&apos;s authentic logo, injected sanitized post excerpts directly into the card, added a dynamic &quot;Read full&quot; call-to-action, and built an intelligent font-scaling algorithm that shrinks long titles automatically to prevent layout overflow.
                          </p>

                          <p>
                            <strong>Bypassing the Native Share API Crash:</strong>
                            <br/>
                            <em>Problem:</em> Clicking the &quot;Share&quot; button passed long, complex markdown text into the browser&apos;s native <code>navigator.share()</code> API. This resulted in silent link-preview failures on WhatsApp (because it received a paragraph instead of a raw link) and threw fatal <code>[object Event]</code> runtime crashes when users cancelled the OS-level share sheet.
                            <br/>
                            <em>Solution:</em> Completely bypassed the buggy native Web Share API. Designed and integrated a gorgeous interactive <strong>Share Modal</strong> (using Radix UI Dialog). Now, clicking Share instantly pops up a visual preview of the generated OG card right on the website, alongside one-click buttons to copy the link or share directly to Twitter and WhatsApp.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>

          {/* Timeline Item - Jun 6 (Documentation & Onboarding) */}
          <div className="relative mb-12">
            
            {/* Dot */}
            <div className="absolute left-[11px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-white dark:ring-[#09090b] z-10" />
            
            {/* Item Content Container */}
            <div className="pl-10 sm:pl-12">
              
              {/* Date & Category Label */}
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 flex items-center">
                <span>Jun 6, 2026</span>
                <span className="mx-2">·</span>
                <span>Documentation Update</span>
              </div>
              
              {/* The Card */}
              <div className="w-full bg-white dark:bg-[#09090b] p-2 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-jun-6-documentation" className="border-none">
                    <AccordionTrigger className="hover:no-underline p-0 py-2">
                      <div className="flex items-center w-full pr-2 sm:pr-4">
                        
                        {/* Stacked Date */}
                        <div className="flex flex-col items-center justify-center w-12 sm:w-16 shrink-0 text-zinc-400 dark:text-zinc-500">
                          <span className="text-sm font-medium">06</span>
                          <span className="text-xs uppercase">Jun</span>
                        </div>
                        
                        {/* Vertical Divider */}
                        <div className="w-px h-8 sm:h-10 bg-zinc-100 dark:bg-zinc-800 mx-2 sm:mx-4 shrink-0" />
                        
                        {/* Title */}
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm sm:text-base text-left flex-1 pr-4">
                          Comprehensive Project Documentation & Admin Onboarding
                        </h3>
                        
                        {/* Badge */}
                        <div className="shrink-0">
                          <span className="px-2.5 py-1 text-xs font-semibold tracking-wide rounded bg-amber-100/80 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 uppercase">
                            updated
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    {/* Accordion Dropdown Content */}
                    <AccordionContent className="pt-4 sm:pt-6 pb-2">
                      <div className="pl-2 sm:pl-[4.5rem] pr-2 sm:pr-4">
                        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          <p>
                            <strong>Complete README Overhaul:</strong>
                            <br/>
                            <em>Problem:</em> The repository lacked a central source of truth for its architecture, feature set, and setup instructions. It was difficult to understand how the project was built or how to run it locally.
                            <br/>
                            <em>Solution:</em> Completely rewrote the <code>README.md</code>. Added a comprehensive list of features, a detailed technology stack breakdown (Next.js 15+, Tailwind, Prisma, PostgreSQL), and step-by-step local setup instructions including database generation.
                          </p>

                          <p>
                            <strong>Secret Admin Dashboard Documentation:</strong>
                            <br/>
                            <em>Problem:</em> The new feature allowing content creation via a secret admin dashboard was completely undocumented, leaving users to rely solely on manual Markdown file creation.
                            <br/>
                            <em>Solution:</em> Added a dedicated section explaining the dual content creation workflows. Highlighted the secret admin dashboard as the recommended primary method to write, preview, and publish posts directly from the website without modifying local files.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>

          {/* Timeline Item - Jun 6 (Post Engagement & UI) */}
          <div className="relative mb-12">
            
            {/* Dot */}
            <div className="absolute left-[11px] top-1.5 w-2.5 h-2.5 rounded-full bg-fuchsia-500 ring-4 ring-white dark:ring-[#09090b] z-10" />
            
            {/* Item Content Container */}
            <div className="pl-10 sm:pl-12">
              
              {/* Date & Category Label */}
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 flex items-center">
                <span>Jun 6, 2026</span>
                <span className="mx-2">·</span>
                <span>Post Engagement & UI Update</span>
              </div>
              
              {/* The Card */}
              <div className="w-full bg-white dark:bg-[#09090b] p-2 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-jun-6-comments" className="border-none">
                    <AccordionTrigger className="hover:no-underline p-0 py-2">
                      <div className="flex items-center w-full pr-2 sm:pr-4">
                        
                        {/* Stacked Date */}
                        <div className="flex flex-col items-center justify-center w-12 sm:w-16 shrink-0 text-zinc-400 dark:text-zinc-500">
                          <span className="text-sm font-medium">06</span>
                          <span className="text-xs uppercase">Jun</span>
                        </div>
                        
                        {/* Vertical Divider */}
                        <div className="w-px h-8 sm:h-10 bg-zinc-100 dark:bg-zinc-800 mx-2 sm:mx-4 shrink-0" />
                        
                        {/* Title */}
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm sm:text-base text-left flex-1 pr-4">
                          Interactive Comments, Read Time Algorithm & Post UI Refinements
                        </h3>
                        
                        {/* Badge */}
                        <div className="shrink-0">
                          <span className="px-2.5 py-1 text-xs font-semibold tracking-wide rounded bg-fuchsia-100/80 text-fuchsia-700 dark:bg-fuchsia-500/20 dark:text-fuchsia-400 uppercase">
                            new
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    {/* Accordion Dropdown Content */}
                    <AccordionContent className="pt-4 sm:pt-6 pb-2">
                      <div className="pl-2 sm:pl-[4.5rem] pr-2 sm:pr-4">
                        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          <p>
                            <strong>Interactive Comments Section:</strong> Built and integrated a dynamic, database-backed comments section positioned seamlessly at the end of every post. The integration included a fully responsive submission form, a real-time updating list of community thoughts, and a dynamic comment counter icon directly inside the post&apos;s metadata bar.
                          </p>

                          <p>
                            <strong>Accurate Reading Time Algorithm:</strong> 
                            <br/>
                            <em>Problem:</em> The reading time estimate was overly simplistic, ignoring the cognitive load of processing images, and it ran dynamically on every page load.
                            <br/>
                            <em>Solution:</em> Engineered a sophisticated algorithm that calculates both word count (225 WPM) and image cognitive delay (12s for the first image, decaying to a floor of 3s per subsequent image). Shifted the execution out of the client and into Next.js Static Generation so the exact time is baked effortlessly into the build without a performance hit.
                          </p>

                          <p>
                            <strong>Table of Contents Scrollspy & Visual Glow:</strong> 
                            <br/>
                            <em>Problem:</em> The &quot;On this page&quot; sidebar lacked distinct visual feedback, leaving readers unsure of their exact position within long technical articles.
                            <br/>
                            <em>Solution:</em> Tuned the <code>IntersectionObserver</code> bounds for pinpoint scrolling accuracy and applied a theme-aware &quot;glow&quot; effect (casting a dark shadow in light mode and a crisp white shadow in dark mode) to the actively read section. Supplemented this with an elegant staggered skeleton loader to prevent layout shifts on desktop.
                          </p>

                          <p>
                            <strong>Streamlined Like & Share Engagement:</strong> 
                            <br/>
                            <em>Problem:</em> The Like and Share buttons were bulky, heavily bordered, and occupied far too much vertical whitespace, disrupting the premium aesthetic of the post header.
                            <br/>
                            <em>Solution:</em> Dismantled the clunky button frames and transformed them into elegant, clickable inline icons, slotting them flawlessly alongside the View and Comment counters to reclaim significant screen real estate.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>

          {/* Timeline Item - Jun 6 (UI Polishing & Fixes) */}
          <div className="relative mb-12">
            
            {/* Dot */}
            <div className="absolute left-[11px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-[#09090b] z-10" />
            
            {/* Item Content Container */}
            <div className="pl-10 sm:pl-12">
              
              {/* Date & Category Label */}
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 flex items-center">
                <span>Jun 6, 2026</span>
                <span className="mx-2">·</span>
                <span>UI Polishing & Bug Fixes</span>
              </div>
              
              {/* The Card */}
              <div className="w-full bg-white dark:bg-[#09090b] p-2 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-jun-6-ui-fixes" className="border-none">
                    <AccordionTrigger className="hover:no-underline p-0 py-2">
                      <div className="flex items-center w-full pr-2 sm:pr-4">
                        
                        {/* Stacked Date */}
                        <div className="flex flex-col items-center justify-center w-12 sm:w-16 shrink-0 text-zinc-400 dark:text-zinc-500">
                          <span className="text-sm font-medium">06</span>
                          <span className="text-xs uppercase">Jun</span>
                        </div>
                        
                        {/* Vertical Divider */}
                        <div className="w-px h-8 sm:h-10 bg-zinc-100 dark:bg-zinc-800 mx-2 sm:mx-4 shrink-0" />
                        
                        {/* Title */}
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm sm:text-base text-left flex-1 pr-4">
                          Scroll Tracking, Navbar Fixes & Aesthetics
                        </h3>
                        
                        {/* Badge */}
                        <div className="shrink-0">
                          <span className="px-2.5 py-1 text-xs font-semibold tracking-wide rounded bg-indigo-100/80 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 uppercase">
                            updated
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    {/* Accordion Dropdown Content */}
                    <AccordionContent className="pt-4 sm:pt-6 pb-2">
                      <div className="pl-2 sm:pl-[4.5rem] pr-2 sm:pr-4">
                        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          <p>
                            <strong>Sticky Navbar Flicker Fix:</strong>
                            <br/>
                            <em>Problem:</em> The navbar jittered and flickered wildly when scrolling near the top of the page. Shrinking its padding instantly collapsed the page height, creating an infinite layout-shift loop.
                            <br/>
                            <em>Solution:</em> Separated the sticky behavior from the document flow. Transformed the wrapper into a true <code>fixed</code> overlay and placed a static <code>88px</code> placeholder <code>div</code> behind it to maintain the layout dimensions. The glass header now shrinks smoothly without yanking the page.
                          </p>

                          <p>
                            <strong>Intelligent Scroll Progress Indicator:</strong> 
                            <br/>
                            <em>Problem:</em> The top-of-page reading progress bar was completely hidden underneath the frosted-glass navbar.
                            <br/>
                            <em>Solution:</em> Re-engineered the <code>ScrollProgress</code> component and injected it directly inside the <code>Header</code>. It now perfectly traces the absolute bottom border of the navbar, tracking scroll progress cleanly underneath the frosted glass.
                          </p>

                          <p>
                            <strong>Auto-Scrolling Table of Contents:</strong> 
                            <br/>
                            <em>Problem:</em> The "On this page" sidebar list was static. Readers lost track of their position on long articles when the active section scrolled out of view.
                            <br/>
                            <em>Solution:</em> Added a manual scrolling mechanism via <code>useRef</code> and <code>scrollTo</code>. The Table of Contents now dynamically and smoothly scrolls itself to ensure the actively read section is always visibly pinned near the top of the list.
                          </p>

                          <p>
                            <strong>Radix UI Archive Crash Fix:</strong>
                            <br/>
                            <em>Problem:</em> The <code>/archive</code> page threw a fatal React error (<code>A &lt;Select.Item /&gt; must have a value prop that is not an empty string</code>).
                            <br/>
                            <em>Solution:</em> Discovered that blog tags with trailing commas were generating blank <code>[""]</code> entries. Added aggressive filtering to scrub empty strings out of the tags array before rendering the Radix Select options.
                          </p>

                          <p>
                            <strong>Aesthetic Polishing:</strong>
                            <br/>
                            - <strong>Tables:</strong> Prevented Markdown tables from breaking layout bounds by enforcing strict <code>w-fit mx-auto</code> centering and horizontal scrolling logic.
                            <br/>
                            - <strong>Typography:</strong> Refined the blog post title layout and text size to be slightly more compact and elegant on desktop.
                            <br/>
                            - <strong>Avatar:</strong> Fixed an issue where the main profile logo wasn't perfectly round by forcing a strict 1:1 <code>aspect-square</code> ratio on the image regardless of intrinsic dimensions.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>

          {/* Timeline Item - May 29 (Admin & Mobile UI) */}
          <div className="relative mb-12">
            
            {/* Dot */}
            <div className="absolute left-[11px] top-1.5 w-2.5 h-2.5 rounded-full bg-teal-500 ring-4 ring-white dark:ring-[#09090b] z-10" />
            
            {/* Item Content Container */}
            <div className="pl-10 sm:pl-12">
              
              {/* Date & Category Label */}
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 flex items-center">
                <span>May 29, 2026</span>
                <span className="mx-2">·</span>
                <span>Admin Tools & Mobile UI</span>
              </div>
              
              {/* The Card */}
              <div className="w-full bg-white dark:bg-[#09090b] p-2 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-may-29-admin-mobile" className="border-none">
                    <AccordionTrigger className="hover:no-underline p-0 py-2">
                      <div className="flex items-center w-full pr-2 sm:pr-4">
                        
                        {/* Stacked Date */}
                        <div className="flex flex-col items-center justify-center w-12 sm:w-16 shrink-0 text-zinc-400 dark:text-zinc-500">
                          <span className="text-sm font-medium">29</span>
                          <span className="text-xs uppercase">May</span>
                        </div>
                        
                        {/* Vertical Divider */}
                        <div className="w-px h-8 sm:h-10 bg-zinc-100 dark:bg-zinc-800 mx-2 sm:mx-4 shrink-0" />
                        
                        {/* Title */}
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm sm:text-base text-left flex-1 pr-4">
                          Admin Post Management, Mobile UI Overhaul & Bug Fixes
                        </h3>
                        
                        {/* Badge */}
                        <div className="shrink-0">
                          <span className="px-2.5 py-1 text-xs font-semibold tracking-wide rounded bg-teal-100/80 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400 uppercase">
                            updated
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    {/* Accordion Dropdown Content */}
                    <AccordionContent className="pt-4 sm:pt-6 pb-2">
                      <div className="pl-2 sm:pl-[4.5rem] pr-2 sm:pr-4">
                        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          <p>
                            <strong>Admin Editing & Simulation Embeds:</strong> Upgraded the content management system. Added an inline <code>AdminEditButton</code> and a <code>deleteContent</code> server action to modify or delete live posts. Integrated a new <code>Simulation</code> database model, allowing direct HTML file uploads from the editor that automatically generate absolute embedding links for the media popups.
                          </p>

                          <p>
                            <strong>Next.js Static Cache Invalidation:</strong> 
                            <br/>
                            <em>Problem:</em> After editing a post, the live site still showed the old content. Next.js statically caches pages with <code>force-static</code> and never checks the database again.
                            <br/>
                            <em>Solution:</em> Injected <code>revalidatePath</code> into the <code>updateContent</code> and <code>deleteContent</code> server actions. Now, the moment a post is saved, Next.js instantly busts the cache for that specific URL and rebuilds the static HTML in the background.
                          </p>

                          <p>
                            <strong>Mobile Navbar Optimization:</strong> Freed up valuable horizontal space on mobile devices by hiding the text labels on the navigation bar (using <code>hidden sm:inline</code>) and slightly scaling up the icons for better touch targets. Hid the main blog title on tiny screens so the layout remains uncluttered.
                          </p>

                          <p>
                            <strong>Mobile X-Axis Overflow & Tables:</strong> 
                            <br/>
                            <em>Problem:</em> Long code blocks, URLs, and Markdown tables were refusing to shrink, forcing the entire page layout to stretch horizontally on mobile phones.
                            <br/>
                            <em>Solution:</em> Added a strict <code>overflow-x-hidden</code> lock to the global body to prevent viewport stretching. Updated the <code>prose</code> text container with robust <code>break-words</code> rules, and transformed Markdown tables into block-level elements with internal <code>overflow-x: auto</code> scrolling. Tables now scroll natively without destroying the reading experience.
                          </p>

                          <p>
                            <strong>Radix UI Crash Fix:</strong>
                            <br/>
                            <em>Problem:</em> A fatal white-screen client crash occurred on the Archive page due to a Radix UI error: <code>A &lt;Select.Item /&gt; must have a value prop that is not an empty string.</code>
                            <br/>
                            <em>Solution:</em> Found that editing posts with trailing commas generated empty string tags <code>[""]</code>. Updated the Prisma query and server actions to aggressively <code>filter(Boolean)</code> empty strings out of the tags array before they ever hit the database.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>

          {/* Timeline Item - May 29 (SPA Navigation & DB Fixes) */}
          <div className="relative mb-12">
            
            {/* Dot */}
            <div className="absolute left-[11px] top-1.5 w-2.5 h-2.5 rounded-full bg-pink-500 ring-4 ring-white dark:ring-[#09090b] z-10" />
            
            {/* Item Content Container */}
            <div className="pl-10 sm:pl-12">
              
              {/* Date & Category Label */}
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 flex items-center">
                <span>May 29, 2026</span>
                <span className="mx-2">·</span>
                <span>Architecture & Layout Fixes</span>
              </div>
              
              {/* The Card */}
              <div className="w-full bg-white dark:bg-[#09090b] p-2 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-may-29-spa" className="border-none">
                    <AccordionTrigger className="hover:no-underline p-0 py-2">
                      <div className="flex items-center w-full pr-2 sm:pr-4">
                        
                        {/* Stacked Date */}
                        <div className="flex flex-col items-center justify-center w-12 sm:w-16 shrink-0 text-zinc-400 dark:text-zinc-500">
                          <span className="text-sm font-medium">29</span>
                          <span className="text-xs uppercase">May</span>
                        </div>
                        
                        {/* Vertical Divider */}
                        <div className="w-px h-8 sm:h-10 bg-zinc-100 dark:bg-zinc-800 mx-2 sm:mx-4 shrink-0" />
                        
                        {/* Title */}
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm sm:text-base text-left flex-1 pr-4">
                          SPA Navigation, UI Spacing & Database Stability
                        </h3>
                        
                        {/* Badge */}
                        <div className="shrink-0">
                          <span className="px-2.5 py-1 text-xs font-semibold tracking-wide rounded bg-pink-100/80 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400 uppercase">
                            updated
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    {/* Accordion Dropdown Content */}
                    <AccordionContent className="pt-4 sm:pt-6 pb-2">
                      <div className="pl-2 sm:pl-[4.5rem] pr-2 sm:pr-4">
                        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          <p>
                            <strong>Single Page Application (SPA) Navigation:</strong> Extracted the navigation header out of individual pages and moved it to the global layout. The navbar remains completely intact and persistent across route changes. Added <code>framer-motion</code> to page templates for premium fade/blur transitions without harsh background flashes.
                          </p>

                          <p>
                            <strong>Layout Spacing & Footer Fixes:</strong> Stripped excess margins to ensure the content width perfectly aligns with the navigation width. Removed <code>fixed</code> positioning from the footer so it sits cleanly at the bottom of the document flow instead of hovering over content.
                          </p>
                          
                          <p>
                            <strong>Database Stability (Neon):</strong> Fixed intermittent Prisma connection terminations by enforcing strict SSL and increasing connection timeouts to <code>10000ms</code>, letting the serverless database safely wake up from cold starts. Forced a cache flush of Next.js Hot Module Replacement to ensure the new pool settings immediately took effect.
                          </p>

                          <p>
                            <strong>Newsletter Crash Fix:</strong> Resolved a fatal <code>Cannot read properties of null (reading &apos;reset&apos;)</code> error that occurred after successful newsletter subscriptions. Fixed an asynchronous React lifecycle bug by locking the form reference into a stable variable before initiating the async server request.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>

          {/* Timeline Item - May 27 (Popcard Links) */}
          <div className="relative mb-12">
            
            {/* Dot */}
            <div className="absolute left-[11px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-500 ring-4 ring-white dark:ring-[#09090b] z-10" />
            
            {/* Item Content Container */}
            <div className="pl-10 sm:pl-12">
              
              {/* Date & Category Label */}
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 flex items-center">
                <span>May 27, 2026</span>
                <span className="mx-2">·</span>
                <span>Feature Update</span>
              </div>
              
              {/* The Card */}
              <div className="w-full bg-white dark:bg-[#09090b] p-2 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-may-27-popcards" className="border-none">
                    <AccordionTrigger className="hover:no-underline p-0 py-2">
                      <div className="flex items-center w-full pr-2 sm:pr-4">
                        
                        {/* Stacked Date */}
                        <div className="flex flex-col items-center justify-center w-12 sm:w-16 shrink-0 text-zinc-400 dark:text-zinc-500">
                          <span className="text-sm font-medium">27</span>
                          <span className="text-xs uppercase">May</span>
                        </div>
                        
                        {/* Vertical Divider */}
                        <div className="w-px h-8 sm:h-10 bg-zinc-100 dark:bg-zinc-800 mx-2 sm:mx-4 shrink-0" />
                        
                        {/* Title */}
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm sm:text-base text-left flex-1 pr-4">
                          Popcard Interception for External Links
                        </h3>
                        
                        {/* Badge */}
                        <div className="shrink-0">
                          <span className="px-2.5 py-1 text-xs font-semibold tracking-wide rounded bg-cyan-100/80 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400 uppercase">
                            updated
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    {/* Accordion Dropdown Content */}
                    <AccordionContent className="pt-4 sm:pt-6 pb-2">
                      <div className="pl-2 sm:pl-[4.5rem] pr-2 sm:pr-4">
                        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          <p>
                            <strong>Popcard Interception for External Links:</strong> Added an interception mechanism in <code>markdown-content.tsx</code> and <code>note-card.tsx</code> so that standard external anchor links (including YouTube URLs) open directly in the <code>MediaPopup</code> overlay instead of navigating away from the blog.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>

          {/* Timeline Item - May 24 (View Tracking & Fixes) */}
          <div className="relative mb-12">
            
            {/* Dot */}
            <div className="absolute left-[11px] top-1.5 w-2.5 h-2.5 rounded-full bg-orange-500 ring-4 ring-white dark:ring-[#09090b] z-10" />
            
            {/* Item Content Container */}
            <div className="pl-10 sm:pl-12">
              
              {/* Date & Category Label */}
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 flex items-center">
                <span>May 24, 2026</span>
                <span className="mx-2">·</span>
                <span>Features & Enhancements</span>
              </div>
              
              {/* The Card */}
              <div className="w-full bg-white dark:bg-[#09090b] p-2 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-may-24-features" className="border-none">
                    <AccordionTrigger className="hover:no-underline p-0 py-2">
                      <div className="flex items-center w-full pr-2 sm:pr-4">
                        
                        {/* Stacked Date */}
                        <div className="flex flex-col items-center justify-center w-12 sm:w-16 shrink-0 text-zinc-400 dark:text-zinc-500">
                          <span className="text-sm font-medium">24</span>
                          <span className="text-xs uppercase">May</span>
                        </div>
                        
                        {/* Vertical Divider */}
                        <div className="w-px h-8 sm:h-10 bg-zinc-100 dark:bg-zinc-800 mx-2 sm:mx-4 shrink-0" />
                        
                        {/* Title */}
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm sm:text-base text-left flex-1 pr-4">
                          View Tracking, Markdown Upgrades & UI Fixes
                        </h3>
                        
                        {/* Badge */}
                        <div className="shrink-0">
                          <span className="px-2.5 py-1 text-xs font-semibold tracking-wide rounded bg-orange-100/80 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 uppercase">
                            new
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    {/* Accordion Dropdown Content */}
                    <AccordionContent className="pt-4 sm:pt-6 pb-2">
                      <div className="pl-2 sm:pl-[4.5rem] pr-2 sm:pr-4">
                        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          <p>
                            <strong>Blog Post View Tracking:</strong> Added a new <code>ViewCount</code> Prisma model and a dedicated API route to track and display the number of times a blog post is viewed. The view count is displayed seamlessly next to the reading time using a custom <code>ViewCounter</code> component.
                          </p>

                          <p>
                            <strong>Markdown Processing Upgrades:</strong> Upgraded the core markdown processor from <code>remark-html</code> to <code>remark-rehype</code> combined with <code>rehype-raw</code>. This ensures that standard HTML video iframe tags embedded in posts are fully preserved and rendered accurately.
                          </p>

                          <p>
                            <strong>UI Fixes:</strong>
                          </p>
                          <ul className="list-disc pl-4 space-y-3">
                            <li>
                              <strong>TextReveal Component:</strong> Fixed an issue where words in blog post titles clumped together. Replaced the static <code>0.25rem</code> margin with a font-responsive <code>0.25em</code> margin for proper gap indentation.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>

          {/* Timeline Item - May 22 (Media Popups & Performance) */}
          <div className="relative mb-12">
            
            {/* Dot */}
            <div className="absolute left-[11px] top-1.5 w-2.5 h-2.5 rounded-full bg-violet-500 ring-4 ring-white dark:ring-[#09090b] z-10" />
            
            {/* Item Content Container */}
            <div className="pl-10 sm:pl-12">
              
              {/* Date & Category Label (Next to dot) */}
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 flex items-center">
                <span>May 22, 2026</span>
                <span className="mx-2">·</span>
                <span>Feature & Performance Update</span>
              </div>
              
              {/* The Card */}
              <div className="w-full bg-white dark:bg-[#09090b] p-2 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-0" className="border-none">
                    <AccordionTrigger className="hover:no-underline p-0 py-2">
                      <div className="flex items-center w-full pr-2 sm:pr-4">
                        
                        {/* Stacked Date */}
                        <div className="flex flex-col items-center justify-center w-12 sm:w-16 shrink-0 text-zinc-400 dark:text-zinc-500">
                          <span className="text-sm font-medium">22</span>
                          <span className="text-xs uppercase">May</span>
                        </div>
                        
                        {/* Vertical Divider */}
                        <div className="w-px h-8 sm:h-10 bg-zinc-100 dark:bg-zinc-800 mx-2 sm:mx-4 shrink-0" />
                        
                        {/* Title */}
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm sm:text-base text-left flex-1 pr-4">
                          Interactive Media Popups & Performance Fixes
                        </h3>
                        
                        {/* Badge */}
                        <div className="shrink-0">
                          <span className="px-2.5 py-1 text-xs font-semibold tracking-wide rounded bg-violet-100/80 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400 uppercase">
                            updated
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    {/* Accordion Dropdown Content */}
                    <AccordionContent className="pt-4 sm:pt-6 pb-2">
                      <div className="pl-2 sm:pl-[4.5rem] pr-2 sm:pr-4">
                        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          <p>
                            <strong>Interactive Media Embeds:</strong> Added the ability to embed videos, web simulations, and images as clickable trigger cards in both blog posts and daily notes.
                          </p>

                          <p>
                            <strong>Global Overlay Engine:</strong> Built a Radix UI Dialog overlay (`MediaPopupProvider`) integrated directly into the global layout. When a reader clicks a media trigger, a cinematic modal overlay opens instantly on top of the current page with a backdrop blur. Readers can view simulations or videos and simply click 'X' or press Escape to return exactly to where they were reading without navigating to a new page.
                          </p>
                          
                          <p>
                            <strong>Editor Toolbar Integration:</strong> Added three new dedicated toolbar buttons (Video, Globe, Image) to the `/create` editor. Highlighting text and clicking a button prompts for a URL, automatically generating the required `div` markup for the popup trigger.
                          </p>

                          <p>
                            <strong>Massive Performance Fix (ISR & Caching):</strong>
                          </p>
                          <ul className="list-disc pl-4 space-y-3">
                            <li>
                              <strong>The Bottleneck:</strong> The Next.js `app/page.tsx` and `app/notes/page.tsx` were set to `force-dynamic` with a manual cache TTL of 0. This forced the server to synchronously read 100+ markdown files from disk, run the `gray-matter` parser on every file, connect to the database, and sort the array on <em>every single page load</em>.
                            </li>
                            <li>
                              <strong>The Fix:</strong> Removed `force-dynamic` and enabled <strong>Incremental Static Regeneration (ISR)</strong> with a 60-second revalidation period. Updated the manual cache TTL to 1 minute.
                            </li>
                          </ul>

                          <p className="pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-6">
                            <strong>Result:</strong> Page loads are now virtually instantaneous as they are served from cache, and the reading experience is enhanced with cinematic, distraction-free media overlays.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>

          {/* Timeline Item - May 19 */}
          <div className="relative mb-12">
            
            {/* Dot */}
            <div className="absolute left-[11px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-[#09090b] z-10" />
            
            {/* Item Content Container */}
            <div className="pl-10 sm:pl-12">
              
              {/* Date & Category Label */}
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 flex items-center">
                <span>May 19, 2026</span>
                <span className="mx-2">·</span>
                <span>Major Feature Release</span>
              </div>
              
              {/* The Card */}
              <div className="w-full bg-white dark:bg-[#09090b] p-2 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-2" className="border-none">
                    <AccordionTrigger className="hover:no-underline p-0 py-2">
                      <div className="flex items-center w-full pr-2 sm:pr-4">
                        
                        {/* Stacked Date */}
                        <div className="flex flex-col items-center justify-center w-12 sm:w-16 shrink-0 text-zinc-400 dark:text-zinc-500">
                          <span className="text-sm font-medium">19</span>
                          <span className="text-xs uppercase">May</span>
                        </div>
                        
                        {/* Vertical Divider */}
                        <div className="w-px h-8 sm:h-10 bg-zinc-100 dark:bg-zinc-800 mx-2 sm:mx-4 shrink-0" />
                        
                        {/* Title */}
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm sm:text-base text-left flex-1 pr-4">
                          Interactive Book Library, Admin Auth & Navigation Overhaul
                        </h3>
                        
                        {/* Badge */}
                        <div className="shrink-0">
                          <span className="px-2.5 py-1 text-xs font-semibold tracking-wide rounded bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 uppercase">
                            new
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    {/* Accordion Dropdown Content */}
                    <AccordionContent className="pt-4 sm:pt-6 pb-2">
                      <div className="pl-2 sm:pl-[4.5rem] pr-2 sm:pr-4">
                        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">

                          <p>
                            <strong>Interactive Book Engine:</strong> Built a fully interactive 3D book component with GPU-accelerated page-flip animations. Books render on a shelf at thumbnail size, then smoothly expand to full-screen when clicked. Includes keyboard navigation (←/→ arrows, Escape to close) and a premium hover-peek effect on the cover.
                          </p>

                          <p>
                            <strong>Auto-Pagination System:</strong> Content is never cut off. All text (front + back) within each chapter is merged into a continuous stream, then intelligently split at paragraph boundaries (or sentence boundaries for long paragraphs) and paired into physical book pages. Continuation pages show only a tiny 9px chapter label instead of repeating the full title. Zero blank pages guaranteed.
                          </p>

                          <p>
                            <strong>Admin Authentication:</strong> Implemented a password-protected admin system:
                          </p>
                          <ul className="list-disc pl-4 space-y-2">
                            <li>
                              <strong>AdminGate component</strong> wraps <code>/create</code> and <code>/books/edit</code> routes with server-side password verification via environment variables.
                            </li>
                            <li>
                              <strong>Secret keybindings</strong> — typing <code>vvcc</code> navigates to content creator, <code>vvbb</code> to book editor. No visible buttons on public pages.
                            </li>
                            <li>
                              <strong>About page admin panel</strong> — a subtle settings icon at the bottom of the About page triggers a password prompt, then reveals admin links.
                            </li>
                            <li>
                              Session-based auth persists until the tab is closed.
                            </li>
                          </ul>

                          <p>
                            <strong>Book Editor Dashboard:</strong> Full CRUD admin at <code>/books/edit</code> — create books, add/edit/delete pages, reorder pages with ↑/↓ buttons. Chapter numbers auto-update when pages are moved (e.g., &quot;Chapter 5: Docker&quot; becomes &quot;Chapter 2: Docker&quot; when moved to position 2). Simplified to a single content textarea per page — the pagination engine handles both sides automatically.
                          </p>

                          <p>
                            <strong>Navigation Progress Bar:</strong> Added a slim 2px top-of-viewport progress bar (YouTube/GitHub pattern) that starts instantly on any link click and completes when the route loads. Eliminates the perception of slow page transitions.
                          </p>

                          <p>
                            <strong>Mobile & Deployment:</strong>
                          </p>
                          <ul className="list-disc pl-4 space-y-2">
                            <li>Books display as a responsive grid on mobile but show an &quot;Available on desktop&quot; toast when tapped (3D flip requires a larger viewport).</li>
                            <li>Edit page actions are always visible on mobile (no hover dependency).</li>
                            <li>Fixed Vercel 500 errors: wrapped filesystem calls in try-catch for read-only serverless environments, and added <code>outputFileTracingIncludes</code> to bundle <code>content/books/</code> into the serverless output.</li>
                            <li>Synced <code>pnpm-lock.yaml</code> with <code>package.json</code> to fix frozen-lockfile build failures.</li>
                          </ul>

                          <p className="pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-6">
                            <strong>Result:</strong> A complete authoring and reading system — write chapters in one text box, the engine paginates them into a premium interactive book with zero blank pages, accessible only to the admin behind a secure gate.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <Footer />
        </div>
      </div>
    </Layout>
  )
}
