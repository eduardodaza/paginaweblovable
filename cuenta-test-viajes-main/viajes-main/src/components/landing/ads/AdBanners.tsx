import { Megaphone } from "lucide-react";

function AdShell({ label, className = "", height = "h-24" }: { label: string; className?: string; height?: string }) {
  return (
    <div
      data-ad-slot={label}
      className={`w-full ${height} rounded-2xl border-2 border-dashed border-border bg-muted/40 flex items-center justify-center text-xs text-muted-foreground gap-2 ${className}`}
    >
      <Megaphone className="w-4 h-4" />
      <span className="font-medium">Espacio publicitario · {label}</span>
    </div>
  );
}

export const BannerPublicidadTop = () => (
  <div className="max-w-7xl mx-auto px-6 pt-24 pb-2">
    <AdShell label="Top Banner (728x90)" height="h-20" />
  </div>
);

export const BannerPublicidadSidebar = () => <AdShell label="Sidebar (300x600)" height="h-[400px]" />;

export const BannerPublicidadArticulo = () => (
  <div className="my-8">
    <AdShell label="In-Article (300x250)" height="h-32" />
  </div>
);

export const BannerPublicidadFooter = () => (
  <div className="max-w-7xl mx-auto px-6 py-6">
    <AdShell label="Footer Banner (970x250)" height="h-28" />
  </div>
);
