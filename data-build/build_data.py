"""Aggregate real data from the user's repos into small JSON for the Analytics Lab."""
import json, sys
from pathlib import Path
import numpy as np
import pandas as pd

R = Path(sys.argv[1])
OUT = Path(sys.argv[2])
W = R / "weatherretail-intelligence/data"
O = R / "ai-data-analyst-agent/data"

# ---------- WeatherRetail ----------
sales = pd.read_csv(W / "snapshot/fact_sales.csv", parse_dates=["date"])
store = pd.read_csv(W / "snapshot/dim_store.csv")
wx = pd.read_csv(W / "snapshot/fact_weather_daily.csv", parse_dates=["date"])
sens = pd.read_csv(W / "processed/sensitivity_scores.csv")
risk = pd.read_csv(W / "snapshot/fact_risk_forecast.csv")

df = sales.merge(store[["store_id", "city"]], on="store_id").merge(wx, on=["date", "city"])
df["stockout_flag"] = df["stockout_flag"].astype(str).str.lower().eq("true")
driver_col = {"temp_max_c": "temp_max_c", "precipitation_mm": "precipitation_mm", "snowfall_cm": "snowfall_cm"}

cats = []
for _, s in sens.iterrows():
    c = s.product_category
    d = df[df.product_category == c]
    x = d[driver_col[s.weather_driver]].to_numpy(float)
    y = d.units_sold.to_numpy(float)
    r = float(np.corrcoef(x, y)[0, 1])
    slope, icpt = np.polyfit(x, y, 1)
    # binned means
    if s.weather_driver == "temp_max_c":
        edges = np.arange(np.floor(x.min() / 5) * 5, x.max() + 5, 5)
    elif s.weather_driver == "precipitation_mm":
        edges = np.array([0, 0.1, 2, 5, 10, 20, 1000])
    else:
        edges = np.array([0, 0.01, 1, 3, 1000])
    b = pd.cut(d[driver_col[s.weather_driver]], edges, right=False, include_lowest=True)
    g = d.groupby(b, observed=True).agg(units=("units_sold", "mean"), n=("units_sold", "size"), x=(driver_col[s.weather_driver], "mean"))
    bins = [{"x": round(float(v.x), 2), "units": round(float(v.units), 2), "n": int(v.n)} for _, v in g.iterrows()]
    cats.append({
        "category": c, "driver": s.weather_driver, "r": round(float(s.correlation_r), 3), "r_recomputed": round(r, 3),
        "slope": round(float(s.slope_units_per_unit_weather), 3), "slope_recomputed": round(float(slope), 3),
        "intercept": round(float(icpt), 2), "label": s.sensitivity_label, "bins": bins,
        "revenue": round(float(d.revenue.sum())),
        "stockout_rate": round(float(d.stockout_flag.mean()) * 100, 2),
    })

monthly = df.groupby(df.date.dt.to_period("M")).agg(revenue=("revenue", "sum"), units=("units_sold", "sum"))
monthly_cat = df.pivot_table(index=df.date.dt.to_period("M"), columns="product_category", values="revenue", aggfunc="sum")
by_store = df.groupby("city").agg(revenue=("revenue", "sum"), stockout=("stockout_flag", "mean")).sort_values("revenue", ascending=False)
heat = df.pivot_table(index="city", columns="product_category", values="stockout_flag", aggfunc="mean") * 100

