import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  DollarSign,
  FileText,
  Edit2,
  Trash2,
  MessageSquare,
  LayoutGrid,
  List,
  Calendar,
  Layers,
  ArrowUpDown,
  Share2,
} from 'lucide-react';
import { LandRecord, FilterStatus } from '../types';
import { formatCurrency, formatDate, generateWhatsAppMessage } from '../utils/formatters';

interface RecordListProps {
  records: LandRecord[];
  currency: string;
  activeFilter: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  onAddNew: () => void;
  onEdit: (record: LandRecord) => void;
  onDelete: (id: string) => void;
  onOpenPayment: (record: LandRecord) => void;
  onOpenReceipt: (record: LandRecord) => void;
}

export const RecordList: React.FC<RecordListProps> = ({
  records,
  currency,
  activeFilter,
  onFilterChange,
  onAddNew,
  onEdit,
  onDelete,
  onOpenPayment,
  onOpenReceipt,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'due' | 'total'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter & Search
  const filteredRecords = useMemo(() => {
    let result = [...records];

    // Status filter
    if (activeFilter === 'paid') {
      result = result.filter((r) => r.due <= 0);
    } else if (activeFilter === 'due') {
      result = result.filter((r) => r.due > 0);
    } else if (activeFilter === 'partial') {
      result = result.filter((r) => r.paid > 0 && r.due > 0);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.phone && r.phone.toLowerCase().includes(q)) ||
          (r.plotNumber && r.plotNumber.toLowerCase().includes(q)) ||
          r.date.includes(q) ||
          (r.notes && r.notes.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'due') {
        comparison = b.due - a.due;
      } else if (sortBy === 'total') {
        comparison = b.total - a.total;
      }
      return sortOrder === 'desc' ? comparison : -comparison;
    });

    return result;
  }, [records, activeFilter, searchQuery, sortBy, sortOrder]);

  const toggleSort = (field: 'date' | 'name' | 'due' | 'total') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleQuickWhatsApp = (record: LandRecord) => {
    const text = generateWhatsAppMessage(record, currency);
    const cleanPhone = record.phone?.replace(/[^0-9]/g, '') || '';
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4">
      {/* Search, Filter Tabs & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone, plot #, date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters and View toggles */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center rounded-xl bg-slate-100 p-0.5 text-xs font-semibold">
            <button
              onClick={() => onFilterChange('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeFilter === 'all' ? 'bg-white text-emerald-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              All ({records.length})
            </button>
            <button
              onClick={() => onFilterChange('paid')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                activeFilter === 'paid' ? 'bg-white text-emerald-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Paid
            </button>
            <button
              onClick={() => onFilterChange('due')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                activeFilter === 'due' ? 'bg-white text-amber-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              <AlertCircle className="w-3 h-3 text-amber-600" />
              Deu
            </button>
          </div>

          {/* Table / Card View Toggle */}
          <div className="hidden sm:flex items-center rounded-xl border border-slate-200 p-0.5">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'cards' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add New Record Button */}
          <button
            onClick={onAddNew}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">+ Record</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Results Header / Sorting */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong>{filteredRecords.length}</strong> of {records.length} records
          {activeFilter !== 'all' && ` (Filter: ${activeFilter.toUpperCase()})`}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[11px]">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-slate-200 bg-white py-1 px-2 text-xs font-medium text-slate-700"
          >
            <option value="date">Date</option>
            <option value="due">Due Amount</option>
            <option value="total">Total Value</option>
            <option value="name">Name</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
            title="Toggle sort order"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredRecords.length === 0 && (
        <div className="text-center py-12 px-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No records found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `No match for "${searchQuery}". Try searching with different keywords.`
              : 'No entries currently match the selected filter.'}
          </p>
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add New Record
          </button>
        </div>
      )}

      {/* CARD VIEW (Default & Mobile Optimized) */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredRecords.map((record) => {
            const isFullyPaid = record.due <= 0;
            return (
              <div
                key={record.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-4 sm:p-5 border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition duration-200"
              >
                {/* Top Row: Name, Photo thumbnail, Status badge & Date */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {record.photoUrl && (
                        <img
                          src={record.photoUrl}
                          alt="Land Photo"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(record);
                          }}
                          className="w-10 h-10 rounded-xl object-cover border-2 border-emerald-400 shadow-xs shrink-0 cursor-pointer hover:scale-105 transition"
                          title="জমির ছবি (Click to view/edit)"
                        />
                      )}
                      <div
                        onClick={() => onEdit(record)}
                        className="cursor-pointer group/title min-w-0"
                        title="ক্লিক করে এডিট করুন (Click to edit)"
                      >
                        <h3 className="font-extrabold text-slate-900 text-base tracking-tight flex items-center gap-1.5 group-hover/title:text-emerald-800 transition truncate">
                          {record.name}
                          <Edit2 className="w-3 h-3 text-slate-400 group-hover/title:text-emerald-700 opacity-60 group-hover/title:opacity-100 shrink-0" />
                        </h3>
                        {record.plotNumber && (
                          <p className="text-[11px] text-slate-500 font-medium truncate">
                            📍 {record.plotNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase shrink-0 ${
                        isFullyPaid
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {isFullyPaid ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          PAID
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3 text-amber-700" />
                          DUE PENDING
                        </>
                      )}
                    </span>
                  </div>

                  {/* Core 7 Requested Fields Grid */}
                  <div className="grid grid-cols-2 gap-2 my-3 rounded-xl bg-slate-50/80 p-3 border border-slate-100 text-xs">
                    {/* Land Area */}
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">Land Area</span>
                      <span className="font-bold text-slate-800 text-xs sm:text-sm">
                        {record.land} {record.unit}
                      </span>
                    </div>

                    {/* Rate */}
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">Rate / Unit</span>
                      <span className="font-bold text-slate-800 text-xs sm:text-sm">
                        {formatCurrency(record.rate, currency)}
                      </span>
                    </div>

                    {/* Total */}
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Amount</span>
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        {formatCurrency(record.total, currency)}
                      </span>
                    </div>

                    {/* Date */}
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">Date</span>
                      <span className="font-medium text-slate-700 text-xs">
                        {formatDate(record.date)}
                      </span>
                    </div>
                  </div>

                  {/* Paid & Deu Big Metric Split */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[10px] font-bold uppercase text-emerald-700 block">Paid (জমা)</span>
                      <span className="text-base font-extrabold text-emerald-900">
                        {formatCurrency(record.paid, currency)}
                      </span>
                    </div>

                    <div
                      className={`p-2.5 rounded-xl border ${
                        isFullyPaid
                          ? 'bg-slate-50 border-slate-200 text-slate-500'
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase block">Deu / Due (বাকি)</span>
                      <span className={`text-base font-extrabold ${isFullyPaid ? 'text-emerald-700' : 'text-amber-900'}`}>
                        {isFullyPaid ? '0 (Cleared)' : formatCurrency(record.due, currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    {/* Collect payment button */}
                    <button
                      onClick={() => onOpenPayment(record)}
                      className="inline-flex items-center gap-1 py-1.5 px-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs"
                      title="Collect Payment"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{record.due > 0 ? '+ Pay' : 'Payment'}</span>
                    </button>

                    {/* Receipt voucher */}
                    <button
                      onClick={() => onOpenReceipt(record)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                      title="View & Print Voucher"
                    >
                      <FileText className="w-4 h-4" />
                    </button>

                    {/* WhatsApp */}
                    <button
                      onClick={() => handleQuickWhatsApp(record)}
                      className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition"
                      title="Send WhatsApp Receipt"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Edit & Delete */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEdit(record)}
                      className="inline-flex items-center gap-1 py-1.5 px-2.5 rounded-lg border border-slate-300 hover:border-emerald-500 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-bold transition shadow-2xs cursor-pointer active:scale-95"
                      title="এডিট করুন (Edit Record Details)"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>এডিট</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete record for ${record.name}?`)) {
                          onDelete(record.id);
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3.5">Name</th>
                <th className="py-3 px-3">Land</th>
                <th className="py-3 px-3">Rate</th>
                <th className="py-3 px-3">Total</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-emerald-800">Paid</th>
                <th className="py-3 px-3 text-amber-800">Deu</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredRecords.map((r) => {
                const isPaid = r.due <= 0;
                return (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3.5 font-bold text-slate-900">
                      <div>{r.name}</div>
                      {r.plotNumber && <span className="text-[10px] text-slate-400">{r.plotNumber}</span>}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {r.land} {r.unit}
                    </td>
                    <td className="py-3 px-3">{formatCurrency(r.rate, currency)}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{formatCurrency(r.total, currency)}</td>
                    <td className="py-3 px-3 text-slate-500">{formatDate(r.date)}</td>
                    <td className="py-3 px-3 font-bold text-emerald-800">{formatCurrency(r.paid, currency)}</td>
                    <td className="py-3 px-3 font-bold text-amber-800">{isPaid ? '0' : formatCurrency(r.due, currency)}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isPaid ? 'PAID' : 'DUE'}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onOpenPayment(r)}
                          className="px-2 py-1 rounded bg-emerald-700 text-white font-bold text-[10px]"
                        >
                          + Pay
                        </button>
                        <button
                          onClick={() => onOpenReceipt(r)}
                          className="p-1 rounded hover:bg-slate-100 text-slate-600"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEdit(r)}
                          className="p-1 rounded hover:bg-slate-100 text-slate-600"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${r.name}?`)) onDelete(r.id);
                          }}
                          className="p-1 rounded hover:bg-rose-50 text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
