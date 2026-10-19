import React from 'react';

const steps = [
  {
    num: '01',
    title: 'Understand',
    desc: 'We assess your space, ventilation, ceiling height, and your family’s daily drying or storage routines.'
  },
  {
    num: '02',
    title: 'Plan',
    desc: 'Selecting the exact rod lengths, pulley mechanics, and wall anchors best suited to your walls and ceiling.'
  },
  {
    num: '03',
    title: 'Install',
    desc: 'Our trained professionals carry out a neat, secure installation and thoroughly test weight and cord movement.'
  },
  {
    num: '04',
    title: 'Support',
    desc: 'Local service coverage for adjustments, replacement parts, or future relocations whenever needed.'
  }
];

export function AboutApproach() {
  return (
    <section className="about-approach-section">
      <div className="container">
        <div className="install-header">
          <span className="eyebrow">OUR METHODOLOGY</span>
          <h2>Our Approach to Better Living</h2>
          <p>A structured, quality-first process ensuring every installation is seamless and long-lasting.</p>
        </div>

        <div className="about-approach-grid">
          {steps.map((st, idx) => (
            <div className="about-approach-card" key={idx}>
              <span className="step-num">{st.num} / PHASE</span>
              <h3>{st.title}</h3>
              <p>{st.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
