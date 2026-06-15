"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useSelector } from "react-redux";
import type { RootState } from "@/app/redux/store";


import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/redux/store";
import { logout } from "@/app/redux/features/userSlice";


// ─── colour tokens ────────────────────────────────────────────────────────────
const C = {
  primary: "#1a2939",
  secondary: "#22C55E",
};

// ─── mock data ────────────────────────────────────────────────────────────────
const growthData = [
  { month: "JAN", value: 180 },
  { month: "FEB", value: 220 },
  { month: "MAR", value: 200 },
  { month: "APR", value: 260 },
  { month: "MAY", value: 240 },
  { month: "JUN", value: 300 },
  { month: "JUL", value: 380 },
  { month: "AUG", value: 320 },
  { month: "SEP", value: 290 },
  { month: "OCT", value: 310 },
  { month: "NOV", value: 270 },
  { month: "DEC", value: 250 },
];

const recentActivity = [
  {
    title: "New Course Enrollment",
    desc: 'James enrolled in "UI Design Basics"',
    time: "2 mins ago",
    dot: C.secondary,
  },
  {
    title: "New Message Alert",
    desc: "You received a message from life",
    time: "2 hrs ago",
    dot: "#3B82F6",
  },
  {
    title: "Course Rating",
    desc: 'Sandra rated "Design Basics" 5 ⭐',
    time: "3 hrs ago",
    dot: "#F59E0B",
  },
  {
    title: "Course Update",
    desc: 'You updated "Design Basics" yesterday',
    time: "3 hrs ago",
    dot: "#8B5CF6",
  },
];

const Page = [
  {
    name: "Orion Chandelier",
    status: "Published",
  },


];



// ─── main dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
    const userStates = useSelector(
    (state: RootState) => state.user
  );

  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = async () => {
          try {
            await dispatch(logout()).unwrap();
          } catch (error) {
            console.error("Logout Failed:", error);
          }
  };
   
  const [search, setSearch] = useState("");

  const filtered = Page.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── header ── */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 max-w-[1200px] mx-auto">
          <h1
            className="text-base sm:text-xl font-bold truncate mr-3"
            style={{ color: C.primary }}
          >
            Welcome Back, {userStates.name}!
          </h1>

          {/* desktop */}
          <div className="hidden sm:flex gap-3 flex-shrink-0">
            <button
              className="flex items-center gap-2 text-white bg-[var(--primarycolor)] hover:bg-[var(--secondarycolor)]  text-sm font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
   
              onClick={handleLogout}
            >
             Logout
            </button>
          </div>

        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5 sm:space-y-6 max-w-[1200px] mx-auto">

        {/* ── chart + activity: stacked mobile → side-by-side lg ── */}
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-6">

          {/* chart */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 flex-1 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Total traffic</h2>
              <button className="text-xs border border-gray-200 rounded-lg px-3 py-1 text-gray-500 hover:bg-gray-50">
                This Year ▾
              </button>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[100, 500]}
                  ticks={[100, 200, 300, 400, 500]}
                  width={32}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={C.secondary}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6, fill: C.secondary, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* recent activity */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 lg:w-72 shadow-sm border border-gray-100 lg:flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Recent Activity</h2>
              <span className="text-gray-400 cursor-pointer text-lg">›</span>
            </div>
            {/* 2-col on sm/md, single col on lg */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span
                    className="mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: a.dot }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{a.title}</p>
                    <p className="text-xs text-gray-500 truncate">{a.desc}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Development only ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">User Global States</h2>
            <hr />
            <p><b>Email:</b> {userStates.email}</p>
            <p><b>error:</b> {userStates.error}</p>
            <p><b>Installed:</b> {userStates.isInstall ? " Yes" : " No"} </p>
            <p><b>Login:</b> {userStates.isLogin ? " Yes" : " No"}</p>
          </div>

        </div>
      </main>
    </div>
  );
}