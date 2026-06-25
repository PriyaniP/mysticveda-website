import { useEffect, useState } from "react";
import BlogManager from "../components/BlogManager";
import SectionHeading from "../components/SectionHeading";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { timeSlots } from "../lib/constants";

function AdminPage() {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState(timeSlots);
  const [newSlot, setNewSlot] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingSlots, setSavingSlots] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [appointmentsData, availabilityData] = await Promise.all([
          api.getAppointments(),
          api.getAvailability()
        ]);
        setAppointments(appointmentsData.appointments);
        setSlots(availabilityData.slots?.length ? availabilityData.slots : timeSlots);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  function handleAddSlot() {
    const normalizedSlot = newSlot.trim();

    if (!normalizedSlot) {
      return;
    }

    setSlots((current) => {
      if (current.includes(normalizedSlot)) {
        return current;
      }

      return [...current, normalizedSlot];
    });
    setNewSlot("");
  }

  function handleRemoveSlot(slotToRemove) {
    setSlots((current) => current.filter((slot) => slot !== slotToRemove));
  }

  async function handleSaveSlots() {
    if (slots.length === 0) {
      setError("Please keep at least one available slot.");
      return;
    }

    setSavingSlots(true);
    setError("");

    try {
      const data = await api.updateAvailability(slots);
      setSlots(data.slots);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingSlots(false);
    }
  }

  return (
    <section className="section-shell py-16">
      <SectionHeading
        eyebrow="Admin"
        title="Booking dashboard"
        description="Manage the daily slots clients can book, then review who reserved each date and time."
        align="left"
      />

      <div className="mt-6 flex flex-col gap-3 rounded-[24px] bg-white/70 p-5 text-sm text-mystic-plum/75 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <p>
          Logged in as <span className="font-semibold text-mystic-plum">{user?.email}</span>
        </p>
        <button type="button" className="secondary-button" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-panel rounded-[32px] p-7 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-mystic-gold">
            Available Slots
          </p>
          <h2 className="mt-3 font-display text-4xl text-mystic-plum">
            Control booking times
          </h2>
          <p className="mt-3 text-sm leading-7 text-mystic-plum/70">
            These are the time choices shown to clients on the booking page for
            future dates. If a client already books a slot on a date, that slot
            appears as booked for that date.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              className="input-field"
              type="text"
              value={newSlot}
              onChange={(event) => setNewSlot(event.target.value)}
              placeholder="Add slot like 07:00 PM"
            />
            <button type="button" className="secondary-button" onClick={handleAddSlot}>
              Add Slot
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {slots.map((slot) => (
              <div
                key={slot}
                className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-mystic-plum shadow-sm"
              >
                <span>{slot}</span>
                <button
                  type="button"
                  className="text-mystic-plum/45 transition hover:text-red-500"
                  onClick={() => handleRemoveSlot(slot)}
                  aria-label={`Remove ${slot}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <button
            type="button"
            className="primary-button mt-6"
            onClick={handleSaveSlots}
            disabled={savingSlots}
          >
            {savingSlots ? "Saving..." : "Save Available Slots"}
          </button>
        </div>

        <div className="glass-panel rounded-[32px] p-7 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-mystic-gold">
            Booking Summary
          </p>
          <h2 className="mt-3 font-display text-4xl text-mystic-plum">
            Current reservations
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] bg-white/75 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-mystic-plum/45">
                Total Bookings
              </p>
              <p className="mt-2 text-2xl font-semibold text-mystic-plum">
                {appointments.length}
              </p>
            </div>
            <div className="rounded-[24px] bg-white/75 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-mystic-plum/45">
                Live Sessions
              </p>
              <p className="mt-2 text-2xl font-semibold text-mystic-plum">
                {
                  appointments.filter(
                    (appointment) => appointment.requiresMeeting !== false
                  ).length
                }
              </p>
            </div>
            <div className="rounded-[24px] bg-white/75 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-mystic-plum/45">
                Reports
              </p>
              <p className="mt-2 text-2xl font-semibold text-mystic-plum">
                {
                  appointments.filter(
                    (appointment) => appointment.requiresMeeting === false
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 overflow-hidden rounded-[32px] border border-mystic-plum/10 bg-white/80 shadow-card">
        {loading ? (
          <div className="p-8">
            <div className="h-64 animate-pulse rounded-[24px] bg-mystic-lilac/50" />
          </div>
        ) : error && appointments.length === 0 ? (
          <div className="p-8 text-sm text-red-600">{error}</div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-sm text-mystic-plum/70">
            No bookings yet. New appointments will appear here after clients book a slot.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-mystic-plum text-white">
                <tr>
                  {[
                    "Client",
                    "Contact",
                    "Service",
                    "Schedule",
                    "Status",
                    "Meeting"
                  ].map((heading) => (
                    <th key={heading} className="px-5 py-4 font-semibold">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment, index) => (
                  <tr
                    key={appointment.id}
                    className={index % 2 === 0 ? "bg-white/80" : "bg-[#FBF7FF]"}
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-mystic-plum">
                        {appointment.name}
                      </p>
                      <p className="text-xs uppercase tracking-[0.25em] text-mystic-plum/45">
                        {appointment.emailStatus}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-mystic-plum/75">
                      <p>{appointment.email}</p>
                      <p>{appointment.phone}</p>
                    </td>
                    <td className="px-5 py-4 text-mystic-plum/75">
                      <p className="font-semibold text-mystic-plum">
                        {appointment.serviceName}
                      </p>
                      <p>{appointment.serviceDuration}</p>
                      {appointment.serviceItems?.length > 1 ? (
                        <p className="mt-1 text-xs text-mystic-plum/55">
                          {appointment.serviceItems
                            .map((item) => `${item.name} x${item.quantity}`)
                            .join(", ")}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 text-mystic-plum/75">
                      <p>{appointment.date}</p>
                      <p>
                        {appointment.requiresMeeting !== false
                          ? appointment.timeSlot
                          : "Report by email"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-2">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                          {appointment.bookingStatus}
                        </span>
                        <p className="text-xs text-mystic-plum/60">
                          {appointment.emailStatus}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-mystic-plum/75">
                      {appointment.requiresMeeting !== false &&
                      appointment.meetingLink &&
                      appointment.meetingProvider === "google-meet" ? (
                        <a
                          href={appointment.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-mystic-gold/60 underline-offset-4"
                        >
                          Open Link
                        </a>
                      ) : appointment.requiresMeeting !== false &&
                        appointment.meetingProvider === "fallback" ? (
                        <span className="text-xs text-amber-700">
                          Placeholder only
                        </span>
                      ) : (
                        <span className="text-xs text-mystic-plum/55">
                          No meeting link
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-12">
        <SectionHeading
          eyebrow="Blog"
          title="Write & manage blog posts"
          description="Publish articles that appear instantly on the public blog page. Edit or remove them anytime."
          align="left"
        />
        <BlogManager />
      </div>
    </section>
  );
}

export default AdminPage;
