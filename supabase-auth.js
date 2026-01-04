// ============================================
// SUPABASE AUTHENTICATION
// Login, Signup, Google OAuth Integration
// ============================================

class SupabaseAuth {
    constructor() {
        this.currentUser = null;
        this.supabase = null;
        this.initAttempts = 0;
        this.maxAttempts = 10;
        
        // Wait for Supabase to be ready
        this.waitForSupabase();
    }

    waitForSupabase() {
        if (window.supabaseClient) {
            this.supabase = window.supabaseClient;
            console.log('✅ Supabase client connected to SupabaseAuth');
            this.init();
        } else {
            this.initAttempts++;
            if (this.initAttempts < this.maxAttempts) {
                console.log(`⏳ Waiting for Supabase... (attempt ${this.initAttempts}/${this.maxAttempts})`);
                setTimeout(() => this.waitForSupabase(), 200);
            } else {
                console.error('❌ Supabase client not available after multiple attempts');
            }
        }
    }

    async init() {
        try {
            if (!this.supabase) {
                console.error('❌ Supabase not initialized in init()');
                return;
            }

            // Check if user is already logged in
            const { data: { session }, error } = await this.supabase.auth.getSession();
            
            if (error) {
                console.error('Error getting session:', error);
            }
            
            if (session) {
                this.currentUser = session.user;
                this.onAuthStateChange(session.user);
            }

            // Listen for auth state changes
            this.supabase.auth.onAuthStateChange((event, session) => {
                console.log('Auth state changed:', event);
                this.currentUser = session?.user || null;
                this.onAuthStateChange(this.currentUser);
            });
        } catch (error) {
            console.error('Error initializing auth:', error);
        }
    }

