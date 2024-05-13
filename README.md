```mermaid
erDiagram

Users ||--|| Profiles : has
Users ||--o{ FavoriteKpopVideos : places
Users ||--o{ FavoriteKpopVideos : places
KpopVideos ||--o{ FavoriteKpopVideos : places
Users ||--o{ Comments : places
KpopVideos ||--o{ Comments : places
Users ||--o{ Playlists : places
KpopVideos ||--o{ PlaylistItems : places
Playlists ||--o{ PlaylistItems : places



Users {
 bigint id PK
 string name
 string avatar_url
 string provider
 string uid
 datetime created_at
 datetime updated_at
}

Profiles {
 bigint id PK
 bigint user_id FK
 datetime created_at
 datetime updated_at
}

KpopVideos {
 bigint id PK
 string name
 string video_id_or_url
 string image
 string artist_name
 bigint view_count
 datatime posted_at
 datetime created_at
 datetime updated_at
}

Comments {
 bigint id PK
 bigint user_id FK
 bigint kpopvideo_id FK
 string comment
}

FavoriteKpopVideos {
 bigint id PK
 bigint user_id FK
 bigint kpopvideo_id FK
 datetime created_at
 datetime updated_at
}

Playlists {
 bigint id PK
 bigint user_id FK
 string name
 datetime created_at
 datetime updated_at
}

PlaylistItems {
 bigint id PK
 bigint kpopvideo_id FK
 bigint playlist_id
 datetime created_at
 datetime updated_at
}
```



This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
