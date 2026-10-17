"use client";

import { useEffect, useRef } from "react";
import styles from "./ModelWelcome.module.css";

type Props = { userId: string; onComplete: () => void };

export default function ModelWelcome({ userId, onComplete }: Props) {
  const complete = useRef(onComplete);
  complete.current = onComplete;

  useEffect(() => {
    const key = `peacock:ciao-baby:v1:${userId}`;
    let seen = false;
    try {
      seen = sessionStorage.getItem(key) === "seen";
    } catch {
      // Restricted storage must never prevent access to the profile.
    }
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      complete.current();
      return;
    }
    const timer = window.setTimeout(() => {
      try { sessionStorage.setItem(key, "seen"); } catch { /* Access still continues. */ }
      complete.current();
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [userId]);

  return (
    <section className={styles.welcome} aria-label="Ciao Baby, benvenuto nel tuo profilo" role="status">
      <div className={styles.center}>
        <div className={styles.face} aria-hidden="true">
          <span className={`${styles.eye} ${styles.left}`} />
          <span className={`${styles.eye} ${styles.right}`} />
          <span className={styles.smile} />
          <span className={styles.cheek} />
        </div>
        <div className={styles.greeting} aria-hidden="true">
          <span className={styles.ciao}>Ciao</span>
          <span className={styles.baby}>Baby<span className={styles.dot}>.</span></span>
        </div>
        <div className={styles.note} aria-hidden="true">MAKE YOUR ENTRANCE.</div>
      </div>
      <div className={styles.bottom} aria-hidden="true">
        <span>YOUR NEXT CHAPTER</span><span>STARTS HERE ↗</span>
      </div>
    </section>
  );
}
