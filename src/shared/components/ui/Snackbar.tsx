interface SnackbarProps {
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export function Snackbar({ open, message, type }: SnackbarProps) {
  if (!open) return null;

  const typeStyles = {
    success: 'bg-[#C9A227] border-[#E6C847] text-[#0E1320] shadow-[0_0_20px_rgba(230,200,71,0.6)] font-bold',
    error: 'bg-[#8B2C2C] border-[#B84040] text-[#E6D5A7] shadow-[0_0_16px_rgba(139,44,44,0.4)]',
    info: 'bg-[#8C6A3F] border-[#C9A227] text-[#E6D5A7] shadow-[0_0_16px_rgba(201,162,39,0.4)]',
  };

  return (
    <div
      className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl border-3 transform transition-all duration-300 ease-in-out z-50 animate-slide-in ${typeStyles[type]}`}
      style={{ fontFamily: 'var(--font-merriweather)' }}
    >
      <div className="flex items-center gap-3">
        <span className="text-base font-semibold">{message}</span>
      </div>
    </div>
  );
}
