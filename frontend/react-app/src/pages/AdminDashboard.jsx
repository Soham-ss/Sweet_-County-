import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const statusFlow = ['Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'];

const statusColors = {
    'Pending': '#e8a317',
    'Confirmed': '#2196F3',
    'Out for Delivery': '#ff9800',
    'Delivered': '#4CAF50',
    'Cancelled': '#cc4444'
};

const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000' : '';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('All');
    const [updatingId, setUpdatingId] = useState(null);
    const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'users', or 'settings'

    // Change password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordMsg, setPasswordMsg] = useState({ text: '', isError: false });

    // Create admin state
    const [adminName, setAdminName] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [adminMsg, setAdminMsg] = useState({ text: '', isError: false });

    useEffect(() => {
        fetchOrders();
        fetchUsers();
    }, [user]);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/orders/all`, {
                headers: { 'Authorization': `Bearer ${user?.token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            setOrders(data);
        } catch (err) {
            setError('Could not load orders.');
        }
        setLoading(false);
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
                headers: { 'Authorization': `Bearer ${user?.token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setUsersList(data);
            }
        } catch (err) {
            console.error('Error fetching user database:', err);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (!response.ok) throw new Error('Failed to update');
            const updatedOrder = await response.json();
            setOrders(prev => prev.map(o => o._id === orderId ? updatedOrder : o));
        } catch (err) {
            alert('Failed to update order status');
        }
        setUpdatingId(null);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordMsg({ text: '', isError: false });
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const data = await response.json();
            if (!response.ok) {
                setPasswordMsg({ text: data.message, isError: true });
            } else {
                setPasswordMsg({ text: 'Password changed successfully!', isError: false });
                setCurrentPassword('');
                setNewPassword('');
            }
        } catch (err) {
            setPasswordMsg({ text: 'Server error', isError: true });
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setAdminMsg({ text: '', isError: false });
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/create-admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ name: adminName, email: adminEmail, password: adminPassword })
            });
            const data = await response.json();
            if (!response.ok) {
                setAdminMsg({ text: data.message, isError: true });
            } else {
                setAdminMsg({ text: `Admin "${data.name}" (${data.email}) created successfully!`, isError: false });
                setAdminName('');
                setAdminEmail('');
                setAdminPassword('');
                fetchUsers();
            }
        } catch (err) {
            setAdminMsg({ text: 'Server error', isError: true });
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

    const totalOrders = orders.length;
    const pendingCount = orders.filter(o => o.status === 'Pending').length;
    const outForDeliveryCount = orders.filter(o => o.status === 'Out for Delivery').length;
    const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
    const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.totalAmount, 0);

    return (
        <div className="discovery-section" style={{ maxWidth: '1100px', minHeight: '60vh', margin: '0 auto', padding: '40px 20px' }}>
            <h2 style={{ marginBottom: '20px', color: '#3d2b1f', fontFamily: 'Playfair Display, serif', fontSize: '2.2rem' }}>
                🛠️ Admin Dashboard
            </h2>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '2px solid #e0d5c1' }}>
                {[
                    { key: 'orders', label: '📦 Orders', count: totalOrders },
                    { key: 'users', label: '👥 User Database', count: usersList.length },
                    { key: 'settings', label: '⚙️ Settings' }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            padding: '12px 25px',
                            border: 'none',
                            borderBottom: activeTab === tab.key ? '3px solid #a36b4f' : '3px solid transparent',
                            background: 'transparent',
                            color: activeTab === tab.key ? '#a36b4f' : '#7a635c',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: '0.2s'
                        }}
                    >
                        {tab.label} {tab.count !== undefined ? `(${tab.count})` : ''}
                    </button>
                ))}
            </div>

            {/* =================== ORDERS TAB =================== */}
            {activeTab === 'orders' && (
                <>
                    {/* Stats Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                        gap: '15px',
                        marginBottom: '30px'
                    }}>
                        {[
                            { label: 'Total Orders', value: totalOrders, color: '#4b3832', icon: '📦' },
                            { label: 'Pending', value: pendingCount, color: '#e8a317', icon: '⏳' },
                            { label: 'Out for Delivery', value: outForDeliveryCount, color: '#ff9800', icon: '🚚' },
                            { label: 'Delivered', value: deliveredCount, color: '#4CAF50', icon: '✅' },
                            { label: 'Revenue', value: `₹${totalRevenue}`, color: '#a36b4f', icon: '💰' },
                        ].map((stat) => (
                            <div key={stat.label} style={{
                                background: '#fff', padding: '20px', borderRadius: '12px',
                                boxShadow: '0 3px 10px rgba(0,0,0,0.06)', textAlign: 'center',
                                borderTop: `4px solid ${stat.color}`
                            }}>
                                <p style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{stat.icon}</p>
                                <h3 style={{ fontSize: '1.5rem', color: stat.color, marginBottom: '5px' }}>{stat.value}</h3>
                                <p style={{ fontSize: '0.85rem', color: '#7a635c' }}>{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Filter Tabs */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '25px' }}>
                        {['All', ...statusFlow].map((s) => (
                            <button key={s} className={`filter-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
                                {s}
                            </button>
                        ))}
                    </div>

                    {loading && <p style={{ textAlign: 'center', color: '#7a635c', fontSize: '1.1rem' }}>Loading orders...</p>}
                    {error && <p style={{ textAlign: 'center', color: '#cc4444' }}>{error}</p>}

                    {!loading && !error && filteredOrders.length === 0 && (
                        <p style={{ textAlign: 'center', color: '#7a635c', fontSize: '1.1rem', marginTop: '30px' }}>
                            No orders found{filter !== 'All' ? ` with status "${filter}"` : ''}.
                        </p>
                    )}

                    {!loading && filteredOrders.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {filteredOrders.map((order) => (
                                <div key={order._id} style={{
                                    background: '#fff', padding: '20px 25px', borderRadius: '15px',
                                    boxShadow: '0 3px 12px rgba(0,0,0,0.06)',
                                    borderLeft: `5px solid ${statusColors[order.status] || '#999'}`
                                }}>
                                    <div style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                                        flexWrap: 'wrap', gap: '10px', marginBottom: '12px'
                                    }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', color: '#3d2b1f', marginBottom: '4px' }}>
                                                Order #{order._id.slice(-8).toUpperCase()}
                                            </h3>
                                            <p style={{ fontSize: '0.85rem', color: '#999' }}>{formatDate(order.createdAt)}</p>
                                            <p style={{ fontSize: '0.9rem', color: '#7a635c', marginTop: '4px' }}>
                                                👤 {order.user?.name || 'Unknown'} — {order.user?.email || ''}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{
                                                display: 'inline-block', padding: '5px 14px', borderRadius: '20px',
                                                fontSize: '0.85rem', fontWeight: 'bold',
                                                background: (statusColors[order.status] || '#999') + '20',
                                                color: statusColors[order.status] || '#999'
                                            }}>
                                                {order.status}
                                            </span>
                                            <h3 style={{ marginTop: '8px', color: '#a36b4f' }}>₹{order.totalAmount}</h3>
                                        </div>
                                    </div>

                                    <div style={{ borderTop: '1px solid #f0ebe4', paddingTop: '10px', marginBottom: '12px' }}>
                                        {order.items.map((item, idx) => (
                                            <p key={idx} style={{ fontSize: '0.9rem', color: '#4b3832', padding: '3px 0' }}>
                                                {item.name} <span style={{ color: '#999' }}>×{item.quantity}</span>
                                                <span style={{ float: 'right', color: '#a36b4f', fontWeight: 'bold' }}>₹{item.price * item.quantity}</span>
                                            </p>
                                        ))}
                                    </div>

                                    <div style={{
                                        borderTop: '1px solid #f0ebe4', paddingTop: '12px',
                                        display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'
                                    }}>
                                        <span style={{ fontSize: '0.9rem', color: '#7a635c', fontWeight: 'bold' }}>Update:</span>
                                        {statusFlow.map((s) => (
                                            <button key={s}
                                                disabled={order.status === s || updatingId === order._id}
                                                onClick={() => updateStatus(order._id, s)}
                                                style={{
                                                    padding: '6px 14px', borderRadius: '20px',
                                                    border: order.status === s ? 'none' : `1.5px solid ${statusColors[s]}`,
                                                    background: order.status === s ? statusColors[s] : 'transparent',
                                                    color: order.status === s ? '#fff' : statusColors[s],
                                                    cursor: order.status === s ? 'default' : 'pointer',
                                                    fontWeight: 'bold', fontSize: '0.8rem',
                                                    opacity: updatingId === order._id ? 0.5 : 1,
                                                    transition: '0.2s'
                                                }}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* =================== USER DATABASE TAB =================== */}
            {activeTab === 'users' && (
                <div style={{ background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <h3 style={{ color: '#3d2b1f', fontSize: '1.4rem' }}>👥 Customer Accounts Database</h3>
                            <p style={{ color: '#7a635c', fontSize: '0.9rem' }}>Registered accounts in your bakery system</p>
                        </div>
                        <span style={{ background: '#fdf6f0', color: '#a36b4f', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            Total Accounts: {usersList.length}
                        </span>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #f0ebe4', color: '#7a635c', fontSize: '0.9rem' }}>
                                    <th style={{ padding: '12px 16px' }}>User ID</th>
                                    <th style={{ padding: '12px 16px' }}>Full Name</th>
                                    <th style={{ padding: '12px 16px' }}>Email Address</th>
                                    <th style={{ padding: '12px 16px' }}>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersList.map((u) => (
                                    <tr key={u._id} style={{ borderBottom: '1px solid #f9f5ef', color: '#3d2b1f' }}>
                                        <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#999' }}>#{u._id}</td>
                                        <td style={{ padding: '14px 16px', fontWeight: 'bold' }}>{u.name}</td>
                                        <td style={{ padding: '14px 16px', color: '#a36b4f' }}>{u.email}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{
                                                padding: '4px 12px', borderRadius: '14px', fontSize: '0.78rem', fontWeight: 'bold',
                                                background: u.isAdmin ? '#4b3832' : '#e8f5e9',
                                                color: u.isAdmin ? '#ffffff' : '#2e7d32'
                                            }}>
                                                {u.isAdmin ? '👑 Admin' : '👤 Customer'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* =================== SETTINGS TAB =================== */}
            {activeTab === 'settings' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' }}>
                    {/* Change Password */}
                    <div style={{
                        background: '#fff', padding: '30px', borderRadius: '15px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.06)'
                    }}>
                        <h3 style={{ marginBottom: '20px', color: '#3d2b1f' }}>🔒 Change Password</h3>
                        <p style={{ fontSize: '0.9rem', color: '#7a635c', marginBottom: '15px' }}>
                            Logged in as: <strong>{user?.email}</strong>
                        </p>

                        {passwordMsg.text && (
                            <p style={{
                                padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.9rem',
                                background: passwordMsg.isError ? '#fff0f0' : '#f0fff0',
                                color: passwordMsg.isError ? '#cc4444' : '#4CAF50'
                            }}>
                                {passwordMsg.text}
                            </p>
                        )}

                        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input
                                type="password" placeholder="Current Password" required
                                value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                                className="search-input" style={{ marginBottom: 0 }}
                            />
                            <input
                                type="password" placeholder="New Password" required minLength={4}
                                value={newPassword} onChange={e => setNewPassword(e.target.value)}
                                className="search-input" style={{ marginBottom: 0 }}
                            />
                            <button type="submit" className="cta-btn" style={{ background: '#4b3832', color: '#fff' }}>
                                Update Password
                            </button>
                        </form>
                    </div>

                    {/* Create New Admin */}
                    <div style={{
                        background: '#fff', padding: '30px', borderRadius: '15px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.06)'
                    }}>
                        <h3 style={{ marginBottom: '20px', color: '#3d2b1f' }}>👑 Create New Admin</h3>
                        <p style={{ fontSize: '0.9rem', color: '#7a635c', marginBottom: '15px' }}>
                            Create another admin account with full dashboard access.
                        </p>

                        {adminMsg.text && (
                            <p style={{
                                padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.9rem',
                                background: adminMsg.isError ? '#fff0f0' : '#f0fff0',
                                color: adminMsg.isError ? '#cc4444' : '#4CAF50'
                            }}>
                                {adminMsg.text}
                            </p>
                        )}

                        <form onSubmit={handleCreateAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input
                                type="text" placeholder="Admin Name" required
                                value={adminName} onChange={e => setAdminName(e.target.value)}
                                className="search-input" style={{ marginBottom: 0 }}
                            />
                            <input
                                type="email" placeholder="Admin Email" required
                                value={adminEmail} onChange={e => setAdminEmail(e.target.value)}
                                className="search-input" style={{ marginBottom: 0 }}
                            />
                            <input
                                type="password" placeholder="Admin Password" required minLength={4}
                                value={adminPassword} onChange={e => setAdminPassword(e.target.value)}
                                className="search-input" style={{ marginBottom: 0 }}
                            />
                            <button type="submit" className="cta-btn" style={{ background: '#a36b4f', color: '#fff' }}>
                                Create Admin Account
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
