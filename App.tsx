
import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase, supabaseInitializationError } from './supabaseClient';
import { TUTORIAL_STEPS } from './constants';
import { Step } from './types';
import StepCard from './components/StepCard';
import Auth from './components/Auth';
import UserDashboard from './components/UserDashboard';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  return (
    <div className="min-h-screen bg-base-100 text-content font-sans antialiased">
      <main className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Lesson 2: Building a Secure, Multi-User App
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            This lesson builds on "Hello World" to teach user authentication and data security with Supabase and React.
          </p>
        </header>

        <div className="space-y-8">
          {TUTORIAL_STEPS.map((step: Step, index: number) => (
            <StepCard key={index} step={step} number={index + 1} />
          ))}
        </div>
        
        <section className="mt-16 bg-base-200 p-8 rounded-xl shadow-lg border border-base-300">
            <h2 className="text-3xl font-bold text-white text-center mb-2">
              Live Application Demo
            </h2>
            <p className="text-center text-gray-400 mb-6">
              Sign up or sign in to test the secure, user-specific message board.
            </p>
            {supabaseInitializationError ? (
                <div className="text-center p-4 bg-yellow-900/30 border border-yellow-500/50 rounded-md">
                    <p className="font-bold text-yellow-300">Demo Disabled</p>
                    <p className="text-yellow-200">{supabaseInitializationError}</p>
                </div>
              ) : (
                !session ? <Auth /> : <UserDashboard key={session.user.id} session={session} />
              )}
        </section>

        <footer className="text-center mt-16 text-gray-500">
            <p>Built with React, TypeScript, Supabase, and Tailwind CSS.</p>
            <p>You've got this! Happy coding!</p>
        </footer>
      </main>
    </div>
  );
};

export default App;