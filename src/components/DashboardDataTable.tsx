import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TableRow } from '../types/dashboard';

interface TableProps {
  data: TableRow[];
  sectionName?: 'ssc' | 'sci' | 'gen';
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header with Export Button */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">School Data Table</h3>
          <p className="text-sm text-gray-600">Total records: {data.length}</p>
        </div>
        <button
          onClick={() => exportToPDF(data, sectionName)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200 shadow-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  District ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  District Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  School Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Mobile No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Pending PDF Count
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, idx) => (
                <tr
                  key={idx}
                  className={`${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-indigo-50 transition-colors duration-150`}
                >
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {item.dist_id || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {item.dist_name || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {item.code || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap max-w-xs truncate">
                    {item.name || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {item.mobileno || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {item.pdf_count ?? 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
          <p className="mt-1 text-sm text-gray-500">No records found for this section.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardDataTable;