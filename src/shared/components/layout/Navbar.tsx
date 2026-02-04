export function Navbar() {
  return (
    <nav className="fixed top-0 left-64 right-0 z-50 bg-[#101827]/95 backdrop-blur-md border-b-2 border-[#3A2F1E] shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
      {/* Navbar simplifiée - démarre après la sidebar */}
      <div className="h-16 flex items-center justify-center">
        <h1 className="text-xl font-bold text-[#C9A227] tracking-wider drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]" style={{ fontFamily: 'var(--font-cinzel)' }}>
          Le Grimoire Éveillé
        </h1>
      </div>
    </nav>
  );
}

