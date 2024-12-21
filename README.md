# PROJECT STRUCTURE 
```
└── 📁1min2meet
    └── 📁app
        └── 📁fonts
        └── globals.css
        └── layout.tsx // root layout
        └── 📁api // api routing
        └── auth.ts
        └── 📁dashboard // page routing
        └── 📁meeting
            └── 📁[meetingId] // dynamic page routing
                └── page.tsx
        └── page.tsx
    └── 📁components
        └── 📁common
        └── 📁features // special components for each page
            └── 📁AddGoogleCalendar
            └── 📁Auth
            └── 📁AvailabilityFill
            └── 📁Dashboard
            └── 📁MeetingCUForm
        └── 📁Layout // special components for layojt
            └── 📁Footer
            └── 📁Navbar
        └── 📁ui // shadcn's components
        └── 📁utils
            └── constant.ts
            └── 📁helper
    └── 📁hooks
    └── 📁lib
        └── meeting.ts // api service functions
        └── prisma.ts // db connect
        └── utils.ts 
    └── 📁prisma
        └── 📁migrations
        └── 📁schema 
            └── schema.prisma
            └── auth.prisma
            └── meeting.prisma
            ...
    └── 📁public // public assets
        └── 📁icons
    └── 📁types // typescript interfaces
    ...
```