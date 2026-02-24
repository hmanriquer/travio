'use client';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import ReactQueryProvider from '@/providers/react-query.provider';
import ThemeProvider from '@/providers/theme.provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ReactQueryProvider>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  );
}
