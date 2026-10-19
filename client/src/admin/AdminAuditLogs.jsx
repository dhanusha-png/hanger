import React, { useState, useEffect } from 'react';
import { History, Search, ShieldCheck } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { api } from '../lib/api';

export function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await api('/admin/audit-logs');
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">SECURITY & COMPLIANCE</span>
            <h1>Audit Trail & System Activity</h1>
            <p>Immutable log of administrative updates, role changes, product modifications and orders.</p>
          </div>
        </div>

        <div className="admin-card" style={{ marginTop: '20px' }}>
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>Entity Target</th>
                <th>Performed By</th>
                <th>IP Address</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#95a8a0' }}>
                    Loading audit trail…
                  </td>
                </tr>
              ) : logs.length ? (
                logs.map((log) => (
                  <tr key={log._id}>
                    <td>
                      <span className="admin-badge new" style={{ textTransform: 'uppercase' }}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      <b style={{ color: '#fff' }}>{log.entity}</b>
                      {log.entityId && <small style={{ display: 'block', color: '#6e7a76' }}>ID: {log.entityId}</small>}
                    </td>
                    <td>
                      <div>{log.userName || 'System'}</div>
                      <small style={{ color: '#e8c070' }}>{log.userRole || 'admin'}</small>
                    </td>
                    <td>
                      <small style={{ color: '#95a8a0' }}>{log.ip}</small>
                    </td>
                    <td>
                      <small style={{ color: '#b2c0ba' }}>
                        {new Date(log.createdAt).toLocaleString('en-IN')}
                      </small>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="admin-empty">
                    No audit records logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
