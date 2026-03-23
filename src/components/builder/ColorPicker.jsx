import { useState } from 'react';
import { Palette, X, Check } from 'lucide-react';

// 30 accent colors across 6 categories.
// The picker opens a panel grouped by hue family so users can
// quickly find the right color without scrolling a flat list.

const COLOR_GROUPS = [
  {
    label: 'Blues',
    colors: [
      { name: 'Cobalt',      value: '#2563EB' },
      { name: 'Sky',         value: '#0EA5E9' },
      { name: 'Royal',       value: '#3B82F6' },
      { name: 'Navy',        value: '#1E3A8A' },
      { name: 'Slate Blue',  value: '#6366F1' },
    ],
  },
  {
    label: 'Purples',
    colors: [
      { name: 'Violet',      value: '#7C3AED' },
      { name: 'Purple',      value: '#9333EA' },
      { name: 'Plum',        value: '#6B21A8' },
      { name: 'Mauve',       value: '#A855F7' },
      { name: 'Fuchsia',     value: '#D946EF' },
    ],
  },
  {
    label: 'Greens',
    colors: [
      { name: 'Emerald',     value: '#10B981' },
      { name: 'Forest',      value: '#16A34A' },
      { name: 'Teal',        value: '#0D9488' },
      { name: 'Sage',        value: '#4ADE80' },
      { name: 'Olive',       value: '#65A30D' },
    ],
  },
  {
    label: 'Reds & Pinks',
    colors: [
      { name: 'Crimson',     value: '#DC2626' },
      { name: 'Rose',        value: '#E11D48' },
      { name: 'Pink',        value: '#EC4899' },
      { name: 'Coral',       value: '#F43F5E' },
      { name: 'Salmon',      value: '#FB7185' },
    ],
  },
  {
    label: 'Warm',
    colors: [
      { name: 'Amber',       value: '#D97706' },
      { name: 'Orange',      value: '#EA580C' },
      { name: 'Saffron',     value: '#F59E0B' },
      { name: 'Tangerine',   value: '#F97316' },
      { name: 'Gold',        value: '#EAB308' },
    ],
  },
  {
    label: 'Neutrals',
    colors: [
      { name: 'Charcoal',    value: '#374151' },
      { name: 'Slate',       value: '#475569' },
      { name: 'Zinc',        value: '#52525B' },
      { name: 'Stone',       value: '#57534E' },
      { name: 'Graphite',    value: '#1F2937' },
    ],
  },
];

const ALL_COLORS = COLOR_GROUPS.flatMap((g) => g.colors);

const ColorPicker = ({ selectedColor, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(selectedColor || '#3B82F6');

  const current = ALL_COLORS.find((c) => c.value === selectedColor);

  const handleCustom = (e) => {
    setCustomColor(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-1.5 text-sm text-primary bg-primary/10 hover:bg-primary/20 transition-all px-3 py-2 rounded-lg'
        title='Accent color'
      >
        <Palette size={14} />
        <div className='w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm flex-shrink-0'
          style={{ backgroundColor: selectedColor }} />
        <span className='text-xs text-muted-foreground hidden sm:inline'>
          {current?.name ?? 'Custom'}
        </span>
      </button>

      {isOpen && (
        <>
          <div className='fixed inset-0 z-10' onClick={() => setIsOpen(false)} />
          <div className='absolute top-full left-0 mt-2 z-20 bg-popover rounded-xl border border-border shadow-xl p-4 w-72'>
            <div className='flex items-center justify-between mb-3'>
              <p className='text-sm font-semibold text-foreground'>Accent Color</p>
              <button onClick={() => setIsOpen(false)}
                className='p-1 rounded-lg hover:bg-secondary text-muted-foreground'>
                <X className='h-4 w-4' />
              </button>
            </div>

            <div className='space-y-3 max-h-72 overflow-y-auto pr-0.5'>
              {COLOR_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5'>
                    {group.label}
                  </p>
                  <div className='grid grid-cols-5 gap-1.5'>
                    {group.colors.map((color) => {
                      const isSelected = selectedColor === color.value;
                      return (
                        <button
                          key={color.value}
                          onClick={() => { onChange(color.value); setIsOpen(false); }}
                          title={color.name}
                          className={`relative w-9 h-9 rounded-lg border-2 transition-all duration-150 hover:scale-110 ${
                            isSelected ? 'border-white scale-110 ring-2 ring-primary/50 shadow-md' : 'border-transparent hover:border-white/60'
                          }`}
                          style={{ backgroundColor: color.value }}
                        >
                          {isSelected && (
                            <Check className='absolute inset-0 m-auto h-4 w-4 text-white drop-shadow' />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom color picker */}
            <div className='mt-3 pt-3 border-t border-border'>
              <p className='text-xs font-semibold text-muted-foreground mb-2'>Custom Color</p>
              <div className='flex items-center gap-2'>
                <input
                  type='color'
                  value={customColor}
                  onChange={handleCustom}
                  className='w-9 h-9 rounded-lg border border-border cursor-pointer bg-transparent p-0.5'
                />
                <input
                  type='text'
                  value={customColor}
                  onChange={(e) => {
                    const v = e.target.value;
                    setCustomColor(v);
                    if (/^#[0-9A-Fa-f]{6}$/.test(v)) onChange(v);
                  }}
                  placeholder='#3B82F6'
                  className='flex-1 px-2 py-1.5 text-xs rounded-lg border border-border bg-secondary/50 text-foreground outline-none focus:ring-2 focus:ring-ring font-mono'
                  maxLength={7}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ColorPicker;
