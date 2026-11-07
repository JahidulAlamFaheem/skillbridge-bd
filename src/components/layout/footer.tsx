export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-blue text-white">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </span>
            <span className="text-base font-bold text-slate-900">
              SkillBridge <span className="text-brand-blue">BD</span>
            </span>
          </div>

          {/* Mandated Spec Line */}
          <p className="text-center text-xs font-medium text-slate-600 md:text-left">
            Skill comparison is informational. It is not a hiring decision.
          </p>

          {/* Copyright & Secondary note */}
          <div className="text-xs text-slate-600">
            &copy; 2026 SkillBridge BD. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
