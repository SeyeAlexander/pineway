export default function Loading() {
  return (
    <div
      className='flex items-center justify-center rounded-3xl m-2 animate-pulse'
      style={{
        minHeight: "calc(100vh - 1rem)",
        background: "white",
        boxShadow: `
          0px 0px 0px 1px rgba(120, 57, 238, 0.3),
          0px 2px 24px 0px rgba(120, 57, 238, 0.3),
          0px 8px 32px 0px rgba(120, 57, 238, 0.2),
          0px 4px 4px 0px rgba(0, 0, 0, 0.02)
        `,
      }}
    >
      <span className='text-sm font-medium text-violet-400'>Loading...</span>
    </div>
  );
}
