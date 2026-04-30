// ═══════════════════════════════════════════════════════════════════
// LV Logistics — Global Route Network (v5)
// ═══════════════════════════════════════════════════════════════════
// Ocean routes: searoute-js (Eurostat maritime routing engine)
// Road segments: OSRM (router.project-osrm.org), fetched live
// ═══════════════════════════════════════════════════════════════════

const SVG_ICONS = {
  ship:  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.5a.75.75 0 0 1 .75.75V4.5h6.75a.75.75 0 0 1 .75.75v6.69l1.94 1.69a.75.75 0 0 1 .14.97l-2.86 4.45a3.75 3.75 0 0 1-3.13 1.7H6.66a3.75 3.75 0 0 1-3.13-1.7L.67 14.6a.75.75 0 0 1 .14-.97l1.94-1.69V5.25a.75.75 0 0 1 .75-.75h6.75V2.25a.75.75 0 0 1 .75-.75ZM5.25 6v5.25l6.75-1.69 6.75 1.69V6h-13.5Z"/></svg>`,
  truck: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a.75.75 0 0 0 .75-.75V15Z"/><path d="M8.25 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0ZM15.75 6.75a.75.75 0 0 0-.75.75v11.25c0 .087.015.17.042.248a3 3 0 0 1 5.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 0 0-3.732-10.104 1.837 1.837 0 0 0-1.47-.725H15.75Z"/><path d="M19.5 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"/></svg>`,
  train: `<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12 2.25c-2.429 0-4.817.178-7.152.521C2.87 3.061 1.5 4.795 1.5 6.741V16.5a3 3 0 0 0 3 3h.879l-1.94 1.94a.75.75 0 1 0 1.061 1.06l3-3h7l3 3a.75.75 0 1 0 1.06-1.06l-1.939-1.94H19.5a3 3 0 0 0 3-3V6.741c0-1.946-1.37-3.68-3.348-3.97A49.149 49.149 0 0 0 12 2.25ZM4.5 9a.75.75 0 0 1 .75-.75h13.5a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9Zm3 6a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm6.75-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clip-rule="evenodd"/></svg>`,
};

const ROUTE_COLORS = {
  route1: '#a855f7',
  route2: '#ef4444',
  route3: '#f59e0b',
  route4: '#10b981',
  route5: '#38bdf8',
};

const ROUTE_NOTES = {
  route1: {
    title: 'FCL/LCL — USA via Rotterdam → CIS',
    color: '#a855f7',
    notes: [
      '<strong>Service type:</strong> FCL/LCL (Full & Less than Container Load)',
      '<strong>US Hub:</strong> Houston — consolidation from LA, Seattle, New York, Savannah',
      '<strong>EU arrival ports:</strong> Rotterdam, Antwerp, Hamburg, Southampton',
      '<strong>Route:</strong> Houston → Atlantic → Rotterdam → onward via FTL/LTL to Baku',
      '<strong>Transit time:</strong> 30 to 35 days (port to door)',
      '<strong>Carriers:</strong> Maersk, MSC, CMA CGM, Hapag-Lloyd, ZIM',
    ],
  },
  route2: {
    title: 'FCL/LCL — China via Turkey → CIS',
    color: '#ef4444',
    notes: [
      '<strong>Service type:</strong> FCL/LCL — Sea freight only',
      '<strong>China Hub:</strong> Guangzhou — consolidation from Shenzhen, Ningbo, Qingdao, Xiamen, Shanghai',
      '<strong>Route:</strong> Guangzhou → Singapore → Suez Canal → Mersin → overland → Baku',
      '<strong>Transit time:</strong> 35 to 40 days (port to door)',
      '<strong>Carriers:</strong> COSCO, MSC, Yang Ming, Maersk, Hapag-Lloyd, ZIM',
    ],
  },
  route3: {
    title: 'Silkway — China via Kazakhstan',
    color: '#f59e0b',
    notes: [
      '<strong>Service type:</strong> Rail freight (FCL & LCL)',
      '<strong>Origins:</strong> Shanghai, Beijing, Chengdu, Chongqing, Wuhan, Guangzhou, Shenzhen, Nanjing',
      "<strong>Route:</strong> Various origins → Xi'an → Dostyk → Kazakhstan → Aktau → Caspian → Baku/Alat",
      '<strong>Transit time:</strong> 28 to 30 days',
      '<strong>Key crossing:</strong> Dostyk — gauge change point',
    ],
  },
  route4: {
    title: 'FTL/LTL — EU via Turkey → CIS',
    color: '#10b981',
    notes: [
      '<strong>Service type:</strong> FTL/LTL — road & multimodal transport',
      '<strong>Route A — Road:</strong> EU hubs → Frankfurt → Vienna → Budapest → Romania → Bulgaria → Istanbul → Tbilisi → Baku',
      '<strong>Route B — Ferry:</strong> EU hubs → Trieste → Mediterranean ferry → Mersin, Turkey → overland → Baku',
      '<strong>Main EU hubs:</strong> Rotterdam, Warsaw, Trieste',
      '<strong>Transit time:</strong> 17 to 25 days (door to door)',
    ],
  },
  route5: {
    title: 'Via Cape of Good Hope → CIS',
    color: '#38bdf8',
    notes: [
      '<strong>Service type:</strong> FCL — alternative ocean route',
      '<strong>Route:</strong> Shanghai → Singapore → Cape of Good Hope → Gibraltar → Mediterranean → Mersin → Istanbul → Baku',
      '<strong>Transit time:</strong> 45 to 55 days',
      '<strong>Purpose:</strong> Alternative when Suez Canal faces disruptions',
    ],
  },
};

