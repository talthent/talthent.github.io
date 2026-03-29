/**
 * CV — full career panel rendered on the right side.
 *
 * Shows company blocks with narrative descriptions.
 * Active company highlighted based on current year from State.
 */
const CV = (() => {
  const CV_DATA = [
    {
      company: 'Lemonade',
      icon: 'assets/lemonade.jpg',
      years: '2018\u2013Present',
      startIndex: 4,
      endIndex: 12,
      text: 'Joined as the second iOS developer, right after the company started offering renters insurance in New York. Built the entire iOS app from the ground up, including the core AI-powered chat that drives onboarding, claims, and customer experience. Over the years, helped expand to more states, more countries, more products, and more languages. Grew the mobile team from 1 iOS and 1 Android developer to a team of 12. Introduced a modern stack\u200a\u2014\u200aSwiftUI over TCA with massive UI end-to-end test coverage. As <strong>Lead iOS Developer</strong>, guided the technical direction through Lemonade\u2019s IPO and global expansion. Stepped into <strong>Mobile Platform Team Lead</strong> and later <strong>Engineering Manager</strong>, managing the mobile team and the Client &amp; Experience Platform\u200a\u2014\u200aincluding frontend and backend developers\u200a\u2014\u200abuilding a cross-platform web chat solution that served all product lines across Lemonade\u2019s companies for 3 years. Recently transitioned back to hands-on work as <strong>Mobile Tech Lead</strong>, leading the migration to SPM modular architecture and pioneering AI-assisted development with Claude Code, Cursor, and MCPs.'
    },
    {
      company: 'Glance Fashion',
      icon: 'assets/glance.png',
      years: '2017',
      startIndex: 3,
      endIndex: 3,
      text: 'Built the iOS app for a social media platform focused on creating, editing, sharing, and discovering fashion videos. Also contributed to <strong>#memory</strong>\u200a\u2014\u200aa brain-extension note-taking app\u200a\u2014\u200abuilding the macOS app and performing code review for iOS.'
    },
    {
      company: 'Life On Air',
      icon: null,
      years: '2014\u20132016',
      startIndex: 0,
      endIndex: 2,
      text: 'Part of a small, high-caliber team building social apps around live video. Joined <strong>Yevvo</strong> mid-project and rewrote major portions of the codebase. Moved on to <strong>Meerkat</strong>\u200a\u2014\u200aa live broadcast app on Twitter\u2019s social graph that gained massive traction. Then built <strong>Houseparty</strong> from scratch: end-to-end architecture, real-time messaging, and live video. Houseparty reached #2 on the overall App Store chart.'
    }
  ];

  let companyEls = [];

  function init(container) {
    CV_DATA.forEach(company => {
      const block = document.createElement('div');
      block.className = 'cv-company';

      // Header
      const header = document.createElement('div');
      header.className = 'cv-company__header';

      if (company.icon) {
        const icon = document.createElement('img');
        icon.className = 'cv-company__icon';
        icon.src = company.icon;
        icon.alt = company.company;
        icon.width = 28;
        icon.height = 28;
        header.appendChild(icon);
      }

      const info = document.createElement('div');
      info.innerHTML = `
        <div class="cv-company__name">${company.company}</div>
        <div class="cv-company__years">${company.years}</div>
      `;
      header.appendChild(info);
      block.appendChild(header);

      // Narrative text
      const text = document.createElement('div');
      text.className = 'cv-company__text';
      text.innerHTML = company.text;
      block.appendChild(text);

      block.addEventListener('click', () => {
        State.goTo(company.endIndex);
      });

      container.appendChild(block);
      companyEls.push({ el: block, startIndex: company.startIndex, endIndex: company.endIndex });
    });

    State.subscribe((index) => update(index));
  }

  function update(index) {
    companyEls.forEach(({ el, startIndex, endIndex }) => {
      el.classList.toggle('cv-company--active', index >= startIndex && index <= endIndex);
    });
  }

  return { init };
})();
