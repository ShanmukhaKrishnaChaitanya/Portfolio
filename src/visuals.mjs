export function field() {
  // A projected spherical lattice: a visual metaphor for structure emerging from data.
  const project = (lat, lon) => {
    let x = Math.cos(lat) * Math.cos(lon), y = Math.sin(lat), z = Math.cos(lat) * Math.sin(lon);
    const a = -.34, b = .46;
    [x, y] = [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
    [y, z] = [y * Math.cos(b) - z * Math.sin(b), y * Math.sin(b) + z * Math.cos(b)];
    return [250 + x * 162, 224 + y * 162, z];
  };
  const curve = (points) => points.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
  let paths = '';
  for (let i = 1; i < 19; i++) {
    const lat = -Math.PI / 2 + i * Math.PI / 19;
    paths += `<path class="orb-path" opacity=".62" d="${curve(Array.from({length:121}, (_, j) => project(lat, j * Math.PI / 60)))}"/>`;
  }
  for (let i = 0; i < 30; i++) {
    paths += `<path class="orb-path" opacity=".75" d="${curve(Array.from({length:91}, (_, j) => project(-Math.PI / 2 + j * Math.PI / 90, i * Math.PI / 15)))}"/>`;
  }
  let nodes = '';
  for (const [lat,lon] of [[.5,.3],[-.6,1.3],[.1,2.2],[.9,3],[-.2,4.7],[.6,5.3]]) {
    const [x,y] = project(lat,lon);
    nodes += `<circle cx="${x}" cy="${y}" r="8" fill="#e9edde"/><circle class="sphere-node" cx="${x}" cy="${y}" r="3"/>`;
  }
  return `<svg class="field-art" viewBox="0 0 500 460" fill="none" aria-hidden="true"><defs><radialGradient id="field-wash"><stop stop-color="#dce4d3" stop-opacity=".8"/><stop offset="1" stop-color="#f8f7f3" stop-opacity="0"/></radialGradient><pattern id="field-grid" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M26 0H0V26" stroke="#94a288" stroke-opacity=".12" stroke-width=".6"/></pattern></defs><rect x="10" y="25" width="480" height="410" fill="url(#field-grid)"/><ellipse cx="250" cy="237" rx="243" ry="211" fill="url(#field-wash)"/><path d="M24 225H476M250 45V418" stroke="#bcc7b6" stroke-width=".6" stroke-dasharray="3 6"/><ellipse cx="250" cy="224" rx="223" ry="67" transform="rotate(-26 250 224)" stroke="#acbb9c" stroke-width=".7"/>${paths}${nodes}<path d="M82 60H70V72M418 60H430V72M70 370V382H82M430 370V382H418" stroke="#90a285"/><circle cx="62" cy="231" r="3" fill="#8da676"/><circle cx="441" cy="215" r="2" fill="#8da676"/></svg>`;
}

const base = (content, label, bg) => `<svg viewBox="0 0 560 260" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg"><rect width="560" height="260" fill="${bg}"/>${content}</svg>`;
export function projectVisual(slug) {
  if (slug === 'smart-grid') {
    let content = '<defs><pattern id="grid-lines" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M26 0H0V26" stroke="#426548" stroke-opacity=".09" fill="none"/></pattern></defs><rect width="560" height="260" fill="url(#grid-lines)"/>';
    const points = [[93,137],[176,78],[190,185],[280,130],[351,67],[368,196],[453,123]];
    const edges = [[0,1],[0,2],[1,2],[1,3],[2,3],[3,4],[3,5],[4,5],[4,6],[5,6]];
    for (const [a,b] of edges) content += `<path d="M${points[a]} L${points[b]}" stroke="#77967b" stroke-width="1.2"/>`;
    for (const [i,[x,y]] of points.entries()) content += `<circle cx="${x}" cy="${y}" r="${i === 3 ? 25 : 16}" fill="#ecf1e6" stroke="#71926f" stroke-width="1"/><circle cx="${x}" cy="${y}" r="${i === 3 ? 10 : 5}" fill="#${i === 3 ? '416a48':'8ba57b'}"/>`;
    return base(content, 'Conceptual network of connected smart grid nodes', '#e6edde');
  }
  if (slug === 'epilepsy-diagnosis') {
    let content = '<defs><pattern id="signal-grid" width="23" height="23" patternUnits="userSpaceOnUse"><path d="M23 0H0V23" stroke="#98756b" stroke-opacity=".11" fill="none"/></pattern></defs><rect width="560" height="260" fill="url(#signal-grid)"/><rect x="223" width="98" height="260" fill="#d4bca9" opacity=".18"/>';
    for (let row=0; row<3; row++) {
      const y=83+row*50;
      let d='';
      for (let x=0; x<=560; x+=2) {
        const envelope=Math.exp(-Math.pow((x-265)/62,2));
        const v=y+Math.sin(x*.12+row*1.3)*4+Math.sin(x*.23+row)*envelope*(24-row*2)+Math.sin(x*.033)*5;
        d+=`${x?'L':'M'}${x},${v.toFixed(1)} `;
      }
      content+=`<path d="${d}" stroke="${row===1?'#946349':'#b39781'}" stroke-width="${row===1?'1.8':'1.2'}" fill="none"/>`;
    }
    return base(content, 'Illustrative EEG waveforms; not patient data', '#f0e8df');
  }
  if (slug === 'keyword-extraction') {
    let content = '<rect x="92" y="49" width="198" height="164" rx="5" fill="#f8f4e9" stroke="#d7cbb1"/>';
    for(let i=0;i<8;i++) content+=`<rect x="110" y="${69+i*16}" width="${[110,150,80,138,152,98,145,124][i]}" height="4" rx="2" fill="#d7cbb5"/>`;
    content+='<path d="M283 132H331" stroke="#a49059" stroke-width="1.3"/><path d="M325 126L331 132L325 138" fill="none" stroke="#a49059"/><rect x="348" y="61" width="115" height="33" rx="4" fill="#e1d4ab"/><rect x="348" y="113" width="115" height="33" rx="4" fill="#e9dfc1"/><rect x="348" y="165" width="115" height="33" rx="4" fill="#eee7d4"/><g font-family="Consolas,monospace" font-size="12" fill="#796b46" text-anchor="middle"><text x="405" y="82">TF-IDF</text><text x="405" y="134">TextRank</text><text x="405" y="186">YAKE</text></g>';
    return base(content, 'Conceptual comparison of TF-IDF, TextRank, and YAKE keyword extraction', '#efe9d8');
  }
  let content = '<g stroke="#789191" stroke-width="1" fill="#eaf0ed"><rect x="93" y="60" width="94" height="132" rx="4"/><rect x="232" y="60" width="94" height="132" rx="4"/><rect x="371" y="60" width="94" height="132" rx="4"/></g><g fill="none" stroke="#668583" stroke-width="2"><path d="M130 93H148V105L155 118V160H123V118L130 105Z"/><path d="M267 95L290 103L296 148L275 158L258 140Z"/><rect x="395" y="104" width="46" height="44" rx="3"/><path d="M395 114H441M418 114V148"/></g><g font-family="Consolas,monospace" font-size="9" fill="#65827b" text-anchor="middle"><text x="140" y="180">REPRESENT</text><text x="279" y="180">SELECT</text><text x="418" y="180">CLASSIFY</text></g><path d="M193 128H222M333 128H362" stroke="#819c91" stroke-dasharray="3 3"/>';
  return base(content, 'Conceptual pipeline from waste image representation to classification', '#e2ebe7');
}
