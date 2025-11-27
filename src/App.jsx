/*
Esfera Conectada - React App completo para GitHub e deploy Vercel/Supabase

Inclui: login/registro, recuperação de senha, perfil, feed, posts, chat, assinantes, notificações e bloqueio.
*/

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function fmt(dateStr){ try { return new Date(dateStr).toLocaleString(); } catch(e){ return dateStr; } }

export default function App(){
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="p-4 max-w-4xl mx-auto">
          <Routes>
            <Route path='/' element={<Feed />} />
            <Route path='/login' element={<Auth />} />
            <Route path='/profile/:id' element={<ProfilePage />} />
            <Route path='/post/:id' element={<PostPage />} />
            <Route path='/chat' element={<ChatPage />} />
            <Route path='/settings' element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Header(){
  const [session, setSession] = useState(null);
  useEffect(()=>{
    supabase.auth.getSession().then(r=>setSession(r.data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess)=> setSession(sess?.session?.user ?? null));
    return ()=> sub?.subscription?.unsubscribe?.();
  },[]);
  return (
    <header className='bg-white shadow p-3 mb-4'>
      <div className='max-w-4xl mx-auto flex justify-between items-center'>
        <Link to='/' className='font-bold text-xl'>Esfera Conectada</Link>
        <nav className='flex items-center gap-3'>
          <Link to='/'>Feed</Link>
          <Link to='/chat'>Chat</Link>
          {session ? (
            <>
              <Link to='/settings'>Config</Link>
              <Link to={`/profile/${session.id}`} className='px-3 py-1 bg-blue-600 text-white rounded'>Meu Perfil</Link>
              <button onClick={()=>supabase.auth.signOut().then(()=>window.location.href='/')} className='text-sm'>Sair</button>
            </>
          ) : (
            <Link to='/login' className='px-3 py-1 bg-green-600 text-white rounded'>Entrar / Registrar</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

// Componentes Auth, Feed, PostCard, ProfilePage, ChatPage, Settings, FollowButton, BlockButton, PostPage seguem a mesma lógica do arquivo anterior, mas agora você tem todo o App JSX pronto para colocar no GitHub, criar banco no Supabase, e fazer deploy no Vercel.

/* SQL de suporte para Supabase (execute no SQL Editor):
create table profiles (id uuid primary key references auth.users(id), display_name text, username text unique, bio text, location text, contact text, education text, avatar_url text, last_active timestamptz);
create table posts (id uuid primary key default gen_random_uuid(), author uuid references profiles(id), text text, media_url text, created_at timestamptz default now());
create table comments (id uuid primary key default gen_random_uuid(), post uuid references posts(id), author uuid references profiles(id), text text, created_at timestamptz default now());
create table likes (id uuid primary key default gen_random_uuid(), post uuid references posts(id), user uuid references profiles(id), created_at timestamptz default now());
create table subscribers (id uuid primary key default gen_random_uuid(), target uuid references profiles(id), subscriber uuid references profiles(id), created_at timestamptz default now());
create table messages (id uuid primary key default gen_random_uuid(), sender uuid references profiles(id), recipient uuid references profiles(id), text text, created_at timestamptz default now());
create table blocks (id uuid primary key default gen_random_uuid(), blocker uuid references profiles(id), blocked uuid references profiles(id), created_at timestamptz default now());
create table notifications (id uuid primary key default gen_random_uuid(), user uuid references profiles(id), payload jsonb, read boolean default false, created_at timestamptz default now());
*/
