import { useEffect, useMemo, useState } from "react";
import * as motion from "framer-motion";

function formatTime(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function App() {
  const [now, setNow] = useState(() => new Date());
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 250);
    return () => clearInterval(tick);
  }, []);

  // Fade-in after 3 seconds
  useEffect(() => {
    const audio = new Audio("./sound.mp3");
    audio.volume = 0.5;
    const t = setTimeout(() => {
      (setVisible(true), audio.play());
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  const palette = useMemo(() => ({ a: "#7C3AED", b: "#06B6D4" }), []);

  function closeToast() {
    setVisible(false); // triggers exit animation
  }

  return (
    <motion.AnimatePresence
      onExitComplete={() => {
        // Close the Electron window after the fade-out finishes
        window.close();
      }}
    >
      {visible && (
        <motion.motion.div
          style={styles.wrap}
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.98 }} // fade out towards bottom-right
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div style={styles.card}>
            <button
              type="button"
              onClick={closeToast}
              style={styles.closeBtn}
              aria-label="Close"
              title="Close"
            >
              <span style={styles.closeIcon}>×</span>
            </button>

            <div style={styles.timeRow}>
              <div style={styles.timeMain}>{formatTime(now)}</div>
            </div>

            {/* <div style={styles.sub}>Keep the momentum going.</div> */}

            <div
              style={{
                ...styles.accent,
                background: `linear-gradient(90deg, ${palette.a}, ${palette.b})`,
              }}
            />
          </div>
        </motion.motion.div>
      )}
    </motion.AnimatePresence>
  );
}

const styles = {
  wrap: {
    position: "relative",
    width: 300,
  },

  card: {
    position: "relative",
    padding: 18,
    borderRadius: 18,
    background: "rgba(18, 18, 22, 0.58)",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow:
      "0 22px 55px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.06) inset",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    color: "rgba(255,255,255,0.92)",
    overflow: "hidden",
  },

  // Close button: 2rem width x 1.5rem height
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 20,
    width: "1.5rem",
    height: "1rem",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.9)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
  },
  closeIcon: {
    fontSize: 24,
  },

  timeRow: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  timeMain: {
    fontSize: 54,
    lineHeight: 1,
    fontWeight: 750,
    letterSpacing: -1.2,
    textShadow: "0 12px 30px rgba(0,0,0,0.35)",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    // fontFamily: "Poppins, sans-serif",
  },
  sub: {
    marginTop: 10,
    fontSize: 13,
    opacity: 0.72,
  },
  accent: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 4,
    opacity: 0.95,
  },
};
