import { useRef, useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const idempotencyKey = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");
    idempotencyKey.current ??= crypto.randomUUID();

    try {
      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey.current
        },
        body: JSON.stringify({ name: name.trim(), amount: Number(amount) })
      });

      if (!response.ok) {
        throw new Error(result.message || "Could not create the order.");
      }

      setMessage(`Order created successfully`);
      setName("");
      setAmount("");
      idempotencyKey.current = null;
    } catch (submissionError) {
      setError(submissionError.message || "Could not create the order.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-6 py-10 text-slate-900">
      <form
        className="grid w-full max-w-sm gap-3 rounded-xl border border-slate-200 bg-white p-7 shadow-xl"
        onSubmit={handleSubmit}
      >
        <h1 className="mb-2 text-2xl font-semibold">Create an order</h1>

        <label className="text-sm font-semibold" htmlFor="order-name">Name</label>
        <input
          id="order-name"
          name="name"
          type="text"
          className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Order name"
          required
        />

        <label className="text-sm font-semibold" htmlFor="order-amount">Amount</label>
        <input
          id="order-amount"
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="0.00"
          required
        />

        <button
          className="mt-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Create order"}
        </button>

        {message && <p className="mt-1 text-sm text-green-700" role="status">{message}</p>}
        {error && <p className="mt-1 text-sm text-red-700" role="alert">{error}</p>}
      </form>
    </main>
  );
}

export default App
