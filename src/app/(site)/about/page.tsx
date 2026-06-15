export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"></div>
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        {/* Heading */}
        <div className="mb-20 text-center">
          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
            About Me
          </span>

          <h1 className="mt-6 text-5xl font-bold md:text-6xl">
            Building Modern Web
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Experiences
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-400">
            Full Stack Developer passionate about creating scalable,
            user-friendly applications with modern technologies.
          </p>
        </div>

        {/* Main About Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left */}
            <div>
              <h2 className="mb-6 text-3xl font-semibold">
                Hi, I'm{" "}
                <span className="text-cyan-400">Manpreet Singh</span>
              </h2>

              <div className="space-y-5 text-slate-300 leading-relaxed">
                <p>
                  I am a Full Stack Developer with over 3 years of
                  professional experience building modern web applications.
                </p>

                <p>
                  My primary expertise lies in Next.js, React,
                  TypeScript, and REST API integration. I enjoy creating
                  scalable, responsive, and high-performance web solutions.
                </p>

                <p>
                  Alongside JavaScript development, I have extensive
                  experience with WordPress CMS, including custom theme
                  development, theme customization, and page builder-based
                  websites.
                </p>

                <p>
                  Currently, I am working at Gemini Geeks, Patiala,
                  where I continue to contribute to modern web projects
                  and improve my technical expertise.
                </p>

                <p>
                  My goal is to further master Next.js and React while
                  taking on new challenges that help me grow both
                  technically and professionally.
                </p>
              </div>
            </div>

            {/* Right */}
            <div>
              <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-6">
                <h3 className="mb-6 text-xl font-semibold text-cyan-400">
                  Quick Overview
                </h3>

                <div className="space-y-5">
                  <div>
                    <p className="text-sm text-slate-500">
                      Experience
                    </p>
                    <h4 className="text-lg font-medium">
                      3+ Years
                    </h4>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Current Company
                    </p>
                    <h4 className="text-lg font-medium">
                      Gemini Geeks, Patiala
                    </h4>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Specialization
                    </p>
                    <h4 className="text-lg font-medium">
                      Full Stack Development
                    </h4>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Primary Stack
                    </p>
                    <h4 className="text-lg font-medium">
                      Next.js • React • TypeScript
                    </h4>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Additional Skills
                    </p>
                    <h4 className="text-lg font-medium">
                      WordPress • REST APIs
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-16">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Technical Skills
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Next.js",
              "React",
              "TypeScript",
              "JavaScript",
              "Tailwind CSS",
              "Redux Toolkit",
              "Node.js",
              "REST API",
              "WordPress",
              "MongoDB",
              "Git",
              "SEO",
            ].map((skill) => (
              <div
                key={skill}
                className="rounded-xl border border-cyan-500/20 bg-white/5 px-5 py-3 transition hover:border-cyan-400 hover:bg-cyan-500/10"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="mt-20">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Career Journey
          </h2>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="flex gap-5">
              <div className="mt-2 h-4 w-4 rounded-full bg-cyan-400"></div>

              <div>
                <h3 className="text-xl font-semibold">
                  Full Stack Developer
                </h3>

                <p className="mt-1 text-cyan-400">
                  Gemini Geeks, Patiala
                </p>

                <p className="mt-4 text-slate-400">
                  Developing modern web applications using Next.js,
                  React, TypeScript, REST APIs, and CMS solutions while
                  focusing on performance, scalability, and user
                  experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}