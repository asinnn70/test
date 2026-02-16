import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { InventoryList } from './components/InventoryList';
import { AIChatAssistant } from './components/AIChatAssistant';
import { AddItemModal } from './components/AddItemModal';
import { Login } from './components/Login';
import { AppView, InventoryItem, User, UserRole } from './types';

// Mock initial data
const initialInventory: InventoryItem[] = [
  { id: '1', name: 'Laptop Gaming ASUS', category: 'Elektronik', quantity: 5, price: 15000000, description: 'Laptop high-end untuk gaming.', lastUpdated: new Date().toISOString() },
  { id: '2', name: 'Kopi Arabika 1kg', category: 'Makanan', quantity: 50, price: 120000, description: 'Biji kopi premium.', lastUpdated: new Date().toISOString() },
  { id: '3', name: 'Meja Kerja Kayu', category: 'Peralatan Rumah', quantity: 12, price: 850000, description: 'Meja minimalis jati.', lastUpdated: new Date().toISOString() },
  { id: '4', name: 'Headset Bluetooth', category: 'Elektronik', quantity: 8, price: 350000, description: 'Suara bass jernih.', lastUpdated: new Date().toISOString() },
  { id: '5', name: 'Jaket Hoodie', category: 'Pakaian', quantity: 25, price: 150000, description: 'Bahan cotton fleece.', lastUpdated: new Date().toISOString() },
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Check for persisted login (mock)
  useEffect(() => {
    const savedUser = localStorage.getItem('invenai_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('invenai_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('invenai_user');
    setView(AppView.DASHBOARD);
  };

  const handleAddItem = (newItem: InventoryItem) => {
    setInventory(prev => [newItem, ...prev]);
  };

  const handleDeleteItem = (id: string) => {
    if (user?.role !== UserRole.ADMIN) {
      alert("Akses ditolak. Hanya admin yang bisa menghapus barang.");
      return;
    }
    if (window.confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
      setInventory(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleUpdateStock = (id: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Sidebar 
        currentView={view} 
        onChangeView={setView} 
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 transition-all">
        <div className="max-w-7xl mx-auto">
          {view === AppView.DASHBOARD && (
            <Dashboard inventory={inventory} />
          )}
          
          {view === AppView.INVENTORY && (
            <InventoryList 
              inventory={inventory} 
              onDelete={handleDeleteItem}
              onUpdateStock={handleUpdateStock}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              userRole={user.role}
            />
          )}

          {view === AppView.AI_CHAT && (
            <AIChatAssistant inventory={inventory} />
          )}
        </div>
      </main>

      <AddItemModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddItem} 
      />
    </div>
  );
};

export default App;