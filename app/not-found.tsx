'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Layers } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-12 h-12 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold">
        <Layers className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold text-zinc-900">404 - Page Not Found</h2>
      <p className="text-xs text-zinc-500 max-w-sm">
        The requested resource could not be found or may have been relocated in the ERP system.
      </p>
      <Link href="/dashboard">
        <Button variant="primary" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
}
