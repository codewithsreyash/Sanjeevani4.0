import React from 'react';
import {
  X,
  Download,
  Printer,
  Trash2,
  Calendar,
  Building,
  User,
  ShieldCheck,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { PatientDocument } from '../types';
import { useHealth } from '../context/HealthContext';

interface DocumentViewerModalProps {
  document: PatientDocument | null;
  onClose: () => void;
  patientName: string;
}

const CATEGORY_NAMES: Record<string, { label: string; icon: string; color: string }> = {
  lab_report: { label: 'Lab & Pathology Report', icon: '🧪', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' },
  radiology_scan: { label: 'Radiology / X-Ray / USG', icon: '🩻', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300' },
  prescription: { label: 'Clinical Prescription', icon: '💊', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
  discharge_summary: { label: 'Discharge Summary', icon: '📋', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
  vaccination: { label: 'Vaccination Certificate', icon: '💉', color: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300' },
  identity: { label: 'Identity / ABHA Document', icon: '🪪', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' }
};

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document: doc,
  onClose,
  patientName
}) => {
  const { deletePatientDocument } = useHealth();

  if (!doc) return null;

  const catMeta = CATEGORY_NAMES[doc.category] || {
    label: doc.category,
    icon: '📄',
    color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
  };

  const handleDownload = () => {
    if (!doc.fileData) return;
    const link = window.document.createElement('a');
    link.href = doc.fileData;
    link.download = `${doc.title.replace(/\s+/g, '_')}_${doc.id}.${doc.fileType === 'pdf' ? 'pdf' : 'jpg'}`;
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${doc.title} - ${patientName}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 24px; color: #1e293b; }
            .header { border-bottom: 2px solid #0d9488; padding-bottom: 12px; margin-bottom: 20px; }
            .title { font-size: 20px; font-weight: bold; color: #0f766e; }
            .meta { font-size: 12px; color: #64748b; margin-top: 6px; line-height: 1.5; }
            .content { margin-top: 20px; text-align: center; }
            img { max-width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${doc.title}</div>
            <div class="meta">
              <strong>Patient:</strong> ${patientName} &bull; <strong>Facility:</strong> ${doc.issuingFacility || 'N/A'}<br/>
              <strong>Date:</strong> ${new Date(doc.uploadDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} &bull; <strong>Type:</strong> ${doc.category.toUpperCase()}
            </div>
          </div>
          <div class="content">
            ${doc.fileType === 'image' && doc.fileData ? `<img src="${doc.fileData}" alt="${doc.title}" />` : `<p>Document Format: ${doc.fileType.toUpperCase()}</p>`}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove "${doc.title}" from ABHA Health Locker?`)) {
      deletePatientDocument(doc.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{catMeta.icon}</span>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  {doc.title}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catMeta.color}`}>
                  {catMeta.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Patient: <span className="font-semibold text-slate-700 dark:text-slate-300">{patientName}</span> • Uploaded on{' '}
                {new Date(doc.uploadDate).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              title="Print Document"
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              title="Download File"
              className="p-2 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/50 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              title="Delete Document"
              className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-100 dark:bg-slate-950/60">
          {/* Metadata Banner */}
          <div className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
              <Building className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Issuing Facility</span>
                <span className="font-semibold">{doc.issuingFacility || 'Government Health Sub-centre'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
              <User className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Uploaded By</span>
                <span className="font-semibold">
                  {doc.uploadedByName} ({doc.uploadedByRole.toUpperCase()})
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">ABHA Consent Status</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">ABDM Verified & Encrypted</span>
              </div>
            </div>
          </div>

          {doc.notes && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-3 text-xs text-amber-900 dark:text-amber-200">
              <span className="font-bold">Clinical Note:</span> {doc.notes}
            </div>
          )}

          {/* Document Preview Display */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-center min-h-[360px] shadow-sm">
            {doc.fileType === 'pdf' ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/60 rounded-2xl flex items-center justify-center mx-auto text-rose-600">
                  <FileText className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                  Portable Document Format (PDF)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  {doc.title} • {doc.fileSize}
                </p>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm inline-flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download / View PDF</span>
                </button>
              </div>
            ) : doc.fileData ? (
              <img
                src={doc.fileData}
                alt={doc.title}
                className="max-h-[550px] w-auto max-w-full object-contain rounded-lg shadow-sm border border-slate-100 dark:border-slate-800"
              />
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                Preview not available for this record format.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>ABHA Record ID: {doc.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