// Ocean routes from searoute-js (Eurostat maritime routing engine)
const OCEAN_ROUTES = {
  route1_ocean: [[29.706,-95.018],[29.703,-95.016],[29.702,-95.013],[29.7,-95.004],[29.697,-94.997],[29.692,-94.989],[29.684,-94.982],[29.679,-94.98],[29.653,-94.97],[29.614,-94.955],[29.609,-94.953],[29.607,-94.952],[29.564,-94.92],[29.5,-94.87],[29.494,-94.865],[29.489,-94.863],[29.368,-94.802],[29.363,-94.798],[29.348,-94.782],[29.342,-94.77],[29.344,-94.716],[29.338,-94.688],[29.307,-94.625],[29.148,-94.378],[29.132,-93.668],[29.13,-93.214],[28.585,-91.548],[28.432,-91.298],[28.284,-89.9],[28.105,-88.472],[27.6613,-87.7749],[27.2142,-87.0834],[26.7638,-86.3975],[26.31,-85.717],[25.521,-84.261],[25.0914,-83.4433],[24.6574,-82.6313],[24.219,-81.825],[24.504,-80.814],[24.754,-80.353],[25.116,-80.029],[25.333,-79.948],[25.79,-79.815],[25.792,-79.954],[25.981,-79.939],[26.08,-79.937],[26.099,-79.938],[26.648,-79.889],[26.747,-79.887],[26.766,-79.886],[26.793,-79.89],[26.4,-79.8],[26.3,-78.8],[26.8126,-78.2049],[27.3227,-77.6044],[27.8301,-76.9983],[28.3349,-76.3866],[28.837,-75.769],[29.3362,-75.1457],[29.8325,-74.5163],[30.3258,-73.8807],[30.816,-73.2386],[31.303,-72.59],[31.7866,-71.935],[32.2668,-71.2732],[32.7435,-70.6044],[33.2166,-69.9283],[33.686,-69.245],[34.1514,-68.5543],[34.613,-67.8561],[35.0705,-67.15],[35.5239,-66.436],[35.973,-65.714],[36.4176,-64.9842],[36.8578,-64.2461],[37.2933,-63.4994],[37.7241,-62.7441],[38.15,-61.98],[38.5708,-61.2071],[38.9864,-60.4252],[39.3967,-59.6342],[39.8016,-58.8338],[40.201,-58.024],[40.5948,-57.2051],[40.9828,-56.3765],[41.3647,-55.5382],[41.7405,-54.69],[42.11,-53.832],[42.473,-52.9642],[42.8293,-52.0863],[43.1789,-51.1983],[43.5215,-50.3002],[43.857,-49.392],[44.1854,-48.4741],[44.5064,-47.546],[44.8197,-46.6078],[45.1253,-45.6594],[45.423,-44.701],[45.7125,-43.7327],[45.9937,-42.7544],[46.2664,-41.7663],[46.5306,-40.7684],[46.786,-39.761],[47.0327,-38.7445],[47.2703,-37.7188],[47.4986,-36.684],[47.7176,-35.6403],[47.927,-34.588],[48.1269,-33.5277],[48.317,-32.4594],[48.4972,-31.3833],[48.6672,-30.2997],[48.827,-29.209],[48.9766,-28.1115],[49.1156,-27.0077],[49.2441,-25.8979],[49.362,-24.7825],[49.469,-23.662],[49.5654,-22.5372],[49.6509,-21.4082],[49.7254,-20.2755],[49.7887,-19.1396],[49.841,-18.001],[49.8822,-16.8605],[49.9123,-15.7183],[49.9311,-14.575],[49.9387,-13.431],[49.935,-12.287],[49.9204,-11.1432],[49.8946,-10.0004],[49.8576,-8.8591],[49.8094,-7.7198],[49.75,-6.583],[50.1,-4],[49.95,-1.3],[50.3822,-0.0116],[50.8,1.3],[51.1,2.1],[51.5,3.4],[52,3.9],[51.857,3.997],[51.836,4.048],[51.814,4.136],[51.771,4.21],[51.715,4.43]],
  route2_ocean: [[22.666,113.696],[21.7,114.1],[21.0245,113.7996],[20.3484,113.5019],[19.6718,113.2067],[18.9948,112.9141],[18.3173,112.6238],[17.6393,112.3358],[16.961,112.05],[16.2819,111.766],[15.6024,111.484],[14.9226,111.2039],[14.2424,110.9255],[13.5619,110.6488],[12.8811,110.3736],[12.2,110.1],[11.5456,109.698],[10.8907,109.2978],[10.2353,108.8994],[9.5793,108.5026],[8.923,108.1073],[8.2662,107.7135],[7.609,107.321],[6.9132,107.0027],[6.2172,106.6853],[5.521,106.3688],[4.8246,106.0531],[4.1281,105.7379],[3.4315,105.4234],[2.7347,105.1092],[2.0379,104.7955],[1.341,104.482],[1.1,103.6],[1.5502,102.8002],[2.0,102.0],[2.6002,101.3003],[3.2,100.6],[3.744,100.0881],[4.2876,99.5755],[4.831,99.0623],[5.3739,98.5482],[5.9164,98.0332],[6.4585,97.5171],[7.0,97.0],[6.9268,96.2496],[6.8523,95.4995],[6.7767,94.7496],[6.7,94.0],[6.6558,93.1997],[6.6102,92.3995],[6.5634,91.5995],[6.5153,90.7997],[6.466,90.0],[6.467,90],[6.4157,89.1893],[6.3632,88.3787],[6.3094,87.5683],[6.2543,86.7581],[6.198,85.948],[6.1408,85.138],[6.0824,84.3283],[6.0228,83.5187],[5.962,82.7092],[5.9,81.9],[5.8,80.1],[6.0045,79.3861],[6.2081,78.6717],[6.4107,77.9567],[6.6124,77.2411],[6.813,76.525],[7.0128,75.8083],[7.2116,75.0909],[7.4092,74.3729],[7.6057,73.6543],[7.801,72.935],[7.9956,72.2152],[8.1889,71.4947],[8.3809,70.7735],[8.5716,70.0516],[8.761,69.329],[8.9495,68.6055],[9.1365,67.8813],[9.3222,67.1563],[9.5063,66.4305],[9.689,65.704],[9.8704,64.9768],[10.0502,64.2488],[10.2284,63.52],[10.405,62.7904],[10.58,62.06],[10.7539,61.3287],[10.9261,60.5965],[11.0965,59.8635],[11.2651,59.1297],[11.432,58.395],[11.5974,57.6595],[11.7609,56.9232],[11.9225,56.186],[12.0822,55.4479],[12.24,54.709],[12.3961,53.969],[12.5501,53.228],[12.7022,52.4862],[12.8521,51.7436],[13.0,51.0],[12.8823,50.2475],[12.7626,49.4957],[12.6406,48.7446],[12.5166,47.9942],[12.3905,47.2445],[12.2624,46.4956],[12.1322,45.7474],[12.0,45.0],[12.3513,44.1511],[12.7,43.3],[13.4674,42.8695],[14.2341,42.4362],[15.0,42.0],[16.3,41.2],[17.0435,40.8247],[17.7864,40.4464],[18.5285,40.065],[19.2698,39.6802],[20.0103,39.2919],[20.75,38.9],[21.4645,38.4321],[22.1778,37.9596],[22.8896,37.4823],[23.6,37.0],[24.2833,36.511],[24.965,36.0167],[25.6451,35.5169],[26.3234,35.0114],[27.0,34.5],[27.9,33.75],[28.8012,33.18],[29.7,32.6],[30.7002,32.3526],[31.7,32.1],[32.4028,32.5067],[33.1042,32.9198],[33.8043,33.3395],[34.5029,33.7662],[35.2,34.2],[35.9,35.7],[36.5,35.6],[36.891,36.002],[36.603,36.128],[36.295,35.633],[35.67,34.682],[36.755,34.663]],
  route5_ocean: [[30.507,121.205],[31.3,122.9],[30.835,122.678],[30.0776,122.3257],[29.3193,121.9787],[28.5601,121.6369],[27.8,121.3],[27.1013,120.8613],[26.4013,120.428],[25.7,120.0],[25.1648,119.3896],[24.6271,118.7846],[24.087,118.1847],[23.5446,117.5899],[23.0,117.0],[22.6799,116.2699],[22.3565,115.5432],[22.0298,114.8199],[21.7,114.1],[21.0245,113.7996],[20.3484,113.5019],[19.6718,113.2067],[18.9948,112.9141],[18.3173,112.6238],[17.6393,112.3358],[16.961,112.05],[16.2819,111.766],[15.6024,111.484],[14.9226,111.2039],[14.2424,110.9255],[13.5619,110.6488],[12.8811,110.3736],[12.2,110.1],[11.5456,109.698],[10.8907,109.2978],[10.2353,108.8994],[9.5793,108.5026],[8.923,108.1073],[8.2662,107.7135],[7.609,107.321],[6.9132,107.0027],[6.2172,106.6853],[5.521,106.3688],[4.8246,106.0531],[4.1281,105.7379],[3.4315,105.4234],[2.7347,105.1092],[2.0379,104.7955],[1.341,104.482],[1.1,103.6],[0.348,103.859],[-0.587,104.137],[-1.378,104.5998],[-2.169,105.063],[-2.346,105.686],[-2.892,105.905],[-3,106.1],[-3.7334,106.3329],[-4.4667,106.5662],[-5.2,106.8],[-5.6513,106.1017],[-6.1018,105.4024],[-6.5514,104.7018],[-7.0,104.0],[-7.5027,103.3375],[-8.0044,102.6735],[-8.5051,102.0078],[-9.0046,101.3404],[-9.503,100.6712],[-10.0,100.0],[-10.4474,99.3009],[-10.8932,98.5998],[-11.3374,97.8966],[-11.78,97.1912],[-12.2209,96.4835],[-12.6599,95.7735],[-13.097,95.061],[-13.5322,94.3463],[-13.9654,93.6289],[-14.3964,92.9088],[-14.8253,92.186],[-15.2519,91.4603],[-15.6762,90.7317],[-16.098,90.0],[-16.098,90],[-16.4804,89.3306],[-16.8607,88.6586],[-17.2387,87.9838],[-17.6145,87.3063],[-17.988,86.626],[-18.359,85.9432],[-18.7276,85.2574],[-19.0936,84.5687],[-19.4571,83.8769],[-19.818,83.182],[-20.1761,82.4839],[-20.5314,81.7826],[-20.8838,81.0781],[-21.2334,80.3702],[-21.58,79.659],[-21.9237,78.9448],[-22.2644,78.2271],[-22.6018,77.5059],[-22.9361,76.7813],[-23.267,76.053],[-23.5946,75.3212],[-23.9188,74.5857],[-24.2395,73.8465],[-24.5566,73.1036],[-24.87,72.357],[-25.1797,71.607],[-25.4857,70.8533],[-25.7878,70.0957],[-26.0859,69.3343],[-26.38,68.569],[-26.6701,67.7998],[-26.956,67.0267],[-27.2377,66.2497],[-27.515,65.4688],[-27.788,64.684],[-28.0566,63.8956],[-28.3207,63.1033],[-28.5801,62.3071],[-28.8349,61.507],[-29.085,60.703],[-29.3303,59.8955],[-29.5707,59.0841],[-29.8062,58.2688],[-30.0367,57.4498],[-30.262,56.627],[-30.4824,55.8003],[-30.6976,54.9699],[-30.9075,54.1359],[-31.1119,53.2982],[-31.311,52.457],[-31.5047,51.6128],[-31.6927,50.7651],[-31.8752,49.914],[-32.052,49.0596],[-32.223,48.202],[-32.3883,47.3412],[-32.5476,46.4774],[-32.7011,45.6105],[-32.8486,44.7407],[-32.99,43.868],[-33.1256,42.9929],[-33.255,42.1151],[-33.3782,41.2348],[-33.4953,40.3521],[-33.606,39.467],[-33.7108,38.58],[-33.8092,37.6908],[-33.9013,36.7997],[-33.9869,35.9067],[-34.066,35.012],[-34.1389,34.1157],[-34.2053,33.2179],[-34.2651,32.3188],[-34.3183,31.4184],[-34.365,30.517],[-34.4053,29.6149],[-34.4389,28.712],[-34.4659,27.8085],[-34.4863,26.9044],[-34.5,26.0],[-34.6372,25.0046],[-34.7664,24.0061],[-34.8873,23.0045],[-35.0,22.0],[-35.0123,21.0001],[-35.0164,20.0],[-35.0123,18.9999],[-35.0,18.0],[-34.4344,17.4303],[-33.8662,16.8683],[-33.2954,16.3137],[-32.7222,15.7663],[-32.1467,15.226],[-31.5689,14.6924],[-30.989,14.1654],[-30.4069,13.6448],[-29.8227,13.1304],[-29.2366,12.622],[-28.6486,12.1194],[-28.0588,11.6223],[-27.4672,11.1308],[-26.8739,10.6444],[-26.2789,10.1632],[-25.6824,9.6869],[-25.0843,9.2153],[-24.4848,8.7483],[-23.8838,8.2858],[-23.2814,7.8275],[-22.6778,7.3734],[-22.0728,6.9232],[-21.4667,6.4769],[-20.8593,6.0343],[-20.2509,5.5953],[-19.6414,5.1597],[-19.0308,4.7274],[-18.4192,4.2982],[-17.8067,3.8721],[-17.1932,3.4489],[-16.5789,3.0286],[-15.9637,2.6108],[-15.3477,2.1957],[-14.731,1.783],[-14.172,1.3105],[-13.6121,0.8402],[-13.0514,0.3722],[-12.4898,-0.0936],[-11.9274,-0.5575],[-11.3642,-1.0194],[-10.8003,-1.4795],[-10.2358,-1.9379],[-9.6706,-2.3947],[-9.1048,-2.8499],[-8.5384,-3.3037],[-7.9715,-3.7561],[-7.4042,-4.2073],[-6.8363,-4.6573],[-6.2681,-5.1063],[-5.6995,-5.5543],[-5.1305,-6.0013],[-4.5612,-6.4476],[-3.9917,-6.8932],[-3.4219,-7.3382],[-2.8519,-7.7826],[-2.2817,-8.2266],[-1.7114,-8.6703],[-1.141,-9.1137],[-0.5705,-9.5569],[0.0,-10.0],[0.6148,-10.3797],[1.2296,-10.7595],[1.8443,-11.1395],[2.459,-11.5198],[3.0735,-11.9003],[3.6879,-12.2814],[4.3021,-12.6629],[4.9162,-13.0451],[5.53,-13.428],[6.1392,-13.8204],[6.7481,-14.2138],[7.3567,-14.6081],[7.965,-15.0035],[8.5729,-15.4],[9.1803,-15.7979],[9.7874,-16.1971],[10.3939,-16.5978],[11.0,-17.0],[11.8003,-17.1975],[12.6005,-17.3962],[13.4005,-17.5961],[14.2003,-17.7973],[15.0,-18.0],[15.7767,-18.0],[16.5535,-18.0],[17.3303,-18.0],[18.107,-18.0],[18.8302,-18.0],[19.5535,-18.0],[20.2767,-18.0],[21.0,-18.0],[21.6458,-17.5745],[22.2905,-17.1453],[22.9341,-16.712],[23.5765,-16.2746],[24.2176,-15.8329],[24.8575,-15.3868],[25.496,-14.936],[26.1331,-14.4804],[26.7688,-14.0198],[27.403,-13.554],[28.0364,-13.0785],[28.6682,-12.5974],[29.2983,-12.1104],[29.9266,-11.6174],[30.553,-11.1182],[31.1775,-10.6124],[31.8,-10.1],[32.7017,-9.4566],[33.6,-8.8],[34.4,-7.1],[35.1769,-6.4314],[35.95,-5.75],[36,-4.7],[36.1776,-3.7389],[36.3474,-2.7734],[36.5094,-1.8039],[36.6636,-0.8304],[36.8098,0.1469],[36.948,1.1279],[37.0781,2.1123],[37.2,3.1],[37.2653,4.1977],[37.3204,5.2971],[37.3653,6.398],[37.4,7.5],[37.4448,8.6656],[37.4781,9.8324],[37.5,11.0],[37.2389,12.0613],[36.9685,13.1152],[36.6888,14.1614],[36.4,15.2],[36.4073,16.1292],[36.4074,17.0584],[36.4003,17.9876],[36.386,18.9165],[36.3645,19.845],[36.3358,20.7729],[36.3,21.7],[36.5,23.6],[36.4351,24.5025],[36.3635,25.4035],[36.2851,26.3027],[36.2,27.2],[36.6,28.3],[36,30],[35.9416,31.0017],[35.875,32.0017],[35.8,33.0],[36.0396,33.8615],[36.2729,34.7282],[36.5,35.6],[36.891,36.002],[36.603,36.128],[36.295,35.633],[35.67,34.682],[36.755,34.663]],
  route4_ferry: [[45.613,13.767],[45.629,13.581],[45.3,13.1],[44.6,14],[44,14.8],[43,16],[42.1,16.7],[41.4,17.3],[40.1,18.9],[39.3277,19.7028],[38.55,20.488],[38.227,21.147],[38.349,21.904],[38.024,22.828],[37.913,23.027],[37.881,23.175],[37.819,23.643],[37.55,23.966],[37.57,24.158],[37.8,24.45],[37.2738,25.3796],[36.7403,26.2962],[36.2,27.2],[36.6,28.3],[36,30],[35.9416,31.0017],[35.875,32.0017],[35.8,33.0],[36.0396,33.8615],[36.2729,34.7282],[36.5,35.6],[36.891,36.002],[36.603,36.128],[36.295,35.633],[35.67,34.682],[36.755,34.663]],
  caspian_ferry: [[43.65,51.15],[40.41,49.87]],
};

const ROAD_SEGMENTS = {
  route2_land: [
    [36.80, 34.63], [37.59, 36.93], [37.87, 38.27], [39.93, 41.26],
    [41.69, 44.80], [40.41, 49.87],
  ],
  route3_land_china: [
    [31.23, 121.47], [34.26, 108.94], [40.20, 99.87], [43.83, 87.62], [45.42, 82.46],
  ],
  route3_land_kazakhstan: [
    [45.42, 82.46], [43.25, 76.95], [47.10, 51.90], [43.65, 51.15],
  ],
  route4_main: [
    [50.11, 8.68], [48.21, 16.37], [47.50, 19.04], [44.43, 26.10], [42.70, 23.32], [41.01, 28.98],
  ],
  route4_warsaw: [
    [52.23, 21.01], [48.21, 16.37],
  ],
  route4_to_baku: [
    [41.01, 28.98], [40.20, 38.93], [41.02, 40.51], [41.69, 44.80], [40.41, 49.87],
  ],
  route4_mersin_to_istanbul: [
    [36.80, 34.63], [37.06, 37.38], [39.92, 32.85], [41.01, 28.98],
  ],
  route5_to_baku: [
    [36.80, 34.63], [41.01, 28.98], [40.20, 38.93], [41.69, 44.80], [40.41, 49.87],
  ],
  route1_to_baku: [
    [51.92, 4.48], [50.11, 8.68], [48.21, 16.37], [47.50, 19.04],
    [44.43, 26.10], [41.01, 28.98], [41.69, 44.80], [40.41, 49.87],
  ],
};

const FEEDERS = {};

const TRANSPORT_ICONS = [
  { lat: 43.0,  lng: -38.0, icon: 'ship',  tip: 'Vessel — Mid-Atlantic (Maersk / MSC / CMA CGM)', route: 'route1' },
  { lat: 12.0,  lng:  68.0, icon: 'ship',  tip: 'Vessel — Arabian Sea (COSCO / Yang Ming / ZIM)', route: 'route2' },
  { lat: 18.0,  lng:  39.0, icon: 'ship',  tip: 'Vessel — Red Sea', route: 'route2' },
  { lat: 42.5,  lng:  90.0, icon: 'train', tip: 'Rail — Western China corridor', route: 'route3' },
  { lat: 47.0,  lng:  62.0, icon: 'train', tip: 'Rail — Kazakhstan steppe', route: 'route3' },
  { lat: 41.8,  lng:  50.8, icon: 'ship',  tip: 'Vessel — Caspian Sea crossing (Aktau → Baku)', route: 'route3' },
  { lat: 38.0,  lng:  20.5, icon: 'ship',  tip: 'Ferry — Trieste → Mediterranean → Mersin', route: 'route4' },
  { lat: -15.0, lng:  85.0, icon: 'ship',  tip: 'Vessel — Indian Ocean (Cape route)', route: 'route5' },
  { lat: -33.0, lng:  35.0, icon: 'ship',  tip: 'Vessel — South of Madagascar', route: 'route5' },
  { lat: -15.0, lng:   8.0, icon: 'ship',  tip: 'Vessel — Off Namibia coast', route: 'route5' },
  { lat:  15.0, lng: -22.0, icon: 'ship',  tip: 'Vessel — Off Cape Verde', route: 'route5' },
];

