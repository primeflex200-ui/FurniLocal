// ============================================
// SUPABASE CONFIGURATION TEMPLATE
// Copy this file to 'supabase-config.js' and add your credentials
// ============================================

// INSTRUCTIONS:
// 1. Go to https://supabase.com/dashboard
// 2. Select your project
// 3. Go to Settings → API
// 4. Copy your Project URL and anon public key
// 5. Paste them below
// 6. Save this file as 'supabase-config.js'

const SUPABASE_CONFIG = {
    url: 'https://YOUR_PROJECT_REF.supabase.co', // Replace with your Project URL
    anonKey: 'YOUR_ANON_PUBLIC_KEY_HERE' // Replace with your anon public key
};

// Initialize Supabase client
let supabase = null;

function initSupabase() {
    if (typeof supabase === 'undefined' || !window.supabase) {
        console.error('Supabase library not loaded. Please include the Supabase CDN script.');
        return false;
    }
    
    try {
        supabase = window.supabase.createClient(
            SUPABASE_CONFIG.url,
            SUPABASE_CONFIG.anonKey
        );
        console.log('✅ Supabase initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ Error initializing Supabase:', error);
        return false;
    }
}

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabase);
} else {
    initSupabase();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SUPABASE_CONFIG, initSupabase };
}
