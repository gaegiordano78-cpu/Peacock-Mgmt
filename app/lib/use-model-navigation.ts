"use client";
import { useEffect, useRef, useState } from "react";

type Route = { screen: string; job: any };
const home: Route = { screen: "home", job: null };

// Keep personal/job data in memory; browser history contains only an index.
export function useModelNavigation(userId: string | null) {
  const [route, setRoute] = useState<Route>(home);
  const navigation = useRef<{ token: string; entries: Route[]; index: number } | null>(null);
  const restoring = useRef(false);

  useEffect(() => {
    if (!userId) { navigation.current = null; setRoute(home); return; }
    const token = `${Date.now()}-${Math.random()}`;
    navigation.current = { token, entries: [home], index: 0 };
    setRoute(home);
    window.history.replaceState({ ...window.history.state, peacockModel: { token, index: 0 } }, "");
    const onBack = (event: PopStateEvent) => {
      const nav = navigation.current;
      const entry = event.state?.peacockModel;
      if (!nav || entry?.token !== nav.token || !nav.entries[entry.index]) return;
      nav.index = entry.index;
      restoring.current = true;
      setRoute(nav.entries[entry.index]);
    };
    window.addEventListener("popstate", onBack);
    return () => window.removeEventListener("popstate", onBack);
  }, [userId]);

  useEffect(() => {
    const nav = navigation.current;
    if (!nav || !userId) return;
    if (restoring.current) { restoring.current = false; return; }
    const previous = nav.entries[nav.index];
    if (previous.screen === route.screen && previous.job?.id === route.job?.id) return;
    nav.entries = nav.entries.slice(0, nav.index + 1);
    nav.entries.push(route);
    nav.index++;
    window.history.pushState({ ...window.history.state, peacockModel: { token: nav.token, index: nav.index } }, "");
  }, [route, userId]);

  const setScreen = (screen: string) => {
    const nav = navigation.current;
    // The in-app Back button uses the same history as Android Back.
    if (nav && screen !== route.screen) {
      for (let i = nav.index - 1; i >= 0; i--) {
        if (nav.entries[i].screen === screen &&
            (screen !== "job_dettaglio" || nav.entries[i].job?.id === route.job?.id)) {
          window.history.go(i - nav.index);
          return;
        }
      }
    }
    setRoute(current => ({ ...current, screen }));
  };
  const setJob = (job: any) => setRoute(current => ({ ...current, job }));
  return { screen: route.screen, setScreen, job: route.job, setJob };
}
