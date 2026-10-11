import React from "react";
import { AlertTriangle, Stethoscope } from "lucide-react";

export function MedicineDisclaimer() {
  return (
    <div className="rounded-xl bg-amber-50 border-2 border-amber-200/90 p-4 sm:p-5 text-amber-900 shadow-sm">
      <div className="flex items-start space-x-3.5">
        <div className="p-2 bg-amber-100 rounded-lg text-amber-800 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
            <Stethoscope className="w-4 h-4 text-amber-700" />
            Important Medical Disclaimer
          </h4>
          <p className="mt-1 text-xs sm:text-sm text-amber-800 leading-relaxed font-medium">
            This is an authentic imported over-the-counter (OTC) health / dietary supplement.
            <strong> Please consult a doctor or healthcare professional before use.</strong> It is not intended to diagnose, treat, cure, or replace prescribed clinical treatment. Keep out of reach of children.
          </p>
        </div>
      </div>
    </div>
  );
}
