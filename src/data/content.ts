// Single source of truth for portfolio content.
// Sources: public GitHub repos/READMEs and the owner's LinkedIn profile text (pasted by the owner).
// Confidential employer details (client names, volumes, internal systems) are intentionally NOT included.

export const profile = {
  name: 'Suman Jha',
  title: 'Data Analyst',
  headline: 'Business Intelligence & Process Automation · Procurement Analytics · GenAI Workflows',
  location: 'Gwalior, Madhya Pradesh, India',
  email: 'sumanjha0906@gmail.com',
  phone: '+91 78792 09587',
  phoneHref: 'tel:+917879209587',
  linkedin: 'https://www.linkedin.com/in/sumanjha-tech/',
  github: 'https://github.com/SumanJha-tech',
  company: 'Delta Analytics Pvt. Ltd.',
  resume: './Suman_Jha_Resume.pdf',
  photo: './suman.jpg',
}

export const about = [
  'Data Analyst with 1+ year of experience in supply chain and procurement data, ETL and process automation. I work on Purchase Order (PO) data pipelines that feed SAP-integrated systems for quick commerce, e-commerce and modern trade.',
  'I am skilled in SQL, Python, Excel and Power BI, turning raw data into actionable insights. Outside work I build GenAI projects, and I hold SAP and Oracle certifications.',
]

export const coreStack = ['SQL', 'Python', 'Power BI', 'Tableau', 'Selenium', 'BeautifulSoup', 'SAP', 'ETL', 'Generative AI', 'Agentic AI']

export const currently = [
  { label: 'Building', text: 'AI-driven data automation workflows (generative and agentic AI).' },
  { label: 'Learning', text: 'LLM applications, agentic AI workflows and AI-assisted development.' },
  { label: 'Open to', text: 'Data, Supply Chain, Quick Commerce, BI, Business and Risk Analyst roles. Available for remote, hybrid or on-site work, and happy to relocate anywhere in the world.' },
]

export const targetRoles = ['Data Analyst', 'Supply Chain Data Analyst', 'Quick Commerce Data Analyst', 'E-commerce Analyst', 'BI Analyst', 'Business Analyst', 'Risk Analyst']

export const domains = [
  { title: 'E-commerce', text: 'Vendor portals of online marketplaces and retailers: how purchase orders are published, what the order data contains, and how it changes from day to day.' },
  { title: 'Quick commerce', text: 'Vendor portals of quick-commerce platforms, where orders are frequent and fast-moving. I collect and validate this purchase-order data in my daily work.' },
  { title: 'Modern trade (MT)', text: 'Supermarket and retail-chain channels: their PO formats and portals, and how to bring them into one clean, consistent structure.' },
  { title: 'Supply chain', text: 'Procurement, inventory analytics and the purchase-order cycle from order received to order processed in SAP: capture, validation, loading, issue tracking and reporting.' },
]

export type Tag = 'Analytics' | 'SQL' | 'Python' | 'BI' | 'GenAI' | 'Automation' | 'ML'
export const allTags: Tag[] = ['Analytics', 'SQL', 'Python', 'BI', 'GenAI', 'Automation', 'ML']