const TRANSIT_LABELS = [
  { lat: 38.0,  lng: -22.0, days: '30 to 35 days', route: 'route1' },
  { lat: 22.0,  lng:  88.0, days: '35 to 40 days', route: 'route2' },
  { lat: 45.0,  lng:  68.0, days: '28 to 30 days', route: 'route3' },
  { lat: 47.5,  lng:  10.0, days: '17 to 25 days', route: 'route4' },
  { lat: -28.0, lng:  60.0, days: '45 to 55 days', route: 'route5' },
];

const HUBS = [
  { name: 'BAKU',      lat: 40.41, lng: 49.87,  type: 'primary', color: '#e63946', routes: ['Route 1','Route 2','Route 3','Route 4','Route 5'], desc: 'Primary destination — Baku / Alat International Seaport, Azerbaijan' },
  { name: 'ISTANBUL',  lat: 41.01, lng: 29.0,   type: 'major',   color: '#fff', routes: ['Route 2','Route 4','Route 5'], desc: 'Major transit hub — Europe / Caucasus gateway' },
  { name: 'TBILISI',   lat: 41.69, lng: 44.8,   type: 'major',   color: '#fff', routes: ['Route 2','Route 4','Route 5'], desc: 'LV Logistics office — Georgia transit corridor' },
  { name: 'POTI',      lat: 42.15, lng: 41.67,  type: 'major',   color: '#fff', routes: ['Route 4'], desc: 'LV Logistics office — Georgian Black Sea port' },
  { name: 'ROTTERDAM', lat: 51.92, lng: 4.48,   type: 'major',   color: '#fff', routes: ['Route 1','Route 4'], desc: 'Main EU hub — transatlantic arrival & road connections' },
  { name: 'TRIESTE',   lat: 45.65, lng: 13.77,  type: 'major',   color: '#fff', routes: ['Route 4'], desc: 'Italian port — Mediterranean ferry to Mersin' },
  { name: 'FRANKFURT', lat: 50.11, lng: 8.68,   type: 'major',   color: '#fff', routes: ['Route 4'], desc: 'European road hub' },
  { name: 'WARSAW',    lat: 52.23, lng: 21.01,  type: 'major',   color: '#fff', routes: ['Route 4'], desc: 'Northern European connector' },
  { name: 'HOUSTON',   lat: 29.76, lng: -95.36, type: 'major',   color: '#fff', routes: ['Route 1'], desc: 'US consolidation hub' },
  { name: 'GUANGZHOU', lat: 23.13, lng: 113.26, type: 'major',   color: '#fff', routes: ['Route 2'], desc: 'China consolidation hub' },
  { name: 'SHANGHAI',  lat: 31.23, lng: 121.47, type: 'major',   color: '#fff', routes: ['Route 2','Route 3','Route 5'], desc: 'Major China origin port' },
  { name: 'AKTAU',     lat: 43.65, lng: 51.15,  type: 'major',   color: '#fff', routes: ['Route 3'], desc: 'Kazakhstan Caspian port — rail terminus & ferry hub' },
  { name: 'MERSIN',    lat: 36.8,  lng: 34.63,  type: 'major',   color: '#fff', routes: ['Route 2','Route 4','Route 5'], desc: 'Turkish Mediterranean port' },
];

