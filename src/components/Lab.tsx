import { useMemo, useState, type ReactNode } from 'react'
import { Bar, BarChart, CartesianGrid, ComposedChart, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import lab from '../data/lab.json'

const wr = lab.weatherRetail
const ol = lab.olist

const GREEN = '#1d4f91', OCHRE = '#c48a2c', SLATE = '#41697f', CLAY = '#b4533e'
const PALETTE = [GREEN, OCHRE, SLATE, CLAY, '#5b7f9c', '#7a6a9a', '#3f8a8a', '#8a7a3a']
const AXIS = { fontSize: 12, fill: '#5f645f' }
const TIP = { contentStyle: { background: '#ffffff', border: '1px solid #e0cfae', borderRadius: 10, fontSize: 13 }, labelStyle: { fontWeight: 600 } }

const driverLabel: Record<string, string> = { temp_max_c: 'Daily high (°C)', precipitation_mm: 'Precipitation (mm)', snowfall_cm: 'Snowfall (cm)' }
const money = (n: number) => (n >= 1e6 ? `$${(n / 1e6).toFixed(2)}M` : n >= 1e3 ? `$${(n / 1e3).toFixed(0)}K` : `$${n}`)
const pretty = (s: string) => s.replace(/_/g, ' ')

type Col = { key: string; label: string; fmt?: (v: never) => string }

function DataTable({ rows, cols }: { rows: Record<string, string | number>[]; cols: Col[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button className="toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>{open ? 'Hide data table' : 'Show data table'}</button>
      {open && (
        <div className="data-table-wrap" tabIndex={0} role="region" aria-label="Chart data table">
          <table className="data-table">
            <thead><tr>{cols.map((c) => <th key={c.key} scope="col">{c.label}</th>)}</tr></thead>
            <tbody>{rows.map((r, i) => <tr key={i}>{cols.map((c) => <td key={c.key}>{String(r[c.key])}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function Chart({ label, children }: { label: string; children: ReactNode }) {
  return <div className="chart-box" role="img" aria-label={label}><ResponsiveContainer width="100%" height="100%">{children as never}</ResponsiveContainer></div>
}

function Source({ kind, children }: { kind: 'syn' | 'real'; children: ReactNode }) {
  return <p className="source"><span className={`src-tag ${kind}`}>{kind === 'syn' ? 'Synthetic sales + real weather' : 'Real public data'}</span>{children}</p>
}

/* ---- 1. Sensitivity ---- */
function Sensitivity() {
  const [cat, setCat] = useState(wr.categories[0].category)
  const c = wr.categories.find((x) => x.category === cat)!
  const data = c.bins.map((b) => ({ x: b.x, units: b.units, fit: +(c.slope * b.x + c.intercept).toFixed(2), n: b.n }))
  const unit = driverLabel[c.driver]
  const strong = c.label === 'High'
  return (
    <div>
      <div className="lab-head">
        <div>
          <h3>Weather sensitivity explorer</h3>
          <p>Average units sold per store-day, grouped into weather bands, with the fitted OLS line. Pick a category to see how strongly demand follows its weather driver.</p>
        </div>
        <label className="field">Category
          <select value={cat} onChange={(e) => setCat(e.target.value)}>{wr.categories.map((x) => <option key={x.category}>{x.category}</option>)}</select>
        </label>
      </div>
      <div className="stat-row">
        <div className="kpi"><b>{c.r > 0 ? '+' : '−'}{Math.abs(c.r).toFixed(3)}</b><span>Pearson r</span></div>
        <div className="kpi"><b>{c.slope > 0 ? '+' : '−'}{Math.abs(c.slope).toFixed(2)}</b><span>units per 1 {unit.match(/\((.*)\)/)?.[1]}</span></div>
        <div className="kpi"><b>{c.label}</b><span>sensitivity label</span></div>
        <div className="kpi"><b>{c.stockout_rate}%</b><span>stockout rate (days)</span></div>
      </div>
      <Chart label={`${c.category}: average units sold by ${unit} band. Correlation ${c.r}.`}>
        <ComposedChart data={data} margin={{ top: 8, right: 12, bottom: 22, left: 0 }}>
          <CartesianGrid stroke="#efe3cc" vertical={false} />
          <XAxis dataKey="x" tick={AXIS} tickFormatter={(v) => String(Math.round(v * 10) / 10)} label={{ value: unit, position: 'insideBottom', offset: -12, fontSize: 12, fill: '#5f645f' }} />
          <YAxis tick={AXIS} width={44} label={{ value: 'Avg units / store-day', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#5f645f', dy: 56 }} />
          <Tooltip {...TIP} formatter={(v, n) => [Number(v).toFixed(1), n === 'units' ? 'Avg units' : 'Fitted line']} labelFormatter={(v) => `${unit}: ${Number(v).toFixed(1)}`} />
          <Bar dataKey="units" fill={GREEN} fillOpacity={0.85} radius={[4, 4, 0, 0]} name="units" />
          <Line dataKey="fit" stroke={OCHRE} strokeWidth={2.5} dot={false} name="fit" />
        </ComposedChart>
      </Chart>
      <p className="callout">
        {strong
          ? <><b>High sensitivity.</b> Demand moves visibly with {unit.toLowerCase()}, so this category is a candidate for a weather-aware buy.</>
          : c.category.includes('control')
            ? <><b>Control category.</b> Generated with no weather effect, yet it still scores r = {c.r} because temperature and demand both follow the season. This is why a one-variable correlation needs a seasonality check.</>
            : <><b>Low correlation, real slope.</b> Snow days are rare, so most of the series is zeros. Plan snow gear around snow events rather than the full-series correlation.</>}
      </p>
      <DataTable
        cols={[{ key: 'x', label: unit }, { key: 'units', label: 'Avg units' }, { key: 'fit', label: 'Fitted' }, { key: 'n', label: 'Store-days' }]}
        rows={data}
      />
      <Source kind="syn">Recomputed from the committed snapshot in the WeatherRetail repo; r and slope match the repo's published sensitivity table. Sales are generated with a known weather effect, so this shows the method recovering it, not a real-world finding.</Source>
    </div>
  )
}

/* ---- 2. Seasonality ---- */
function Seasonality() {
  const names = wr.categories.map((c) => c.category)
  const [sel, setSel] = useState<string[]>(['Ice Cream & Frozen Treats', 'Outerwear & Jackets', 'Umbrellas & Rain Gear'])
  const toggle = (n: string) => setSel((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n]))
  const rows = wr.monthly as unknown as Record<string, number | string>[]
  return (
    <div>
      <div className="lab-head">
        <div>
          <h3>Seasonal revenue by category</h3>
          <p>Monthly revenue across all six stores. Select categories to compare how their seasons line up and diverge.</p>
        </div>
      </div>
      <fieldset style={{ border: 0, padding: 0, margin: '0 0 12px' }}>
        <legend className="sr-only">Categories to plot</legend>
        <div className="check-row">
          {names.map((n, i) => (
            <label key={n}><input type="checkbox" checked={sel.includes(n)} onChange={() => toggle(n)} /><span className="swatch" style={{ background: PALETTE[i] }} aria-hidden="true" />{n}</label>
          ))}
        </div>
      </fieldset>
      {sel.length === 0 ? <p className="empty">Select at least one category to draw the chart.</p> : (
        <Chart label={`Monthly revenue lines for ${sel.join(', ')} over 24 months.`}>
          <LineChart data={rows} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
            <CartesianGrid stroke="#efe3cc" vertical={false} />
            <XAxis dataKey="month" tick={AXIS} interval={2} />
            <YAxis tick={AXIS} width={52} tickFormatter={(v) => money(v)} />
            <Tooltip {...TIP} formatter={(v) => money(Number(v))} />
            <Legend wrapperStyle={{ fontSize: 12.5 }} />
            {names.map((n, i) => sel.includes(n) && <Line key={n} dataKey={n} stroke={PALETTE[i]} strokeWidth={2.2} dot={false} />)}
          </LineChart>
        </Chart>
      )}
      <DataTable
        cols={[{ key: 'month', label: 'Month' }, ...sel.map((n) => ({ key: n, label: n }))]}
        rows={rows}
      />
      <Source kind="syn">Aggregated from fact_sales in the repo snapshot (35,088 rows, $13.48M). Seasonal waves are partly planted by the generator.</Source>
    </div>
  )
}

/* ---- 3. Stockouts ---- */
function Stockouts() {
  const { cities, categories, values } = wr.stockoutHeat
  const max = Math.max(...values.flat())
  return (
    <div>
      <div className="lab-head">
        <div>
          <h3>Where the sale is lost</h3>
          <p>Share of days with a stockout, by store and category. Darker cells mean more lost-sale days. Values are printed in every cell.</p>
        </div>
      </div>
      <div className="stat-row">
        <div className="kpi"><b>{wr.totals.stockout_rate}%</b><span>of store-category-days</span></div>
        <div className="kpi"><b>{wr.totals.stockout_days}</b><span>stockout days in total</span></div>
        <div className="kpi"><b>~90%</b><span>of stockouts: Outerwear + Hot Beverages</span></div>
      </div>
      <div className="data-table-wrap" tabIndex={0} role="region" aria-label="Stockout rate heat table by store and category" style={{ maxHeight: 'none' }}>
        <table className="heat">
          <thead><tr><th scope="col">Store city</th>{categories.map((c) => <th key={c} scope="col">{c.replace(' (control)', '')}</th>)}</tr></thead>
          <tbody>
            {cities.map((city, i) => (
              <tr key={city}>
                <th scope="row">{city}</th>
                {values[i].map((v, j) => (
                  <td key={j} style={{ background: v === 0 ? '#f3efe4' : `rgba(168,80,58,${0.14 + (v / max) * 0.6})`, color: '#23262b' }}>{v === 0 ? '0' : v.toFixed(1)}%</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="callout"><b>Reading it.</b> Outerwear and Hot Beverages account for roughly 90% of stockout days (about 155 of 173), and they are also two of the most weather-sensitive categories. That is the expensive combination: demand spikes on cold days exactly when the shelf is empty.</p>
      <Source kind="syn">Computed from fact_sales.stockout_flag in the repo snapshot. Inventory and replenishment are simulated (Monday replenishment at 110% of mean weekly demand).</Source>
    </div>
  )
}

/* ---- 4. Marketplace ---- */
type View = 'orders' | 'categories' | 'reviews' | 'states' | 'payments'
function Marketplace() {
  const [view, setView] = useState<View>('orders')
  const [metric, setMetric] = useState<'days' | 'late'>('days')
  const t = ol.totals
  const chart = useMemo(() => {
    switch (view) {
      case 'orders':
        return {
          label: 'Delivered orders per month, 2017 to August 2018, rising over time.',
          el: <LineChart data={ol.monthlyOrders} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}><CartesianGrid stroke="#efe3cc" vertical={false} /><XAxis dataKey="month" tick={AXIS} interval={2} /><YAxis tick={AXIS} width={48} /><Tooltip {...TIP} /><Line dataKey="orders" stroke={GREEN} strokeWidth={2.4} dot={false} name="Delivered orders" /></LineChart>,
          cols: [{ key: 'month', label: 'Month' }, { key: 'orders', label: 'Delivered orders' }], rows: ol.monthlyOrders,
        }
      case 'categories': {
        const rows = ol.topCategories.map((c) => ({ ...c, category: pretty(c.category) }))
        return {
          label: 'Top 10 product categories by item revenue.',
          el: <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 24 }}><CartesianGrid stroke="#efe3cc" horizontal={false} /><XAxis type="number" tick={AXIS} tickFormatter={(v) => `R$${(v / 1e3).toFixed(0)}K`} /><YAxis type="category" dataKey="category" tick={AXIS} width={130} /><Tooltip {...TIP} formatter={(v) => `R$${Number(v).toLocaleString()}`} /><Bar dataKey="revenue" fill={GREEN} radius={[0, 4, 4, 0]} name="Item revenue" /></BarChart>,
          cols: [{ key: 'category', label: 'Category (Portuguese)' }, { key: 'revenue', label: 'Item revenue (R$)' }, { key: 'items', label: 'Items sold' }], rows,
        }
      }
      case 'reviews':
        return {
          label: 'Review score distribution from 1 to 5 stars.',
          el: <BarChart data={ol.reviewDist} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}><CartesianGrid stroke="#efe3cc" vertical={false} /><XAxis dataKey="score" tick={AXIS} tickFormatter={(v) => `${v}★`} /><YAxis tick={AXIS} width={52} /><Tooltip {...TIP} /><Bar dataKey="reviews" fill={OCHRE} radius={[4, 4, 0, 0]} name="Reviews" /></BarChart>,
          cols: [{ key: 'score', label: 'Stars' }, { key: 'reviews', label: 'Reviews' }], rows: ol.reviewDist,
        }
      case 'states': {
        const key = metric === 'days' ? 'days' : 'late'
        return {
          label: `Top 10 states by orders, showing ${metric === 'days' ? 'average days to deliver' : 'percent of orders delivered late'}.`,
          el: <BarChart data={ol.states} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}><CartesianGrid stroke="#efe3cc" vertical={false} /><XAxis dataKey="state" tick={AXIS} /><YAxis tick={AXIS} width={44} unit={metric === 'late' ? '%' : ''} /><Tooltip {...TIP} formatter={(v) => (metric === 'late' ? `${v}%` : `${v} days`)} /><Bar dataKey={key} fill={metric === 'days' ? SLATE : CLAY} radius={[4, 4, 0, 0]} name={metric === 'days' ? 'Avg days to deliver' : 'Late %'} /></BarChart>,
          cols: [{ key: 'state', label: 'State' }, { key: 'orders', label: 'Orders' }, { key: 'days', label: 'Avg days' }, { key: 'late', label: 'Late %' }], rows: ol.states,
        }
      }
      case 'payments':
        return {
          label: 'Total payment value by payment type.',
          el: <BarChart data={ol.payments} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}><CartesianGrid stroke="#efe3cc" vertical={false} /><XAxis dataKey="type" tick={AXIS} tickFormatter={pretty} /><YAxis tick={AXIS} width={56} tickFormatter={(v) => `R$${(v / 1e6).toFixed(1)}M`} /><Tooltip {...TIP} formatter={(v) => `R$${Number(v).toLocaleString()}`} /><Bar dataKey="value" fill={GREEN} radius={[4, 4, 0, 0]} name="Payment value" /></BarChart>,
          cols: [{ key: 'type', label: 'Payment type' }, { key: 'value', label: 'Value (R$)' }], rows: ol.payments,
        }
    }
  }, [view, metric])

  const views: [View, string][] = [['orders', 'Orders over time'], ['categories', 'Top categories'], ['reviews', 'Review scores'], ['states', 'Delivery by state'], ['payments', 'Payment mix']]
  return (
    <div>
      <div className="lab-head">
        <div>
          <h3>Olist marketplace explorer</h3>
          <p>The same public dataset my AI Data Analyst Agent queries, summarised directly from its CSVs. Switch views to explore orders, categories, reviews, delivery and payments.</p>
        </div>
        <div className="controls">
          <label className="field">View
            <select value={view} onChange={(e) => setView(e.target.value as View)}>{views.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          </label>
          {view === 'states' && (
            <label className="field">Metric
              <select value={metric} onChange={(e) => setMetric(e.target.value as 'days' | 'late')}><option value="days">Average days to deliver</option><option value="late">Late deliveries %</option></select>
            </label>
          )}
        </div>
      </div>
      <div className="stat-row">
        <div className="kpi"><b>{t.orders.toLocaleString()}</b><span>orders</span></div>
        <div className="kpi"><b>R${(t.gmv / 1e6).toFixed(2)}M</b><span>item revenue</span></div>
        <div className="kpi"><b>{t.avg_review}</b><span>avg review score</span></div>
        <div className="kpi"><b>{ol.reviewByLate.lateShare}%</b><span>delivered late</span></div>
      </div>
      <Chart label={chart.label}>{chart.el}</Chart>
      <p className="callout"><b>Finding.</b> Orders delivered after the estimated date average <b>{ol.reviewByLate.late}★</b> versus <b>{ol.reviewByLate.onTime}★</b> for on-time orders. Delivery reliability is the clearest lever on customer satisfaction in this data.</p>
      <DataTable cols={chart.cols} rows={chart.rows as unknown as Record<string, string | number>[]} />
      <Source kind="real">Olist Brazilian e-commerce public dataset (orders from 2016 to 2018; charts show Jan 2017 – Aug 2018). Currency is Brazilian reais; category names are in Portuguese as in the source. Delivered orders only for time and delivery views.</Source>
    </div>
  )
}

const tabs = [
  ['sens', 'Weather sensitivity'],
  ['season', 'Seasonality'],
  ['stock', 'Stockouts'],
  ['market', 'Olist marketplace'],
] as const

export default function Lab() {
  const [tab, setTab] = useState<(typeof tabs)[number][0]>('sens')
  return (
    <div className="card lab">
      <div className="lab-tabs" role="group" aria-label="Choose an analysis">
        {tabs.map(([id, label]) => (
          <button key={id} className="filter" aria-pressed={tab === id} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>
      {tab === 'sens' && <Sensitivity />}
      {tab === 'season' && <Seasonality />}
      {tab === 'stock' && <Stockouts />}
      {tab === 'market' && <Marketplace />}
    </div>
  )
}
