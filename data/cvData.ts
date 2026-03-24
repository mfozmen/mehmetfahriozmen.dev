export interface CvProject {
  name: string;
  description: string;
  url?: string;
}

export interface CvRole {
  title: string;
  date: string;
  description?: string;
  bullets?: string[];
}

export interface CvSubEntry {
  role: string;
  date: string;
  company: string;
  companyUrl?: string;
  description?: string;
  bullets?: string[];
  chips: string[];
}

export interface CvExperienceEntry {
  role: string;
  date: string;
  company: string;
  companyUrl?: string;
  roles?: CvRole[];
  description?: string;
  subEntry?: CvSubEntry;
  projects?: CvProject[];
  chips?: string[];
}

export interface CvSkillCategory {
  label: string;
  items: string[];
}

export interface CvCoordinate {
  label: string;
  value: string;
  href?: string;
}

export const cvExperience: CvExperienceEntry[] = [
  {
    role: "Head of Software Technologies",
    date: "Dec 2024 — Dec 2025",
    company: "Mayadem",
    companyUrl: "https://mayadem.com",
    roles: [
      {
        title: "Head of Software Technologies",
        date: "Nov 2025 — Dec 2025",
        bullets: [
          "Led cross-functional backend, frontend, QA, and UI/UX teams while actively contributing to backend architecture and production system design",
          "Participated in technical solution design and peer code reviews to ensure scalability and maintainability of backend services",
          "Drove complete product lifecycle from conception to deployment, ensuring alignment between technical execution and business objectives",
          "Established engineering best practices, coding standards, and quality assurance processes across all disciplines",
          "Managed hiring, onboarding, performance evaluations, and career development for engineering team members",
        ],
      },
      {
        title: "Head of Backend Engineering",
        date: "Dec 2024 — Nov 2025",
        bullets: [
          "Built backend engineering teams from scratch for MagicPags and ÇokNet, personally conducting all hiring processes and recruiting top talent",
          "Designed and led the implementation of microservices architecture using .NET, Kafka, PostgreSQL, Hasura, and PHP Laravel on AWS",
          "Contributed to business analysis, project planning, and cross-team coordination, supporting both technical and non-technical departments",
          "Managed engineers from several departments including UI/UX, QA, and frontend, ensuring smooth end-to-end delivery",
          "Designed and led comprehensive CI/CD pipelines for frontend monorepos and backend microservices",
          "Promoted test-driven development (TDD) practices and established observability standards for system robustness",
        ],
      },
    ],
    projects: [
      {
        name: "MagicPags",
        description: "Educational audiobook, analytics, child-safe delivery",
        url: "https://magicpags.com/",
      },
      {
        name: "Çoknet",
        description:
          "Exam prep, microservices architecture, multi-discipline team",
        url: "https://app.cok.net.tr/",
      },
    ],
    chips: [
      ".NET",
      "Kafka",
      "PostgreSQL",
      "Hasura",
      "AWS",
      "Laravel",
      "Grafana",
      "Prometheus",
      "Clickhouse",
      "CI/CD",
    ],
  },
  {
    role: "Software Engineering Manager",
    date: "Aug 2019 — Sep 2024",
    company: "Brew Interactive",
    companyUrl: "https://brewww.com/",
    roles: [
      {
        title: "Software Engineering Manager",
        date: "Dec 2022 — Sep 2024",
        bullets: [
          "Designed and delivered event-driven microservices for high-traffic transactional systems for major clients in Turkey and globally",
          "Led the migration of legacy backend systems from monolithic architecture to microservices in live production environments",
          "Contributed to system architecture design and backend data modeling",
          "Implemented CI/CD pipelines and containerized services using Docker and Kubernetes",
          "Led Agile sprint planning, system architecture design, and data modeling while maintaining TDD principles",
          "Fully responsible for professional development, hiring, performance evaluations, and career progression for team members",
          "Developed internal open-source solutions for reusability across multiple client projects, enhancing operational efficiency",
          "Performed peer code reviews to ensure maintainability and delivery quality",
          "Supported hiring, professional development and mentoring of backend and DevOps team of 4-6 engineers",
        ],
      },
      {
        title: "Senior Backend Developer",
        date: "Aug 2019 — Dec 2022",
        bullets: [
          "Developed serverless functions and microservices for major international clients including decktopus.com and foodservicedirect.com",
          "Implemented CI/CD pipelines and containerized applications using Docker, Kubernetes, and various orchestration tools",
          "Built custom Magento modules for major e-commerce project, enhancing platform capabilities and user experience",
          "Collaborated in Agile Scrum environment, consistently delivering high-quality code following TDD methodology",
        ],
      },
    ],
    subEntry: {
      role: "Senior Backend Developer",
      date: "Jan 2021 — Dec 2022",
      company: "BeforeSunset AI",
      companyUrl: "https://beforesunset.ai",
      bullets: [
        "Developed backend services using Node.js and created APIs with Hasura for efficient GraphQL data interactions",
        "Designed PostgreSQL database schema and managed deployment within Docker containers on Kubernetes",
      ],
      chips: [
        "Node.js",
        "GraphQL",
        "PostgreSQL",
        "Docker",
        "Kubernetes",
        "DigitalOcean",
      ],
    },
    projects: [
      {
        name: "Mobilet",
        description:
          "Event ticketing platform with campaign engine, QR gate entry, and multi-channel payment processing serving millions",
        url: "https://mobilet.com",
      },
      {
        name: "VillaSepeti",
        description:
          "Vacation rental marketplace with automated search engine powered by set theory, replacing manual filtering",
        url: "https://villasepeti.com",
      },
      {
        name: "Shubuo",
        description:
          "Digital advertising platform with intelligent ad scheduling optimizing delivery against contracts in real-time",
        url: "https://shubuo.net/",
      },
      {
        name: "Decktopus AI",
        description:
          "Presentation platform with serverless architecture, real-time subscriptions, and event-driven workflows",
        url: "https://decktopus.ai",
      },
      {
        name: "FoodServiceDirect",
        description: "Large-scale food commerce platform",
        url: "https://foodservicedirect.com/",
      },
      {
        name: "İhtiyaç Haritası - Sosyal Pazaryeri",
        description: "Social impact platform",
        url: "https://sosyalpazaryeri.ihtiyacharitasi.org/",
      },
      {
        name: "Room3D (now Holoh)",
        description:
          "Spatial meeting platform placing participants in lifelike 3D environments, used for remote courtrooms and government services",
        url: "https://holoh.com/",
      },
      {
        name: "20 Megatons",
        description:
          "Carrefour's climate action platform tracking greenhouse gas reduction commitments across 90+ global supplier partners",
        url: "https://20megatons.com/",
      },
    ],
    chips: [
      "Node.js",
      ".NET",
      "Java",
      "SQL/NoSQL",
      "Rest/GraphQL",
      "Docker",
      "Kubernetes",
      "Cloud",
      "CI/CD",
    ],
  },
  {
    role: "Senior Software Engineer",
    date: "May 2019 — Jul 2019",
    company: "Datagen Bilişim",
    companyUrl: "https://datagen.com.tr/",
    roles: [
      { title: "Senior Software Engineer", date: "May 2019 — Jul 2019", bullets: [
        "Developed sales automation system for Peyman Kuruyemiş, one of Turkey's leading snack food companies — Android application and backend services with MSSQL database programming",
        "Implemented database programming on MSSQL Server using T-SQL for enterprise mobile application",
      ] },
    ],
    chips: ["C#", "Xamarin", "MSSQL"],
  },
  {
    role: "Senior Software Engineer",
    date: "Jun 2018 — Apr 2019",
    company: "Ptt Trade",
    roles: [
      { title: "Senior Software Engineer", date: "Jun 2018 — Apr 2019", bullets: [
        "Built backend services for ptttrade.com foreign trade portal using Node.js, .NET Core, and Golang",
        "Developed search engine using Elasticsearch and maintained multiple mobile and web applications",
      ] },
    ],
    chips: ["Golang", "Node.js", "Elasticsearch", ".NET Core"],
  },
];