const LABEL_OFFSETS = {
  'ISTANBUL': [12,-2], 'TBILISI': [12,-8], 'POTI': [-50,6],
  'MERSIN': [12,6], 'TRIESTE': [12,-4],
  'ROTTERDAM': [12,0],
  'FRANKFURT': [12,-6], 'WARSAW': [12,-4],
  'BAKU': [14,-2], 'AKTAU': [12,-6],
  'SHANGHAI': [12,0], 'GUANGZHOU': [14,4], 'HOUSTON': [14,4],
};

const ZOOM_REGIONS = {
  global:  { center: [32, 48],  zoom: 3 },
  europe:  { center: [46, 12],  zoom: 5 },
  asia:    { center: [30, 105], zoom: 4 },
};

// ═══════════════════════════════════════════════════════════════════
// MAP INITIALIZATION
// ═══════════════════════════════════════════════════════════════════

const darkBase = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
  { attribution: '&copy; OSM &copy; CARTO', subdomains: 'abcd', maxZoom: 19 }
);
const lightBase = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
  { attribution: '&copy; Esri &copy; OpenStreetMap contributors', maxZoom: 19 }
);

const map = L.map('map', {
  center: [32, 48],
  zoom: 3,
  minZoom: 2,
  maxZoom: 10,
  zoomControl: false,
  attributionControl: false,
  worldCopyJump: false,
});

L.control.attribution({ position: 'bottomright', prefix: false })
  .addAttribution('© OpenStreetMap / Esri / CARTO')
  .addTo(map);

L.control.zoom({ position: 'bottomright' }).addTo(map);

let isDarkMode = true;
darkBase.addTo(map);

function toggleTheme() {
  isDarkMode = !isDarkMode;
  const btn = document.getElementById('themeBtn');
  if (isDarkMode) {
    map.removeLayer(lightBase);
    darkBase.addTo(map);
    document.body.classList.remove('light-mode');
    btn.textContent = '☀️'; btn.title = 'Switch to light mode';
  } else {
    map.removeLayer(darkBase);
    lightBase.addTo(map);
    document.body.classList.add('light-mode');
    btn.textContent = '🌙'; btn.title = 'Switch to dark mode';
  }
}

