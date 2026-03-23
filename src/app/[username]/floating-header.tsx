"use client";

import { Button } from "@/components/ui/button/button";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function FloatingHeader({ username }: { username: string }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    // Wait briefly for the server to recognize the cleared cookie before removing loading state
    setTimeout(() => setIsLoggingOut(false), 1000);
  };

  return (
    <div className='fixed bottom-6 right-6 z-50 flex items-center gap-2'>
      <span className='text-[13px] text-gray-500 mr-2'>
        Signed in as <span className='font-medium text-violet-600'>@{username}</span>
      </span>

      <span className=''>/</span>

      <Link href='/app'>
        <Button
          variant='ghost'
          size='sm'
          className='h-7 text-xs px-3 font-medium bg-transparent text-gray-600 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 transition-colors'
        >
          Profile settings
        </Button>
      </Link>

      <span className=''>/</span>

      <Button
        variant='ghost'
        size='sm'
        className='h-7 text-xs px-3 font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors w-[64px]'
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? "..." : "Logout"}
      </Button>
    </div>
  );
}
