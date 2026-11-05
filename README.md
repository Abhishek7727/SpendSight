# SpendSight — Smart AI-Powered Personal Finance & Budget Tracker

> **Built with ❤️ by [Abhishek Namdev](https://github.com/abhisheknamdev)**

A full-stack, cross-platform personal finance and budgeting application for iOS and Android built with **Expo (SDK 54)**, **Supabase**, **Clerk Auth**, and **Google Gemini AI**. Track accounts, monitor expenses, set monthly budgets, and log transactions seamlessly through manual entry, AI receipt scanning, or voice notes — all secured with biometric authentication (Face ID / Fingerprint).

---

## ✨ Features

- **🛡️ Biometric Security & App Lock** — Secure your financial data with Face ID, Touch ID, or Android Biometrics. Automatically shields data when the app is backgrounded or launched.
- **🏦 Multiple Accounts** — Manage Cash, Bank accounts, Credit Cards, and Savings with real-time balance calculations and default account preferences.
- **📊 Interactive Financial Dashboard** — Visual breakdown of monthly spending with interactive pie charts, daily income vs. expense graphs, and recent transactions.
- **🧾 AI Receipt Scanner** — Snap or upload receipt photos; Google Gemini extracts amounts, store descriptions, categories, and transaction dates automatically.
- **🎙️ AI Voice Expense Logging** — Speak naturally (*"I spent 450 rupees on groceries yesterday"*), and Gemini transcribes and records the transaction.
- **💬 AI Spending Assistant** — In-app conversational AI that answers questions about your past 30-day spending habits, top categories, and budgets.
- **🎯 Monthly Budgets & Smart Alerts** — Set budgets with visual progress indicators. Supabase Edge Functions send daily email alerts at 80% and 100% threshold crossings.
- **💡 Automated Weekly Financial Tips** — Weekly cron job triggers Gemini to analyze recent transactions and email personalized financial coaching via Resend.
- **📁 CSV Data Export** — Export recent transaction histories to CSV and share directly via iOS/Android native share sheets.
- **🌍 Multi-Currency Support** — Choose from worldwide currencies with automatic regional formatting.

---

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (SDK 54) + [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **Authentication**: [Clerk](https://clerk.com/) (Native Third-Party Auth integration with Supabase)
- **Database & Backend**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security policies & Edge Functions)
- **AI & Multimodal**: [Google Gemini 3.1 Flash Lite](https://ai.google.dev/) via Google Generative Language API
- **Biometric Security**: [Expo Local Authentication](https://docs.expo.dev/versions/latest/sdk/local-authentication/) & [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) & [TanStack React Query v5](https://tanstack.com/query)
- **Forms & Validation**: React Hook Form + Zod
- **Audio & Media**: Expo Audio, Expo Camera, Expo Image Picker

---

## 🔑 Environment Variables & Setup Guide

SpendSight requires keys from **Clerk**, **Supabase**, and **Google Gemini** for the client app, plus **Resend** if you wish to run backend email alerts.

Create a `.env` file in the root directory (or copy from `.env.example`):

```bash
cp .env.example .env
```

Your `.env` file should contain the following variables:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=<your-supabase-anon-key>
EXPO_PUBLIC_GEMINI_API_KEY=<your-gemini-api-key>
```

### 1. Clerk Publishable Key (`EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`)
Clerk handles user authentication (sign-up, sign-in, session management).

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/) and sign up or log in.
2. Click **Create application**, choose a name (e.g., `SpendSight`), and select your desired sign-in methods (Email + Password recommended).
3. In the left navigation, go to **Configure → Developers → API Keys**.
4. Copy the **Publishable Key** (starts with `pk_test_...` or `pk_live_...`).
5. Paste it as `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` in `.env`.

> **Important (Clerk ↔ Supabase Integration)**:
> In your Supabase dashboard, navigate to **Authentication → Providers → Third-Party Auth → Clerk**. Enable Clerk and paste your Clerk frontend API domain / issuer URL so Supabase validates JWT tokens natively without legacy templates.

---

### 2. Supabase URL & Anon Key (`EXPO_PUBLIC_SUPABASE_URL` & `EXPO_PUBLIC_SUPABASE_KEY`)
Supabase hosts the PostgreSQL database, Row Level Security (RLS) rules, and Edge Functions.

1. Go to [Supabase](https://supabase.com/) and create a new project.
2. In the left sidebar, click the **Project Settings** (gear icon) → **API**.
3. Under **Project URL**, copy the `URL` and paste it as `EXPO_PUBLIC_SUPABASE_URL`.
4. Under **Project API keys**, copy the `anon` / `public` key and paste it as `EXPO_PUBLIC_SUPABASE_KEY`.

---

### 3. Google Gemini API Key (`EXPO_PUBLIC_GEMINI_API_KEY`)
Gemini powers the AI receipt scanner, voice transaction transcriber, and spending assistant.

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Click **Get API key** → **Create API key** (select or create a Google Cloud project).
4. Copy the generated key.
5. Paste it as `EXPO_PUBLIC_GEMINI_API_KEY` in `.env`.

---

### 4. Resend API Keys (Optional — For Email Alerts & Weekly Tips)
Resend delivers budget alert emails and weekly spending insights.

1. Sign up at [Resend](https://resend.com/).
2. Navigate to **API Keys** → **Create API Key**.
3. Set permissions to *Sending access* and copy your key (`re_...`).
4. In your Supabase project dashboard, go to **Edge Functions → Secrets** (or use the Supabase CLI):
   ```bash
   npx supabase secrets set RESEND_API_KEY=re_your_key_here
   npx supabase secrets set RESEND_FROM_EMAIL="SpendSight <onboarding@resend.dev>"
   npx supabase secrets set GEMINI_API_KEY=your_gemini_api_key_here
   ```

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/abhisheknamdev/spendsight.git
cd spendsight
npm install
```

### 2. Configure Environment

Fill in your `.env` file as described in the [Environment Variables Guide](#-environment-variables--setup-guide).

### 3. Initialize Supabase Database Schema

Open your [Supabase Dashboard](https://supabase.com/dashboard) → **SQL Editor** and execute the queries below:

#### Users Table & RLS
```sql
create table users (
  clerk_id text primary key,
  email text not null,
  name text,
  image_url text,
  currency text,
  created_at timestamp with time zone default now()
);

alter table users enable row level security;

create policy "Users can insert own row"
on users for insert
with check (clerk_id = auth.jwt()->>'sub');

create policy "Users can read own row"
on users for select
using (clerk_id = auth.jwt()->>'sub');

create policy "Users can update own row"
on users for update
using (clerk_id = auth.jwt()->>'sub');
```

#### Accounts Table & RLS
```sql
create table accounts (
  id uuid default gen_random_uuid() primary key,
  user_id text not null references users(clerk_id) on delete cascade,
  name text not null,
  type text not null, -- 'CASH' | 'BANK' | 'CREDIT_CARD' | 'SAVINGS'
  balance numeric not null default 0,
  is_default boolean not null default false,
  created_at timestamp with time zone default now()
);

alter table accounts enable row level security;

create policy "Users can manage own accounts"
on accounts for all
using (user_id = auth.jwt()->>'sub')
with check (user_id = auth.jwt()->>'sub');
```

#### Transactions Table & RLS
```sql
create table transactions (
  id uuid default gen_random_uuid() primary key,
  user_id text not null references users(clerk_id) on delete cascade,
  account_id uuid not null references accounts(id) on delete cascade,
  type text not null, -- 'INCOME' | 'EXPENSE'
  amount numeric not null,
  category text not null,
  description text,
  date timestamp with time zone not null default now(),
  status text not null default 'COMPLETED',
  input_method text not null default 'MANUAL', -- 'MANUAL' | 'RECEIPT_SCAN' | 'VOICE'
  voice_transcript text,
  is_flagged boolean not null default false,
  flag_reason text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table transactions enable row level security;

create policy "Users can manage own transactions"
on transactions for all
using (user_id = auth.jwt()->>'sub')
with check (user_id = auth.jwt()->>'sub');
```

#### Budgets Table & RLS
```sql
create table budgets (
  id uuid default gen_random_uuid() primary key,
  user_id text not null unique references users(clerk_id) on delete cascade,
  amount numeric not null,
  last_alert_sent timestamp with time zone,
  last_alert_threshold numeric,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table budgets enable row level security;

create policy "Users can manage own budget"
on budgets for all
using (user_id = auth.jwt()->>'sub')
with check (user_id = auth.jwt()->>'sub');
```

### 4. Run the App

Start the Expo development server:

```bash
npx expo start -c
```

- Press `i` to open in the iOS simulator.
- Press `a` to open in the Android emulator.
- Scan the QR code using the **Expo Go** app on your physical device.

---

## 🔒 Biometric Security

SpendSight includes biometric authentication support powered by `expo-local-authentication`:
- **Hardware Detection**: Automatically checks if your device supports Face ID, Touch ID, or Android Biometric authentication.
- **Encrypted Preference Storage**: Security preference toggles are stored in hardware-backed `expo-secure-store`.
- **App Privacy Shield**: When enabled, leaving the app or switching to another application immediately locks the interface with a secure overlay, preventing unauthorized access until verified.

---

## 🧪 Testing

Run automated unit tests with Jest:

```bash
npm test
```

Typecheck the codebase:

```bash
npx expo typecheck
```

---

## 👤 Author & Credits

Developed by **Abhishek Namdev**

- GitHub: [@abhisheknamdev](https://github.com/abhisheknamdev)
- Project: SpendSight 
- License: MIT