export interface Project {
  id: string
  title: string
  kicker: string
  summary: string
  tags: Tag[]
  stack: string[]
  status: 'Live demo' | 'Source available' | 'Professional work' | 'In progress'
  dataNote: string
  facts: { label: string; value: string }[]
  demo?: string
  repo?: string
  repos?: { label: string; href: string }[]
  caseStudy?: string
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: 'weatherretail',
    title: 'WeatherRetail Intelligence',
    kicker: 'Retail · Demand planning',
    summary:
      'Which products sell more when it is hot, rainy or cold? This project measures it, then gives each store a 0–100 risk score that says what to reorder before the weather hits.',
    tags: ['Analytics', 'SQL', 'Python', 'BI'],
    stack: ['Python', 'PostgreSQL', 'SQL', 'pandas', 'SciPy', 'Streamlit', 'Plotly', 'pytest'],
    status: 'Live demo',
    dataNote: 'Sales are made-up (synthetic) data. Weather is real.',
    facts: [
      { label: 'Sales records', value: '35,088' },
      { label: 'Stores', value: '6' },
      { label: 'Tests', value: '10' },
    ],
    demo: 'https://weatherretail-intelligence.streamlit.app/',
    repo: 'https://github.com/SumanJha-tech/weatherretail-intelligence',
    caseStudy: 'weatherretail',
    featured: true,
  },
  {
    id: 'ai-analyst',
    title: 'AI Data Analyst Agent',
    kicker: 'Generative AI · Text-to-SQL',
    summary:
      'Type a business question in plain English. The app writes the SQL, runs it, and shows a table, a chart and a short explanation. It keeps working even if the AI is down.',
    tags: ['GenAI', 'SQL', 'Python', 'Analytics'],
    stack: ['Python', 'Gemini API', 'DuckDB', 'Streamlit', 'Plotly', 'pandas', 'pytest'],
    status: 'Live demo',
    dataNote: 'Uses the real public Olist e-commerce dataset.',
    facts: [
      { label: 'App pages', value: '5' },
      { label: 'Orders', value: '99,441' },
      { label: 'SQL retries', value: '2' },
    ],
    demo: 'https://ai-data-analyst-agent-ge2wddq5x2zrynlgqiffr5.streamlit.app/',
    repo: 'https://github.com/SumanJha-tech/ai-data-analyst-agent',
    caseStudy: 'ai-analyst',
    featured: true,
  },
  {
    id: 'po-automation',
    title: 'Purchase Order Automation',
    kicker: 'Professional work · Automation',
    summary:
      'Automated the daily collection of purchase orders from email and e-commerce portals, with validation and loading into a SAP-integrated system.',
    tags: ['Automation', 'Analytics', 'Python'],
    stack: ['Python', 'Selenium', 'BeautifulSoup', 'SAP', 'ETL', 'SQL'],
    status: 'Professional work',
    dataNote: 'Confidential work. No company, client or volume details are shared.',
    facts: [
      { label: 'Role', value: 'Data Analyst' },
      { label: 'Since', value: 'Jul 2025' },
      { label: 'Loads into', value: 'SAP' },
    ],
    caseStudy: 'po-automation',
    featured: true,
  },
  {
    id: 'bi-dashboards',
    title: 'Power BI & Tableau Dashboards',
    kicker: 'Business intelligence',
    summary: 'Four dashboards: Power BI for credit-card finance, online-shop sales and hospital data, and a Tableau sales dashboard you can drill from region to category to product. The repos include the data, workbook files and PDF exports.',
    tags: ['BI', 'SQL', 'Analytics'],
    stack: ['Power BI', 'Tableau', 'SQL', 'Excel'],
    status: 'Source available',
    dataNote: 'Public practice datasets.',
    facts: [
      { label: 'Dashboards', value: '4' },
      { label: 'Tools', value: 'Power BI + Tableau' },
    ],
    repos: [
      { label: 'Power BI code', href: 'https://github.com/SumanJha-tech/PowerBI-Dashboards' },
      { label: 'Tableau code', href: 'https://github.com/SumanJha-tech/Tableau-Dashboards' },
    ],
  },
  {
    id: 'scraper',
    title: 'E-commerce Price Scraper',
    kicker: 'Data collection',
    summary: 'Collects rice product prices and ratings from Amazon automatically, with logging and error handling. A BigBasket data source is simulated as a backup.',
    tags: ['Automation', 'Python'],
    stack: ['Python', 'Selenium', 'requests', 'pandas', 'BeautifulSoup'],
    status: 'Source available',
    dataNote: 'The BigBasket data is simulated, not live.',
    facts: [
      { label: 'Products', value: '50' },
      { label: 'Output', value: 'CSV + JSON' },
    ],
    repo: 'https://github.com/SumanJha-tech/E-commerce-Price-Scraper',
  },
  {
    id: 'ml',
    title: 'ML Case Studies',
    kicker: 'Machine learning',
    summary: 'Three applied machine-learning projects: how weather drives energy use across cities (a Flask web app with SQL storage), a real-time gender and age detector, and a start-up success predictor.',
    tags: ['ML', 'Python'],
    stack: ['Python', 'scikit-learn', 'Flask', 'OpenCV'],
    status: 'Source available',
    dataNote: 'Model accuracy is not documented in the repo yet, so none is shown.',
    facts: [
      { label: 'Projects', value: '3' },
      { label: 'Weather files', value: '50' },
      { label: 'App', value: 'Flask' },
    ],
    repo: 'https://github.com/SumanJha-tech/ML-Case-Studies',
  },
]

