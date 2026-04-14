'use client';
import { useEffect, useState } from 'react';

interface Props {
  fallback?: string;
}

export default function SocialProofSection({ fallback }: Props) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/analytics/proposta-count')
      .then(r => r.json())
      .then(d => setCount(d.count ?? null))
      .catch(() => {});
  }, []);

  if (count === null) return null;

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
        <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
        </svg>
        {count > 0
          ? `${count.toLocaleString('pt-BR')} propostas criadas`
          : fallback ?? 'Usado por milhares de profissionais'}
      </span>
    </div>
  );
}
