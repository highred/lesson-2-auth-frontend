import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (!supabase) return null;

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setError(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
      setMessage("User already exists. Please try signing in.");
    } 
    else {
      setMessage("Check your email for the confirmation link!");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          className="w-full bg-base-300 text-white placeholder-gray-500 px-4 py-3 rounded-md border-2 border-base-300 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition"
          type="email"
          placeholder="Your email"
          value={email}
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full bg-base-300 text-white placeholder-gray-500 px-4 py-3 rounded-md border-2 border-base-300 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition"
          type="password"
          placeholder="Your password"
          value={password}
          required={true}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <button type="submit" className="flex-1 bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-6 rounded-md transition disabled:bg-gray-500" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <button type="button" onClick={handleSignUp} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-md transition disabled:bg-gray-500" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </div>
      </form>
      {error && <p className="mt-4 text-center text-red-400">{error}</p>}
      {message && <p className="mt-4 text-center text-cyan-400">{message}</p>}
    </div>
  );
};

export default Auth;