Vivek's Blog
A minimalist personal blog system built with Next.js 15+.

Technology Stack
    Framework: Next.js 13+ (App Router)
    Styling: Tailwind CSS
    Icons: Lucide Icons & react-icons
    Theming: Supports dark/light mode switching
    Deployment: Vercel
Features
    📝 Markdown-based article support
    🌓 Dark/light theme toggle
    📱 Responsive design
    ⚡ Fast page loading
    📅 Article timeline display


Project Structure

```text
.
├── app/
│   ├── lib/           # Utility functions and data processing
│   ├── posts/         # Blog articles
│   └── page.tsx       # Homepage
├── content/
│   ├── notes/         # Short notes
│   └── posts/         # Articles
├── components/        # React components
├── public/            # Static assets
└── styles/            # Global styles

```
# Installation and Running
1. Clone the project:
```bash

git clone https://github.com/Lily-404/blog.git
cd jimmy-blog
```

2. Install dependencies:
```bash

npm install
```

3. Run the development server:
```bash

npm run dev
```

4. Build for production:
```bash
npm run build
```

# Adding New Articles
1. Create a new Markdown file in the content/posts directory.
2. Use the naming format: xxx.md.
3. Add metadata at the top of the file:

```markdown
---
title: Article Title
date: YYYY-MM-DD
tags: ["tag1", "tag2", "tag3"]
---
```

# Adding Notes
1. Create a new Markdown file in the content/notes directory.
2. Use the naming format: YYYY-MM-DD-title.md.
3. Add metadata at the top of the file:

```markdown
---
date: YYYY-MM-DD
---
```
# Deployment
The project is configured for Vercel deployment, supporting automatic builds and deployments. Push code to the GitHub repository, and Vercel will handle the rest.

# Contribution
Feel free to submit Issues and Pull Requests!

# License
MIT License