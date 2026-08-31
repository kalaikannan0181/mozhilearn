export default function GridBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(29, 78, 216, 0.06) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(29, 78, 216, 0.06) 1px, transparent 1px),
          radial-gradient(circle at 82% 10%, rgba(249, 115, 22, 0.10) 0%, rgba(249, 115, 22, 0.03) 26%, transparent 52%),
          radial-gradient(circle at 12% 45%, rgba(5, 150, 105, 0.07) 0%, transparent 40%)
        `,
        backgroundSize: '40px 40px, 40px 40px, 100% 100%, 100% 100%',
      }}
    />
  )
}
