import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    if (req.method === 'POST') {
      const { email, password, userData } = await req.json()
      
      // Create user with admin privileges (bypasses email confirmation)
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // Automatically confirm email
        user_metadata: userData || {}
      })

      if (authError) {
        console.error('Auth error:', authError)
        return new Response(
          JSON.stringify({ error: authError.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles_2025_10_03_16_01')
        .insert({
          id: authData.user.id,
          email: email,
          first_name: userData?.first_name || 'Test',
          last_name: userData?.last_name || 'Utilisateur',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          subscription_type: 'free',
          experience_level: 'intermediate',
          availability: 'immediate',
          contract_types: ['cdi'],
          automation_level: 'semi'
        })

      if (profileError) {
        console.error('Profile error:', profileError)
        // Continue even if profile creation fails
      }

      // Create some test applications for demonstration
      const jobOffers = await supabase
        .from('job_offers_2025_10_03_16_01')
        .select('id')
        .limit(3)

      if (jobOffers.data && jobOffers.data.length > 0) {
        const testApplications = jobOffers.data.map((job, index) => ({
          user_id: authData.user.id,
          job_offer_id: job.id,
          status: index === 0 ? 'sent' : index === 1 ? 'interview_scheduled' : 'draft',
          applied_date: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
          notes: index === 0 ? 'Candidature envoyée avec CV personnalisé' : 
                 index === 1 ? 'Entretien prévu le 15 octobre à 14h' : 
                 'Brouillon - À finaliser',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))

        await supabase
          .from('applications_2025_10_03_16_01')
          .insert(testApplications)
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          user: authData.user,
          message: 'Utilisateur créé avec succès. Vous pouvez maintenant vous connecter.' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // GET request - return instructions
    return new Response(
      JSON.stringify({
        message: 'Edge Function pour créer un utilisateur de test',
        instructions: 'Envoyez une requête POST avec { email, password, userData }',
        example: {
          email: 'info@grandire.ch',
          password: 'Test123!',
          userData: {
            first_name: 'Test',
            last_name: 'Utilisateur'
          }
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})