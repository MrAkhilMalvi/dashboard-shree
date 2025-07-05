import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TableRow } from '../types/dashboard';
// import "../assets/fonts/MuktaVaani-Medium-normal"; 


interface TableProps {
  data: TableRow[];
  sectionName?: 'ssc' | 'science' | 'general';
  startIndex?: number;
}

type SortKey = 'dist_id' | 'dist_name' | 'code' | 'name';
type SortDirection = 'asc' | 'desc';

const getFormattedTimestamp = (): string => {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
};

const exportToPDF = (data: TableRow[], sectionName: 'ssc' | 'science' | 'general' = 'ssc') => {
  const doc = new jsPDF();
  const timestamp = getFormattedTimestamp();
  const fileName = `${sectionName}_${timestamp}.pdf`;

  // 🧠 Dynamic title based on section
  const getTitle = () => {
    console.log(sectionName);
    switch (sectionName) {
      
      case 'general':
        return 'HSC GENERAL PURAK 2025 PENDING HALLTICKET DOWNLOAD REPORT';
      case 'science':
        return 'HSC SCIENCE PURAK 2025 PENDING HALLTICKET DOWNLOAD REPORT';
      case 'ssc':
      default:
        return 'SSC PURAK 2025 PENDING HALLTICKET DOWNLOAD REPORT';
    }
  };

  autoTable(doc, {
    startY: 30,
    head: [['Sr. No', 'District Id', 'District Name', 'School Code', 'Name', 'Mobile No', 'Pending PDF Count']],
    body: data.map((item, idx) => [
      (idx + 1).toString(),
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
        // console.log(doc.getFontList());
//         doc.setFont("MuktaVaani-Medium", "normal"); // Must match name & style from the generated file
// doc.setFontSize(14);

// // ✅ Gujarati Text
// doc.text("ગુજરાત માધ્યમિક અને ઉચ્ચતર માધ્યમિક શિક્ષણ બોર્ડ", 105, 20, { align: "center" });
        doc.setFont('helvetica', 'bold');
        doc.text(getTitle(), pageWidth / 2, 15, { align: 'center' }); // 👈 Dynamic title here
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
  const [searchName, setSearchName] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aValue = (a[sortKey] ?? '').toString().toLowerCase();
    const bValue = (b[sortKey] ?? '').toString().toLowerCase();
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter((item) =>
    item.name?.toLowerCase().includes(searchName.toLowerCase()) &&
    item.code?.toLowerCase().includes(searchCode.toLowerCase())
  );

  const renderSortArrow = (key: SortKey) => {
    const isActive = sortKey === key;
    return (
      <span
        className={`ml-1 text-2xl align-middle transition-colors duration-300 ${isActive ? 'text-indigo-600 font-bold' : 'text-gray-400'
          }`}
      >
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between justify-center items-center gap-3 mb-4">

        <h2 className="text-base sm:text-lg font-semibold text-gray-800">Downloaded Summary</h2>

        <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <input
            type="text"
            placeholder="Search by School Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-2 w-full sm:w-64 hidden sm:block"
          />
          <input
            type="text"
            placeholder="School Code"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-2 w-full sm:w-40 hidden sm:block"
          />
          <button
            onClick={() => {
              setSearchName('');
              setSearchCode('');
            }}
            className="text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md hidden sm:block"
          >
            Reset
          </button>
          <button
            onClick={() => exportToPDF(filteredData, sectionName)}
            className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Table Scroll Wrapper */}
      <div className="w-full overflow-x-auto rounded-md border border-gray-100 max-h-[400px] hidden sm:block">
        <table className="min-w-[640px] w-full text-sm text-left text-gray-700">
          <thead className="sticky top-0 z-10 bg-gray-100 text-gray-800 uppercase text-xs">
            <tr>
                <th className="px-3 py-2">Sr. No</th>
              <th className="px-3 py-2 cursor-pointer" onClick={() => handleSort('dist_id')}>
                District Id{renderSortArrow('dist_id')}
              </th>
              <th className="px-3 py-2 cursor-pointer" onClick={() => handleSort('dist_name')}>
                District Name{renderSortArrow('dist_name')}
              </th>
              <th className="px-3 py-2 cursor-pointer" onClick={() => handleSort('code')}>
                School Code{renderSortArrow('code')}
              </th>
              <th className="px-3 py-2 cursor-pointer" onClick={() => handleSort('name')}>
                Name{renderSortArrow('name')}
              </th>
              <th className="px-3 py-2">Mobile No</th>
              <th className="px-3 py-2">Pending PDF Count</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, idx) => (
                <tr
                  key={idx}
                  className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition`}
                >
                  <td className="px-3 py-2 whitespace-nowrap">{idx + 1}</td> 
                  <td className="px-3 py-2 whitespace-nowrap">{item.dist_id || '-'}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{item.dist_name || '-'}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{item.code || '-'}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{item.name || '-'}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{item.mobileno || '-'}</td>
                  <td className="px-3 py-2 font-medium whitespace-nowrap">{item.pdf_count ?? 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-sm text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardDataTable;