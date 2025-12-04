import BottomNav from './BottomNav';

export default function LayoutEntrenadora({ children }) {
  return (
    <div className="min-h-screen bg-pulso-negro pb-20">
      <main className="p-4">
        {children}
      </main>
      <BottomNav role="entrenadora" />
    </div>
  );
}