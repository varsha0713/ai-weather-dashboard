"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        return;
      }

      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err) {
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg w-96"
      >
        <h2 className="text-2xl mb-4 font-bold text-center">Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full p-2 mb-3 bg-gray-700 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 mb-3 bg-gray-700 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 mb-4 bg-gray-700 rounded"
          onChange={handleChange}
          required
        />

        <button className="w-full bg-blue-600 p-2 rounded hover:bg-blue-700">
          Register
        </button>

        {message && (
          <p className="mt-3 text-center text-sm text-green-400">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}