import React, { useState } from 'react';
import { InventoryItem, UserRole } from '../types';
import { Search, Plus, Trash2, Edit2, Filter, Lock } from 'lucide-react';

interface InventoryListProps {
  inventory: InventoryItem[];
  onDelete: (id: string) => void;
  onUpdateStock: (id: string, newQuantity: number) => void;
  onOpenAddModal: () => void;
  userRole: UserRole;
}

export const InventoryList: React.FC<InventoryListProps> = ({ 
  inventory, 
  onDelete, 
  onUpdateStock,
  onOpenAddModal,
  userRole
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(inventory.map(item => item.category))];
  const isAdmin = userRole === UserRole.ADMIN;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Inventaris</h1>
          <p className="text-gray-500">
            Kelola semua barang dan stok Anda di sini. 
            {!isAdmin && <span className="text-orange-500 text-xs ml-2 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">View Only Mode</span>}
          </p>
        </div>
        {isAdmin && (
          <button 
            onClick={onOpenAddModal}
            className="bg-primary text-white px-4 py-2.5 rounded-xl font-medium flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 active:scale-95"
          >
            <Plus size={20} className="mr-2" />
            Tambah Barang
          </button>
        )}
      </header>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari barang..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Filter size={20} className="text-gray-400 min-w-[20px]" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${filterCategory === cat 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produk</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Stok</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada barang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-400 truncate max-w-[200px]">{item.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => onUpdateStock(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 0}
                          className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-600 disabled:opacity-50"
                        >-</button>
                        <span className={`font-semibold w-8 text-center ${item.quantity < 10 ? 'text-red-600' : 'text-gray-700'}`}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => onUpdateStock(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-600"
                        >+</button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      Rp {item.price.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isAdmin ? (
                          <>
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => onDelete(item.id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        ) : (
                          <div title="Hanya Admin" className="p-2 text-gray-300">
                            <Lock size={16} />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};