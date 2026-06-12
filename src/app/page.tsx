import styles from "./landing.module.css";

export default function Home() {
  return (
    <main className={styles.landing}>
      <div className={styles.pond} aria-hidden>
        <div className={styles.horizon} />
        <div className={`${styles.pixel} ${styles.lily} ${styles.lily1}`} />
        <div className={`${styles.pixel} ${styles.lily} ${styles.lily2}`} />
        <div className={`${styles.pixel} ${styles.reed} ${styles.reed1}`} />
        <div className={`${styles.pixel} ${styles.reed} ${styles.reed2}`} />
        <div className={`${styles.pixel} ${styles.fish}`} />
        <div className={`${styles.pixel} ${styles.firefly} ${styles.f1}`} />
        <div className={`${styles.pixel} ${styles.firefly} ${styles.f2}`} />
        <div className={`${styles.pixel} ${styles.firefly} ${styles.f3}`} />
      </div>

      <div className={styles.content}>
        <span className={styles.pill}>Swipe through people you almost forgot</span>
        <h1 className={styles.title}>Tinder for Old Friends</h1>
        <p className={styles.subtitle}>
          You ran into someone from way back at a conference or meetup. Capture
          their LinkedIn screenshot, swipe to keep or forget, and search your
          kept contacts later in plain language.
        </p>

        <div className={styles.formula}>
          <div className={styles.step}>
            <span className={styles.stepNum}>01</span>
            <span className={styles.stepLabel}>Capture — screenshot during the event</span>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNum}>02</span>
            <span className={styles.stepLabel}>Triage — Keep or Forget on the pond</span>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNum}>03</span>
            <span className={styles.stepLabel}>Recall — search your memory in NL</span>
          </div>
        </div>

        <p className={styles.ctaHint}>
          Run the Expo app in <code>apps/mobile</code> — see README for setup.
        </p>

        <section className={styles.api}>
          <h2>API</h2>
          <ul>
            <li>
              <code>POST /api/sessions</code> — start monitoring
            </li>
            <li>
              <code>POST /api/extract</code> — screenshot → encounter
            </li>
            <li>
              <code>POST /api/sessions/:id/end</code> — triage queue
            </li>
            <li>
              <code>POST /api/encounters/:id/triage</code> — keep / forget
            </li>
            <li>
              <code>POST /api/search</code> — natural language recall
            </li>
            <li>
              <code>GET /api/encounters?status=kept</code> — memory list
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
