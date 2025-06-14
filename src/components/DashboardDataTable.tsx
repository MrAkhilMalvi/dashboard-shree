import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TableRow } from '../types/dashboard';

interface TableProps {
  data: TableRow[];
  sectionName?: 'ssc' | 'sci' | 'gen'; // optional, default: 'ssc'
}

const getFormattedTimestamp = (): string => {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
};

const exportToPDF = (data: TableRow[], sectionName: 'ssc' | 'sci' | 'gen' = 'ssc') => {
  const doc = new jsPDF();
  const timestamp = getFormattedTimestamp();
  const fileName = `${sectionName}_${timestamp}.pdf`;

  autoTable(doc, {
    startY: 30,
    head: [['District Id', 'District Name', 'School Code', 'Name', 'Mobile No', 'Pending PDF Count']],
    body: data.map((item) => [
      item.dist_id || '-',
      item.dist_name || '-',
      item.code || '-',
      item.name || '-',
      item.mobileno || '-',
      item.pdf_count?.toString() || '0',
    ]),
    didDrawPage: () => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const currentPage = (doc as any).internal.getCurrentPageInfo().pageNumber;

      if (currentPage === 1) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('School Not Downloaded HT', pageWidth / 2, 15, { align: 'center' });
      }

      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text(`Page ${currentPage}`, 10, pageHeight - 10);
      doc.text(timestamp, pageWidth / 2, pageHeight - 10, { align: 'center' });
    },
    margin: { top: 30 },
  });

  doc.save(fileName);
};

const DashboardDataTable: React.FC<TableProps> = ({ data, sectionName = 'ssc' }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">Downloaded Summary</h2>
        <button
          onClick={() => exportToPDF(data, sectionName)}
          className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md"
        >
          Download PDF
        </button>
      </div>

      {/* Table Scroll Wrapper */}
      <div className="w-full overflow-x-auto rounded-md border border-gray-100 max-h-[400px]">
        <table className="min-w-[640px] w-full text-sm text-left text-gray-700">
          <thead className="sticky top-0 z-10 bg-gray-100 text-gray-800 uppercase text-xs">
            <tr>
              <th className="px-3 py-2">District Id</th>
              <th className="px-3 py-2">District Name</th>
              <th className="px-3 py-2">School Code</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Mobile No</th>
              <th className="px-3 py-2">Pending PDF Count</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr
                key={idx}
                className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition`}
              >
                <td className="px-3 py-2 whitespace-nowrap">{item.dist_id || '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap">{item.dist_name || '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap">{item.code || '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap">{item.name || '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap">{item.mobileno || '-'}</td>
                <td className="px-3 py-2 font-medium whitespace-nowrap">{item.pdf_count ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardDataTable;
