// lib/email.ts
import "server-only";
import { Resend } from "resend";

type SendEmailArgs = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  headers?: Record<string, string>;
  tags?: { name: string; value: string }[];
};

type SendEmailResult = {
  id?: string;
  ok: boolean;
  error?: {
    message: string;
    code?: string;
    status?: number;
    name?: string;
  };
};

function getEnv(name: string, required = true): string {
  const v = process.env[name];
  if (!v && required) throw new Error(`Missing env var: ${name}`);
  return v ?? "";
}

function isValidEmail(email: string): boolean {
  // volontairement simple et robuste
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function classifyError(err: any): { status?: number; code?: string; message: string; name?: string } {
  const status = err?.statusCode ?? err?.status ?? err?.response?.status;
  const code = err?.code ?? err?.name;
  const message =
    err?.message ??
    err?.response?.data?.message ??
    err?.response?.data?.error ??
    "Unknown error";
  const name = err?.name;
  return { status, code, message, name };
}

function shouldRetry(status?: number, message?: string) {
  // retry si rate limit ou erreurs temporaires
  if (status === 429) return true;
  if (status && status >= 500) return true;
  if (message?.toLowerCase().includes("timeout")) return true;
  return false;
}

let resendSingleton: Resend | null = null;
function getResendClient(): Resend {
  if (resendSingleton) return resendSingleton;
  const key = getEnv("RESEND_API_KEY", true);
  resendSingleton = new Resend(key);
  return resendSingleton;
}

/**
 * Envoi email robuste avec:
 * - validation email
 * - gestion clé manquante
 * - retry simple (exponential backoff) sur 429 / 5xx
 */
export async function sendEmail(args: SendEmailArgs): Promise<SendEmailResult> {
  const from = args.from ?? getEnv("EMAIL_FROM", true);
  const replyTo = args.replyTo ?? process.env.EMAIL_REPLY_TO;

  const toList = Array.isArray(args.to) ? args.to : [args.to];
  for (const e of toList) {
    if (!isValidEmail(e)) {
      return {
        ok: false,
        error: { message: `Invalid email: ${e}`, code: "INVALID_EMAIL", status: 400 },
      };
    }
  }

  const resend = getResendClient();

  const maxAttempts = 4;
  let attempt = 0;
  let lastErr: any = null;

  while (attempt < maxAttempts) {
    attempt += 1;
    try {
      const res = await resend.emails.send({
        from,
        to: toList,
        subject: args.subject,
        html: args.html,
        text: args.text,
        replyTo: replyTo ? [replyTo] : undefined,
        headers: args.headers,
        tags: args.tags,
      });

      // Resend renvoie { id } si ok
      return { ok: true, id: (res as any)?.id };
    } catch (err: any) {
      lastErr = err;
      const info = classifyError(err);

      if (!shouldRetry(info.status, info.message) || attempt >= maxAttempts) {
        return { ok: false, error: info };
      }

      // backoff: 500ms, 1s, 2s, 4s (+ jitter)
      const base = 500 * Math.pow(2, attempt - 1);
      const jitter = Math.floor(Math.random() * 250);
      await sleep(base + jitter);
    }
  }

  const info = classifyError(lastErr);
  return { ok: false, error: info };
}