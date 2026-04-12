import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BrandLink = () => (
  <Link to='/' className='flex items-center gap-2.5 mb-8'>
    <div className='relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-br from-primary to-purple-600' />
      <Sparkles className='h-4 w-4 text-white relative z-10' />
    </div>
    <span className='font-display text-xl font-bold text-foreground'>
      Resume<span className='text-gradient'>IQ</span>
    </span>
  </Link>
);
