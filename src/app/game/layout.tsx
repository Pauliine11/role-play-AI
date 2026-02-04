import { NavbarResponsive } from '@/shared/components/layout/NavbarResponsive';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { Footer } from '@/shared/components/layout/Footer';
import { LayoutContent } from '@/shared/components/layout/LayoutContent';

export default function ImmersiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <NavbarResponsive variant="immersive" />
      <Sidebar variant="immersive" />
      
      <LayoutContent>
        {children}
      </LayoutContent>
      
      <Footer variant="immersive" />
    </div>
  );
}

