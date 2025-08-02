# Moody - Mood Tracking Frontend

A beautiful, responsive React frontend for the Moody mood tracking application. Built with modern web technologies and designed with a feminine, wellness-focused aesthetic.

## 🌸 Features

- **Beautiful UI Design**: Inspired by feminine wellness aesthetics with soft gradients and pink/rose color schemes
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Mood Tracking**: Easy-to-use emoji-based mood selection with optional notes
- **Visual Timeline**: See mood patterns over time with beautiful calendar views
- **User Authentication**: Secure login and registration system
- **Dashboard Analytics**: Personal mood statistics and weekly insights
- **Smooth Animations**: Framer Motion powered micro-interactions

## 🛠 Tech Stack

- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icons
- **React Router** - Client-side routing
- **Vite** - Fast build tool and dev server

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Backend server running on `http://localhost:5000`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd moody-frontend
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎨 Design Features

### Color Palette
- **Primary**: Pink to Rose gradients (`from-pink-500 to-rose-500`)
- **Background**: Soft gradients (`from-pink-50 via-rose-50 to-orange-50`)
- **Accents**: Yellow, Purple, and Orange highlights
- **Text**: Dark grays for readability

### Typography
- **Headings**: Bold, modern sans-serif
- **Body**: Clean, readable text with proper contrast
- **Gradients**: Text gradients for emphasis and branding

### Layout
- **Responsive Grid**: Mobile-first design approach
- **Cards**: Elevated cards with subtle shadows
- **Spacing**: Consistent spacing using Tailwind's spacing scale

## 📱 Pages & Components

### Home Page
- Hero section with compelling copy
- Feature showcase with icons and descriptions
- Statistics section with animated counters
- Call-to-action sections

### Authentication
- **Login**: Clean form with validation
- **Register**: Multi-step registration process
- **Protected Routes**: Automatic redirection for authenticated users

### Dashboard
- **Mood Logging**: 8 different mood options with emoji selection
- **Mood History**: Timeline view of past mood entries
- **Statistics**: Personal analytics and insights
- **Notes**: Optional journaling for each mood entry

### Navigation
- **Responsive Navbar**: Collapsible mobile menu
- **User Status**: Shows login state and user name
- **Smooth Transitions**: Animated page transitions

## 🔌 API Integration

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Mood Tracking
- `POST /api/mood` - Create new mood entry
- `GET /api/mood` - Get user's mood history
- `DELETE /api/mood/:id` - Delete mood entry

## 🎯 Key Features Implementation

### Mood Selection
- 8 different mood options with emojis
- Visual feedback with gradient backgrounds
- Smooth hover and selection animations

### Mood Analytics
- Total mood entries counter
- Most common mood detection
- Weekly insights and patterns

### User Experience
- Loading states for all async operations
- Error handling with user-friendly messages
- Success notifications for completed actions
- Responsive design for all screen sizes

## 📦 Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🎨 Customization

### Colors
Modify the color scheme in `src/App.css` and component files. The app uses Tailwind's color system with custom gradients.

### Components
All UI components are in `src/components/` and use shadcn/ui as the base with custom styling.

### Animations
Framer Motion animations can be customized in individual component files.

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000
```

## 📝 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── Dashboard.jsx    # Main dashboard
│   ├── Home.jsx         # Landing page
│   ├── Login.jsx        # Login form
│   ├── Register.jsx     # Registration form
│   └── Navbar.jsx       # Navigation component
├── context/
│   └── AuthContext.jsx  # Authentication context
├── App.jsx              # Main app component
├── App.css              # Global styles
└── main.jsx             # Entry point
```

## 🌟 Future Enhancements

- **Data Visualization**: Charts and graphs for mood trends
- **Export Features**: PDF/CSV export of mood data
- **Notifications**: Reminder notifications for mood logging
- **Social Features**: Share insights with therapists or friends
- **Integrations**: Connect with Spotify, calendar apps, etc.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Design inspiration from feminine wellness and life coaching websites
- shadcn/ui for beautiful, accessible components
- Tailwind CSS for rapid styling
- Framer Motion for smooth animations

