import { useState } from "react";
import SEO from "../components/SEO";
import SectionHeading from "../components/SectionHeading";

const PYTHAGOREAN_MAP = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

// Chaldean numerology — values 1-8 (9 is considered sacred and never assigned to a letter).
// The compound (total) number carries meaning of its own and is then reduced to a single root digit.
const CHALDEAN_MAP = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8
};

// Selected compound (Chaldean) number meanings — only shown when system is Chaldean
// and the unreduced total falls within this set.
const CHALDEAN_COMPOUND_MEANINGS = {
  10: "The Wheel of Fortune — honour, faith, self-confidence and rise in life.",
  11: "Hidden trials and treachery from others; warns of caution and discernment.",
  12: "The Sacrifice — the victim of plots; advises caution against being deceived.",
  13: "Upheaval and change — power if used unselfishly; warns against the unknown.",
  14: "Movement, dealings with the public, media, and travel; lucky for money matters.",
  15: "The Magician — magnetism, eloquence and good fortune through gifts of others.",
  16: "The Shattered Citadel — warns of strange fatality; demands caution in plans.",
  17: "The Star of the Magi — spiritual rise above trials; immortality of the name.",
  18: "Materialism striving against the spiritual — warns of family quarrels and deceit.",
  19: "The Prince of Heaven — happiness, success, esteem and honour.",
  20: "The Awakening — a new purpose, call to action; delays but eventual success.",
  21: "The Crown of the Magi — honour, elevation, success after long struggle.",
  22: "A good person blinded by folly — warns against illusions and false friends.",
  23: "The Royal Star of the Lion — promise of success, help from superiors.",
  24: "Assistance and association with those of rank; love and gain through opposite sex.",
  25: "Strength gained through experience — success after struggle and trial.",
  26: "Warns of disaster through partnerships, bad speculation and bad advice.",
  27: "The Sceptre — authority, command and reward through productive intellect.",
  28: "Trust nothing as permanent — gains followed by losses; demands new beginnings.",
  29: "Uncertainty, treachery and unreliable friends; grief from the opposite sex.",
  30: "Thoughtful deduction, mental superiority — neutral; outcome depends on user.",
  31: "Similar to 30 — self-contained, lonely, isolated from others; not material luck.",
  32: "Magical power like 14 and 23 — success if one holds to one's own judgment.",
  33: "Same vibration as 24 — fortunate, especially in love and partnerships.",
  34: "Same as 25.",
  35: "Same as 26.",
  36: "Same as 27.",
  37: "Good and fortunate friendships; love and harmonious partnerships.",
  38: "Same as 29.",
  39: "Same as 30.",
  40: "Same as 31.",
  41: "Same as 32.",
  42: "Same as 24.",
  43: "An unfortunate number — revolution, upheaval, strife and failure.",
  44: "Same as 26.",
  45: "Same as 27.",
  46: "Same as 37.",
  47: "Same as 29.",
  48: "Same as 30.",
  49: "Same as 31.",
  50: "Same as 32.",
  51: "The Warrior — sudden advancement; favourable for soldiers and leaders.",
  52: "Same as 43."
};