wr = {
    "totals": {"revenue": round(float(df.revenue.sum())), "units": int(df.units_sold.sum()), "rows": int(len(df)),
               "weather_rows": int(len(wx)), "stockout_days": int(df.stockout_flag.sum()),
               "stockout_rate": round(float(df.stockout_flag.mean()) * 100, 2)},
    "categories": cats,
    "monthly": [{"month": str(p), "revenue": round(float(r.revenue)), "units": int(r.units),
                 **{k: round(float(monthly_cat.loc[p, k])) for k in monthly_cat.columns}} for p, r in monthly.iterrows()],
    "stores": [{"city": c, "revenue": round(float(r.revenue)), "stockout": round(float(r.stockout) * 100, 2)} for c, r in by_store.iterrows()],
    "stockoutHeat": {"cities": list(heat.index), "categories": list(heat.columns),
                     "values": [[round(float(v), 2) for v in row] for row in heat.to_numpy()]},
    "forecastDates": sorted(risk.forecast_date.unique().tolist()),
    "forecastMaxRisk": round(float(risk.risk_score.max()), 1),
}

# ---------- Olist ----------
orders = pd.read_csv(O / "olist_orders_dataset.csv", parse_dates=["order_purchase_timestamp", "order_delivered_customer_date", "order_estimated_delivery_date"])
items = pd.read_csv(O / "olist_order_items_dataset.csv")
prod = pd.read_csv(O / "olist_products_dataset.csv")
pay = pd.read_csv(O / "olist_order_payments_dataset.csv")
rev = pd.read_csv(O / "olist_order_reviews_dataset.csv")
cust = pd.read_csv(O / "olist_customers_dataset.csv")

deliv = orders[orders.order_status == "delivered"].copy()
mo = deliv.groupby(deliv.order_purchase_timestamp.dt.to_period("M")).size()
mo = mo[(mo.index >= "2017-01") & (mo.index <= "2018-08")]
it = items.merge(deliv[["order_id"]], on="order_id").merge(prod[["product_id", "product_category_name"]], on="product_id")
cat_rev = it.groupby("product_category_name").agg(revenue=("price", "sum"), items=("price", "size")).sort_values("revenue", ascending=False).head(10)
deliv["days"] = (deliv.order_delivered_customer_date - deliv.order_purchase_timestamp).dt.days
deliv["late"] = deliv.order_delivered_customer_date > deliv.order_estimated_delivery_date
st = deliv.merge(cust[["customer_id", "customer_state"]], on="customer_id").dropna(subset=["days"])
by_state = st.groupby("customer_state").agg(orders=("order_id", "size"), days=("days", "mean"), late=("late", "mean")).sort_values("orders", ascending=False).head(10)
rs = rev.merge(deliv[["order_id", "late"]], on="order_id")
score_late = rs.groupby("late").review_score.mean()

olist = {
    "totals": {"orders": int(len(orders)), "delivered": int(len(deliv)),
               "gmv": round(float(items.price.sum())), "avg_review": round(float(rev.review_score.mean()), 2)},
    "monthlyOrders": [{"month": str(p), "orders": int(v)} for p, v in mo.items()],
    "topCategories": [{"category": c, "revenue": round(float(r.revenue)), "items": int(r["items"])} for c, r in cat_rev.iterrows()],
    "reviewDist": [{"score": int(k), "reviews": int(v)} for k, v in rev.review_score.value_counts().sort_index().items()],
    "payments": [{"type": k, "value": round(float(v))} for k, v in pay.groupby("payment_type").payment_value.sum().sort_values(ascending=False).items()],
    "states": [{"state": s, "orders": int(r.orders), "days": round(float(r.days), 1), "late": round(float(r.late) * 100, 1)} for s, r in by_state.iterrows()],
    "reviewByLate": {"onTime": round(float(score_late[False]), 2), "late": round(float(score_late[True]), 2),
                     "lateShare": round(float(deliv.late.mean()) * 100, 1)},
}

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps({"weatherRetail": wr, "olist": olist}, separators=(",", ":")))
print(json.dumps(wr["totals"]), json.dumps(olist["totals"]), json.dumps(olist["reviewByLate"]))
for c in cats: print(c["category"], c["r"], c["r_recomputed"], c["slope"], c["slope_recomputed"], c["stockout_rate"])
print(wr["stores"], wr["forecastDates"], wr["forecastMaxRisk"], OUT.stat().st_size)
