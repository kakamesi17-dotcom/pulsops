'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation, UserRole } from '../components/Navigation';
import { SuperAdminDashboard } from '../components/dashboards/SuperAdminDashboard';
import { GymAdminDashboard } from '../components/dashboards/GymAdminDashboard';
import { TrainerDashboard } from '../components/dashboards/TrainerDashboard';
import { MemberDashboard } from '../components/dashboards/MemberDashboard';
import { getStoredSession } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<UserRole>('GYM_ADMIN');
  const [gymName, setGymName] = useState<string>('نادي PulsOps الرياضي');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const session = getStoredSession();
    if (session && session.user && session.user.role) {
      // ─── Super Admin High-Security Gate ───
      if (session.user.role === 'SUPER_ADMIN') {
        const isMasterAuthorized =
          session.token &&
          (session.token.startsWith('sec-superadmin') || session.user.email === 'superadmin@pulsops.com');
        if (!isMasterAuthorized) {
          router.push('/login');
          return;
        }
      }
      setCurrentRole(session.user.role);
      if (session.user.gymName) {
        setGymName(session.user.gymName);
      }
    }
    setIsLoaded(true);
  }, [router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#00FF66] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col selection:bg-[#00FF66] selection:text-[#0A0A0A]">
      {/* ─── Top Collapsible Navigation Header & Drawer ───────────── */}
      <Navigation
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        gymName={gymName}
      />

      {/* ─── Main Content Container (مستقل تماماً لكل دور) ──────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {currentRole === 'SUPER_ADMIN' && <SuperAdminDashboard activeTab={activeTab} />}
        {currentRole === 'GYM_ADMIN' && <GymAdminDashboard activeTab={activeTab} />}
        {currentRole === 'TRAINER' && <TrainerDashboard activeTab={activeTab} onTabChange={setActiveTab} />}
        {currentRole === 'MEMBER' && <MemberDashboard activeTab={activeTab} onTabChange={setActiveTab} />}
      </main>

      {/* ─── Sleek Minimal Footer ───────────────────────────────────── */}
      <footer className="border-t border-[#1E1E1E] py-6 px-4 text-center text-xs text-[#666666]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-2 h-2 rounded-full bg-[#00FF66]"></span>
            <span className="font-semibold text-[#A0A0A0]">بولس أوبس — نظام إدارة الأندية الرياضية السحابي ERP</span>
          </div>
          <p>© 2026 بولس أوبس. جميع الحقوق محفوظة. بنية سحابية متعددة الأندية.</p>
        </div>
      </footer>
    </div>
  );
}
