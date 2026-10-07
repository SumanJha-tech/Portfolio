# How to put your portfolio on Vercel (step by step)

You need: a free GitHub account (you have one) and a free Vercel account. Time: about 10 minutes.

## Part 1: Put the code on GitHub

1. Go to https://github.com/new
2. Repository name: `portfolio` (or any name). Keep it **Public**. Do **not** add a README. Click **Create repository**.
3. Open PowerShell in your project folder and run these commands one by one:

```powershell
cd D:\Portfolio
git add -A
git commit -m "Portfolio website"
git branch -M main
git remote add origin https://github.com/SumanJha-tech/portfolio.git
git push -u origin main
```

If `git commit` asks who you are, run these once, then repeat the commit:

```powershell
git config --global user.name "Suman Jha"
git config --global user.email "sumanjha0906@gmail.com"
```

Your original photos are in the `_private` folder and are not uploaded (ignored on purpose). The website uses `public/suman.jpg`.

## Part 2: Deploy on Vercel

1. Go to https://vercel.com and click **Sign Up** → **Continue with GitHub**.
2. Click **Add New…** → **Project**.
3. Find the `portfolio` repository and click **Import**.
4. Leave the settings as they are (Vercel detects **Vite**). The build command is `npm run build` and the output folder is `dist`.
5. Open **Environment Variables** and add:
   - Name: `VITE_SITE_URL`
   - Value: your final address, for example `https://portfolio-suman.vercel.app` (you can edit it after the first deploy, see Part 4)
6. Click **Deploy**. Wait about one minute. Vercel shows your live link.

## Part 3: Make the contact form deliver to your Gmail (important)

Anyone who fills the form types their own name, email and message. The message is **emailed to you at sumanjha0906@gmail.com**. The visitor never needs your password. The site tries Web3Forms first, then a relay on your own site (`/api/contact`), then FormSubmit, so one blocked route does not stop the message.

**Option A (recommended, works everywhere): Web3Forms key**
1. Go to https://web3forms.com, type `sumanjha0906@gmail.com` and click **Create Access Key**.
2. Open your Gmail and copy the **access key** from their email.
3. In the project folder open the `.env` file and add a line: `VITE_WEB3FORMS_KEY=your-key` (then stop and restart `npm run dev`).
4. In Vercel: your project, **Settings**, **Environment Variables**, add `VITE_WEB3FORMS_KEY` with the same key, **Save**, then **Deployments**, latest one, **...**, **Redeploy**.

**Option B (no key): FormSubmit**
Works without a key, but FormSubmit wants you to click an **Activate Form** link in Gmail **once for every different site address** (for example `localhost:5173`, `127.0.0.1:5173`, and your Vercel address). Until you click it, the form shows an error. Check Gmail (also Spam and Promotions) for emails from FormSubmit.

Always send one test message after setup and check your inbox.

## Part 4: Fix the website address (so link previews look right)

1. After the first deploy, copy your real address (for example `https://portfolio-xyz.vercel.app`).
2. Vercel → your project → **Settings** → **Environment Variables** → edit `VITE_SITE_URL` to that address (no slash at the end).
3. Go to **Deployments** → the latest one → **⋯** → **Redeploy**.

Optional: **Settings → Domains** lets you use your own domain.

## Updating the site later

Edit files, then run:

```powershell
git add -A
git commit -m "Update"
git push
```

Vercel redeploys automatically in about a minute.

## Updating your resume later

1. Save your new resume as a PDF named exactly `Suman_Jha_Resume.pdf`.
2. Replace the file in `public\Suman_Jha_Resume.pdf`.
3. Run the three git commands above. The Resume buttons on the site now serve the new PDF.

Tip: after your site is live, change the "Portfolio" link in your resume to your Vercel address.

To update text on the website (projects, skills, experience, certificates), edit `src\data\content.ts`.

## Run it on your computer

```powershell
cd D:\Portfolio
npm install
npm run dev
```

Open http://localhost:5173
