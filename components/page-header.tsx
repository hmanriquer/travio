export function PageHeader() {
  return (
    <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-2.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
            aria-hidden="true"
          >
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
          </svg>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
            Travio
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestión y control de viáticos empresariales
        </p>
      </div>
      <div className="mt-3 flex items-center gap-2 sm:mt-0">
        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
        <span className="text-xs text-muted-foreground">
          Último corte: Feb 2026
        </span>
      </div>
    </header>
  );
}
