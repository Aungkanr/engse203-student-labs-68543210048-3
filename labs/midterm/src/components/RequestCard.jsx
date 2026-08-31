import { Link } from 'react-router-dom';

function RequestCard({ request, onDeleteRequest, onMarkDone }) {
  return (
    <article className="request-card">
      <div>
        <p className="request-id">{request.id}</p>
        <h3><Link to={`/requests/${request.id}`}>{request.requestType}</Link></h3>
        <p>{request.location}</p>
        <p>{request.details}</p>
        {/* TODO B4: แทน {request.priority} ด้านล่างด้วย <PriorityBadge priority={request.priority} /> ที่คุณสร้าง */}
        <p><span className={`badge ${request.status}`}>{request.status}</span> · {request.priority}</p>
      </div>

      {/* 🔴 ส่วนที่แก้ไข: สร้าง div มาครอบเพื่อจัดกลุ่มปุ่ม และเพิ่มเงื่อนไขซ่อน/แสดงปุ่ม "ทำเสร็จ" */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        
        {/* เงื่อนไข: ถ้าสถานะ "ไม่ใช่" completed ถึงจะแสดงปุ่ม "ทำเสร็จ" */}
        {request.status !== 'completed' && (
          <button className="button primary" type="button" onClick={() => onMarkDone(request.id)}>
            ทำเสร็จ
          </button>
        )}

        <button className="button danger" type="button" onClick={() => onDeleteRequest(request.id)} aria-label={`ลบคำร้อง ${request.id}`}>
          ลบ
        </button>

      </div>
    </article>
  );
}

export default RequestCard;