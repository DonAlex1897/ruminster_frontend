import React from 'react';

function App() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🚧 Under Construction 🚧</h1>
      <p style={styles.text}>We’re working hard to bring something great. Stay tuned!</p>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdf6e3',
    color: '#333',
    fontFamily: 'sans-serif',
    padding: '0 1rem',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  text: {
    fontSize: '1.2rem',
  },
};

export default App;
