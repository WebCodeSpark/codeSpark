import React from 'react';
import LinkPage from '../pages/LinkPage';

export default function Footer() {
  return (
    <footer style={{ textAlign: 'center', marginTop: '20px', padding: '10px 0', backgroundColor: '#f1f1f1' }}>
      <LinkPage/>
      <div style={{ color: '#555' }}>© 2024 CodeSpark </div>
    </footer>
  );
}
