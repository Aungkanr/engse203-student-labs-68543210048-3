import RequestCard from './RequestCard.jsx';

function RequestList({ requests, onDeleteRequest }) {
  // LAB4-R11: empty state เมื่อ requests.length === 0
  if (requests.length === 0) {
    return (
      <p className="empty-state">ไม่พบคำร้องที่ตรงกับตัวกรองนี้</p>
    );
  }

  return (
    <div className="request-list">
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          onDeleteRequest={onDeleteRequest}
        />
      ))}
    </div>
  );
}

export default RequestList;