    // ============================================
    // SIGN UP WITH EMAIL
    // ============================================
    async signUp(email, password, fullName, phoneNumber = '') {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: fullName,
                        phone_number: phoneNumber
                    }
                }
            });

            if (error) throw error;

            // Create user profile in database
            if (data.user) {
                await this.createUserProfile(data.user.id, email, fullName, phoneNumber);
            }

            console.log('✅ Sign up successful:', data);
            alert('Sign up successful! Please check your email to verify your account.');
            return { success: true, data };
        } catch (error) {
            console.error('❌ Sign up error:', error);
            alert('Sign up failed: ' + error.message);
            return { success: false, error };
        }
    }

    // ============================================
    // CREATE USER PROFILE
    // ============================================
    async createUserProfile(userId, email, fullName, phoneNumber = '') {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .insert([
                    {
                        id: userId,
                        email: email,
                        full_name: fullName,
                        phone_number: phoneNumber
                    }
                ]);

            if (error) throw error;
            console.log('✅ User profile created:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error creating user profile:', error);
            return { success: false, error };
        }
    }

    // ============================================
    // GET USER PROFILE
    // ============================================
    async getUserProfile(userId) {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle(); // Use maybeSingle() instead of single() to handle 0 rows

            if (error) {
                // If table doesn't exist or other error
                if (error.code === '42P01') {
                    console.warn('⚠️ Table "user_profiles" does not exist. Please run the SQL script from create-user-profiles-table.sql');
                } else {
                    console.warn('⚠️ Could not fetch user profile:', error.message);
                }
                return { success: false, error, data: null };
            }
            
            // If no profile exists, return null data (not an error)
            if (!data) {
                console.log('ℹ️ No profile found for user, will use auth data');
                return { success: true, data: null };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error fetching user profile:', error);
            return { success: false, error, data: null };
        }
    }

    // ============================================
    // UPDATE USER PROFILE
    // ============================================
    async updateUserProfile(userId, updates) {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .update(updates)
                .eq('id', userId);

            if (error) throw error;
            console.log('✅ User profile updated:', data);
            alert('Profile updated successfully!');
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error updating user profile:', error);
            alert('Failed to update profile: ' + error.message);
            return { success: false, error };
        }
    }

    // ============================================
    // SIGN IN WITH EMAIL
    // ============================================
    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            console.log('✅ Sign in successful:', data);
            alert('Welcome back!');
            return { success: true, data };
        } catch (error) {
            console.error('❌ Sign in error:', error);
            alert('Sign in failed: ' + error.message);
            return { success: false, error };
        }
    }

    // ============================================
    // SIGN IN WITH GOOGLE
    // ============================================
    async signInWithGoogle() {
        try {
            // Check if supabase is initialized
            if (!this.supabase) {
                throw new Error('Supabase not initialized');
            }

            const { data, error } = await this.supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });

            if (error) throw error;

            console.log('✅ Google sign in initiated:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Google sign in error:', error);
            alert('Google sign in failed: ' + error.message);
            return { success: false, error };
        }
    }

    // ============================================
    // SIGN OUT
    // ============================================
    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;

            console.log('✅ Sign out successful');
            alert('You have been signed out.');
            return { success: true };
        } catch (error) {
            console.error('❌ Sign out error:', error);
            alert('Sign out failed: ' + error.message);
            return { success: false, error };
        }
    }

    // ============================================
    // PASSWORD RESET
    // ============================================
    async resetPassword(email) {
        try {
            const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/reset-password.html'
            });

            if (error) throw error;

            console.log('✅ Password reset email sent:', data);
            alert('Password reset email sent! Please check your inbox.');
            return { success: true, data };
        } catch (error) {
            console.error('❌ Password reset error:', error);
            alert('Password reset failed: ' + error.message);
            return { success: false, error };
        }
    }

    // ============================================
    // GET CURRENT USER
    // ============================================
    getCurrentUser() {
        return this.currentUser;
    }

    // ============================================
    // CHECK IF USER IS LOGGED IN
    // ============================================
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // ============================================
    // AUTH STATE CHANGE HANDLER
    // ============================================
    onAuthStateChange(user) {
        if (user) {
            console.log('👤 User logged in:', user.email);
            this.updateUIForLoggedInUser(user);
        } else {
            console.log('👤 User logged out');
            this.updateUIForLoggedOutUser();
        }
    }

    // ============================================
    // UPDATE UI FOR LOGGED IN USER
    // ============================================
    async updateUIForLoggedInUser(user) {
        // Close auth modal
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Show navigation menu
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.style.display = 'flex';
        }

        // Get user profile from database (handle if table doesn't exist)
        const profileResult = await this.getUserProfile(user.id);
        const profile = (profileResult.success && profileResult.data) ? profileResult.data : null;
        
        // If profile doesn't exist and table exists, create it
        if (!profile && profileResult.success) {
            console.log('ℹ️ Creating profile for user...');
            await this.createUserProfile(
                user.id, 
                user.email, 
                user.user_metadata?.full_name || '', 
                user.user_metadata?.phone_number || ''
            );
        }

        // Replace "Get Started" button with user dropdown
        const navbarButton = document.querySelector('.navbar .navbar-auth-btn');
        if (navbarButton) {
            const userName = profile?.full_name || user.user_metadata?.full_name || user.email.split('@')[0];
            navbarButton.outerHTML = `
                <div class="user-dropdown">
                    <button class="user-dropdown-btn">
                        <span class="user-avatar">${userName.charAt(0).toUpperCase()}</span>
                        <span class="user-name">${userName}</span>
                        <span class="dropdown-arrow">▼</span>
                    </button>
                    <div class="user-dropdown-menu">
                        <div class="user-info">
                            <div class="user-info-name">${userName}</div>
                            <div class="user-info-email">${user.email}</div>
                            ${profile?.phone_number ? `<div class="user-info-phone">📱 ${profile.phone_number}</div>` : ''}
                        </div>
                        <div class="dropdown-divider"></div>
                        <button class="dropdown-item" onclick="window.supabaseAuth.showProfileModal()">
                            <span>👤</span> Edit Profile
                        </button>
                        <button class="dropdown-item" onclick="window.supabaseAuth.signOut()">
                            <span>🚪</span> Sign Out
                        </button>
                    </div>
                </div>
            `;

            // Add dropdown toggle functionality
            setTimeout(() => {
                const dropdownBtn = document.querySelector('.user-dropdown-btn');
                const dropdownMenu = document.querySelector('.user-dropdown-menu');
                
                if (dropdownBtn && dropdownMenu) {
                    dropdownBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        dropdownMenu.classList.toggle('active');
                    });

                    // Close dropdown when clicking outside
                    document.addEventListener('click', () => {
                        dropdownMenu.classList.remove('active');
                    });
                }
            }, 100);
        }
    }

    // ============================================
    // UPDATE UI FOR LOGGED OUT USER
    // ============================================
    updateUIForLoggedOutUser() {
        // Hide navigation menu
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.style.display = 'none';
        }

        // Replace user dropdown with "Get Started" button
        const userDropdown = document.querySelector('.user-dropdown');
        if (userDropdown) {
            userDropdown.outerHTML = '<button class="btn-primary navbar-auth-btn">Get Started</button>';
            
            // Re-initialize the Get Started button
            setTimeout(() => {
                if (window.initGetStartedButton) {
                    window.initGetStartedButton();
                }
            }, 100);
        }
    }

    // ============================================
    // SHOW PROFILE MODAL
    // ============================================
    async showProfileModal() {
        const user = this.getCurrentUser();
        if (!user) return;

        const profileResult = await this.getUserProfile(user.id);
        const profile = (profileResult.success && profileResult.data) ? profileResult.data : {};
        
        // If no profile exists, use user metadata
        if (!profile || Object.keys(profile).length === 0) {
            profile.full_name = user.user_metadata?.full_name || '';
            profile.phone_number = user.user_metadata?.phone_number || '';
            profile.address = '';
            profile.city = '';
            profile.state = '';
            profile.zip_code = '';
            profile.country = '';
        }

        // Create profile modal
        const modalHTML = `
            <div class="profile-modal active" id="profileModal">
                <div class="auth-modal-overlay"></div>
                <div class="auth-modal-content">
                    <button class="auth-modal-close" onclick="document.getElementById('profileModal').remove()">×</button>
                    <div class="auth-container">
                        <h2 class="auth-title">Edit Profile</h2>
                        <p class="auth-subtitle">Update your personal information</p>
                        
                        <form class="auth-form-fields" id="profileForm">
                            <div class="form-group">
                                <label>Full Name</label>
                                <input type="text" id="profileName" value="${profile.full_name || ''}" required>
                            </div>
                            
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" value="${user.email}" disabled>
                            </div>
                            
                            <div class="form-group">
                                <label>Phone Number</label>
                                <input type="tel" id="profilePhone" value="${profile.phone_number || ''}" placeholder="+1 (555) 123-4567">
                            </div>
                            
                            <div class="form-group">
                                <label>Address</label>
                                <input type="text" id="profileAddress" value="${profile.address || ''}" placeholder="Street address">
                            </div>
                            
                            <div class="form-group">
                                <label>City</label>
                                <input type="text" id="profileCity" value="${profile.city || ''}" placeholder="City">
                            </div>
                            
                            <div class="form-group">
                                <label>State</label>
                                <input type="text" id="profileState" value="${profile.state || ''}" placeholder="State">
                            </div>
                            
                            <div class="form-group">
                                <label>ZIP Code</label>
                                <input type="text" id="profileZip" value="${profile.zip_code || ''}" placeholder="12345">
                            </div>
                            
                            <div class="form-group">
                                <label>Country</label>
                                <input type="text" id="profileCountry" value="${profile.country || ''}" placeholder="Country">
                            </div>
                            
                            <button type="submit" class="btn-auth btn-primary-auth">Save Changes</button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Handle form submission
        const form = document.getElementById('profileForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const updates = {
                full_name: document.getElementById('profileName').value,
                phone_number: document.getElementById('profilePhone').value,
                address: document.getElementById('profileAddress').value,
                city: document.getElementById('profileCity').value,
                state: document.getElementById('profileState').value,
                zip_code: document.getElementById('profileZip').value,
                country: document.getElementById('profileCountry').value,
                updated_at: new Date().toISOString()
            };

            const result = await this.updateUserProfile(user.id, updates);
            if (result.success) {
                document.getElementById('profileModal').remove();
                // Refresh UI
                this.updateUIForLoggedInUser(user);
            }
        });
    }
}

// Initialize auth when DOM is ready
let auth = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Initializing Supabase Auth...');
    
    // Create auth instance immediately - it will wait for Supabase internally
    auth = new SupabaseAuth();
    window.supabaseAuth = auth;
    console.log('🔐 Supabase Auth instance created');
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupabaseAuth;
}
