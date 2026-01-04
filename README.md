# FurniLocal - Premium Furniture Marketplace

A modern, responsive furniture marketplace website with user authentication and interactive features.

## 🎯 Features

- **User Authentication** - Email/Password and Google OAuth sign-in
- **User Profiles** - Complete profile management with Supabase
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Floating Navigation** - Modern dock-style navigation
- **Smooth Animations** - GSAP-powered text animations
- **Contact Integration** - Direct Gmail compose links

## 🚀 Live Demo

Visit: [Your Netlify URL will be here]

## 🛠️ Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Supabase (Authentication & Database)
- **Animations:** GSAP (GreenSock Animation Platform)
- **Hosting:** Netlify
- **Version Control:** Git

## 📋 Prerequisites

- Supabase account and project
- Google OAuth credentials (for Google Sign-in)
- Netlify account (for deployment)

## 🔧 Setup

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd furnilocal
```

### 2. Configure Supabase

1. Create a Supabase project
2. Run the SQL script from `create-user-profiles-table.sql`
3. Update `supabase-config.js` with your credentials
4. Configure authentication providers

### 3. Deploy to Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Deploy automatically

## 📁 Project Structure

```
furnilocal/
├── index.html              # Main HTML file
├── styles.css              # Main stylesheet
├── styles-gpu-optimized.css # GPU-optimized styles
├── floating-dock.css       # Navigation dock styles
├── script.js               # Main JavaScript
├── floating-dock.js        # Navigation functionality
├── text-animation.js       # GSAP animations
├── supabase-config.js      # Supabase configuration
├── supabase-auth.js        # Authentication logic
├── logo-main.jpg           # Logo image
├── chair-main.jpg          # Hero image
├── netlify.toml            # Netlify configuration
└── README.md               # This file
```

## 🔐 Environment Variables

No environment variables needed - all configuration is in `supabase-config.js`

## 🎨 Customization

### Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --primary: #2D1810;
    --accent: #D4A574;
    /* ... more colors */
}
```

### Logo

Replace `logo-main.jpg` with your logo

### Email

Update email in `index.html` (Contact section)

## 📱 Contact

- **Email:** hellofurnilocal@gmail.com
- **Instagram:** @furnilocal_official

## 📄 License

All rights reserved © 2025 FurniLocal

## 🙏 Acknowledgments

- GSAP for animations
- Supabase for backend services
- Netlify for hosting
