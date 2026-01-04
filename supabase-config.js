// ============================================
// SUPABASE CONFIGURATION
// Authentication and Database Integration
// ============================================

const SUPABASE_CONFIG = {
    url: 'https://fwropsaxmenkagyfdwcb.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3cm9wc2F4bWVua2FneWZkd2NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3MzcwOTYsImV4cCI6MjA4MjMxMzA5Nn0.symhG6e7GyitYssZHPNoM3x4uTXsW_hcm19BEzrJH7Y'
};

// Initialize Supabase when the script loads
function initSupabase() {
    if (typeof window.supabase === 'undefined') {
        console.error('Supabase library not loaded. Please include the Supabase CDN script.');
        return false;
    }
    
    try {
        const supabaseClient = window.supabase.createClient(
            SUPABASE_CONFIG.url,
            SUPABASE_CONFIG.anonKey
        );
        
        // Make it globally available
        window.supabaseClient = supabaseClient;
        
        console.log('✅ Supabase initialized successfully');
        console.log('📍 Project URL:', SUPABASE_CONFIG.url);
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
