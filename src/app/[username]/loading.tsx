export default function UsernameLoading() {
  return (
    <div
      className='flex items-start justify-center rounded-3xl m-2 py-10 animate-pulse'
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
      <div className='w-full max-w-[520px]'>
        <div
          className='rounded-3xl bg-white overflow-hidden p-8'
          style={{
            boxShadow: `
              0px 0px 0px 1px rgba(120, 57, 238, 0.08),
              0px 2px 24px 0px rgba(120, 57, 238, 0.06),
              0px 4px 4px 0px rgba(0, 0, 0, 0.01),
              0px 2px 2px 0px rgba(0, 0, 0, 0.01)
            `,
          }}
        >
          {/* Name + Avatar skeleton */}
          <div className='flex items-start justify-between'>
            <div className='flex flex-col gap-2'>
              {/* Name */}
              <div className='h-7 w-36 rounded-lg bg-gray-100' />
              {/* Username */}
              <div className='h-4 w-24 rounded-md bg-gray-100' />
            </div>
            {/* Avatar skeleton */}
            <div className='flex-shrink-0 ml-6'>
              <div className='h-[72px] w-[72px] rounded-full bg-gray-100' />
            </div>
          </div>

          <hr className='my-6 border-gray-100' />

          {/* About section skeleton */}
          <div className='flex flex-col gap-2'>
            <div className='h-3 w-12 rounded bg-gray-100' />
            <div className='space-y-1.5'>
              <div className='h-4 w-full rounded bg-gray-100' />
              <div className='h-4 w-3/4 rounded bg-gray-100' />
            </div>
          </div>

          <hr className='my-6 border-gray-100' />

          {/* Profile link skeleton */}
          <div className='flex items-center justify-between'>
            <div className='h-3 w-24 rounded bg-gray-100' />
            <div className='h-6 w-32 rounded-full bg-violet-50' />
          </div>
        </div>

        {/* Footer skeleton */}
        <div className='mt-10 flex w-full items-center justify-center gap-2'>
          <div className='h-3 w-20 rounded bg-gray-100' />
        </div>
      </div>
    </div>
  );
}
