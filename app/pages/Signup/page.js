"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  // Toggle eye functionality to show/hide password
  function toggle() {
    try {
      const passIn = document.getElementById('password');
      const type = passIn.getAttribute('type') === 'password' ? 'text' : 'password';
      passIn.setAttribute('type', type);
    } catch (error) {
      console.error(error);
    }
  }

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate input
    if (formData.name.length < 3) {
      setErrorMessage("Name must be at least 3 characters long.");
      return;
    } else if (/[^a-zA-Z ]/.test(formData.name)) {
      setErrorMessage("Name must include only letters.");
      return;
    } else if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      // Sending the signup data to the API
      const res = await fetch('/api/expenses/signup', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        alert("User registered successfully.");
        router.push('/pages/Login');
      } else {
        setErrorMessage(data.message || 'Error during signup');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.',{error});
    }
  };

  return (
   
    <div className="px-4 flex justify-center w-full items-center my-10 ">
      {/* main Div Starts */}
      <div className="max-w-lg w-full bg-gradient-to-r from-blue-800 to-purple-600 rounded-xl shadow-2xl overflow-hidden p-8 space-y-8">
        {/* heading starts */}
        <h2 className="text-center text-4xl font-extrabold text-white">Welcome</h2>
        <p className="text-center text-gray-200">Create an Account</p>
        {/* heading ends */}

        {/* form starts */}
        <form className="space-y-6" onSubmit={handleSignup}>
          {/* Name input */}
          <div className="relative">
            <input
              placeholder="Enter your name"
              className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-purple-500"
              required
              id="name"
              name="name"
              type="text"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <label
              className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-purple-500 peer-focus:text-sm"
              htmlFor="name"
            >
              Name
            </label>
          </div>

          {/* Email input */}
          <div className="relative">
            <input
              placeholder="john@example.com"
              className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-purple-500"
              required
              id="email"
              name="email"
              type="email"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <label
              className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-purple-500 peer-focus:text-sm"
              htmlFor="email"
            >
              Email address
            </label>
          </div>

          {/* Password input */}
          <div className="relative">
            {/* Toggle button for password visibility */}
            <p onClick={toggle} id="togglebtn" className='grayscale hover:grayscale-0 absolute top-2 left-96'>
              <img src="/images/view.png" alt="eye" width={30} />
            </p>
            <input
              placeholder="Password"
              className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-purple-500"
              required
              id="password"
              name="password"
              type="password"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <label
              className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-purple-500 peer-focus:text-sm"
              htmlFor="password"
            >
              Password
            </label>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-500 text-sm text-center">{errorMessage}</div>
          )}

          {/* Submit button */}
          <button
            className="w-full py-2 px-4 bg-purple-500 hover:bg-purple-700 rounded-md shadow-lg text-white font-semibold transition duration-200"
            type="submit"
          >
            Sign up
          </button>
        </form>
        {/* form ends */}

        {/* Other options */}
        <p className="text-center text-lg text-gray-200">-OR-</p>
        <button className="w-full py-2 px-4 bg-purple-500 hover:bg-purple-700 rounded-md shadow-lg text-white font-semibold transition duration-200">
          <a href="/pages/Login">Login with existing Account</a>
        </button>
      </div>
      {/* main div ends */}
    </div>
  );
}
