export function LoadingSpinner() {
  return (
    <div className="flex h-dvh items-center justify-center">
      <svg
        viewBox="0 0 200 200"
        className="h-32 w-32"
        style={{
          animation: "spin 1s linear infinite",
        }}
      >
        {/* Outer perforations - C shape with gap */}
        <path
          d="M 100 35 A 65 65 0 1 1 100 165"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="4"
          strokeDasharray="6, 8"
          strokeLinecap="round"
          className="opacity-60"
        />

        {/* Film frames (middle layer) - C shape with gap */}
        <path
          d="M 100 45 A 55 55 0 1 1 100 155"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="12"
          strokeDasharray="18, 18"
          strokeLinecap="round"
          className="opacity-90"
        />

        {/* Inner perforations - C shape with gap */}
        <path
          d="M 100 55 A 45 45 0 1 1 100 145"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="4"
          strokeDasharray="5, 7"
          strokeLinecap="round"
          className="opacity-60"
        />
      </svg>
    </div>
  );
}
