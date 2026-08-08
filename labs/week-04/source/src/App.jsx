import { useState } from 'react';
import AppHeader from './components/AppHeader.jsx';
import SummaryPanel from './components/SummaryPanel.jsx';
import RequestForm from './components/RequestForm.jsx';
import FilterBar from './components/FilterBar.jsx';
import RequestList from './components/RequestList.jsx';
import { initialRequests } from './data/initialRequests.js';

// สร้าง id ใหม่ต่อจาก id เดิมที่มากที่สุดใน requests (ปลอดภัยแม้มีการลบรายการไปแล้ว)
function generateRequestId(requests) {
  const maxNumber = requests.reduce((max, request) => {
    const match = /^REQ-(\d+)$/.exec(request.id);
    const number = match ? Number(match[1]) : 0;
    return Math.max(max, number);
  }, 0);
  const nextNumber = maxNumber + 1;
  return `REQ-${String(nextNumber).padStart(3, '0')}`;
}

function App() {
  // LAB4-R04: requests/statusFilter เป็น state
  const [requests, setRequests] = useState(initialRequests);
  const [statusFilter, setStatusFilter] = useState('all');

  // LAB4-R04: summary เป็น derived data (คำนวณจาก requests ทุกครั้งที่ render)
  const summary = {
    total: requests.length,
    pending: requests.filter((request) => request.status === 'pending').length,
    inProgress: requests.filter((request) => request.status === 'in-progress').length,
    completed: requests.filter((request) => request.status === 'completed').length,
  };

  // LAB4-R08: filteredRequests จาก requests + statusFilter
  const filteredRequests =
    statusFilter === 'all'
      ? requests
      : requests.filter((request) => request.status === statusFilter);

  function handleAddRequest(requestData) {
    const newRequest = {
      id: generateRequestId(requests),
      status: 'pending',
      ...requestData,
    };
    setRequests([newRequest, ...requests]);
  }

  function handleDeleteRequest(requestId) {
    setRequests(requests.filter((request) => request.id !== requestId));
  }

  function handleFilterChange(nextFilter) {
    setStatusFilter(nextFilter);
  }

  return (
    <>
      <AppHeader
        title="Campus Service Request"
        subtitle="LAB 4 Starter — เปลี่ยน DOM-driven UI เป็น State-driven React UI"
      />
      <main className="container page-content">
        <SummaryPanel summary={summary} />
        <div className="workspace-grid">
          <RequestForm onAddRequest={handleAddRequest} />
          <section className="panel" aria-labelledby="request-list-title">
            <div className="section-heading">
              <h2 id="request-list-title">รายการคำร้อง</h2>
              <FilterBar value={statusFilter} onFilterChange={handleFilterChange} />
            </div>
            <RequestList
              requests={filteredRequests}
              onDeleteRequest={handleDeleteRequest}
            />
          </section>
        </div>
      </main>
    </>
  );
}

export default App;
