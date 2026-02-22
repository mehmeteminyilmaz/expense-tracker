import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import './ExpenseTracker.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const CATEGORIES = ['Yemek', 'Ulaşım', 'Eğlence', 'Sağlık', 'Alışveriş', 'Faturalar', 'Diğer'];
const CATEGORY_COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#10b981', '#f97316', '#6b7280'];

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Yemek');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterCategory, setFilterCategory] = useState('Tümü');
  const [activeTab, setActiveTab] = useState('list');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExpenses(data);
    });
    return () => unsubscribe();
  }, []);

  const addExpense = async () => {
    if (!title.trim() || !amount) {
      setError('Lütfen başlık ve tutar girin.');
      return;
    }
    if (isNaN(amount) || Number(amount) <= 0) {
      setError('Geçerli bir tutar girin.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await addDoc(collection(db, 'expenses'), {
        title,
        amount: Number(amount),
        category,
        date,
        createdAt: new Date()
      });
      setTitle('');
      setAmount('');
      setCategory('Yemek');
      setDate(new Date().toISOString().split('T')[0]);
    } catch (err) {
      setError('Hata: ' + err.message);
    }
    setLoading(false);
  };

  const deleteExpense = async (id) => {
    await deleteDoc(doc(db, 'expenses', id));
  };

  const filteredExpenses = filterCategory === 'Tümü'
    ? expenses
    : expenses.filter(e => e.category === filterCategory);

  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryTotals = CATEGORIES.map(cat => ({
    name: cat,
    total: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
  })).filter(c => c.total > 0);

  const pieData = {
    labels: categoryTotals.map(c => c.name),
    datasets: [{
      data: categoryTotals.map(c => c.total),
      backgroundColor: CATEGORY_COLORS.slice(0, categoryTotals.length),
      borderWidth: 0
    }]
  };

  const barData = {
    labels: categoryTotals.map(c => c.name),
    datasets: [{
      label: 'Harcama (₺)',
      data: categoryTotals.map(c => c.total),
      backgroundColor: CATEGORY_COLORS.slice(0, categoryTotals.length),
      borderRadius: 8
    }]
  };

  const chartOptions = {
    plugins: { legend: { labels: { color: '#fff' } } },
    scales: { x: { ticks: { color: '#aaa' } }, y: { ticks: { color: '#aaa' } } }
  };

  return (
    <div className="expense-tracker">
      {/* Header */}
      <div className="header">
        <div className="header-icon">💰</div>
        <h1>Expense Tracker</h1>
        <p>Harcamalarını takip et, analiz et, tasarruf et</p>
      </div>

      {/* Özet Kartları */}
      <div className="summary-cards">
        <div className="summary-card">
          <span>💳 Toplam Harcama</span>
          <h2>₺{totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</h2>
        </div>
        <div className="summary-card">
          <span>📋 İşlem Sayısı</span>
          <h2>{filteredExpenses.length}</h2>
        </div>
        <div className="summary-card">
          <span>📊 Ortalama</span>
          <h2>₺{filteredExpenses.length > 0 ? (totalAmount / filteredExpenses.length).toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0.00'}</h2>
        </div>
      </div>

      {/* Harcama Ekle */}
      <div className="add-section">
        <h3>➕ Yeni Harcama Ekle</h3>
        {error && <div className="error-box">{error}</div>}
        <div className="form-grid">
          <input
            type="text"
            placeholder="Harcama başlığı"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            type="number"
            placeholder="Tutar (₺)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
        <button className="btn-primary" onClick={addExpense} disabled={loading}>
          {loading ? '⏳ Ekleniyor...' : '➕ Harcama Ekle'}
        </button>
      </div>

      {/* Tab Menü */}
      <div className="tabs">
        <button className={activeTab === 'list' ? 'tab active' : 'tab'} onClick={() => setActiveTab('list')}>📋 Liste</button>
        <button className={activeTab === 'charts' ? 'tab active' : 'tab'} onClick={() => setActiveTab('charts')}>📊 Grafikler</button>
      </div>

      {/* Liste */}
      {activeTab === 'list' && (
        <div className="list-section">
          <div className="filter-row">
            {['Tümü', ...CATEGORIES].map(cat => (
              <button
                key={cat}
                className={filterCategory === cat ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          {filteredExpenses.length === 0 ? (
            <div className="empty-state">Henüz harcama yok 🎉</div>
          ) : (
            filteredExpenses.map(expense => (
              <div key={expense.id} className="expense-item">
                <div className="expense-left">
                  <span className="expense-category" style={{ backgroundColor: CATEGORY_COLORS[CATEGORIES.indexOf(expense.category)] + '22', color: CATEGORY_COLORS[CATEGORIES.indexOf(expense.category)] }}>
                    {expense.category}
                  </span>
                  <div>
                    <p className="expense-title">{expense.title}</p>
                    <p className="expense-date">{expense.date}</p>
                  </div>
                </div>
                <div className="expense-right">
                  <span className="expense-amount">₺{expense.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                  <button className="delete-btn" onClick={() => deleteExpense(expense.id)}>🗑️</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Grafikler */}
      {activeTab === 'charts' && (
        <div className="charts-section">
          {expenses.length === 0 ? (
            <div className="empty-state">Grafik için harcama ekleyin 📊</div>
          ) : (
            <>
              <div className="chart-box">
                <h3>🥧 Kategoriye Göre Dağılım</h3>
                <Pie data={pieData} />
              </div>
              <div className="chart-box">
                <h3>📊 Kategori Karşılaştırması</h3>
                <Bar data={barData} options={chartOptions} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ExpenseTracker;