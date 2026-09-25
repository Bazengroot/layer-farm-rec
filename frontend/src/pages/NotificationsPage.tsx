// frontend/src/pages/NotificationsPage.tsx

import React, { useEffect, useState } from 'react';
import { fetchNotifications, markNotificationAsRead } from '../api/mobileApi';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const loadData = () => {
    setLoading(true);
    fetchNotifications()
      .then(setNotifications)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = categoryFilter
    ? notifications.filter((n) => n.category === categoryFilter)
    : notifications;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Notifications & Threshold Alerts</h1>
          <p className="text-sm text-gray-500">Configurable alerts for abnormal mortality, low feed, medication withdrawal, and pending approvals</p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b text-xs">
        <button
          className={`px-3 py-1.5 rounded-full font-medium ${!categoryFilter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setCategoryFilter('')}
        >
          All Notifications
        </button>
        <button
          className={`px-3 py-1.5 rounded-full font-medium ${categoryFilter === 'abnormal_mortality' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setCategoryFilter('abnormal_mortality')}
        >
          Mortality Alerts
        </button>
        <button
          className={`px-3 py-1.5 rounded-full font-medium ${categoryFilter === 'low_feed_stock' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setCategoryFilter('low_feed_stock')}
        >
          Low Feed Stock
        </button>
        <button
          className={`px-3 py-1.5 rounded-full font-medium ${categoryFilter === 'pending_approval' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setCategoryFilter('pending_approval')}
        >
          Pending Approvals
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading notifications...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-8 border rounded text-center text-gray-500">No unread notifications.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 border rounded shadow-sm flex justify-between items-start ${
                item.is_read ? 'bg-white text-gray-600' : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div>
                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                  {item.category}
                </span>
                <h3 className="font-bold text-base mt-1">{item.title}</h3>
                <p className="text-sm mt-1">{item.message}</p>
                <span className="text-xs text-gray-400 mt-2 block">{new Date(item.created_at).toLocaleString()}</span>
              </div>

              {!item.is_read && (
                <button
                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  onClick={() => handleRead(item.id)}
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
