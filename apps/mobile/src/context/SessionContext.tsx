import React, { createContext, useContext, useState } from "react";

import type { Encounter, PendingSession } from "../api";

export type ActivityItem = {
  id: string;
  name: string | null;
  isDraft: boolean;
  at: string;
  extractionSource?: "stub" | "cursor";
};

type SessionContextValue = {
  sessionId: string | null;
  eventName: string | null;
  triageQueue: Encounter[];
  pendingSessions: PendingSession[];
  activityFeed: ActivityItem[];
  setSession: (id: string, eventName: string) => void;
  setTriageQueue: (queue: Encounter[] | ((prev: Encounter[]) => Encounter[])) => void;
  setPendingSessions: (sessions: PendingSession[]) => void;
  addActivity: (item: ActivityItem) => void;
  clearSession: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [eventName, setEventName] = useState<string | null>(null);
  const [triageQueue, setTriageQueueState] = useState<Encounter[]>([]);
  const [pendingSessions, setPendingSessions] = useState<PendingSession[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);

  const setTriageQueue = (
    queue: Encounter[] | ((prev: Encounter[]) => Encounter[]),
  ) => {
    setTriageQueueState(queue);
  };

  return (
    <SessionContext.Provider
      value={{
        sessionId,
        eventName,
        triageQueue,
        pendingSessions,
        activityFeed,
        setSession: (id, name) => {
          setSessionId(id);
          setEventName(name);
          setActivityFeed([]);
        },
        setTriageQueue,
        setPendingSessions,
        addActivity: (item) =>
          setActivityFeed((prev) => [item, ...prev].slice(0, 20)),
        clearSession: () => {
          setSessionId(null);
          setEventName(null);
          setTriageQueue([]);
          setActivityFeed([]);
        },
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
