import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { Session } from '@supabase/supabase-js';
import { Message } from '../types';

interface UserDashboardProps {
  session: Session;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ session }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!supabase) return null;

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
        const err = error as { message: string };
        setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleAddMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({ text: newMessage, user_id: session.user.id })
        .select()
        .single();
        
      if (error) throw error;

      if (data) {
        setMessages(prevMessages => [data, ...prevMessages]);
      }
      setNewMessage('');
    } catch (error) {
      const err = error as { message: string };
      alert(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-400">
          Signed in as: <span className="font-bold text-white">{session.user.email}</span>
        </p>
        <button
          onClick={() => supabase.auth.signOut()}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition"
        >
          Sign Out
        </button>
      </div>

      <form onSubmit={handleAddMessage} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="What's on your mind?"
          className="flex-grow bg-base-300 text-white placeholder-gray-500 px-4 py-3 rounded-md border-2 border-base-300 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition"
        />
        <button type="submit" className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-6 rounded-md transition">
          Post
        </button>
      </form>
      
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Your Private Messages:</h3>
        {loading && <p>Loading messages...</p>}
        {error && <p className="text-red-400">Error: {error}</p>}
        {!loading && messages.length === 0 && (
          <p className="text-gray-500 italic">You haven't posted any messages yet.</p>
        )}
        {messages.map(msg => (
          <div key={msg.id} className="bg-base-300 p-4 rounded-md">
            <p className="text-content">{msg.text}</p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(msg.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;