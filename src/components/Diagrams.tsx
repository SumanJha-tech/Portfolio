// Architecture diagrams drawn from each project's README / workflow description.
type BoxProps = { x: number; y: number; w?: number; h?: number; title: string; sub?: string; tone?: 'green' | 'plain' | 'ochre' }

const fills = { green: ['#dbe7f6', '#1d4f91'], plain: ['#fffdf8', '#cfc8b4'], ochre: ['#f4ead3', '#a9772a'] } as const

function Box({ x, y, w = 150, h = 62, title, sub, tone = 'plain' }: BoxProps) {
  const [fill, stroke] = fills[tone]
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={fill} stroke={stroke} strokeWidth={1.3} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 3 : h / 2 + 5)} textAnchor="middle" fontSize={13.5} fontWeight={600}>{title}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 15} textAnchor="middle" fontSize={11.5} style={{ fill: '#5f645f' }}>{sub}</text>}
    </g>
  )
}

function Arrow({ d, dashed }: { d: string; dashed?: boolean }) {
  return <path d={d} fill="none" stroke="#5f645f" strokeWidth={1.4} strokeDasharray={dashed ? '5 4' : undefined} markerEnd="url(#ah)" />
}

function Defs() {
  return (
    <defs>
      <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 10 5 0 10z" fill="#5f645f" />
      </marker>
    </defs>
  )
}

export function WeatherDiagram() {
  return (
    <svg viewBox="0 0 960 300" role="img" aria-labelledby="dw-t dw-d">
      <title id="dw-t">WeatherRetail architecture</title>
      <desc id="dw-d">Synthetic sales and Open-Meteo weather are cleaned and quality-checked, loaded into a PostgreSQL star schema, analysed with SQL views and Python, and shown in a Streamlit dashboard. A CSV snapshot replaces PostgreSQL on the hosted app.</desc>
      <Defs />
      <Box x={10} y={40} title="Sales generator" sub="synthetic, seed 42" tone="ochre" />
      <Box x={10} y={150} title="Open-Meteo" sub="history + 7-day forecast" />
      <Box x={215} y={95} w={150} title="Clean + quality gate" sub="6 check types" />
      <Box x={420} y={95} w={165} title="PostgreSQL" sub="star schema, 3 dim + 3 fact" tone="green" />
      <Box x={640} y={40} title="SQL views" sub="6 analysis queries" />
      <Box x={640} y={150} title="Python analytics" sub="r, slope, risk score" />
      <Box x={810} y={95} w={140} title="Streamlit" sub="4 pages" tone="green" />
      <Box x={420} y={225} w={165} h={54} title="CSV snapshot" sub="used on hosted demo" tone="ochre" />
      <Arrow d="M160 71 L215 118" /><Arrow d="M160 181 L215 128" />
      <Arrow d="M365 126 L420 126" /><Arrow d="M585 118 L640 74" /><Arrow d="M585 134 L640 176" />
      <Arrow d="M790 71 L810 112" /><Arrow d="M790 181 L810 138" />
      <Arrow dashed d="M585 252 C 760 252 880 230 880 160" />
    </svg>
  )
}

export function AgentDiagram() {
  return (
    <svg viewBox="0 0 960 250" role="img" aria-labelledby="da-t da-d">
      <title id="da-t">AI Data Analyst Agent flow</title>
      <desc id="da-d">A question plus the live database schema and recent chat history go to Gemini, which writes SQL. DuckDB runs it, and on error the message is sent back for up to two retries. The result is charted and explained.</desc>
      <Defs />
      <Box x={10} y={80} w={130} title="Question" sub="plain English" />
      <Box x={170} y={80} w={150} title="Schema + history" sub="live DB, last 4 turns" />
      <Box x={350} y={80} w={130} title="Gemini" sub="writes ONE SQL query" tone="green" />
      <Box x={510} y={80} w={130} title="DuckDB" sub="runs the query" />
      <Box x={670} y={80} w={130} title="Chart + insight" sub="auto chart, summary" tone="green" />
      <Box x={830} y={80} w={120} title="Chat turn" sub="remembered" />
      <Box x={440} y={185} w={260} h={48} title="Error? send back, retry up to 2×" tone="ochre" />
      <Box x={170} y={185} w={230} h={48} title="Gemini down? demo mode" sub="saved real answers" tone="ochre" />
      <Arrow d="M140 111 L170 111" /><Arrow d="M320 111 L350 111" /><Arrow d="M480 111 L510 111" />
      <Arrow d="M640 111 L670 111" /><Arrow d="M800 111 L830 111" />
      <Arrow dashed d="M575 142 L575 185" /><Arrow dashed d="M440 209 C 410 209 415 150 415 142" />
    </svg>
  )
}

export function PoDiagram() {
  return (
    <svg viewBox="0 0 960 230" role="img" aria-labelledby="dp-t dp-d">
      <title id="dp-t">Purchase order ETL workflow</title>
      <desc id="dp-d">Purchase orders from email and e-commerce or quick-commerce portals are collected, validated, and loaded daily into a SAP-integrated system, with monitoring and reporting around the cycle.</desc>
      <Defs />
      <Box x={10} y={30} w={170} title="Email" sub="PO attachments" />
      <Box x={10} y={125} w={170} title="E-commerce / quick commerce" sub="platform portals" />
      <Box x={250} y={78} w={150} title="Collect" sub="Python, Selenium, BS4" tone="green" />
      <Box x={460} y={78} w={150} title="Validate" sub="accuracy checks" tone="green" />
      <Box x={670} y={78} w={150} title="Load daily" sub="SAP-integrated system" tone="green" />
      <Box x={460} y={170} w={360} h={50} title="Monitor + report" sub="issue fixing, SQL / Power BI / Tableau" tone="ochre" />
      <Arrow d="M180 61 L250 98" /><Arrow d="M180 156 L250 124" />
      <Arrow d="M400 109 L460 109" /><Arrow d="M610 109 L670 109" />
      <Arrow dashed d="M745 140 L745 170" />
    </svg>
  )
}