export interface CaseStudy {
  id: string
  title: string
  tabLabel: string
  simple: string
  oneLiner: string
  context: string
  problem: string
  data: string[]
  method: string[]
  stack: { layer: string; choice: string }[]
  implementation: string[]
  insights: { label: string; text: string }[]
  limitations: string[]
  recommendations: string[]
  diagram: 'weather' | 'agent' | 'po'
  links: { label: string; href: string }[]
  estimateNote?: string
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'weatherretail',
    title: 'WeatherRetail Intelligence',
    tabLabel: 'WeatherRetail',
    simple:
      'I built a system that measures how much hot, rainy or cold weather changes what people buy. It then gives every store a risk score from 0 to 100 that tells which products to reorder before they run out.',
    oneLiner: 'Which products sell more when the weather changes, and what should a store reorder this week?',
    context: 'A made-up retail chain, NorthStar Mart: 6 stores in 6 different climates, Jan 2023 to Dec 2024.',
    problem:
      'Store teams know weather changes sales, but nobody had measured which products, by how much, or which stores would run out of stock first. The goal: measure it and turn it into a clear action list.',
    data: [
      'Sales: 35,088 daily records, about $13.48M revenue. This data is made up (synthetic) so the project can be repeated exactly. It has a known weather effect built in, so I can test whether my method finds it.',
      'Weather: real daily weather and a 7-day forecast for each store city, from the free Open-Meteo service.',
      'One product group (Household Staples) has no weather effect on purpose. It is a "control" that helps catch false signals.',
    ],
    method: [
      'Clean the data and run quality checks (missing days, duplicates, impossible temperatures). All checks passed.',
      'For each product group, measure how closely sales follow the weather (correlation, r) and how many extra units sell per degree, mm of rain or cm of snow (slope).',
      'Risk score for the next 7 days = how unusual the forecast is × how weather-sensitive the product is × how low the shelf stock is. 60+ means reorder now; 30–59 means watch.',
      'Six SQL queries answer questions such as monthly trend, sales by temperature band, stockout rate and days of stock.',
    ],
    stack: [
      { layer: 'Database', choice: 'PostgreSQL (star schema)' },
      { layer: 'Analysis', choice: 'Python: pandas, NumPy, SciPy' },
      { layer: 'Dashboard', choice: 'Streamlit + Plotly, 4 pages' },
      { layer: 'Testing', choice: 'pytest, 10 tests' },
      { layer: 'Hosting', choice: 'Streamlit Cloud (reads a saved CSV copy)' },
    ],
    implementation: [
      'The pipeline runs in steps: collect, clean, check, load into PostgreSQL, analyse, show on the dashboard.',
      'If the weather service fails, it retries 3 times and then uses a saved backup.',
      'The public demo has no database. It reads a saved CSV copy, so it works for anyone with no setup.',
    ],
    insights: [
      { label: 'Six products clearly follow weather', text: 'Water, ice cream and sunscreen sell about 1.24 more units for each +1°C. Soup and jackets sell about 0.6 fewer. Umbrellas sell 0.86 more per mm of rain.' },
      { label: 'Stockouts are rare but concentrated', text: 'Only 0.49% of store-product-days ran out of stock, and about 90% of those were Outerwear and Hot Beverages.' },
      { label: 'The control product matters', text: 'Household Staples has no built-in weather effect but still shows r = 0.46, because temperature and sales both follow the seasons. A high score is a buy signal; a medium score needs a seasonality check first.' },
      { label: 'Snow is different', text: 'Snow gear has a low correlation (0.08) but a real effect of +0.76 units per cm. Snow days are rare, so plan for snow events, not the whole year.' },
    ],
    limitations: [
      'Sales are made up, so the numbers show the method works, not real-world results.',
      'It looks at one weather factor at a time and ignores holidays and price.',
      'The demo uses a frozen forecast snapshot where every risk score is 0, so it shows the logic, not a live reorder list.',
    ],
    recommendations: [
      'Start a weather-aware buy only for the six clearly sensitive product groups.',
      'Keep extra safety stock for Outerwear and Hot Beverages, where stockouts actually happen.',
      'Plan snow gear around snow events.',
      'Next step: use real store sales data, load new days automatically, and send an alert when a score crosses 60.',
    ],
    estimateNote: 'All sales figures come from synthetic data. Treat them as a modelled demonstration, not business results.',
    diagram: 'weather',
    links: [
      { label: 'Live demo', href: 'https://weatherretail-intelligence.streamlit.app/' },
      { label: 'Source on GitHub', href: 'https://github.com/SumanJha-tech/weatherretail-intelligence' },
    ],
  },
  {
    id: 'ai-analyst',
    title: 'AI Data Analyst Agent',
    tabLabel: 'AI Analyst Agent',
    simple:
      'You type a business question in plain English. The app writes the database query for you, runs it, and shows a table, a chart and a short explanation.',
    oneLiner: 'Ask a question in English, get the answer with the SQL shown.',
    context: 'A Streamlit web app on the public Olist Brazilian e-commerce dataset.',
    problem:
      'Managers often need answers from data but do not know SQL, and waiting for an analyst takes days. I wanted a chat tool that shows its work (the SQL) so answers can be trusted, and that does not break when the AI service is down.',
    data: [
      'Olist public marketplace data: about 99K orders in 6 tables (orders, customers, items, products, payments, reviews).',
      'Users can also upload their own CSV or Excel file and ask questions about it.',
    ],
    method: [
      'Read the real table and column names first, so the AI never guesses.',
      'Ask Gemini to write one SQL query. Run it on DuckDB. If it fails, send the error back and try again (up to 2 times).',
      'Pick a line, pie or bar chart based on the shape of the result, then write a short explanation.',
      'Anomaly Radar: scan the numbers for unusual values and explain which ones matter.',
    ],
    stack: [
      { layer: 'AI', choice: 'Gemini API, with retries and a fallback model' },
      { layer: 'Database', choice: 'DuckDB' },
      { layer: 'App', choice: 'Streamlit, Plotly, pandas' },
      { layer: 'Testing', choice: 'pytest with a mocked AI' },
    ],
    implementation: [
      'If the AI is busy, the app waits and retries. If it is still down, saved real answers are shown with a clear "demo answer" label.',
      'The status badge says "ready" only after a real live check.',
      'A real deploy bug (tables missing on a fresh install) was found and fixed by rebuilding tables from the CSVs at start-up.',
    ],
    insights: [
      { label: 'Late delivery hurts ratings', text: 'In the Olist data, late orders average 2.57 stars versus 4.29 for on-time orders. 8.1% of delivered orders were late. (See the Analytics Lab.)' },
      { label: 'Anomaly Radar found real oddities', text: 'It flagged freight cost near 15× the average and orders paid in up to 24 instalments.' },
    ],
    limitations: [
      'The anomaly check is statistical only and does not know business context.',
      'Chat memory covers the last four questions.',
      'Free AI services can be slow or unavailable, which is why demo mode exists.',
    ],
    recommendations: [
      'Always show the generated SQL next to the answer so people can check it.',
      'Before real company use, give the app read-only database access and an allowed-tables list.',
    ],
    diagram: 'agent',
    links: [
      { label: 'Live demo', href: 'https://ai-data-analyst-agent-ge2wddq5x2zrynlgqiffr5.streamlit.app/' },
      { label: 'Source on GitHub', href: 'https://github.com/SumanJha-tech/ai-data-analyst-agent' },
    ],
  },
  {
    id: 'po-automation',
    title: 'Purchase Order Automation',
    tabLabel: 'PO Automation',
    simple:
      'Automated the daily collection, validation and loading of purchase orders from email and e-commerce / quick-commerce portals into a SAP-integrated system.',
    oneLiner: 'Automating purchase-order intake, from source to SAP.',
    context: 'Current role as a Data Analyst, Jul 2025 to present. Shown at a high level: company, client and volume details are confidential.',
    problem:
      'Purchase orders reach the business by email and through e-commerce and quick-commerce portals, each in a different format. Handling them manually every day is slow, and any mistake flows into the order system. The goal was a reliable automated process from collection to loading.',
    data: [
      'Purchase orders for multiple client accounts.',
      'Sources: email attachments and the vendor portals of e-commerce, quick-commerce and modern-trade (MT) channels.',
    ],
    method: [
      'Collect: scripts pull orders from email and from the vendor portals using web scraping and crawling (Selenium, BeautifulSoup).',
      'Validate: check the data for accuracy before it is loaded.',
      'Load: push the validated orders into the SAP-integrated system every day.',
      'Monitor: track each run, investigate failures and fix them before they reach later steps.',
      'Report: SQL reports and Power BI / Tableau dashboards give stakeholders visibility.',
    ],
    stack: [
      { layer: 'Collection', choice: 'Python, Selenium, BeautifulSoup' },
      { layer: 'Data and reporting', choice: 'SQL, Power BI, Tableau' },
      { layer: 'Target system', choice: 'SAP-integrated order system' },
      { layer: 'Development', choice: 'Claude, ChatGPT, GitHub Copilot, Cursor' },
    ],
    implementation: [
      'Work on the end-to-end ETL that collects, validates and loads purchase orders into SAP-integrated client systems.',
      'Monitor production workflows across client accounts and use root cause analysis to fix failures quickly.',
      'Develop and maintain the scraping scripts, updating the logic as portal layouts and business rules change.',
      'Automate recurring manual tasks with scheduled jobs.',
      'Work with clients and cross-functional teams on requirements and EDI integration.',
    ],
    insights: [
      { label: 'Outcome', text: 'Orders move from source to SAP through an automated, monitored process rather than manual handling.' },
    ],
    limitations: [
      'Company and client names, order volumes and performance figures are confidential and not shown.',
      'The diagram shows the main stages only.',
    ],
    recommendations: ['Happy to discuss the approach in an interview, within what I am allowed to share.'],
    diagram: 'po',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sumanjha-tech/' },
    ],
  },
]

