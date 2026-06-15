"use client";

import Link from "next/link";

export default function Home() {
  return (

      <section className="relative z-10 flex h-[calc(100vh-90px)] items-center">
        <div className="mx-auto grid max-w-7xl gap-12 px-8 lg:grid-cols-2">
          
          {/* Left */}
          <div className="flex flex-col justify-center">
            <span className="mb-4 w-fit inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
              Full Stack Developer • Next.js • React
            </span>

            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-5xl">
              Hi, I'm{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Manpreet Singh
              </span>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-slate-300">
              Full Stack Developer with 3+ years of experience building
              scalable web applications using Next.js, React, TypeScript,
              REST APIs, and WordPress CMS.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                href="/posts"
                className="rounded-xl bg-cyan-500 px-6 py-3 font-medium text-black transition hover:scale-105"
              >
                View Posts
              </Link>

              <Link
                href="/about"
                className="rounded-xl border border-slate-700 px-6 py-3 transition hover:border-cyan-400"
              >
                About Me
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 flex gap-10">
              <div>
                <h3 className="text-3xl font-bold text-cyan-400">3+</h3>
                <p className="text-slate-400">Years Experience</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-cyan-400">Next.js</h3>
                <p className="text-slate-400">Primary Stack</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-cyan-400">CMS</h3>
                <p className="text-slate-400">Custom Built</p>
              </div>
            </div>
          </div>

          {/* Right Side Dashboard Mockup */}
          <div className="flex items-center justify-center">
            <div className="group relative w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition duration-500 hover:-translate-y-2">
              
              {/* Browser Top */}
              <div className="mb-5 flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
              </div>

              {/* Sidebar */}
              <div className="flex gap-4">
                <div className="w-32 space-y-3">
                  <div className="h-10 rounded-lg bg-cyan-500/30"></div>
                  <div className="h-10 rounded-lg bg-white/10"></div>
                  <div className="h-10 rounded-lg bg-white/10"></div>
                  <div className="h-10 rounded-lg bg-white/10"></div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <div className="h-16 rounded-xl bg-gradient-to-r from-cyan-500/40 to-blue-500/40"></div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 rounded-xl bg-white/10"></div>
                    <div className="h-24 rounded-xl bg-white/10"></div>
                  </div>

                  <div className="h-40 rounded-xl bg-white/10"></div>
                </div>
              </div>

              {/* Glow */}
              <div className="absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-xl opacity-0 transition group-hover:opacity-100"></div>
            </div>
          </div>

        </div>
      </section>
  );
}