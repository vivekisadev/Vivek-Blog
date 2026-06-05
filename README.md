# Vivek's Blog

A minimalist, feature-rich personal blog built with Next.js 15+ and the App Router.

## 🚀 Features

- **📝 Markdown & MDX Support**: Write articles and notes effortlessly.
- **🎨 Modern UI**: Styled with Tailwind CSS and Radix UI primitives.
- **🌓 Dark/Light Mode**: Full theme support.
- **📊 Database Integration**: Powered by Prisma ORM and PostgreSQL.
- **💬 Comments System**: Integrated with Giscus for GitHub-based discussions.
- **✨ Code & Math Rendering**: Syntax highlighting with Shiki/Highlight.js and Math support via KaTeX.
- **📱 Responsive Design**: Optimized for all devices.
- **⚡ Fast Performance**: Static generation, fast page loading, and optimized assets.
- ** RSS Feed**: Automated RSS feed generation.
- **🛡️ Admin Dashboard**: A secret admin dashboard to create and manage posts or notes directly from the website.

## 💻 Technology Stack

- **Framework**: Next.js 15+ (React 19)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Database ORM**: Prisma
- **Icons**: Lucide React & React Icons
- **Animations**: Framer Motion
- **Package Manager**: pnpm
- **Deployment**: Vercel

## 📂 Project Structure

```text
.
├── app/               # Next.js App Router (Pages, Layouts, API routes)
├── components/        # Reusable React components (UI, Layout, MDX)
├── content/           # Content directory
│   ├── notes/         # Short-form notes
│   └── posts/         # Long-form blog articles
├── lib/               # Utility functions and configurations
├── prisma/            # Database schema and migrations
├── public/            # Static assets
├── scripts/           # Build scripts (e.g., RSS generation)
└── styles/            # Global CSS and Tailwind styles
```

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vivekisadev/Vivek-Blog.git
   cd Vivek-Blog
   ```

2. **Install dependencies:**
   This project uses `pnpm`. If you don't have it installed, you can install it via npm (`npm install -g pnpm`).
   ```bash
   pnpm install
   ```

3. **Environment Variables:**
   Create a `.env.local` file and add necessary environment variables (Database URL, etc.) by referencing `.env` if available.

4. **Database Setup:**
   ```bash
   pnpm run generate
   ```

5. **Run the development server:**
   ```bash
   pnpm run dev
   ```

6. **Build for production:**
   ```bash
   pnpm run build
   ```

## ✍️ Content Creation

You can create content in two ways: through the secret admin dashboard on the website, or manually via Markdown files.

### 1. Via Admin Dashboard (Recommended)
Access the secret admin dashboard to write, preview, and publish posts or notes directly from the website interface without needing to edit local files.

### 2. Manual Creation

#### Adding New Articles
1. Create a new Markdown (`.md` or `.mdx`) file in the `content/posts/` directory.
2. Add the required frontmatter at the top of the file:
   ```markdown
   ---
   title: Your Article Title
   date: YYYY-MM-DD
   tags: ["tag1", "tag2"]
   ---
   ```

#### Adding Notes
1. Create a new file in the `content/notes/` directory.
2. Add the frontmatter:
   ```markdown
   ---
   date: YYYY-MM-DD
   ---
   ```

## 🚀 Deployment

The project is optimized for [Vercel](https://vercel.com/). You can connect your GitHub repository to Vercel for automatic deployments on push.

## 🤝 Contribution

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is licensed under the MIT License.
