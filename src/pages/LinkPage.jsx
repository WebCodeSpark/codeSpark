import React from 'react';

export default function LinkPage() {
  const backjoon = {
    source: '/img/bookjoon.jpg',
    url: 'https://www.acmicpc.net/',
  };

  const programmers = {
    source: '/img/programmers.jpg',
    url: 'https://programmers.co.kr/',
  };

  const github = {
    source: '/img/github.jpg',
    url: 'https://github.com/',
  };

  return (
    <div>
      <Link data={backjoon} />
      <Link data={programmers} />
      <Link data={github} />
    </div>
  );
}

function Link({ data }) {
  return (
      <a href={data.url} target="_blank"  rel="noopener noreferrer">
      <img src={data.source} alt="link" style={{ width: 40, borderRadius: '10%' }} />
    </a>
  );
}
