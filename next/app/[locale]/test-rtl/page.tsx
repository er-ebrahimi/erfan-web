import React from 'react';
import Cons from '@/components/dynamic-zone/cons';

const mockCons = [
  { Title: 'Disadvantage 1', Description: 'This is the first disadvantage.' },
  { Title: 'Disadvantage 2', Description: 'This is the second disadvantage with longer text to test wrapping behavior.' },
];

const mockConsRTL = [
  { Title: 'عیب ۱', Description: 'این اولین عیب است.' },
  { Title: 'عیب ۲', Description: 'این دومین عیب است که متن طولانی‌تری دارد تا رفتار wrapping تست شود.' },
];

export default function TestRTLPage() {
  return (
    <div className="p-8 space-y-16 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <h1 className="text-3xl font-bold text-center">RTL/LTR Support Verification</h1>
      
      <section>
        <h2 className="text-2xl font-bold mb-4 text-center">LTR Test (English)</h2>
        <div className="border p-4 rounded-lg shadow-sm">
           <Cons
             Cons={mockCons}
             Title="Cons (LTR)"
             Description="List of cons in LTR mode. Icons should be on the LEFT."
             locale="en"
           />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-center">RTL Test (Persian)</h2>
        <div className="border p-4 rounded-lg shadow-sm">
           {/* The component self-manages dir attribute based on locale */}
           <Cons
             Cons={mockConsRTL}
             Title="معایب (RTL)"
             Description="لیست معایب در حالت راست‌چین. آیکون‌ها باید در سمت راست باشند."
             locale="fa"
           />
        </div>
      </section>
    </div>
  );
}