const NUMBER_MEANINGS = {
  1: {
    title: "The Leader",
    traits: "Independent · Pioneering · Ambitious",
    description:
      "Number 1 carries leadership energy. You are an initiator with a strong will, original ideas, and the courage to walk your own path."
  },
  2: {
    title: "The Diplomat",
    traits: "Sensitive · Cooperative · Intuitive",
    description:
      "Number 2 is the energy of partnership and harmony. You bring balance, deep empathy, and the ability to bridge people and ideas."
  },
  3: {
    title: "The Communicator",
    traits: "Creative · Expressive · Joyful",
    description:
      "Number 3 vibrates with creativity and self-expression. You uplift others with your words, art, and natural charisma."
  },
  4: {
    title: "The Builder",
    traits: "Stable · Disciplined · Practical",
    description:
      "Number 4 is grounded and dependable. You build strong foundations through hard work, structure, and steady commitment."
  },
  5: {
    title: "The Free Spirit",
    traits: "Adventurous · Versatile · Curious",
    description:
      "Number 5 is the energy of freedom and change. You thrive on new experiences, travel, and dynamic transformation."
  },
  6: {
    title: "The Nurturer",
    traits: "Loving · Responsible · Healing",
    description:
      "Number 6 is the vibration of love, family, and service. You are a natural caretaker who creates beauty and harmony around you."
  },
  7: {
    title: "The Seeker",
    traits: "Spiritual · Analytical · Wise",
    description:
      "Number 7 is deeply introspective and mystical. You are drawn to wisdom, research, and the unseen truths of life."
  },
  8: {
    title: "The Powerhouse",
    traits: "Abundant · Authoritative · Driven",
    description:
      "Number 8 carries the energy of abundance, power, and karmic balance. You are wired for success, leadership, and material mastery."
  },
  9: {
    title: "The Humanitarian",
    traits: "Compassionate · Wise · Visionary",
    description:
      "Number 9 is the energy of completion and universal love. You are here to serve, inspire, and uplift humanity."
  },
  11: {
    title: "Master Number — The Illuminator",
    traits: "Intuitive · Inspirational · Spiritually Awake",
    description:
      "Master Number 11 is a powerful spiritual channel. You carry heightened intuition and the ability to inspire awakening in others."
  },
  22: {
    title: "Master Number — The Master Builder",
    traits: "Visionary · Practical · World-Changing",
    description:
      "Master Number 22 turns big dreams into reality. You hold the rare gift of manifesting on a grand, lasting scale."
  },
  33: {
    title: "Master Number — The Master Teacher",
    traits: "Selfless · Healing · Christ-Conscious",
    description:
      "Master Number 33 is the energy of pure compassionate service. You are a spiritual teacher and healer for the collective."
  }
};

// Favorability of the final reduced sum, based on traditional numerology.
// Good: 1, 3, 5, 6 · Neutral: 9 · Caution: 7 · Not favorable: 2, 4, 8
const SUM_FAVORABILITY = {
  1: { tone: "good", label: "Favorable ✅", note: "1 is a leadership number — strong, lucky and pioneering." },
  2: { tone: "bad", label: "Not Favorable ❌", note: "2 can bring emotional ups and downs and indecision." },
  3: { tone: "good", label: "Favorable ✅", note: "3 is creative, joyful and fortunate for growth." },
  4: { tone: "bad", label: "Not Favorable ❌", note: "4 may bring delays, struggles and unexpected obstacles." },
  5: { tone: "good", label: "Favorable ✅", note: "5 is the most flexible & lucky number — great for business and communication." },
  6: { tone: "good", label: "Favorable ✅", note: "6 is harmonious, attractive and supportive of love & abundance." },
  7: { tone: "caution", label: "Use With Caution ⚠️", note: "7 is mystical and spiritual but can feel isolating in material matters." },
  8: { tone: "bad", label: "Not Favorable ❌", note: "8 carries karmic intensity — rewards through hardship; not recommended for everyone." },
  9: { tone: "neutral", label: "Neutral / Mixed 🟡", note: "9 is universal & spiritual — neutral; outcome depends on intention." },
  11: { tone: "good", label: "Favorable ✅", note: "Master 11 — highly intuitive and spiritually charged." },
  22: { tone: "good", label: "Favorable ✅", note: "Master 22 — the master builder; strong manifesting power." },
  33: { tone: "good", label: "Favorable ✅", note: "Master 33 — the master healer; deeply compassionate energy." }
};

const FAVORABILITY_STYLES = {
  good: "border-emerald-300 bg-emerald-50 text-emerald-700",
  bad: "border-red-300 bg-red-50 text-red-700",
  caution: "border-amber-300 bg-amber-50 text-amber-700",
  neutral: "border-slate-300 bg-slate-50 text-slate-700"
};