function updateZoomScale() {
  const z = map.getZoom();
  document.body.dataset.zoom = z <= 2 ? 'tiny' : z <= 3 ? 'small' : 'normal';
  scheduleOverlapCheck();
}
map.on('zoomend', updateZoomScale);
map.on('moveend', () => scheduleOverlapCheck());

const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving/';

async function fetchOSRMRoute(coords) {
  const coordStr = coords.map(c => `${c[1]},${c[0]}`).join(';');
  const url = `${OSRM_BASE}${coordStr}?overview=full&geometries=geojson`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('OSRM returned ' + resp.status);
    const data = await resp.json();
    if (!data.routes || !data.routes[0]) return null;
    return data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
  } catch (e) {
    console.warn('OSRM fetch failed for segment, falling back to straight line:', e.message);
    return coords;
  }
}

const routeLayers = {};
const routeVisible = {};
const routeTransportIcons = {};
const routeTransitLabels = {};
const allMarkers = [];

Object.keys(ROUTE_COLORS).forEach(key => {
  routeVisible[key] = true;
  routeTransportIcons[key] = [];
  routeTransitLabels[key] = [];
  routeLayers[key] = L.layerGroup().addTo(map);
});

L.circle([40.3, 49.0], {
  radius: 200000, color: '#e63946', weight: 2, opacity: 0.5,
  fillColor: '#e63946', fillOpacity: 0.08, dashArray: '8 4',
}).addTo(map);

function createSolid(coords, color, weight) {
  return L.polyline(coords, { color, weight: weight || 4, opacity: 0.95, lineCap: 'round', lineJoin: 'round', smoothFactor: 1.5 });
}
function createGlow(coords, color, weight) {
  return L.polyline(coords, { color, weight: weight || 14, opacity: 0.12, lineCap: 'round', lineJoin: 'round', smoothFactor: 1.5 });
}
function createFerry(coords, color) {
  return L.polyline(coords, { color, weight: 3, opacity: 0.85, dashArray: '12 6', lineCap: 'round' });
}

function addSegmentToRoute(routeKey, coords, type) {
  const color = ROUTE_COLORS[routeKey];
  const group = routeLayers[routeKey];
  if (type === 'ferry') {
    createFerry(coords, color).addTo(group);
  } else {
    createGlow(coords, color).addTo(group);
    createSolid(coords, color).addTo(group);
  }
}

async function buildRoutes() {
  addSegmentToRoute('route1', OCEAN_ROUTES.route1_ocean, 'main');
  addSegmentToRoute('route2', OCEAN_ROUTES.route2_ocean, 'main');
  addSegmentToRoute('route5', OCEAN_ROUTES.route5_ocean, 'main');
  addSegmentToRoute('route4', OCEAN_ROUTES.route4_ferry, 'main');
  addSegmentToRoute('route3', OCEAN_ROUTES.caspian_ferry, 'ferry');

  addTransportIcons();
  addTransitLabels();
  addHubs();
  scheduleOverlapCheck();

  const osrmJobs = [
    fetchOSRMRoute(ROAD_SEGMENTS.route2_land).then(c => c && addSegmentToRoute('route2', c, 'main')),
    fetchOSRMRoute(ROAD_SEGMENTS.route3_land_china).then(c => c && addSegmentToRoute('route3', c, 'main')),
    fetchOSRMRoute(ROAD_SEGMENTS.route3_land_kazakhstan).then(c => c && addSegmentToRoute('route3', c, 'main')),
    fetchOSRMRoute(ROAD_SEGMENTS.route4_main).then(c => c && addSegmentToRoute('route4', c, 'main')),
    fetchOSRMRoute(ROAD_SEGMENTS.route4_warsaw).then(c => c && addSegmentToRoute('route4', c, 'main')),
    fetchOSRMRoute(ROAD_SEGMENTS.route4_to_baku).then(c => c && addSegmentToRoute('route4', c, 'main')),
    fetchOSRMRoute(ROAD_SEGMENTS.route4_mersin_to_istanbul).then(c => c && addSegmentToRoute('route4', c, 'main')),
    fetchOSRMRoute(ROAD_SEGMENTS.route5_to_baku).then(c => c && addSegmentToRoute('route5', c, 'main')),
    fetchOSRMRoute(ROAD_SEGMENTS.route1_to_baku).then(c => c && addSegmentToRoute('route1', c, 'main')),
  ];
  await Promise.all(osrmJobs);
  console.log('All OSRM road segments loaded.');
}