export interface SkillGroup { id: string; title: string; items: string[] }

// Skills come from the LinkedIn skills list plus what is used in the public repos.
export const skillGroups: SkillGroup[] = [
  { id: 'lang', title: 'Languages & databases', items: ['SQL', 'Python', 'MySQL', 'PostgreSQL', 'DuckDB'] },
  { id: 'data', title: 'Data & analytics', items: ['Excel', 'ETL', 'Data Analysis', 'Data Modeling', 'Data Validation', 'Data Cleaning', 'Regression', 'KPI Reporting', 'Machine Learning (scikit-learn)'] },
  { id: 'auto', title: 'Automation & tools', items: ['Pandas', 'NumPy', 'Selenium', 'BeautifulSoup', 'Web Scraping', 'Web Crawling', 'REST APIs', 'JSON', 'Scheduled jobs', 'EDI integration', 'Git', 'Command line (CLI)'] },
  { id: 'bi', title: 'Visualization & BI', items: ['Power BI', 'Tableau', 'Data Visualization', 'Dashboards', 'Plotly', 'Streamlit'] },
  { id: 'ai', title: 'AI', items: ['Generative AI', 'Agentic AI', 'LLM APIs', 'Prompt Engineering', 'Text-to-SQL', 'LangChain', 'MCP', 'AI-assisted development'] },
  { id: 'core', title: 'Core strengths', items: ['Root Cause Analysis', 'Process Optimization', 'Stakeholder Communication', 'Problem Solving'] },
]

