import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WorkspaceState {
  step: number;
  applicationId: string | null;
  jdText: string;
  analysis: any | null;
  resumeData: any | null;
  healthScore: any | null;
  templateId: string | null;
  
  setStep: (step: number) => void;
  setApplicationId: (id: string | null) => void;
  setJdText: (text: string) => void;
  setAnalysis: (analysis: any) => void;
  setResumeData: (data: any) => void;
  setHealthScore: (score: any) => void;
  setTemplateId: (id: string | null) => void;
  reset: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      step: 1,
      applicationId: null,
      jdText: '',
      analysis: null,
      resumeData: null,
      healthScore: null,
      templateId: null,

      setStep: (step) => set({ step }),
      setApplicationId: (applicationId) => set({ applicationId }),
      setJdText: (jdText) => set({ jdText }),
      setAnalysis: (analysis) => set({ analysis }),
      setResumeData: (resumeData) => set({ resumeData }),
      setHealthScore: (healthScore) => set({ healthScore }),
      setTemplateId: (templateId) => set({ templateId }),
      reset: () => set({ 
        step: 1, 
        applicationId: null, 
        jdText: '', 
        analysis: null, 
        resumeData: null, 
        healthScore: null,
        templateId: null
      }),
    }),
    {
      name: 'drouvana-workspace-storage',
    }
  )
);
