export interface EvidenceItem {
  sourceType: 'email' | 'meeting' | 'voice_note' | 'calendar';
  sourceId: string;
  timestamp: string;
  displayTime: string;
  from: string;
  to: string;
  evidence: string;
  note?: string;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  category: string;
  owner: string;
  recipient: string | null;
  status: 'open' | 'completed' | 'waiting' | 'unclear' | 'overdue' | 'scheduled';
  deadline: string | null;
  deadlineLabel: string;
  completionTimestamp?: string | null;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  waitingOn: string | null;
  sourceIds: string[];
  evidence: EvidenceItem[];
  knownEvidence?: EvidenceItem[];
  relatedPeople: string[];
  lastUpdated: string;
  confidence: string;
  asOfEvaluated?: string;
}

export interface MeetingItem {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  event: string;
  relatedAction?: string | null;
}

export interface BriefMetrics {
  todaysActionsCount: number;
  myCommitmentsCount: number;
  waitingOnOthersCount: number;
  unclearOwnershipCount: number;
  overdueCount: number;
  upcomingDeadlinesCount: number;
  meetingsCount: number;
}

export interface Timepoint {
  id: string;
  label: string;
  iso: string;
}

export interface ExecutiveBrief {
  asOf: string;
  asOfDate: string;
  user: {
    name: string;
    role: string;
    company: string;
  };
  metrics: BriefMetrics;
  todaysActions: ActionItem[];
  myCommitments: ActionItem[];
  waitingOnOthers: ActionItem[];
  unclearOwnership: ActionItem[];
  overdue: ActionItem[];
  upcomingDeadlines: ActionItem[];
  relevantMeetings: MeetingItem[];
  allActions: ActionItem[];
  timepoints: Timepoint[];
}

export interface QAResponse {
  question: string;
  asOf: string;
  summary: string;
  keyPoints: string[];
  status: string;
  deadline: string | null;
  owner: string | null;
  waitingOn: string | null;
  citations: EvidenceItem[];
  error?: string;
}

export interface SystemHealth {
  status: string;
  app: string;
  targetUser: string;
  geminiConfigured: boolean;
  model: string;
  actionsCount: number;
  defaultAsOf: string;
}
