/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface BillManagerPortalProps {
  onExit: () => void;
}

/**
 * BillManagerPortal: Integrates the external Cloud Run Bill Management Pro dashboard.
 * It provides a clean, full-screen iframe view without any header or extra UI elements,
 * allowing the external app to handle its own navigation while maintaining 
 * integration with the main app's exit logic.
 */
export const BillManagerPortal: React.FC<BillManagerPortalProps> = ({ onExit }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-slate-950 flex flex-col overflow-hidden select-none animate-in fade-in duration-200">
      {/* Hidden Back Button for Accessibility - Portals usually handle their own back but main app needs a fallback */}
      <div className="sr-only">
        <button onClick={onExit} aria-label="Exit Bill Manager">Exit</button>
      </div>

      {/* Full-screen Cloud Run App Iframe */}
      <iframe
        src="https://bill-manager-180526203883.asia-southeast1.run.app/#dashboard"
        title="Bill Management Pro Dashboard"
        className="w-full flex-1 border-none bg-slate-950"
        allow="clipboard-read; clipboard-write; fullscreen; camera; microphone; geolocation"
        onLoad={() => {
          console.log('[BillManager] Dashboard iframe loaded successfully.');
        }}
      />
      
      {/* Small floating exit button for mobile fallback if back button fails (Optional, but user asked for NO header) */}
      {/* Based on user request "হেডার থাকবে না", we keep it completely clean. */}
    </div>
  );
};
