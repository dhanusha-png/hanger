import React from 'react';
import { MessageSquare, Calendar, Wrench, CheckCircle } from 'lucide-react';

const steps = [
  {
    num: '01',
    title: 'Tell us what you need',
    desc: 'Choose a service or share your requirement and space details.',
    icon: MessageSquare
  },
  {
    num: '02',
    title: 'Schedule / Measurement',
    desc: 'We arrange a suitable time for site inspection and measurements.',
    icon: Calendar
  },
  {
    num: '03',
    title: 'Installation / Service',
    desc: 'Our skilled team carries out the installation with precision.',
    icon: Wrench
  },
  {
    num: '04',
    title: 'Done',
    desc: 'Your hanger or storage solution is tested and ready to use.',
    icon: CheckCircle
  }
];

export function InstallationProcess() {
  return (
    <section className="section container install-section">
      <div className="install-header">
        <span className="eyebrow">HOW IT WORKS</span>
        <h2>From request to installation</h2>
        <p>A smooth and hassle-free process designed for your convenience.</p>
      </div>

      <div className="install-timeline">
        {steps.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div className="install-step-card" key={idx}>
              <div className="install-step-head">
                <div className="install-step-icon">
                  <Icon size={18} />
                </div>
                <span className="install-step-num">{st.num}</span>
              </div>
              <h3>{st.title}</h3>
              <p>{st.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
