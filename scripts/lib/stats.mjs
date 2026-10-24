// Shared exact and statistical helpers for the checks. Independent of src/app/:
// the normal functions use a series and continued fraction, not the app's integration.
// ---------- exact rationals ----------
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
export class Q {
  constructor(n, d = 1n) { if (d < 0n) { n = -n; d = -d; } const g = gcd(n, d) || 1n; this.n = n / g; this.d = d / g; }
  static of(v) { if (v instanceof Q) return v; const [w, f = ''] = String(v).split('.'); return new Q(BigInt(w + f), 10n ** BigInt(f.length)); }
  add(o) { o = Q.of(o); return new Q(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o) { o = Q.of(o); return new Q(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o) { o = Q.of(o); return new Q(this.n * o.n, this.d * o.d); }
  div(o) { o = Q.of(o); return new Q(this.n * o.d, this.d * o.n); }
  eq(o) { o = Q.of(o); return this.n === o.n && this.d === o.d; }
  toString() { return this.d === 1n ? `${this.n}` : `${this.n}/${this.d}`; }
  valueOf() { return Number(this.n) / Number(this.d); }
}
export const q = (n, d = 1) => new Q(BigInt(n), BigInt(d));
export const sum = xs => xs.reduce((a, b) => a.add(b), q(0));

// ---------- standard normal, independent of src/app/calculator.js ----------
// erf by its Maclaurin series (|z| < 3) and erfc by a Lentz continued fraction otherwise.
export function erfc(x) {
  if (x < 0) return 2 - erfc(-x);
  if (x < 3) { let term = x, total = x; for (let n = 1; n < 200; n += 1) { term *= -x * x / n; total += term / (2 * n + 1); } return 1 - 2 / Math.sqrt(Math.PI) * total; }
  let f = x, c = x, d = 0;
  for (let n = 1; n < 300; n += 1) { const a = n / 2; d = 1 / (x + a * d); c = x + a / c; f *= c * d; }
  return Math.exp(-x * x) / Math.sqrt(Math.PI) / f;
}
export const Phi = z => 0.5 * erfc(-z / Math.SQRT2);
export const pdf = z => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
export function invPhi(p) { let z = 0; for (let i = 0; i < 60; i += 1) z -= (Phi(z) - p) / pdf(z); return z; }
export const binom = (n, p, lo, hi) => { let s = 0; for (let k = lo; k <= hi; k += 1) { let c = 1; for (let i = 1; i <= k; i += 1) c = c * (n - i + 1) / i; s += c * p ** k * (1 - p) ** (n - k); } return s; };

