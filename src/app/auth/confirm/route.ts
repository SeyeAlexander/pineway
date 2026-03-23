import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createProfile } from '@/app/actions/profile/profile.service'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/app'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error, data } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    if (!error && data.user) {
      // Auto-provision profile on successful verification
      await createProfile(data.user.id);
      // redirect user to specified redirect URL or root of app
      redirect(next)
    }
  }

  // redirect the user to an error page with some instructions
  redirect('/login')
}
