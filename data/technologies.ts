export type TechnologyCategory = {
  id: string;
  name: string;
  technologies: string[];
};

export const technologyCategories: TechnologyCategory[] = [
  { id: "databases", name: "Databases", technologies: ["PostgreSQL", "MySQL", "MSSQL", "Redis", "Couchbase"] },
  { id: "search", name: "Search", technologies: ["Elasticsearch", "Meilisearch", "Typesense", "Algolia"] },
  { id: "cloud", name: "Cloud", technologies: ["AWS", "Azure", "DigitalOcean"] },
  { id: "devops", name: "DevOps", technologies: ["Docker", "Kubernetes", "CircleCI", "Bitbucket Pipelines", "GitHub Actions", "Vercel"] },
  { id: "api", name: "API", technologies: ["Hasura", "Directus", "Supabase", "GraphQL", "REST", "WebSocket"] },
  { id: "architecture", name: "Architecture", technologies: ["Event-Driven", "CQRS", "Microservices", "Monolith", "Monorepo"] },
  { id: "messaging", name: "Messaging", technologies: ["RabbitMQ", "Kafka", "Redis Pub/Sub", "AWS SQS/SNS"] },
  { id: "frameworks", name: "Frameworks", technologies: ["NestJS / TypeScript", "Node.js / JavaScript", "Laravel / PHP", "Spring Boot / Java", ".NET / C#", "Magento / PHP", "Golang"] },
  { id: "monitoring", name: "Monitoring", technologies: ["Grafana", "Elasticsearch"] },
  { id: "data_analysis", name: "Data Analysis", technologies: ["ClickHouse", "AWS Glue", "Airflow", "Superset", "SSIS"] },
  { id: "methodologies", name: "Methodologies", technologies: ["Agile/Scrum", "TDD", "BDD"] },
];