export const cvEarlierRoles: CvExperienceEntry[] = [
  {
    role: "Senior Software Engineer",
    date: "Jan 2013 — Jun 2018",
    company: "Veriyaz Yazılım",
    companyUrl: "https://veriyaz.com/",
    roles: [
      { title: "Senior Software Engineer", date: "Jan 2015 — Jun 2018", description: "Led backend and frontend development of a CRM platform for SMEs. Built vehicle tracking, computer monitoring, document management, and bulk mail systems using .NET, with real-time tracking via TCP/IP and WebSocket." },
      { title: "Software Engineer", date: "Jan 2013 — Jan 2015", description: "Contributed to the development of the CRM platform, implementing core features and integrating with AWS and Azure services." },
    ],
    chips: ["C# / .NET", "MSSQL", "AWS", "WebSocket"],
  },
  {
    role: "Software Engineer",
    date: "Sep 2012 — Jan 2013",
    company: "Erik Bilişim",
    roles: [
      { title: "Software Engineer", date: "Sep 2012 — Jan 2013", description: "Contributed to the development of a web application for the logistics sector. Developed backend web services for mobile applications and SMS systems." },
    ],
  },
  {
    role: "Intern",
    date: "Sep 2010 — Oct 2010",
    company: "TRT",
    companyUrl: "https://trt.net.tr/",
    roles: [
      { title: "Intern", date: "Sep 2010 — Oct 2010", description: "Maintained and repaired personnel computers and servers at the TRT İzmir Directorate." },
    ],
  },
  {
    role: "Intern",
    date: "Jul 2009 — Aug 2009",
    company: "Izmir Metropolitan Municipality",
    companyUrl: "https://izmir.bel.tr/",
    roles: [
      { title: "Intern", date: "Jul 2009 — Aug 2009", description: "Maintained technical equipment and network infrastructure at Izmir Metropolitan Municipality." },
    ],
  },
];

export const cvSkills: CvSkillCategory[] = [
  {
    label: "Backend",
    items: [
      "Node.js",
      "TypeScript",
      "PHP",
      "Laravel",
      ".NET / C#",
      "Golang",
      "GraphQL",
      "REST",
    ],
  },
  {
    label: "Infrastructure",
    items: [
      "AWS",
      "GCP",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "Redis",
      "RabbitMQ",
      "Kafka",
    ],
  },
  {
    label: "Data",
    items: ["PostgreSQL", "MongoDB", "MySQL", "MSSQL", "Elasticsearch"],
  },
  {
    label: "Leadership",
    items: [
      "Team building",
      "Hiring",
      "Mentoring",
      "Agile",
      "Code review culture",
    ],
  },
];

export const cvCoordinates: CvCoordinate[] = [
  { label: "Location", value: "İzmir, Turkey" },
  {
    label: "Email",
    value: "mehmetfahriozmen@gmail.com",
    href: "mailto:mehmetfahriozmen@gmail.com",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/mfozmen",
    href: "https://linkedin.com/in/mfozmen",
  },
  {
    label: "GitHub",
    value: "github.com/mfozmen",
    href: "https://github.com/mfozmen",
  },
];
