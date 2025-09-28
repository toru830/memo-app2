function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>メモアプリ</h1>
      <p>サイトは正常に動作しています！</p>
      <button onClick={() => alert('ボタンが動作しています！')}>
        テストボタン
      </button>
    </div>
  );
}

export default App;