function addTransportIcons() {
  TRANSPORT_ICONS.forEach(({ lat, lng, icon, tip, route }) => {
    const color = ROUTE_COLORS[route];
    const svg = SVG_ICONS[icon];
    const html = `<div class="transport-svg-icon" style="color:${color}">${svg}</div>`;
    const el = L.divIcon({
      className: 'transport-marker-wrap',
      html: html,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
    const marker = L.marker([lat, lng], { icon: el, interactive: true }).addTo(map);
    if (tip) marker.bindTooltip(tip, { direction: 'top', offset: [0, -15] });
    marker._iconType = 'transport';
    marker._routeKey = route;
    routeTransportIcons[route].push(marker);
    allMarkers.push(marker);
  });
}

function addTransitLabels() {
  TRANSIT_LABELS.forEach(({ lat, lng, days, route }) => {
    const color = ROUTE_COLORS[route];
    const html = `<div class="transit-label" style="background:${color};border-color:${color}">${days}</div>`;
    const el = L.divIcon({
      className: 'transit-label-wrap',
      html: html,
      iconSize: null,
      iconAnchor: [42, 12],
    });
    const marker = L.marker([lat, lng], { icon: el, interactive: false }).addTo(map);
    marker._iconType = 'label';
    marker._routeKey = route;
    routeTransitLabels[route].push(marker);
    allMarkers.push(marker);
  });
}

function addHubs() {
  HUBS.forEach(hub => {
    const isPrimary = hub.type === 'primary';
    const isMajor   = hub.type === 'major';
    const isMinor   = hub.type === 'minor';
    const dotClass  = isPrimary ? 'hub-dot primary' : 'hub-dot';
    const labelClass = isPrimary ? 'hub-label primary-label' : isMinor ? 'hub-label secondary' : 'hub-label';
    const dotColor  = isPrimary ? '#e63946' : hub.color;
    const dotSize   = isPrimary ? 14 : isMajor ? 9 : isMinor ? 6 : 8;
    const offset    = LABEL_OFFSETS[hub.name] || [12, 0];

    const icon = L.divIcon({
      className: 'hub-marker',
      html: `<div class="${dotClass}" style="background:${dotColor};width:${dotSize}px;height:${dotSize}px"></div>` +
            `<span class="${labelClass}" style="position:relative;left:${offset[0]-12}px;top:${offset[1]}px">${hub.name}</span>`,
      iconSize: null, iconAnchor: [dotSize / 2, dotSize / 2],
    });

    const marker = L.marker([hub.lat, hub.lng], { icon }).addTo(map);
    marker._iconType = 'hub';
    marker._hubName = hub.name;
    marker.on('click', () => {
      const routeStr = hub.routes
        .map(r => `<span style="color:${ROUTE_COLORS[r.replace('Route ','route')]}">●</span> ${r}`)
        .join('<br>');
      document.getElementById('infoPanelTitle').innerHTML =
        `<span style="color:${isPrimary ? '#e63946' : 'var(--text-primary)'}">${hub.name}</span>`;
      document.getElementById('infoPanelDetail').innerHTML =
        `<p>${hub.desc}</p><br><strong>Routes:</strong><br>${routeStr}`;
      document.getElementById('infoPanel').classList.add('active');
    });
    allMarkers.push(marker);
  });
}

let overlapCheckTimer = null;
function scheduleOverlapCheck() {
  if (overlapCheckTimer) clearTimeout(overlapCheckTimer);
  overlapCheckTimer = setTimeout(checkOverlaps, 80);
}

function getElementBounds(marker) {
  const el = marker.getElement && marker.getElement();
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  const pad = 4;
  return {
    left: rect.left - pad,
    right: rect.right + pad,
    top: rect.top - pad,
    bottom: rect.bottom + pad,
  };
}

function rectsOverlap(a, b) {
  if (!a || !b) return false;
  return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
}

function checkOverlaps() {
  const hubBounds = [];
  allMarkers.forEach(m => {
    if (m._iconType === 'hub') {
      const b = getElementBounds(m);
      if (b) hubBounds.push(b);
    }
  });

  allMarkers.forEach(m => {
    if (m._iconType !== 'transport') return;
    const el = m.getElement && m.getElement();
    if (!el) return;
    const b = getElementBounds(m);
    const overlapping = hubBounds.some(h => rectsOverlap(b, h));
    el.style.opacity = overlapping ? '0' : '';
    el.style.pointerEvents = overlapping ? 'none' : '';
  });
}

function toggleRoute(key) {
  routeVisible[key] = !routeVisible[key];
  const item = document.querySelector(`.legend-item[data-route="${key}"]`);
  if (routeVisible[key]) {
    map.addLayer(routeLayers[key]);
    item.classList.remove('dimmed');
    routeTransportIcons[key].forEach(i => map.addLayer(i));
    routeTransitLabels[key].forEach(b => map.addLayer(b));
  } else {
    map.removeLayer(routeLayers[key]);
    item.classList.add('dimmed');
    routeTransportIcons[key].forEach(i => map.removeLayer(i));
    routeTransitLabels[key].forEach(b => map.removeLayer(b));
  }
  scheduleOverlapCheck();
}

function showNotes(routeKey) {
  const data = ROUTE_NOTES[routeKey];
  if (!data) return;
  document.getElementById('notesPanelTitle').innerHTML =
    `<span style="color:${data.color}">●</span> ${data.title}`;
  document.getElementById('notesPanelContent').innerHTML =
    data.notes.map(n => `<div class="note-item">${n}</div>`).join('');
  document.getElementById('notesPanel').classList.add('active');
}

function closeNotesPanel() {
  document.getElementById('notesPanel').classList.remove('active');
}

function closeInfoPanel() {
  document.getElementById('infoPanel').classList.remove('active');
}

map.on('click', (e) => {
  if (!e.originalEvent.target.closest('.hub-marker')) closeInfoPanel();
});

function zoomTo(region) {
  const r = ZOOM_REGIONS[region];
  if (r) map.flyTo(r.center, r.zoom, { duration: 1.2 });
}

buildRoutes();
updateZoomScale();

window.toggleTheme     = toggleTheme;
window.toggleRoute     = toggleRoute;
window.showNotes       = showNotes;
window.closeNotesPanel = closeNotesPanel;
window.closeInfoPanel  = closeInfoPanel;
window.zoomTo          = zoomTo;
