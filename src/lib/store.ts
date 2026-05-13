import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type JobStatus = 'SAVED' | 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'REJECTED' | 'WITHDRAWN';

export interface Application {
  id: string;
  jobTitle: string;
  company: string;
  jobUrl?: string;
  jobDescription?: string;
  platform: string;
  status: JobStatus;
  salaryRange?: string;
  location?: string;
  notes?: string;
  dateApplied: string;
  lastUpdated: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
}

interface AppState {
  user: User | null;
  applications: Application[];
  login: (user: User) => void;
  logout: () => void;
  addApplication: (app: Omit<Application, 'id' | 'dateApplied' | 'lastUpdated'>) => void;
  updateApplicationStatus: (id: string, status: JobStatus) => void;
  updateApplication: (id: string, data: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  setApplications: (applications: Application[]) => void;
}

const SEEDED_APPLICATIONS: Application[] = [
  {
    id: '1',
    jobTitle: 'Senior Frontend Engineer',
    company: 'Stripe',
    platform: 'LinkedIn',
    status: 'INTERVIEW',
    location: 'Remote',
    salaryRange: '$150k - $200k',
    dateApplied: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Recruiter reached out. Technical screen on Thursday.',
    jobDescription: 'We are looking for a Senior Frontend Engineer to join our core payments team. You will be responsible for building seamless checkout experiences using React, TypeScript, and Next.js.'
  },
  {
    id: '2',
    jobTitle: 'Full Stack Developer',
    company: 'Vercel',
    platform: 'Company Site',
    status: 'APPLIED',
    location: 'San Francisco, CA',
    dateApplied: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    jobDescription: 'Join Vercel to help build the future of the web. Experience with Next.js, Edge Functions, and modern CSS is a must.'
  },
  {
    id: '3',
    jobTitle: 'React Developer',
    company: 'Netflix',
    platform: 'Indeed',
    status: 'REJECTED',
    location: 'Los Gatos, CA',
    dateApplied: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    jobTitle: 'Frontend Architect',
    company: 'Shopify',
    platform: 'Referral',
    status: 'OFFER',
    location: 'Remote (Americas)',
    salaryRange: '$180k + Equity',
    dateApplied: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    jobTitle: 'UI Engineer',
    company: 'Linear',
    platform: 'Wellfound',
    status: 'SCREENING',
    location: 'Remote (Global)',
    dateApplied: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      applications: SEEDED_APPLICATIONS,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      addApplication: (appData) =>
        set((state) => ({
          applications: [
            ...state.applications,
            {
              ...appData,
              id: Math.random().toString(36).slice(2, 9),
              dateApplied: new Date().toISOString(),
              lastUpdated: new Date().toISOString(),
            },
          ],
        })),
      updateApplicationStatus: (id, status) =>
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id ? { ...app, status, lastUpdated: new Date().toISOString() } : app
          ),
        })),
      updateApplication: (id, data) =>
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id ? { ...app, ...data, lastUpdated: new Date().toISOString() } : app
          ),
        })),
      deleteApplication: (id) =>
        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id),
        })),
      setApplications: (applications) => set({ applications }),
    }),
    {
      name: 'drouvana-storage',
    }
  )
);