// Two-digit adjacent-pair combinations and their condition.
// good ✅ · bad ❌ · neutral 🟡 (digits 1-9 only).
const PAIR_COMBINATIONS = {
  11: "good", 12: "good", 13: "good", 14: "bad", 15: "good", 16: "bad", 17: "neutral", 18: "bad", 19: "neutral",
  21: "neutral", 22: "neutral", 23: "neutral", 24: "neutral", 25: "good", 26: "bad", 27: "bad", 28: "bad", 29: "good",
  31: "good", 32: "neutral", 33: "good", 34: "bad", 35: "neutral", 36: "neutral", 37: "good", 38: "good", 39: "neutral",
  41: "bad", 42: "neutral", 43: "bad", 44: "bad", 45: "bad", 46: "bad", 47: "good", 48: "bad", 49: "neutral",
  51: "good", 52: "good", 53: "neutral", 54: "bad", 55: "good", 56: "neutral", 57: "good", 58: "neutral", 59: "neutral",
  61: "bad", 62: "bad", 63: "neutral", 64: "bad", 65: "neutral", 66: "good", 67: "bad", 68: "bad", 69: "good",
  71: "neutral", 72: "bad", 73: "good", 74: "good", 75: "good", 76: "bad", 77: "neutral", 78: "good", 79: "neutral",
  81: "bad", 82: "bad", 83: "good", 84: "bad", 85: "neutral", 86: "bad", 87: "good", 88: "neutral", 89: "neutral",
  91: "neutral", 92: "good", 93: "neutral", 94: "neutral", 95: "neutral", 96: "good", 97: "neutral", 98: "neutral", 99: "neutral"
};

const PAIR_LABELS = {
  good: "Favorable ✅",
  bad: "Unfavorable ❌",
  neutral: "Neutral 🟡"
};

function getDigitPairs(digitsString) {
  const digits = String(digitsString).replace(/\D/g, "");
  if (digits.length < 2) return [];
  const pairs = [];
  for (let i = 0; i < digits.length - 1; i += 1) {
    const a = digits[i];
    const b = digits[i + 1];
    if (a === "0" || b === "0") continue; // pairs only defined for 1-9
    const key = Number(`${a}${b}`);
    pairs.push({
      key: `${i}-${a}${b}`,
      pair: `${a}${b}`,
      tone: PAIR_COMBINATIONS[key] || "neutral"
    });
  }
  return pairs;
}

function reduceNumber(num, keepMaster = true) {
  let n = Math.abs(Number(num) || 0);
  while (n > 9) {
    if (keepMaster && (n === 11 || n === 22 || n === 33)) break;
    n = String(n)
      .split("")
      .reduce((sum, d) => sum + Number(d), 0);
  }
  return n;
}

function calculateNameNumber(name, system = "pythagorean") {
  const cleaned = name.toUpperCase().replace(/[^A-Z]/g, "");
  if (!cleaned) return null;
  const map = system === "chaldean" ? CHALDEAN_MAP : PYTHAGOREAN_MAP;
  const total = cleaned
    .split("")
    .reduce((sum, ch) => sum + (map[ch] || 0), 0);
  return { total, reduced: reduceNumber(total), system, input: name.trim() };
}

function calculatePhoneNumber(phone) {
  const cleaned = String(phone).replace(/\D/g, "");
  if (!cleaned) return null;
  const total = cleaned.split("").reduce((sum, d) => sum + Number(d), 0);
  return {
    total,
    reduced: reduceNumber(total),
    digits: cleaned,
    input: String(phone).trim()
  };
}