export const experience = {
  role: 'Data Analyst',
  company: 'Delta Analytics Pvt. Ltd.',
  sub: 'SaaS commerce intelligence platform · PO automation and e-commerce data',
  period: 'Jul 2025 – Present',
  type: 'Full-time · Remote · Gurugram, Haryana',
  bullets: [
    'Work on end-to-end ETL pipelines (Python, SQL) that extract, validate and load purchase order (PO) data from email and vendor portals into SAP-integrated client systems.',
    'Monitor production workflows across multiple client accounts, diagnosing failures through root cause analysis to keep data accurate and on schedule.',
    'Develop and maintain Python scripts (Selenium, BeautifulSoup) for web scraping and data extraction across varied portal structures, updating logic as business rules change.',
    'Write SQL queries on relational databases for data validation, data quality and reporting.',
    'Automate several recurring manual tasks with scheduled jobs, improving process efficiency.',
    'Collaborate with clients and cross-functional teams on requirement gathering and EDI integration.',
    'Use GenAI tools (Claude, Copilot, Cursor) and explore Agentic AI to accelerate automation.',
  ],
}

export const education = {
  degree: 'B.Tech, Computer Software Engineering',
  school: 'ITM University, Gwalior',
  period: 'Sep 2021 – Jun 2025',
  detail: 'CGPA 8.07 · Specialisation in Data Science and Machine Learning',
  note: 'Built hands-on skills in analytics, automation and BI through academic projects and virtual internships, including procurement automation, web scraping and Power BI / Tableau dashboards.',
}

export const certifications = [
  { name: 'SAP Certified – Process Data Analyst – SAP Signavio', issuer: 'SAP', date: 'Issued Sep 2026', url: 'https://www.credly.com/badges/c231586e-8f59-40af-815e-9f38e34bdf82' },
  { name: 'Agentic AI Certified Foundations Associate', issuer: 'Oracle', date: 'Issued Jul 2026', url: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=F26F95DC58E974F8FC0919D417BBC1F5B48DEFB776A745ACF982F4FD714E3356' },
  { name: 'Salesforce Certified Platform Developer I', issuer: 'Salesforce', date: 'Issued May 2024' },
  { name: 'Data Science Master Virtual Internship', issuer: 'Altair', date: 'Issued Jun 2024' },
  { name: 'Salesforce Certified Administrator', issuer: 'Salesforce', date: 'Issued Dec 2023' },
  { name: 'Data Analytic Process Automation', issuer: 'AICTE', date: 'Issued Feb 2023' },
  { name: 'Python for Data Science', issuer: 'IBM', date: 'Issued Jul 2022' },
]
