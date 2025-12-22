"use client";

interface EventCount {
  eventName: string;
  count: number;
}

interface EventsTableProps {
  events: EventCount[];
  period: number;
}

// Event name display labels
const EVENT_LABELS: Record<string, string> = {
  page_view: "Page View",
  portal_click: "Portal Click",
  menu_open: "Menu Open",
  cenotaph_view: "Cenotaph View",
  respects_paid: "Respects Paid",
  share_link_created: "Share Link Created",
  share_click: "Share Click",
  wizard_started: "Wizard Started",
  chapter_started: "Chapter Started",
  chapter_resumed: "Chapter Resumed",
  chapter_paused: "Chapter Paused",
  chapter_completed: "Chapter Completed",
  wizard_completed: "Wizard Completed",
  signup: "Sign Up",
  login: "Login",
  logout: "Logout",
  email_verified: "Email Verified",
  newsletter_subscribe: "Newsletter Subscribe",
};

export function EventsTable({ events, period }: EventsTableProps) {
  if (events.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-marble-100 mb-4">Top Events</h2>
        <div className="text-center text-slate-500 py-8">
          No events recorded in the last {period} days
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...events.map((e) => e.count), 1);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-marble-100 mb-4">
        Top Events (Last {period} days)
      </h2>

      <div className="space-y-3">
        {events.map((event, index) => (
          <div key={event.eventName} className="flex items-center gap-4">
            <span className="text-xs text-slate-500 w-6">{index + 1}.</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-marble-100">
                  {EVENT_LABELS[event.eventName] || event.eventName}
                </span>
                <span className="text-sm text-slate-400">{event.count.toLocaleString()}</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-500/50 rounded-full transition-all duration-500"
                  style={{ width: `${(event.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
