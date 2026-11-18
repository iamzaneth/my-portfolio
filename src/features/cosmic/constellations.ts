// J2000 coordinates and visual magnitudes: Hoffleit et al., Bright Star Catalogue,
// 5th Revised Ed., CDS V/50, retrieved through the Harvard VizieR mirror.
// https://vizier.cfa.harvard.edu/viz-bin/VizieR?-source=V/50
// Conventional connecting figures retained from this portfolio, not IAU boundaries:
// https://www.iau.org/IAU/IAU/Astronomy-FAQs/Constellations.aspx
export type Star = { id: string; catalogId: string; ra: number; dec: number; magnitude: number; x: number; y: number; emphasis: 'primary' | 'secondary' | 'tertiary' }
export type Figure = { id: string; name: string; stars: Star[]; connections: readonly (readonly [string, string])[] }
type Entry = [string, number, number, Star['emphasis'], number, number]

/** Local tangent-plane projection. Only the overall placement may be randomized. */
function figure(name: string, entries: Entry[], connections: Figure['connections']): Figure {
  const radians = Math.PI / 180
  const angles = entries.map(e => e[1] * 15 * radians)
  const ra0 = Math.atan2(angles.reduce((sum, ra) => sum + Math.sin(ra), 0), angles.reduce((sum, ra) => sum + Math.cos(ra), 0))
  const dec0 = entries.reduce((sum, e) => sum + e[2], 0) / entries.length * radians
  const coords = entries.map(e => {
    const ra = e[1] * 15 * radians - ra0, dec = e[2] * radians
    const denominator = Math.sin(dec0) * Math.sin(dec) + Math.cos(dec0) * Math.cos(dec) * Math.cos(ra)
    return [-Math.cos(dec) * Math.sin(ra) / denominator, -(Math.cos(dec0) * Math.sin(dec) - Math.sin(dec0) * Math.cos(dec) * Math.cos(ra)) / denominator]
  })
  const xs = coords.map(p => p[0]), ys = coords.map(p => p[1])
  const left = Math.min(...xs), top = Math.min(...ys), w = Math.max(...xs) - left, h = Math.max(...ys) - top
  const scale = 260 / Math.max(w, h)
  return { id: name.toLowerCase().replace(/ /g, '-'), name, connections, stars: entries.map((e, i) => ({ id: e[0], catalogId: `HR ${e[4]}`, ra: e[1], dec: e[2], magnitude: e[5], x: 150 + (coords[i][0] - left - w / 2) * scale, y: 150 + (coords[i][1] - top - h / 2) * scale, emphasis: e[3] })) }
}
export const figures = {
  home: figure('Lyra', [['vega',18.615639,38.783611,'primary',7001,0.03],['epsilon',18.739000,39.670000,'tertiary',7051,5.06],['zeta',18.746222,37.605000,'secondary',7056,4.36],['delta',18.908389,36.898889,'secondary',7139,4.3],['sheliak',18.834667,33.362778,'secondary',7106,3.45],['sulafat',18.982389,32.689444,'secondary',7178,3.24]], [['vega','epsilon'],['epsilon','zeta'],['zeta','vega'],['zeta','delta'],['delta','sulafat'],['sulafat','sheliak'],['sheliak','zeta']]),
  about: figure('Orion', [['betelgeuse',5.919528,7.406944,'primary',2061,0.5],['bellatrix',5.418861,6.349722,'secondary',1790,1.64],['meissa',5.585639,9.934167,'tertiary',1879,3.54],['alnitak',5.679306,-1.942778,'secondary',1948,2.05],['alnilam',5.603556,-1.201944,'secondary',1903,1.7],['mintaka',5.533444,-0.299167,'secondary',1852,2.23],['saiph',5.795944,-9.669722,'secondary',2004,2.06],['rigel',5.242306,-8.201667,'primary',1713,0.12],['sword',5.587917,-5.389722,'tertiary',1895,5.13]], [['meissa','betelgeuse'],['meissa','bellatrix'],['betelgeuse','alnitak'],['bellatrix','mintaka'],['alnitak','alnilam'],['alnilam','mintaka'],['alnitak','saiph'],['mintaka','rigel'],['saiph','rigel'],['alnilam','sword']]),
  toolkit: figure('Cygnus', [['deneb',20.690528,45.280278,'primary',7924,1.25],['sadr',20.370472,40.256667,'primary',7796,2.2],['albireo',19.512028,27.959722,'secondary',7417,3.08],['gienah',20.770194,33.970278,'secondary',7949,2.46],['zeta',21.215611,30.226944,'tertiary',8115,3.2],['delta',19.749583,45.130833,'secondary',7528,2.87],['iota',19.495083,51.729722,'tertiary',7420,3.79]], [['deneb','sadr'],['sadr','albireo'],['sadr','gienah'],['gienah','zeta'],['sadr','delta'],['delta','iota']]),
  projects: figure('Scorpius', [['antares',16.490111,-26.431944,'primary',6134,0.96],['acrab',16.090611,-19.805556,'secondary',5984,2.62],['dschubba',16.005556,-22.621667,'secondary',5953,2.32],['pi',15.980861,-26.114167,'tertiary',5944,2.89],['tau',16.598056,-28.216111,'secondary',6165,2.82],['epsilon',16.836056,-34.293333,'secondary',6241,2.29],['mu',16.864500,-38.047500,'tertiary',6247,3.08],['zeta',16.909722,-42.361389,'secondary',6271,3.62],['eta',17.202556,-43.239167,'tertiary',6380,3.33],['sargas',17.622000,-42.997778,'secondary',6553,1.87],['iota',17.793083,-40.126944,'tertiary',6615,3.03],['kappa',17.708139,-39.030000,'secondary',6580,2.41],['shaula',17.560139,-37.103889,'primary',6527,1.63],['lesath',17.512722,-37.295833,'secondary',6508,2.69]], [['acrab','dschubba'],['dschubba','pi'],['dschubba','antares'],['antares','tau'],['tau','epsilon'],['epsilon','mu'],['mu','zeta'],['zeta','eta'],['eta','sargas'],['sargas','iota'],['iota','kappa'],['kappa','shaula'],['shaula','lesath']]),
  contact: figure('Ursa Major', [['dubhe',11.062139,61.750833,'primary',4301,1.79],['merak',11.030694,56.382500,'secondary',4295,2.37],['phecda',11.897167,53.694722,'secondary',4554,2.44],['megrez',12.257111,57.032500,'tertiary',4660,3.31],['alioth',12.900472,55.959722,'primary',4905,1.77],['mizar',13.398750,54.925278,'secondary',5054,2.27],['alkaid',13.792333,49.313333,'secondary',5191,1.86],['muscida',8.504417,60.718056,'tertiary',3323,3.36],['theta',9.547611,51.677222,'tertiary',3775,3.17],['talitha',8.986778,48.041667,'secondary',3569,3.14],['tania',10.372139,41.499444,'tertiary',4069,3.05],['alula',11.307972,33.094167,'tertiary',4377,3.48]], [['dubhe','merak'],['merak','phecda'],['phecda','megrez'],['megrez','dubhe'],['megrez','alioth'],['alioth','mizar'],['mizar','alkaid'],['dubhe','muscida'],['muscida','theta'],['theta','talitha'],['merak','theta'],['phecda','tania'],['phecda','alula']]),
}

export const skyFigures: readonly Figure[] = Object.values(figures)