function calculateDobNumbers(dobString) {
  // Expects YYYY-MM-DD from <input type="date">
  if (!dobString) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dobString);
  if (!match) return null;
  const [, yyyy, mm, dd] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);

  if (!day || !month || !year) return null;

  // Personality / Driver number = day of birth reduced
  const personality = {
    total: day,
    reduced: reduceNumber(day),
    input: `Day ${day}`
  };

  // Destiny / Life Path number = sum of all digits across DD MM YYYY, reduced
  const allDigits = `${dd}${mm}${yyyy}`;
  const total = allDigits.split("").reduce((sum, d) => sum + Number(d), 0);
  const formatted = new Date(`${yyyy}-${mm}-${dd}T00:00:00`).toLocaleDateString(
    undefined,
    { day: "numeric", month: "long", year: "numeric" }
  );
  const destiny = {
    total,
    reduced: reduceNumber(total),
    input: formatted,
    digits: allDigits
  };

  return { personality, destiny };
}

function PairCombinationsCard({ digits }) {
  const pairs = getDigitPairs(digits);
  if (!pairs.length) return null;

  const counts = pairs.reduce(
    (acc, p) => ({ ...acc, [p.tone]: (acc[p.tone] || 0) + 1 }),
    {}
  );

  return (
    <div className="mt-6 rounded-[28px] border border-mystic-plum/10 bg-white/80 p-6 shadow-card md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-mystic-gold">
            Adjacent Pair Combinations
          </p>
          <h4 className="mt-1 font-display text-2xl font-semibold text-mystic-plum">
            Digit-by-digit energy flow
          </h4>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-emerald-700">
            ✅ {counts.good || 0} Favorable
          </span>
          <span className="rounded-full border border-red-300 bg-red-50 px-3 py-1 text-red-700">
            ❌ {counts.bad || 0} Unfavorable
          </span>
          <span className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-slate-700">
            🟡 {counts.neutral || 0} Neutral
          </span>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-mystic-plum/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-mystic-plum/5 text-xs font-semibold uppercase tracking-[0.2em] text-mystic-plum/70">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Combined</th>
              <th className="px-4 py-3">Condition</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map((p, idx) => (
              <tr
                key={p.key}
                className="border-t border-mystic-plum/5 odd:bg-white even:bg-mystic-plum/[0.02]"
              >
                <td className="px-4 py-2.5 text-mystic-plum/60">{idx + 1}</td>
                <td className="px-4 py-2.5 font-display text-base font-semibold text-mystic-plum">
                  {p.pair}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${FAVORABILITY_STYLES[p.tone]}`}
                  >
                    {PAIR_LABELS[p.tone]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-mystic-plum/55">
        Each pair represents the energetic flow between two adjacent digits in
        your number. A higher count of ✅ pairs means a smoother, luckier vibration
        overall.
      </p>
    </div>
  );
}

function ResultCard({ result, kind }) {
  if (!result) return null;
  const meaning = NUMBER_MEANINGS[result.reduced];
  const compoundMeaning =
    result.system === "chaldean" && result.total !== result.reduced
      ? CHALDEAN_COMPOUND_MEANINGS[result.total]
      : null;
  const favorability = SUM_FAVORABILITY[result.reduced];
  return (
    <div className="mt-8 rounded-[28px] border border-mystic-plum/10 bg-white/80 p-6 shadow-card md:p-8">
      {result.input ? (
        <p className="mb-4 text-sm text-mystic-plum/80">
          <span className="font-semibold text-mystic-plum">Entered {kind}:</span>{" "}
          <span className="font-display text-base text-mystic-plum">
            {result.input}
          </span>
        </p>
      ) : null}
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-mystic-gold">
            Your {kind} Number
            {result.system
              ? ` · ${result.system === "chaldean" ? "Chaldean" : "Pythagorean"}`
              : ""}
          </p>
          <p className="mt-2 font-display text-6xl font-bold text-mystic-plum">
            {result.reduced}
          </p>
          <p className="mt-1 text-sm text-mystic-plum/60">
            Total sum: {result.total}
            {result.digits ? ` · Digits used: ${result.digits}` : ""}
          </p>
        </div>
        {meaning ? (
          <div className="rounded-2xl bg-mystic-plum/5 px-5 py-4 text-sm font-semibold text-mystic-plum md:max-w-xs">
            {meaning.traits}
          </div>
        ) : null}
      </div>

      {favorability ? (
        <div
          className={`mt-6 rounded-2xl border px-5 py-4 ${FAVORABILITY_STYLES[favorability.tone]}`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em]">
            Sum Verdict
          </p>
          <p className="mt-1 text-base font-semibold">{favorability.label}</p>
          <p className="mt-1 text-sm leading-6 opacity-90">{favorability.note}</p>
        </div>
      ) : null}

      {meaning ? (
        <div className="mt-6 border-t border-mystic-plum/10 pt-6">
          <h4 className="font-display text-2xl font-semibold text-mystic-plum">
            {meaning.title}
          </h4>
          <p className="mt-3 text-sm leading-7 text-mystic-plum/75">
            {meaning.description}
          </p>
        </div>
      ) : null}

      {compoundMeaning ? (
        <div className="mt-6 rounded-2xl border border-mystic-gold/30 bg-mystic-gold/10 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mystic-gold">
            Compound Number {result.total} (Chaldean)
          </p>
          <p className="mt-2 text-sm leading-7 text-mystic-plum/80">
            {compoundMeaning}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function NameNumerology() {
  const [name, setName] = useState("");
  const [system, setSystem] = useState("pythagorean");
  const [results, setResults] = useState(null); // { first, full }
  const [error, setError] = useState("");

  const handleSystemChange = (next) => {
    setSystem(next);
    setResults(null);
    setError("");
  };

  const handleCalculate = () => {
    const trimmed = name.trim().replace(/\s+/g, " ");
    if (!trimmed) {
      setError("Please enter your name to calculate.");
      setResults(null);
      return;
    }
    const parts = trimmed.split(" ");
    const firstNameOnly = parts[0];
    const first = calculateNameNumber(firstNameOnly, system);
    const full = parts.length > 1 ? calculateNameNumber(trimmed, system) : null;

    setError("");
    setResults({ first, full });
  };

  const handleReset = () => {
    setName("");
    setResults(null);
    setError("");
  };

  return (
    <div className="glass-panel rounded-[28px] p-6 shadow-card md:p-8">
      <h3 className="font-display text-2xl font-semibold text-mystic-plum">
        Name Numerology
      </h3>
      <p className="mt-2 text-sm leading-6 text-mystic-plum/70">
        Enter your name to discover the vibration carried by its letters. We'll
        show your <strong>First Name Number</strong> (your everyday name
        energy) and, if you include a last name, your{" "}
        <strong>Full Name (Expression) Number</strong> — the overall vibration
        of your complete name.
      </p>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mystic-plum/70">
          Numerology System
        </p>
        <div className="mt-2 inline-flex rounded-full border border-mystic-plum/10 bg-white/70 p-1 shadow-sm">
          <button
            type="button"
            onClick={() => handleSystemChange("pythagorean")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              system === "pythagorean"
                ? "bg-mystic-plum text-white shadow"
                : "text-mystic-plum hover:bg-mystic-plum/5"
            }`}
          >
            Pythagorean
          </button>
          <button
            type="button"
            onClick={() => handleSystemChange("chaldean")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              system === "chaldean"
                ? "bg-mystic-plum text-white shadow"
                : "text-mystic-plum hover:bg-mystic-plum/5"
            }`}
          >
            Chaldean
          </button>
        </div>
        <p className="mt-2 text-xs leading-5 text-mystic-plum/60">
          {system === "chaldean"
            ? "Chaldean (Mesopotamian) — letters are valued 1–8 by sound vibration; 9 is considered sacred. The compound (total) number carries its own meaning before being reduced."
            : "Pythagorean (Western) — letters are mapped sequentially A=1, B=2 … I=9, J=1 and so on."}
        </p>
      </div>

      <label className="mt-6 block text-xs font-semibold uppercase tracking-[0.3em] text-mystic-plum/70">
        Your Name
      </label>
      <input
        type="text"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
          if (results) setResults(null);
          if (error) setError("");
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") handleCalculate();
        }}
        placeholder="e.g. Priyani P"
        className="mt-2 w-full rounded-2xl border border-mystic-plum/15 bg-white px-4 py-3 text-base text-mystic-plum shadow-inner focus:border-mystic-plum focus:outline-none"
      />
      <p className="mt-1 text-xs text-mystic-plum/55">
        Tip: type only your first name to see just the personality reading.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCalculate}
          className="primary-button"
        >
          Calculate
        </button>
        {results || name ? (
          <button
            type="button"
            onClick={handleReset}
            className="secondary-button"
          >
            Reset
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="mt-4 text-sm font-medium text-red-500">{error}</p>
      ) : null}

      {results?.first ? (
        <ResultCard result={results.first} kind="First Name" />
      ) : null}
      {results?.full ? (
        <ResultCard result={results.full} kind="Full Name (Expression)" />
      ) : null}
    </div>
  );
}

function PhoneNumerology() {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    const computed = calculatePhoneNumber(phone);
    if (!computed) {
      setError("Please enter a phone number to calculate.");
      setResult(null);
      return;
    }
    setError("");
    setResult(computed);
  };

  return (
    <div className="glass-panel rounded-[28px] p-6 shadow-card md:p-8">
      <h3 className="font-display text-2xl font-semibold text-mystic-plum">
        Phone Numerology
      </h3>
      <p className="mt-2 text-sm leading-6 text-mystic-plum/70">
        Your mobile number carries a unique frequency that influences how energy
        flows through your daily communications.
      </p>

      <label className="mt-6 block text-xs font-semibold uppercase tracking-[0.3em] text-mystic-plum/70">
        Phone Number
      </label>
      <input
        type="tel"
        value={phone}
        onChange={(event) => {
          setPhone(event.target.value);
          if (result) setResult(null);
          if (error) setError("");
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") handleCalculate();
        }}
        placeholder="e.g. +91 90000 00000"
        className="mt-2 w-full rounded-2xl border border-mystic-plum/15 bg-white px-4 py-3 text-base text-mystic-plum shadow-inner focus:border-mystic-plum focus:outline-none"
      />

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCalculate}
          className="primary-button"
        >
          Calculate
        </button>
        {result || phone ? (
          <button
            type="button"
            onClick={() => {
              setPhone("");
              setResult(null);
              setError("");
            }}
            className="secondary-button"
          >
            Reset
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="mt-4 text-sm font-medium text-red-500">{error}</p>
      ) : null}

      <ResultCard result={result} kind="Phone" />
      {result ? <PairCombinationsCard digits={result.digits} /> : null}
    </div>
  );
}

function DobNumerology() {
  const [dob, setDob] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    const computed = calculateDobNumbers(dob);
    if (!computed) {
      setError("Please pick a valid date of birth.");
      setResults(null);
      return;
    }
    setError("");
    setResults(computed);
  };

  const handleReset = () => {
    setDob("");
    setResults(null);
    setError("");
  };

  // restrict to a sensible date range
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="glass-panel rounded-[28px] p-6 shadow-card md:p-8">
      <h3 className="font-display text-2xl font-semibold text-mystic-plum">
        Numerology Insights
      </h3>
      <p className="mt-2 text-sm leading-6 text-mystic-plum/70">
        Your date of birth holds two of the most important numbers in your
        chart — your <strong>Personality (Driver) Number</strong> from the day
        you were born, and your <strong>Destiny (Life Path) Number</strong> from
        the full date.
      </p>

      <label className="mt-6 block text-xs font-semibold uppercase tracking-[0.3em] text-mystic-plum/70">
        Date of Birth
      </label>
      <input
        type="date"
        value={dob}
        max={today}
        min="1900-01-01"
        onChange={(event) => {
          setDob(event.target.value);
          if (results) setResults(null);
          if (error) setError("");
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") handleCalculate();
        }}
        className="mt-2 w-full rounded-2xl border border-mystic-plum/15 bg-white px-4 py-3 text-base text-mystic-plum shadow-inner focus:border-mystic-plum focus:outline-none md:w-auto"
      />
      <p className="mt-1 text-xs text-mystic-plum/55">
        We use only the day for Personality, and the entire date (DD + MM +
        YYYY) for Destiny / Life Path.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCalculate}
          className="primary-button"
        >
          Calculate
        </button>
        {results || dob ? (
          <button
            type="button"
            onClick={handleReset}
            className="secondary-button"
          >
            Reset
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="mt-4 text-sm font-medium text-red-500">{error}</p>
      ) : null}

      {results?.personality ? (
        <ResultCard
          result={results.personality}
          kind="Birth Day (Personality / Driver)"
        />
      ) : null}
      {results?.destiny ? (
        <ResultCard
          result={results.destiny}
          kind="Date of Birth (Destiny / Life Path)"
        />
      ) : null}
    </div>
  );
}

function NumerologyPage() {
  const [tab, setTab] = useState("dob");

  return (
    <section className="section-shell py-16 md:py-20">
      <SEO
        title="Free Numerology Reading Online — Name, DOB & Mobile | Mystic Veda"
        description="Calculate your numerology number free online. Get name numerology, date of birth life path number & mobile number readings with Chaldean & Pythagorean systems."
        path="/numerology"
        keywords="numerology reading online, free numerology calculator, name numerology, life path number, chaldean numerology, pythagorean numerology, mobile number numerology"
      />
      <SectionHeading
        eyebrow="Numerology"
        title="Decode the vibrations behind your name and number"
        description="Numerology is the ancient study of how numbers influence personality, destiny, and the energy you carry. Try our quick tools below for an instant glimpse."
      />

      <div className="mt-10 inline-flex flex-wrap rounded-full border border-mystic-plum/10 bg-white/70 p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setTab("dob")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            tab === "dob"
              ? "bg-mystic-plum text-white shadow-md"
              : "text-mystic-plum hover:bg-mystic-plum/5"
          }`}
        >
          Numerology Insights
        </button>
        <button
          type="button"
          onClick={() => setTab("name")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            tab === "name"
              ? "bg-mystic-plum text-white shadow-md"
              : "text-mystic-plum hover:bg-mystic-plum/5"
          }`}
        >
          Name Numerology
        </button>
        <button
          type="button"
          onClick={() => setTab("phone")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            tab === "phone"
              ? "bg-mystic-plum text-white shadow-md"
              : "text-mystic-plum hover:bg-mystic-plum/5"
          }`}
        >
          Mobile Number
        </button>
      </div>

      <div className="mt-8">
        {tab === "dob" ? (
          <DobNumerology />
        ) : tab === "name" ? (
          <NameNumerology />
        ) : (
          <PhoneNumerology />
        )}
      </div>

      <div className="mt-12 rounded-[28px] border border-mystic-plum/10 bg-white/60 p-6 text-sm leading-7 text-mystic-plum/75 md:p-8">
        <h4 className="font-display text-xl font-semibold text-mystic-plum">
          Want a deeper personalised reading?
        </h4>
        <p className="mt-2">
          Book a full Numerology Report from our Services page to receive a
          detailed analysis of your core numbers, life path, and energetic
          patterns — delivered straight to your inbox within 2 working days.
        </p>
      </div>
    </section>
  );
}

export default NumerologyPage;
