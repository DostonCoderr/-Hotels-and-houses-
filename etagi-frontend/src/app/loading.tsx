export default function Loading() {
  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'var(--bg)'
    }}>
      {/* Aylanuvchi yuklanish belgisi */}
      <div style={{
        width: 60,
        height: 60,
        border: '3px solid rgba(201,163,106,0.2)',
        borderTopColor: 'var(--g)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: 20
      }} />
      
      <h2 className="sf" style={{ fontSize: 24, color: 'var(--g2)', letterSpacing: 2 }}>
        ЭТАЖИ
      </h2>
      <p className="mu" style={{ marginTop: 8, fontSize: 14 }}>Загрузка данных...</p>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}