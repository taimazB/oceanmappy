import moment from 'moment'

export const state = () => ({
  selected: null,
  selectedBathymetry: '',

  // --- Keep track of last selected date and time between models
  interDate: null,
  interTime: null,

  bathymetries: {
    field: 'Bathymetry',
    show: true,
    longName: null,
    models: [
      {
        source: 'SRTM',
        directory: 'SRTM',
        longName: '',
        link: '',
        region: 'G',
        maxZoom: 7,
        imgBnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
        min: -10900,
        max: 0,
        // colorbar: {
        //   labels: [
        //     { location: 0, label: '0' },
        //     { location: 0.0909, label: '1000' },
        //     { location: 0.1818, label: '2000' },
        //     { location: 0.2727, label: '3000' },
        //     { location: 0.3636, label: '4000' },
        //     { location: 0.4545, label: '5000' },
        //     { location: 0.5454, label: '6000' },
        //     { location: 0.6363, label: '7000' },
        //     { location: 0.7272, label: '8000' },
        //     { location: 0.8181, label: '9000' },
        //     { location: 0.909, label: '10000' },
        //     { location: 1, label: '11000' },
        //   ],
        //   colormap: [
        //     {
        //       minValue: -11000,
        //       maxValue: -10000,
        //       minColor: [40, 26, 44],
        //       maxColor: [54, 43, 77],
        //     },
        //     {
        //       minValue: -10000,
        //       maxValue: -9000,
        //       minColor: [54, 43, 77],
        //       maxColor: [64, 60, 115],
        //     },
        //     {
        //       minValue: -9000,
        //       maxValue: -8000,
        //       minColor: [64, 60, 115],
        //       maxColor: [63, 84, 144],
        //     },
        //     {
        //       minValue: -8000,
        //       maxValue: -7000,
        //       minColor: [63, 84, 144],
        //       maxColor: [63, 108, 150],
        //     },
        //     {
        //       minValue: -7000,
        //       maxValue: -6000,
        //       minColor: [63, 108, 150],
        //       maxColor: [68, 131, 155],
        //     },
        //     {
        //       minValue: -6000,
        //       maxValue: -5000,
        //       minColor: [68, 131, 155],
        //       maxColor: [76, 154, 160],
        //     },
        //     {
        //       minValue: -5000,
        //       maxValue: -4000,
        //       minColor: [76, 154, 160],
        //       maxColor: [87, 177, 164],
        //     },
        //     {
        //       minValue: -4000,
        //       maxValue: -3000,
        //       minColor: [87, 177, 164],
        //       maxColor: [110, 200, 163],
        //     },
        //     {
        //       minValue: -3000,
        //       maxValue: -2000,
        //       minColor: [110, 200, 163],
        //       maxColor: [156, 220, 165],
        //     },
        //     {
        //       minValue: -2000,
        //       maxValue: -1000,
        //       minColor: [156, 220, 165],
        //       maxColor: [206, 236, 179],
        //     },
        //     {
        //       minValue: -1000,
        //       maxValue: 0,
        //       minColor: [206, 236, 179],
        //       maxColor: [253, 254, 204],
        //     },
        //   ],
        // },
        availContours: [].concat(
          [...Array(99).keys()].map((k) => -10 * k), // --- 0 ... -990 , step 10
          [...Array(99).keys()].map((k) => -20 * k - 1000), // --- -1000 ... -2980 , step 20
          [...Array(19).keys()].map((k) => -50 * k - 3000), // --- -3000 ... -4950 , step 50
          [...Array(60).keys()].map((k) => -100 * k - 5000) // --- -5000 ... -11000 , step 100
        ),
        // unit: 'm',
      },
      // {
      //   source: 'GEBCO',
      //   directory: 'GEBCO',
      //   longName: '',
      //   region: 'G',
      //   imgBnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
      //   min: -11000,
      //   max: 0,
      //   // colorbar: {
      //   //   hasColorbar: true,
      //   //   labels: [
      //   //     { location: 0, label: '0' },
      //   //     { location: 0.0909, label: '1000' },
      //   //     { location: 0.1818, label: '2000' },
      //   //     { location: 0.2727, label: '3000' },
      //   //     { location: 0.3636, label: '4000' },
      //   //     { location: 0.4545, label: '5000' },
      //   //     { location: 0.5454, label: '6000' },
      //   //     { location: 0.6363, label: '7000' },
      //   //     { location: 0.7272, label: '8000' },
      //   //     { location: 0.8181, label: '9000' },
      //   //     { location: 0.909, label: '10000' },
      //   //     { location: 1, label: '11000' },
      //   //   ],
      //   //   colormap: [
      //   //     {
      //   //       minValue: -11000,
      //   //       maxValue: -10000,
      //   //       minColor: [40, 26, 44],
      //   //       maxColor: [54, 43, 77],
      //   //     },
      //   //     {
      //   //       minValue: -10000,
      //   //       maxValue: -9000,
      //   //       minColor: [54, 43, 77],
      //   //       maxColor: [64, 60, 115],
      //   //     },
      //   //     {
      //   //       minValue: -9000,
      //   //       maxValue: -8000,
      //   //       minColor: [64, 60, 115],
      //   //       maxColor: [63, 84, 144],
      //   //     },
      //   //     {
      //   //       minValue: -8000,
      //   //       maxValue: -7000,
      //   //       minColor: [63, 84, 144],
      //   //       maxColor: [63, 108, 150],
      //   //     },
      //   //     {
      //   //       minValue: -7000,
      //   //       maxValue: -6000,
      //   //       minColor: [63, 108, 150],
      //   //       maxColor: [68, 131, 155],
      //   //     },
      //   //     {
      //   //       minValue: -6000,
      //   //       maxValue: -5000,
      //   //       minColor: [68, 131, 155],
      //   //       maxColor: [76, 154, 160],
      //   //     },
      //   //     {
      //   //       minValue: -5000,
      //   //       maxValue: -4000,
      //   //       minColor: [76, 154, 160],
      //   //       maxColor: [87, 177, 164],
      //   //     },
      //   //     {
      //   //       minValue: -4000,
      //   //       maxValue: -3000,
      //   //       minColor: [87, 177, 164],
      //   //       maxColor: [110, 200, 163],
      //   //     },
      //   //     {
      //   //       minValue: -3000,
      //   //       maxValue: -2000,
      //   //       minColor: [110, 200, 163],
      //   //       maxColor: [156, 220, 165],
      //   //     },
      //   //     {
      //   //       minValue: -2000,
      //   //       maxValue: -1000,
      //   //       minColor: [156, 220, 165],
      //   //       maxColor: [206, 236, 179],
      //   //     },
      //   //     {
      //   //       minValue: -1000,
      //   //       maxValue: 0,
      //   //       minColor: [206, 236, 179],
      //   //       maxColor: [253, 254, 204],
      //   //     },
      //   //   ],
      //   // },
      //   // unit: 'm',
      // },
      // {
      //   source: 'NONNA',
      //   directory: 'NONNA',
      //   longName: '',
      //   region: 'R',
      //   imgBnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
      //   // min: -500,
      //   // max: 0,
      //   // colorbar: {
      //   //   hasColorbar: true,
      //   //   labels: [
      //   //     { location: 0, label: '0' },
      //   //     { location: 0.1, label: '100' },
      //   //     { location: 0.2, label: '200' },
      //   //     { location: 0.3, label: '300' },
      //   //     { location: 0.4, label: '400' },
      //   //     { location: 0.5, label: '500' },
      //   //     { location: 0.75, label: '750' },
      //   //     { location: 1, label: '1000+' },
      //   //   ],
      //   //   colormap: [
      //   //     {
      //   //       minValue: -1000,
      //   //       maxValue: -750,
      //   //       minColor: [102, 0, 102],
      //   //       maxColor: [153, 102, 255],
      //   //     },
      //   //     {
      //   //       minValue: -750,
      //   //       maxValue: -500,
      //   //       minColor: [153, 102, 255],
      //   //       maxColor: [51, 102, 255],
      //   //     },
      //   //     {
      //   //       minValue: -500,
      //   //       maxValue: -400,
      //   //       minColor: [51, 102, 255],
      //   //       maxColor: [51, 102, 255],
      //   //     },
      //   //     {
      //   //       minValue: -400,
      //   //       maxValue: -300,
      //   //       minColor: [51, 102, 255],
      //   //       maxColor: [51, 204, 204],
      //   //     },
      //   //     {
      //   //       minValue: -300,
      //   //       maxValue: -200,
      //   //       minColor: [51, 204, 204],
      //   //       maxColor: [51, 204, 51],
      //   //     },
      //   //     {
      //   //       minValue: -200,
      //   //       maxValue: -100,
      //   //       minColor: [51, 204, 51],
      //   //       maxColor: [255, 255, 0],
      //   //     },
      //   //     {
      //   //       minValue: -100,
      //   //       maxValue: 0,
      //   //       minColor: [255, 255, 0],
      //   //       maxColor: [255, 51, 0],
      //   //     },
      //   //   ],
      //   // },
      //   // availContourLevels: [...Array(508).keys()].map((k) => -10 * k), // --- Array from 0 to -5080, with step = 10
      //   // unit: 'm',
      // },
      // {
      //   source: 'NOAA',
      //   directory: 'NOAA',
      //   region: 'R',
      //   colorbar: {
      //     hasColorbar: true
      //   },
      //   availContourLevels: [...Array(508).keys()].map(k => -10 * k), // --- Array from 0 to -5080, with step = 10
      //   unit: 'm'
      // }
      {
        source: 'greatLakes',
        directory: 'greatLakes',
        longName:
          'NOAA was engaged in a program to compile Great Lakes bathymetric data and make them readily available to the public. This program was managed by NCEI and relied on the cooperation of NOAA/Great Lakes Environmental Research Laboratory, NOAA/National Ocean Service, the Canadian Hydrographic Service, other agencies, and academic laboratories.',
        link: 'https://www.ngdc.noaa.gov/mgg/greatlakes/',
        region: 'R',
        maxZoom: 14,
        imgBnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
        min: -390,
        max: 0,
        availContours: [...Array(38).keys()].map((k) => -10 * k), // --- 0 ... -380 , step 10
      },
    ],
    colorbar: {
      hasColorbar: true,
      step: 1,
      minOrg: 0,
      toFixed: 0,
      colormapOrg: [
        {
          value: 0,
          color: '#fefecc',
        },
        {
          value: 1000,
          color: '#9fdda6',
        },
        {
          value: 2000,
          color: '#59b5a4',
        },
        {
          value: 4000,
          color: '#46879c',
        },
        {
          value: 6000,
          color: '#3e5992',
        },
        {
          value: 8000,
          color: '#3a3058',
        },
        {
          value: 11000,
          color: '#271a2c',
        },
      ],
      colormap: [
        {
          value: 0,
          color: '#fefecc',
        },
        {
          value: 1000,
          color: '#9fdda6',
        },
        {
          value: 2000,
          color: '#59b5a4',
        },
        {
          value: 4000,
          color: '#46879c',
        },
        {
          value: 6000,
          color: '#3e5992',
        },
        {
          value: 8000,
          color: '#3a3058',
        },
        {
          value: 11000,
          color: '#271a2c',
        },
      ],
    },
    unit: 'm',
  },

  categories: [
    {
      type: 'ocean',
      name: 'current',
      show: true,
      fields: [
        {
          name: 'current',
          models: [
            {
              category: 'current',
              field: 'current',
              subProducts: { hasSub: false },
              name: 'HYCOM',
              longName: 'Hybrid Coordinate Ocean Model',
              description:
                'The HYCOM consortium is a multi-institutional effort sponsored by the National Ocean Partnership Program (NOPP), as part of the U. S. Global Ocean Data Assimilation Experiment (GODAE), to develop and evaluate a data-assimilative hybrid isopycnal-sigma-pressure (generalized) coordinate ocean model (called HYbrid Coordinate Ocean Model or HYCOM). The GODAE objectives of three-dimensional depiction of the ocean state at fine resolution in real time, provision of boundary conditions for coastal and regional models, and provision of oceanic boundary conditions for a global coupled ocean-atmosphere prediction model, are being addressed by a partnership of institutions that represent a broad spectrum of the oceanographic community.',
              link: 'https://www.hycom.org/',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: true,
                    iLevel: 41,
                    values: [
                      'mean',
                      'bottom',
                      5000,
                      4000,
                      3000,
                      2500,
                      2000,
                      1500,
                      1250,
                      1000,
                      900,
                      800,
                      700,
                      600,
                      500,
                      400,
                      350,
                      300,
                      250,
                      200,
                      150,
                      125,
                      100,
                      90,
                      80,
                      70,
                      60,
                      50,
                      45,
                      40,
                      35,
                      30,
                      25,
                      20,
                      15,
                      12,
                      10,
                      8,
                      6,
                      4,
                      2,
                      0,
                    ],
                  },
                  bnds: {
                    minLon: -180,
                    maxLon: 180,
                    minLat: -80,
                    maxLat: 85,
                  },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
            {
              category: 'current',
              field: 'current',
              subProducts: { hasSub: false },
              name: 'RTOFS',
              description:
                'The Global Real-Time Ocean Forecast System (Global RTOFS) is based on an eddy resolving 1/12° global HYCOM (HYbrid Coordinates Ocean Model) and is part of a larger national backbone capability of ocean modeling at NWS in a strong partnership with US Navy. The Global RTOFS ocean model became operational 25 October 2011. In 2020 the Global RTOFS ocean model was upgraded to Version 2.0, which introduces a high-resolution ocean data assimilation capability to the forecast system for the first time. Global RTOFS provides predictions for up to eight days of ocean currents, salinity, temperature and sea ice conditions around the world.',
              longName: 'Real-Time Ocean Forecast System',
              link: 'https://polar.ncep.noaa.gov/global/',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: {
                    minLon: -180,
                    maxLon: 180,
                    minLat: -80,
                    maxLat: 85,
                  },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
            {
              category: 'current',
              field: 'current',
              subProducts: { hasSub: false },
              name: 'RIOPS',
              longName: 'Regional Ice Ocean Prediction System',
              link: 'https://eccc-msc.github.io/open-data/msc-data/nwp_riops/readme_riops-datamart-alpha_en/',
              regions: [
                {
                  name: 'North of 30',
                  levels: {
                    hasLevels: false,
                    // iLevel: 39,
                    // values: [
                    //   '5000', '4000', '3000', '2500', '2000', '1500', '1250', '1000', '0900','0800', '0700',
                    //   '0600', '0500', '0400', '0350', '0300', '0250', '0200', '0150', '0125', '0100', '0090', '0080', '0070',
                    //   '0060', '0050', '0045', '0040', '0035', '0030', '0025', '0020', '0015', '0012', '0010', '0008','0006', '0004', '0002', '0000'
                    // ],
                  },
                  bnds: {
                    minLon: -180,
                    maxLon: 180,
                    minLat: -85,
                    maxLat: 85,
                  },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: false,
            },
            {
              category: 'current',
              field: 'current',
              subProducts: { hasSub: false },
              name: 'CIOPS',
              longName: 'Coastal Ice-Ocean Prediction Systems',
              description:
                'The Coastal Ice Ocean Predicton System (CIOPS) provides a 48 hour ocean and ice forecast over different domains (East, West, Salish Sea) four times a day at 1/36° resolution. A pseudo-analysis component is forced at the ocean boundaries by the Regional Ice Ocean Prediction System (RIOPS) forecasts and spectrally nudged to the RIOPS solution in the deep ocean. Fields from the pseudo-analysis are used to initialize the 00Z forecast, whilst the 06, 12 and 18Z forecasts use a restart files saved at hour 6 from the previous forecast. The atmospheric fluxes for both the pseudo-analysis and forecast components are provided by the High Resolution Deterministic Prediction System (HRDPS) blended both spatially and temporally with either the Global Deterministic Prediction System (GDPS) (for CIOPS-East) or the Regional Deterministic Predicton System (RDPS) (for CIOPS-West) for areas not covered by the HRDPS.',
              link: 'https://eccc-msc.github.io/open-data/msc-data/nwp_ciops/readme_ciops_en/',
              regions: [
                {
                  name: 'east',
                  levels: {
                    hasLevels: true,
                    iLevel: 98,
                    values: [
                      5657.8, 5454.7, 5253.2, 5053.5, 4855.5, 4659.3, 4464.9,
                      4272.3, 4081.4, 3892.4, 3705.2, 3519.8, 3336.3, 3154.5,
                      2974.6, 2796.5, 2620.2, 2445.6, 2272.9, 2101.9, 1932.6,
                      1765.1, 1599.4, 1436.0, 1275.5, 1120.4, 975.7, 850.7,
                      754.8, 687.9, 640.6, 603.6, 571.6, 542.3, 514.8, 488.7,
                      463.8, 440.0, 417.4, 395.8, 375.1, 355.5, 336.8, 318.9,
                      301.9, 285.8, 270.4, 255.7, 241.8, 228.6, 216.0, 204.0,
                      192.7, 181.9, 171.6, 161.9, 152.7, 143.9, 135.6, 127.7,
                      120.2, 113.1, 106.4, 100.0, 93.9, 88.2, 82.7, 77.6, 72.6,
                      68.0, 63.6, 59.4, 55.4, 51.7, 48.1, 44.7, 41.5, 38.5,
                      35.6, 32.9, 30.3, 27.8, 25.5, 23.2, 21.1, 19.1, 17.2,
                      15.4, 13.7, 12.1, 10.5, 9.0, 7.6, 6.3, 5.0, 3.8, 2.7, 1.6,
                      0.5,
                    ],
                  },
                  bnds: { minLon: -77, maxLon: -37, minLat: 34, maxLat: 55 },
                  availDateTimes: [],
                },
                {
                  name: 'west',
                  levels: {
                    hasLevels: true,
                    iLevel: 67,
                    values: [
                      4488.2, 4290.0, 4093.2, 3898.0, 3704.7, 3513.4, 3324.6,
                      3138.6, 2955.6, 2776.0, 2600.4, 2429.0, 2262.4, 2101.0,
                      1945.3, 1795.7, 1652.6, 1516.4, 1387.4, 1265.9, 1152.0,
                      1045.9, 947.5, 856.7, 773.4, 697.3, 628.0, 565.3, 508.6,
                      457.6, 411.8, 370.7, 333.9, 300.9, 271.4, 244.9, 221.1,
                      199.8, 180.6, 163.2, 147.4, 133.1, 120.0, 108.0, 97.0,
                      86.9, 77.6, 69.0, 61.1, 53.9, 47.2, 41.2, 35.7, 30.9,
                      26.6, 22.8, 19.4, 16.5, 14.0, 11.8, 9.8, 8.1, 6.5, 5.1,
                      3.9, 2.7, 1.6, 0.5,
                    ],
                  },
                  bnds: { minLon: -140, maxLon: -122, minLat: 44, maxLat: 60 },
                  availDateTimes: [],
                },
                {
                  name: 'salishSea',
                  levels: {
                    hasLevels: true,
                    iLevel: 38,
                    values: [
                      414.5, 387.6, 360.7, 333.8, 306.8, 279.9, 253.1, 226.3,
                      199.6, 173.1, 147.1, 121.9, 98.1, 76.6, 58.5, 44.5, 34.7,
                      28.2, 24.1, 21.4, 19.5, 18.0, 16.8, 15.6, 14.6, 13.5,
                      12.5, 11.5, 10.5, 9.5, 8.5, 7.5, 6.5, 5.5, 4.5, 3.5, 2.5,
                      1.5, 0.5,
                    ],
                  },
                  bnds: { minLon: -127, maxLon: -121, minLat: 47, maxLat: 51 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
            {
              category: 'current',
              field: 'current',
              subProducts: { hasSub: false },
              name: 'RDPS',
              longName: 'Global Environmental Multiscale Model',
              link: 'https://en.wikipedia.org/wiki/Global_Environmental_Multiscale_Model',
              regions: [
                {
                  name: 'GOSL',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -71, maxLon: -56, minLat: 45.5, maxLat: 52 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: false,
            },
            // {
            //   field: 'current',
            //   name: 'WMOP',
            //   longName:
            //     'Western Mediterranean OPerational forecasting system (surface)',
            //   depthProperties: {
            //     hasDepth: false
            //   },
            //   imgBnds: { minLon: -5.8, maxLon: 9.2, minLat: 35, maxLat: 44.5 },
            //   imgBndsZoomed: false,
            //   min: 0,
            //   max: 1.5,
            //   availDateTimes: [],
            //   hasHighRes: false,
            //   colorbar: {
            //     hasColorbar: false
            //   },
            //   unit: '<sup>m</sup>&frasl;<sub>s</sub>'
            // },
            // {
            //   field: 'current',
            //   name: 'CMEMS',
            //   longName: 'Copernicus Monitoring Environment Marine Service',
            //   depthProperties: {
            //     hasDepth: false
            //     // iDepth: 14,
            //     // depthLabels: [
            //     //     '399 m',
            //     //     '304 m',
            //     //     '250 m',
            //     //     '203 m',
            //     //     '153 m',
            //     //     '98 m',
            //     //     '73 m',
            //     //     '51 m',
            //     //     '30 m',
            //     //     '19 m',
            //     //     '11 m',
            //     //     '8 m',
            //     //     '5 m',
            //     //     '3 m',
            //     //     '1 m',
            //     // ],
            //     // depthValues: [
            //     //     '0399',
            //     //     '0304',
            //     //     '0250',
            //     //     '0203',
            //     //     '0153',
            //     //     '0098',
            //     //     '0073',
            //     //     '0051',
            //     //     '0030',
            //     //     '0019',
            //     //     '0011',
            //     //     '0008',
            //     //     '0005',
            //     //     '0003',
            //     //     '0001',
            //     // ],
            //   },
            //   imgBnds: {
            //     minLon: -17.2917,
            //     maxLon: 36.2917,
            //     minLat: 30.1875,
            //     maxLat: 45.9792
            //   },
            //   imgBndsZoomed: false,
            //   min: 0,
            //   max: 1.5,
            //   availDateTimes: [],
            //   hasHighRes: false,
            //   colorbar: {
            //     hasColorbar: false
            //   },
            //   unit: '<sup>m</sup>&frasl;<sub>s</sub>'
            // },
            {
              category: 'current',
              field: 'current',
              name: 'Doppio',
              longName: '',
              link: 'https://gmd.copernicus.org/articles/13/3709/2020/',
              regions: [
                {
                  name: '',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -85, maxLat: 85 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: false,
            },
            {
              category: 'current',
              field: 'current',
              name: 'Barents',
              longName: '',
              description:
                "The Barents-2.5 model is a coupled ocean and sea ice model covering the Barents Sea and areas around Svalbard. It is MET Norway's main forecasting model for sea ice in the Barents Sea. The model is based on the METROMS framework which implements the coupling between the ocean component (ROMS) and the sea ice component (CICE). The model employs a regular grid in the horizontal with 2.5km resolution, and an irregular topography-following vertical coordinate system for the ocean consisting of 42 layers, while the ice is modelled in 5 thickness categories, each with 7 vertical layers and a single snow layer on top. The ocean and sea ice is forced by atmospheric fields from MET Norway's in-house 2.5km AROME-Arctic model, a great advantage as the atmosphere forcing is on the same domain and resolution as the ocean and sea ice. Furthermore, boundary conditions comes from TOPAZ4, tides from TPXO tidal model, river runoff climatology from NVE data (mainland Norway) and AHYPE hydrological model (Svalbard+Russia) and the bottom topography is taken from the IBCAO v3 dataset. The model runs a 24 hours analysis for assimilating AMSR2 sea ice concentration from the University of Bremen and then runs a subsequent 66 hours forecast from the produced analysis.",
              link: 'https://thredds.met.no/thredds/fou-hi/barents25.html',
              regions: [
                {
                  name: '',
                  levels: {
                    hasLevels: true,
                    iLevel: 15,
                    values: [
                      3000, 2000, 1000, 500, 300, 250, 200, 150, 100, 75, 50,
                      25, 15, 10, 3, 0,
                    ],
                  },
                  bnds: { minLon: -18, maxLon: 82, minLat: 60, maxLat: 88 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
            {
              category: 'current',
              field: 'current',
              subProducts: { hasSub: false },
              name: 'NorKyst800m',
              longName:
                'Norkyst-800 is used as the main forecast tool for ocean forecasting at the coast of Norway.',
              link: 'https://ocean.met.no/models',
              regions: [
                {
                  name: '',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -85, maxLat: 85 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: false,
            },
          ],
          colorbar: {
            step: 0.01,
            minOrg: -3,
            toFixed: 1,
            colormapOrg: [
              {
                value: 0,
                color: '#cc00cc',
              },
              {
                value: 0.5,
                color: '#0066cc',
              },
              {
                value: 1,
                color: '#009933',
              },
              {
                value: 1.5,
                color: '#ffff00',
              },
              {
                value: 2,
                color: '#ff0000',
              },
              {
                value: 2.5,
                color: '#ffcccc',
              },
            ],
            colormap: [
              {
                value: 0,
                color: '#cc00cc',
              },
              {
                value: 0.5,
                color: '#0066cc',
              },
              {
                value: 1,
                color: '#009933',
              },
              {
                value: 1.5,
                color: '#ffff00',
              },
              {
                value: 2,
                color: '#ff0000',
              },
              {
                value: 2.5,
                color: '#ffcccc',
              },
            ],
          },
          unit: '<sup>m</sup>&frasl;<sub>s</sub>',
          icon: 'mdi-sync',
          hasSetting: true,
        },
      ],
    },
    {
      type: 'ocean',
      name: 'temperature',
      show: true,
      longName: null,
      fields: [
        {
          name: 'temperature',
          models: [
            {
              category: 'temperature',
              field: 'temperature',
              subProducts: { hasSub: false },
              name: 'JPLMUR41',
              longName:
                'Level 4 MUR Global Foundation Sea Surface Temperature Analysis (v4.1)',
              link: 'https://podaac.jpl.nasa.gov/dataset/MUR-JPL-L4-GLOB-v4.1',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: false,
            },
            {
              category: 'temperature',
              field: 'temperature',
              subProducts: { hasSub: false },
              name: 'Coraltemp',
              longName:
                'Daily Global 5km Satellite Coral Bleaching Heat Stress Monitoring (v3.1)',
              link: 'https://www.ncei.noaa.gov/access/metadata/landing-page/bin/iso?id=gov.noaa.nodc:CRW-5km-HeatStressProducts',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: false,
            },
            {
              category: 'temperature',
              field: 'temperature',
              subProducts: { hasSub: false },
              name: 'HYCOM',
              longName: 'Hybrid Coordinate Ocean Model',
              description:
                'The HYCOM consortium is a multi-institutional effort sponsored by the National Ocean Partnership Program (NOPP), as part of the U. S. Global Ocean Data Assimilation Experiment (GODAE), to develop and evaluate a data-assimilative hybrid isopycnal-sigma-pressure (generalized) coordinate ocean model (called HYbrid Coordinate Ocean Model or HYCOM). The GODAE objectives of three-dimensional depiction of the ocean state at fine resolution in real time, provision of boundary conditions for coastal and regional models, and provision of oceanic boundary conditions for a global coupled ocean-atmosphere prediction model, are being addressed by a partnership of institutions that represent a broad spectrum of the oceanographic community.',
              link: 'https://www.hycom.org/',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: true,
                    iLevel: 40,
                    values: [
                      'bottom',
                      5000,
                      4000,
                      3000,
                      2500,
                      2000,
                      1500,
                      1250,
                      1000,
                      900,
                      800,
                      700,
                      600,
                      500,
                      400,
                      350,
                      300,
                      250,
                      200,
                      150,
                      125,
                      100,
                      90,
                      80,
                      70,
                      60,
                      50,
                      45,
                      40,
                      35,
                      30,
                      25,
                      20,
                      15,
                      12,
                      10,
                      8,
                      6,
                      4,
                      2,
                      0,
                    ],
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
            {
              category: 'temperature',
              field: 'temperature',
              subProducts: { hasSub: false },
              name: 'RTOFS',
              description:
                'The Global Real-Time Ocean Forecast System (Global RTOFS) is based on an eddy resolving 1/12° global HYCOM (HYbrid Coordinates Ocean Model) and is part of a larger national backbone capability of ocean modeling at NWS in a strong partnership with US Navy. The Global RTOFS ocean model became operational 25 October 2011. In 2020 the Global RTOFS ocean model was upgraded to Version 2.0, which introduces a high-resolution ocean data assimilation capability to the forecast system for the first time. Global RTOFS provides predictions for up to eight days of ocean currents, salinity, temperature and sea ice conditions around the world.',
              longName: 'Real-Time Ocean Forecast System',
              link: 'https://polar.ncep.noaa.gov/global/',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
            {
              category: 'temperature',
              field: 'temperature',
              subProducts: { hasSub: false },
              name: 'RIOPS',
              longName: 'Regional Ice Ocean Prediction System',
              link: 'https://eccc-msc.github.io/open-data/msc-data/nwp_riops/readme_riops-datamart-alpha_en/',
              regions: [
                {
                  name: 'North of 30',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: false,
            },
            {
              category: 'temperature',
              field: 'temperature',
              subProducts: { hasSub: false },
              name: 'Barents',
              longName: '',
              description:
                "The Barents-2.5 model is a coupled ocean and sea ice model covering the Barents Sea and areas around Svalbard. It is MET Norway's main forecasting model for sea ice in the Barents Sea. The model is based on the METROMS framework which implements the coupling between the ocean component (ROMS) and the sea ice component (CICE). The model employs a regular grid in the horizontal with 2.5km resolution, and an irregular topography-following vertical coordinate system for the ocean consisting of 42 layers, while the ice is modelled in 5 thickness categories, each with 7 vertical layers and a single snow layer on top. The ocean and sea ice is forced by atmospheric fields from MET Norway's in-house 2.5km AROME-Arctic model, a great advantage as the atmosphere forcing is on the same domain and resolution as the ocean and sea ice. Furthermore, boundary conditions comes from TOPAZ4, tides from TPXO tidal model, river runoff climatology from NVE data (mainland Norway) and AHYPE hydrological model (Svalbard+Russia) and the bottom topography is taken from the IBCAO v3 dataset. The model runs a 24 hours analysis for assimilating AMSR2 sea ice concentration from the University of Bremen and then runs a subsequent 66 hours forecast from the produced analysis.",
              link: 'https://thredds.met.no/thredds/fou-hi/barents25.html',
              regions: [
                {
                  name: '',
                  levels: {
                    hasLevels: true,
                    iLevel: 15,
                    values: [
                      3000, 2000, 1000, 500, 300, 250, 200, 150, 100, 75, 50,
                      25, 15, 10, 3, 0,
                    ],
                  },
                  bnds: { minLon: -18, maxLon: 82, minLat: 60, maxLat: 88 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
            {
              category: 'temperature',
              field: 'temperature',
              subProducts: { hasSub: false },
              name: 'GOES16',
              longName: 'Geostationary Operational Environmental Satellites',
              description:
                "GOES-16, formerly known as GOES-R before reaching geostationary orbit, is the first of the GOES-R series of Geostationary Operational Environmental Satellites (GOES) operated by NASA and the National Oceanic and Atmospheric Administration (NOAA). GOES-16 serves as the operational geostationary weather satellite in the GOES East position at 75.2°W, providing a view centered on the Americas. GOES-16 provides high spatial and temporal resolution imagery of the Earth through 16 spectral bands at visible and infrared wavelengths using its Advanced Baseline Imager (ABI). GOES-16's Geostationary Lightning Mapper (GLM) is the first operational lightning mapper flown in geostationary orbit. The spacecraft also includes four other scientific instruments for monitoring space weather and the Sun.",
              link: 'https://www.goes-r.gov/',
              regions: [
                {
                  name: '',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -135, maxLon: -13, minLat: -80, maxLat: 65 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
          ],
          colorbar: {
            hasColorbar: true,
            step: 0.1,
            minOrg: -2,
            toFixed: 0,
            colormapOrg: [
              {
                value: -2,
                color: '#cc00cc',
              },
              {
                value: 0,
                color: '#ff99ff',
              },
              {
                value: 0.1,
                color: '#0066cc',
              },
              {
                value: 10,
                color: '#66ffcc',
              },
              {
                value: 10.1,
                color: '#009933',
              },
              {
                value: 20,
                color: '#ccff66',
              },
              {
                value: 20.1,
                color: '#ffff00',
              },
              {
                value: 30,
                color: '#ff9933',
              },
              {
                value: 30.1,
                color: '#ff0000',
              },
              {
                value: 35,
                color: '#ffcccc',
              },
            ],
            colormap: [
              {
                value: -2,
                color: '#cc00cc',
              },
              {
                value: 0,
                color: '#ff99ff',
              },
              {
                value: 0.1,
                color: '#0066cc',
              },
              {
                value: 10,
                color: '#66ffcc',
              },
              {
                value: 10.1,
                color: '#009933',
              },
              {
                value: 20,
                color: '#ccff66',
              },
              {
                value: 20.1,
                color: '#ffff00',
              },
              {
                value: 30,
                color: '#ff9933',
              },
              {
                value: 30.1,
                color: '#ff0000',
              },
              {
                value: 35,
                color: '#ffcccc',
              },
            ],
          },
          unit: '&deg;C',
          icon: 'mdi-thermometer',
          hasSetting: false,
        },
        {
          name: 'potentialTemperature',
          models: [
            {
              category: 'temperature',
              field: 'potentialTemperature',
              name: 'CIOPS',
              longName: 'Coastal Ice-Ocean Prediction Systems',
              description:
                'The Coastal Ice Ocean Predicton System (CIOPS) provides a 48 hour ocean and ice forecast over different domains (East, West, Salish Sea) four times a day at 1/36° resolution. A pseudo-analysis component is forced at the ocean boundaries by the Regional Ice Ocean Prediction System (RIOPS) forecasts and spectrally nudged to the RIOPS solution in the deep ocean. Fields from the pseudo-analysis are used to initialize the 00Z forecast, whilst the 06, 12 and 18Z forecasts use a restart files saved at hour 6 from the previous forecast. The atmospheric fluxes for both the pseudo-analysis and forecast components are provided by the High Resolution Deterministic Prediction System (HRDPS) blended both spatially and temporally with either the Global Deterministic Prediction System (GDPS) (for CIOPS-East) or the Regional Deterministic Predicton System (RDPS) (for CIOPS-West) for areas not covered by the HRDPS.',
              link: 'https://eccc-msc.github.io/open-data/msc-data/nwp_ciops/readme_ciops_en/',
              regions: [
                {
                  name: 'east',
                  levels: {
                    hasLevels: true,
                    iLevel: 98,
                    values: [
                      5657.8, 5454.7, 5253.2, 5053.5, 4855.5, 4659.3, 4464.9,
                      4272.3, 4081.4, 3892.4, 3705.2, 3519.8, 3336.3, 3154.5,
                      2974.6, 2796.5, 2620.2, 2445.6, 2272.9, 2101.9, 1932.6,
                      1765.1, 1599.4, 1436.0, 1275.5, 1120.4, 975.7, 850.7,
                      754.8, 687.9, 640.6, 603.6, 571.6, 542.3, 514.8, 488.7,
                      463.8, 440.0, 417.4, 395.8, 375.1, 355.5, 336.8, 318.9,
                      301.9, 285.8, 270.4, 255.7, 241.8, 228.6, 216.0, 204.0,
                      192.7, 181.9, 171.6, 161.9, 152.7, 143.9, 135.6, 127.7,
                      120.2, 113.1, 106.4, 100.0, 93.9, 88.2, 82.7, 77.6, 72.6,
                      68.0, 63.6, 59.4, 55.4, 51.7, 48.1, 44.7, 41.5, 38.5,
                      35.6, 32.9, 30.3, 27.8, 25.5, 23.2, 21.1, 19.1, 17.2,
                      15.4, 13.7, 12.1, 10.5, 9.0, 7.6, 6.3, 5.0, 3.8, 2.7, 1.6,
                      0.5,
                    ],
                  },
                  bnds: { minLon: -77, maxLon: -37, minLat: 34, maxLat: 55 },
                  availDateTimes: [],
                },
                {
                  name: 'west',
                  levels: {
                    hasLevels: true,
                    iLevel: 67,
                    values: [
                      4488.2, 4290.0, 4093.2, 3898.0, 3704.7, 3513.4, 3324.6,
                      3138.6, 2955.6, 2776.0, 2600.4, 2429.0, 2262.4, 2101.0,
                      1945.3, 1795.7, 1652.6, 1516.4, 1387.4, 1265.9, 1152.0,
                      1045.9, 947.5, 856.7, 773.4, 697.3, 628.0, 565.3, 508.6,
                      457.6, 411.8, 370.7, 333.9, 300.9, 271.4, 244.9, 221.1,
                      199.8, 180.6, 163.2, 147.4, 133.1, 120.0, 108.0, 97.0,
                      86.9, 77.6, 69.0, 61.1, 53.9, 47.2, 41.2, 35.7, 30.9,
                      26.6, 22.8, 19.4, 16.5, 14.0, 11.8, 9.8, 8.1, 6.5, 5.1,
                      3.9, 2.7, 1.6, 0.5,
                    ],
                  },
                  bnds: { minLon: -140, maxLon: -122, minLat: 44, maxLat: 60 },
                  availDateTimes: [],
                },
                {
                  name: 'salishSea',
                  levels: {
                    hasLevels: true,
                    iLevel: 38,
                    values: [
                      414.5, 387.6, 360.7, 333.8, 306.8, 279.9, 253.1, 226.3,
                      199.6, 173.1, 147.1, 121.9, 98.1, 76.6, 58.5, 44.5, 34.7,
                      28.2, 24.1, 21.4, 19.5, 18.0, 16.8, 15.6, 14.6, 13.5,
                      12.5, 11.5, 10.5, 9.5, 8.5, 7.5, 6.5, 5.5, 4.5, 3.5, 2.5,
                      1.5, 0.5,
                    ],
                  },
                  bnds: { minLon: -127, maxLon: -121, minLat: 47, maxLat: 51 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
          ],
          colorbar: {
            hasColorbar: true,
            step: 0.1,
            minOrg: -2,
            toFixed: 0,
            colormapOrg: [
              {
                value: -2,
                color: '#cc00cc',
              },
              {
                value: 0,
                color: '#ff99ff',
              },
              {
                value: 0.1,
                color: '#0066cc',
              },
              {
                value: 10,
                color: '#66ffcc',
              },
              {
                value: 10.1,
                color: '#009933',
              },
              {
                value: 20,
                color: '#ccff66',
              },
              {
                value: 20.1,
                color: '#ffff00',
              },
              {
                value: 30,
                color: '#ff9933',
              },
              {
                value: 30.1,
                color: '#ff0000',
              },
              {
                value: 35,
                color: '#ffcccc',
              },
            ],
            colormap: [
              {
                value: -2,
                color: '#cc00cc',
              },
              {
                value: 0,
                color: '#ff99ff',
              },
              {
                value: 0.1,
                color: '#0066cc',
              },
              {
                value: 10,
                color: '#66ffcc',
              },
              {
                value: 10.1,
                color: '#009933',
              },
              {
                value: 20,
                color: '#ccff66',
              },
              {
                value: 20.1,
                color: '#ffff00',
              },
              {
                value: 30,
                color: '#ff9933',
              },
              {
                value: 30.1,
                color: '#ff0000',
              },
              {
                value: 35,
                color: '#ffcccc',
              },
            ],
          },
          unit: '&deg;C',
          icon: 'mdi-thermometer',
          hasSetting: false,
        },
      ],
    },
    {
      type: 'ocean',
      name: 'salinity',
      show: true,
      longName: null,
      fields: [
        {
          name: 'salinity',
          models: [
            {
              category: 'salinity',
              field: 'salinity',
              subProducts: { hasSub: false },
              name: 'HYCOM',
              longName: 'Hybrid Coordinate Ocean Model',
              description:
                'The HYCOM consortium is a multi-institutional effort sponsored by the National Ocean Partnership Program (NOPP), as part of the U. S. Global Ocean Data Assimilation Experiment (GODAE), to develop and evaluate a data-assimilative hybrid isopycnal-sigma-pressure (generalized) coordinate ocean model (called HYbrid Coordinate Ocean Model or HYCOM). The GODAE objectives of three-dimensional depiction of the ocean state at fine resolution in real time, provision of boundary conditions for coastal and regional models, and provision of oceanic boundary conditions for a global coupled ocean-atmosphere prediction model, are being addressed by a partnership of institutions that represent a broad spectrum of the oceanographic community.',
              link: 'https://www.hycom.org/',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: true,
                    iLevel: 40,
                    values: [
                      'bottom',
                      5000,
                      4000,
                      3000,
                      2500,
                      2000,
                      1500,
                      1250,
                      1000,
                      900,
                      800,
                      700,
                      600,
                      500,
                      400,
                      350,
                      300,
                      250,
                      200,
                      150,
                      125,
                      100,
                      90,
                      80,
                      70,
                      60,
                      50,
                      45,
                      40,
                      35,
                      30,
                      25,
                      20,
                      15,
                      12,
                      10,
                      8,
                      6,
                      4,
                      2,
                      0,
                    ],
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
            {
              category: 'salinity',
              field: 'salinity',
              subProducts: { hasSub: false },
              name: 'RTOFS',
              description:
                'The Global Real-Time Ocean Forecast System (Global RTOFS) is based on an eddy resolving 1/12° global HYCOM (HYbrid Coordinates Ocean Model) and is part of a larger national backbone capability of ocean modeling at NWS in a strong partnership with US Navy. The Global RTOFS ocean model became operational 25 October 2011. In 2020 the Global RTOFS ocean model was upgraded to Version 2.0, which introduces a high-resolution ocean data assimilation capability to the forecast system for the first time. Global RTOFS provides predictions for up to eight days of ocean currents, salinity, temperature and sea ice conditions around the world.',
              longName: 'Real-Time Ocean Forecast System',
              link: 'https://polar.ncep.noaa.gov/global/',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
            {
              category: 'salinity',
              field: 'salinity',
              subProducts: { hasSub: false },
              name: 'CIOPS',
              longName: 'Coastal Ice-Ocean Prediction Systems',
              description:
                'The Coastal Ice Ocean Predicton System (CIOPS) provides a 48 hour ocean and ice forecast over different domains (East, West, Salish Sea) four times a day at 1/36° resolution. A pseudo-analysis component is forced at the ocean boundaries by the Regional Ice Ocean Prediction System (RIOPS) forecasts and spectrally nudged to the RIOPS solution in the deep ocean. Fields from the pseudo-analysis are used to initialize the 00Z forecast, whilst the 06, 12 and 18Z forecasts use a restart files saved at hour 6 from the previous forecast. The atmospheric fluxes for both the pseudo-analysis and forecast components are provided by the High Resolution Deterministic Prediction System (HRDPS) blended both spatially and temporally with either the Global Deterministic Prediction System (GDPS) (for CIOPS-East) or the Regional Deterministic Predicton System (RDPS) (for CIOPS-West) for areas not covered by the HRDPS.',
              link: 'https://eccc-msc.github.io/open-data/msc-data/nwp_ciops/readme_ciops_en/',
              regions: [
                {
                  name: 'east',
                  levels: {
                    hasLevels: true,
                    iLevel: 98,
                    values: [
                      5657.8, 5454.7, 5253.2, 5053.5, 4855.5, 4659.3, 4464.9,
                      4272.3, 4081.4, 3892.4, 3705.2, 3519.8, 3336.3, 3154.5,
                      2974.6, 2796.5, 2620.2, 2445.6, 2272.9, 2101.9, 1932.6,
                      1765.1, 1599.4, 1436.0, 1275.5, 1120.4, 975.7, 850.7,
                      754.8, 687.9, 640.6, 603.6, 571.6, 542.3, 514.8, 488.7,
                      463.8, 440.0, 417.4, 395.8, 375.1, 355.5, 336.8, 318.9,
                      301.9, 285.8, 270.4, 255.7, 241.8, 228.6, 216.0, 204.0,
                      192.7, 181.9, 171.6, 161.9, 152.7, 143.9, 135.6, 127.7,
                      120.2, 113.1, 106.4, 100.0, 93.9, 88.2, 82.7, 77.6, 72.6,
                      68.0, 63.6, 59.4, 55.4, 51.7, 48.1, 44.7, 41.5, 38.5,
                      35.6, 32.9, 30.3, 27.8, 25.5, 23.2, 21.1, 19.1, 17.2,
                      15.4, 13.7, 12.1, 10.5, 9.0, 7.6, 6.3, 5.0, 3.8, 2.7, 1.6,
                      0.5,
                    ],
                  },
                  bnds: { minLon: -77, maxLon: -37, minLat: 34, maxLat: 55 },
                  availDateTimes: [],
                },
                {
                  name: 'west',
                  levels: {
                    hasLevels: true,
                    iLevel: 67,
                    values: [
                      4488.2, 4290.0, 4093.2, 3898.0, 3704.7, 3513.4, 3324.6,
                      3138.6, 2955.6, 2776.0, 2600.4, 2429.0, 2262.4, 2101.0,
                      1945.3, 1795.7, 1652.6, 1516.4, 1387.4, 1265.9, 1152.0,
                      1045.9, 947.5, 856.7, 773.4, 697.3, 628.0, 565.3, 508.6,
                      457.6, 411.8, 370.7, 333.9, 300.9, 271.4, 244.9, 221.1,
                      199.8, 180.6, 163.2, 147.4, 133.1, 120.0, 108.0, 97.0,
                      86.9, 77.6, 69.0, 61.1, 53.9, 47.2, 41.2, 35.7, 30.9,
                      26.6, 22.8, 19.4, 16.5, 14.0, 11.8, 9.8, 8.1, 6.5, 5.1,
                      3.9, 2.7, 1.6, 0.5,
                    ],
                  },
                  bnds: { minLon: -140, maxLon: -122, minLat: 44, maxLat: 60 },
                  availDateTimes: [],
                },
                {
                  name: 'salishSea',
                  levels: {
                    hasLevels: true,
                    iLevel: 38,
                    values: [
                      414.5, 387.6, 360.7, 333.8, 306.8, 279.9, 253.1, 226.3,
                      199.6, 173.1, 147.1, 121.9, 98.1, 76.6, 58.5, 44.5, 34.7,
                      28.2, 24.1, 21.4, 19.5, 18.0, 16.8, 15.6, 14.6, 13.5,
                      12.5, 11.5, 10.5, 9.5, 8.5, 7.5, 6.5, 5.5, 4.5, 3.5, 2.5,
                      1.5, 0.5,
                    ],
                  },
                  bnds: { minLon: -127, maxLon: -121, minLat: 47, maxLat: 51 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
            {
              category: 'salinity',
              field: 'salinity',
              subProducts: { hasSub: false },
              name: 'Barents',
              longName: '',
              description:
                "The Barents-2.5 model is a coupled ocean and sea ice model covering the Barents Sea and areas around Svalbard. It is MET Norway's main forecasting model for sea ice in the Barents Sea. The model is based on the METROMS framework which implements the coupling between the ocean component (ROMS) and the sea ice component (CICE). The model employs a regular grid in the horizontal with 2.5km resolution, and an irregular topography-following vertical coordinate system for the ocean consisting of 42 layers, while the ice is modelled in 5 thickness categories, each with 7 vertical layers and a single snow layer on top. The ocean and sea ice is forced by atmospheric fields from MET Norway's in-house 2.5km AROME-Arctic model, a great advantage as the atmosphere forcing is on the same domain and resolution as the ocean and sea ice. Furthermore, boundary conditions comes from TOPAZ4, tides from TPXO tidal model, river runoff climatology from NVE data (mainland Norway) and AHYPE hydrological model (Svalbard+Russia) and the bottom topography is taken from the IBCAO v3 dataset. The model runs a 24 hours analysis for assimilating AMSR2 sea ice concentration from the University of Bremen and then runs a subsequent 66 hours forecast from the produced analysis.",
              link: 'https://thredds.met.no/thredds/fou-hi/barents25.html',
              regions: [
                {
                  name: '',
                  levels: {
                    hasLevels: true,
                    iLevel: 15,
                    values: [
                      3000, 2000, 1000, 500, 300, 250, 200, 150, 100, 75, 50,
                      25, 15, 10, 3, 0,
                    ],
                  },
                  bnds: { minLon: -18, maxLon: 82, minLat: 60, maxLat: 88 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
          ],
          colorbar: {
            hasColorbar: true,
            step: 0.01,
            minOrg: 0,
            toFixed: 0,
            colormapOrg: [
              {
                value: 30,
                color: '#3333cc',
              },
              {
                value: 32,
                color: '#0099ff',
              },
              {
                value: 34,
                color: '#009933',
              },
              {
                value: 36,
                color: '#cccc00',
              },
              {
                value: 38,
                color: '#ff6600',
              },
            ],
            colormap: [
              {
                value: 30,
                color: '#3333cc',
              },
              {
                value: 32,
                color: '#0099ff',
              },
              {
                value: 34,
                color: '#009933',
              },
              {
                value: 36,
                color: '#cccc00',
              },
              {
                value: 38,
                color: '#ff6600',
              },
            ],
          },
          unit: 'psu',
          icon: 'mdi-shaker-outline',
          hasSetting: false,
        },
      ],
    },
    {
      type: 'ocean',
      name: 'density',
      show: true,
      longName: null,
      fields: [
        {
          name: 'density',
          models: [
            {
              category: 'density',
              field: 'density',
              subProducts: { hasSub: false },
              name: 'HYCOM',
              longName: 'Hybrid Coordinate Ocean Model',
              description:
                'The HYCOM consortium is a multi-institutional effort sponsored by the National Ocean Partnership Program (NOPP), as part of the U. S. Global Ocean Data Assimilation Experiment (GODAE), to develop and evaluate a data-assimilative hybrid isopycnal-sigma-pressure (generalized) coordinate ocean model (called HYbrid Coordinate Ocean Model or HYCOM). The GODAE objectives of three-dimensional depiction of the ocean state at fine resolution in real time, provision of boundary conditions for coastal and regional models, and provision of oceanic boundary conditions for a global coupled ocean-atmosphere prediction model, are being addressed by a partnership of institutions that represent a broad spectrum of the oceanographic community.',
              link: 'https://www.hycom.org/',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: true,
                    iLevel: 40,
                    values: [
                      'bottom',
                      5000,
                      4000,
                      3000,
                      2500,
                      2000,
                      1500,
                      1250,
                      1000,
                      900,
                      800,
                      700,
                      600,
                      500,
                      400,
                      350,
                      300,
                      250,
                      200,
                      150,
                      125,
                      100,
                      90,
                      80,
                      70,
                      60,
                      50,
                      45,
                      40,
                      35,
                      30,
                      25,
                      20,
                      15,
                      12,
                      10,
                      8,
                      6,
                      4,
                      2,
                      0,
                    ],
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: false,
            },
            {
              category: 'density',
              field: 'density',
              subProducts: { hasSub: false },
              name: 'Barents',
              longName: '',
              description:
                "The Barents-2.5 model is a coupled ocean and sea ice model covering the Barents Sea and areas around Svalbard. It is MET Norway's main forecasting model for sea ice in the Barents Sea. The model is based on the METROMS framework which implements the coupling between the ocean component (ROMS) and the sea ice component (CICE). The model employs a regular grid in the horizontal with 2.5km resolution, and an irregular topography-following vertical coordinate system for the ocean consisting of 42 layers, while the ice is modelled in 5 thickness categories, each with 7 vertical layers and a single snow layer on top. The ocean and sea ice is forced by atmospheric fields from MET Norway's in-house 2.5km AROME-Arctic model, a great advantage as the atmosphere forcing is on the same domain and resolution as the ocean and sea ice. Furthermore, boundary conditions comes from TOPAZ4, tides from TPXO tidal model, river runoff climatology from NVE data (mainland Norway) and AHYPE hydrological model (Svalbard+Russia) and the bottom topography is taken from the IBCAO v3 dataset. The model runs a 24 hours analysis for assimilating AMSR2 sea ice concentration from the University of Bremen and then runs a subsequent 66 hours forecast from the produced analysis.",
              link: 'https://thredds.met.no/thredds/fou-hi/barents25.html',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -18, maxLon: 82, minLat: 60, maxLat: 88 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: false,
            },
          ],
          colorbar: {
            hasColorbar: true,
            step: 0.1,
            minOrg: 900,
            toFixed: 0,
            colormapOrg: [
              {
                value: 1020,
                color: '#66ccff',
              },
              {
                value: 1022,
                color: '#0066ff',
              },
              {
                value: 1024,
                color: '#6666ff',
              },
              {
                value: 1026,
                color: '#6600ff',
              },
              {
                value: 1028,
                color: '#9900ff',
              },
              {
                value: 1030,
                color: '#660066',
              },
            ],
            colormap: [
              {
                value: 1020,
                color: '#66ccff',
              },
              {
                value: 1022,
                color: '#0066ff',
              },
              {
                value: 1024,
                color: '#6666ff',
              },
              {
                value: 1026,
                color: '#6600ff',
              },
              {
                value: 1028,
                color: '#9900ff',
              },
              {
                value: 1030,
                color: '#660066',
              },
            ],
          },
          unit: '<sup>kg</sup>&frasl;<sub>m<sup>3</sup></sub>',
          icon: 'mdi-format-line-weight',
          hasSetting: false,
        },
      ],
    },
    {
      type: 'ocean',
      name: 'seaSurfaceHeight',
      show: true,
      longName: null,
      fields: [
        {
          name: 'seaSurfaceHeight',
          models: [
            {
              category: 'seaSurfaceHeight',
              field: 'seaSurfaceHeight',
              subProducts: { hasSub: false },
              name: 'RTOFS',
              description:
                'The Global Real-Time Ocean Forecast System (Global RTOFS) is based on an eddy resolving 1/12° global HYCOM (HYbrid Coordinates Ocean Model) and is part of a larger national backbone capability of ocean modeling at NWS in a strong partnership with US Navy. The Global RTOFS ocean model became operational 25 October 2011. In 2020 the Global RTOFS ocean model was upgraded to Version 2.0, which introduces a high-resolution ocean data assimilation capability to the forecast system for the first time. Global RTOFS provides predictions for up to eight days of ocean currents, salinity, temperature and sea ice conditions around the world.',
              longName: 'Real-Time Ocean Forecast System',
              link: 'https://polar.ncep.noaa.gov/global/',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -85, maxLat: 85 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
            {
              category: 'seaSurfaceHeight',
              field: 'seaSurfaceHeight',
              subProducts: { hasSub: false },
              name: 'CIOPS',
              longName: 'Coastal Ice-Ocean Prediction Systems',
              description:
                'The Coastal Ice Ocean Predicton System (CIOPS) provides a 48 hour ocean and ice forecast over different domains (East, West, Salish Sea) four times a day at 1/36° resolution. A pseudo-analysis component is forced at the ocean boundaries by the Regional Ice Ocean Prediction System (RIOPS) forecasts and spectrally nudged to the RIOPS solution in the deep ocean. Fields from the pseudo-analysis are used to initialize the 00Z forecast, whilst the 06, 12 and 18Z forecasts use a restart files saved at hour 6 from the previous forecast. The atmospheric fluxes for both the pseudo-analysis and forecast components are provided by the High Resolution Deterministic Prediction System (HRDPS) blended both spatially and temporally with either the Global Deterministic Prediction System (GDPS) (for CIOPS-East) or the Regional Deterministic Predicton System (RDPS) (for CIOPS-West) for areas not covered by the HRDPS.',
              link: 'https://eccc-msc.github.io/open-data/msc-data/nwp_ciops/readme_ciops_en/',
              regions: [
                {
                  name: 'east',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -77, maxLon: -37, minLat: 34, maxLat: 55 },
                  availDateTimes: [],
                },
                {
                  name: 'west',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -140, maxLon: -122, minLat: 44, maxLat: 60 },
                  availDateTimes: [],
                },
                {
                  name: 'salishSea',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -127, maxLon: -121, minLat: 47, maxLat: 51 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
            {
              category: 'seaSurfaceHeight',
              field: 'seaSurfaceHeight',
              subProducts: { hasSub: false },
              name: 'Barents',
              longName: '',
              description:
                "The Barents-2.5 model is a coupled ocean and sea ice model covering the Barents Sea and areas around Svalbard. It is MET Norway's main forecasting model for sea ice in the Barents Sea. The model is based on the METROMS framework which implements the coupling between the ocean component (ROMS) and the sea ice component (CICE). The model employs a regular grid in the horizontal with 2.5km resolution, and an irregular topography-following vertical coordinate system for the ocean consisting of 42 layers, while the ice is modelled in 5 thickness categories, each with 7 vertical layers and a single snow layer on top. The ocean and sea ice is forced by atmospheric fields from MET Norway's in-house 2.5km AROME-Arctic model, a great advantage as the atmosphere forcing is on the same domain and resolution as the ocean and sea ice. Furthermore, boundary conditions comes from TOPAZ4, tides from TPXO tidal model, river runoff climatology from NVE data (mainland Norway) and AHYPE hydrological model (Svalbard+Russia) and the bottom topography is taken from the IBCAO v3 dataset. The model runs a 24 hours analysis for assimilating AMSR2 sea ice concentration from the University of Bremen and then runs a subsequent 66 hours forecast from the produced analysis.",
              link: 'https://thredds.met.no/thredds/fou-hi/barents25.html',
              regions: [
                {
                  name: '',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -18, maxLon: 82, minLat: 60, maxLat: 88 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
          ],
          colorbar: {
            hasColorbar: true,
            step: 0.01,
            minOrg: -5,
            toFixed: 0,
            colormapOrg: [
              {
                value: -1,
                color: '#cc00cc',
              },
              {
                value: -0.67,
                color: '#0066cc',
              },
              {
                value: -0.33,
                color: '#009933',
              },
              {
                value: 0.33,
                color: '#ffff00',
              },
              {
                value: 0.67,
                color: '#ff0000',
              },
              {
                value: 1,
                color: '#ffcccc',
              },
            ],
            colormap: [
              {
                value: -1,
                color: '#cc00cc',
              },
              {
                value: -0.67,
                color: '#0066cc',
              },
              {
                value: -0.33,
                color: '#009933',
              },
              {
                value: 0.33,
                color: '#ffff00',
              },
              {
                value: 0.67,
                color: '#ff0000',
              },
              {
                value: 1,
                color: '#ffcccc',
              },
            ],
          },
          unit: 'm',
          icon: 'mdi-account-circle',
          hasSetting: true,
        },
      ],
    },
    {
      type: 'ocean',
      name: 'surfaceLayerDepth',
      show: true,
      longName: null,
      fields: [
        {
          name: 'mixedLayerDepth',
          models: [
            {
              category: 'surfaceLayerDepth',
              field: 'mixedLayerDepth',
              subProducts: { hasSub: false },
              name: 'HYCOM',
              longName: 'Hybrid Coordinate Ocean Model',
              description:
                'The HYCOM consortium is a multi-institutional effort sponsored by the National Ocean Partnership Program (NOPP), as part of the U. S. Global Ocean Data Assimilation Experiment (GODAE), to develop and evaluate a data-assimilative hybrid isopycnal-sigma-pressure (generalized) coordinate ocean model (called HYbrid Coordinate Ocean Model or HYCOM). The GODAE objectives of three-dimensional depiction of the ocean state at fine resolution in real time, provision of boundary conditions for coastal and regional models, and provision of oceanic boundary conditions for a global coupled ocean-atmosphere prediction model, are being addressed by a partnership of institutions that represent a broad spectrum of the oceanographic community.',
              link: 'https://www.hycom.org/',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
            {
              category: 'surfaceLayerDepth',
              field: 'mixedLayerDepth',
              subProducts: { hasSub: false },
              name: 'RTOFS',
              description:
                'The Global Real-Time Ocean Forecast System (Global RTOFS) is based on an eddy resolving 1/12° global HYCOM (HYbrid Coordinates Ocean Model) and is part of a larger national backbone capability of ocean modeling at NWS in a strong partnership with US Navy. The Global RTOFS ocean model became operational 25 October 2011. In 2020 the Global RTOFS ocean model was upgraded to Version 2.0, which introduces a high-resolution ocean data assimilation capability to the forecast system for the first time. Global RTOFS provides predictions for up to eight days of ocean currents, salinity, temperature and sea ice conditions around the world.',
              longName: 'Real-Time Ocean Forecast System',
              link: 'https://polar.ncep.noaa.gov/global/',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
            {
              category: 'surfaceLayerDepth',
              field: 'mixedLayerDepth',
              subProducts: { hasSub: false },
              name: 'RIOPS',
              longName: 'Regional Ice Ocean Prediction System',
              regions: [
                {
                  name: 'North of 30',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: false,
            },
            {
              category: 'surfaceLayerDepth',
              field: 'mixedLayerDepth',
              subProducts: { hasSub: false },
              name: 'CIOPS',
              longName: 'Coastal Ice-Ocean Prediction Systems',
              description:
                'The Coastal Ice Ocean Predicton System (CIOPS) provides a 48 hour ocean and ice forecast over different domains (East, West, Salish Sea) four times a day at 1/36° resolution. A pseudo-analysis component is forced at the ocean boundaries by the Regional Ice Ocean Prediction System (RIOPS) forecasts and spectrally nudged to the RIOPS solution in the deep ocean. Fields from the pseudo-analysis are used to initialize the 00Z forecast, whilst the 06, 12 and 18Z forecasts use a restart files saved at hour 6 from the previous forecast. The atmospheric fluxes for both the pseudo-analysis and forecast components are provided by the High Resolution Deterministic Prediction System (HRDPS) blended both spatially and temporally with either the Global Deterministic Prediction System (GDPS) (for CIOPS-East) or the Regional Deterministic Predicton System (RDPS) (for CIOPS-West) for areas not covered by the HRDPS.',
              link: 'https://eccc-msc.github.io/open-data/msc-data/nwp_ciops/readme_ciops_en/',
              regions: [
                {
                  name: 'east',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -77, maxLon: -37, minLat: 34, maxLat: 55 },
                  availDateTimes: [],
                },
                {
                  name: 'west',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -140, maxLon: -122, minLat: 44, maxLat: 60 },
                  availDateTimes: [],
                },
                {
                  name: 'salishSea',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -127, maxLon: -121, minLat: 47, maxLat: 51 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
          ],
          colorbar: {
            hasColorbar: true,
            step: 1,
            minOrg: 0,
            toFixed: 0,
            colormapOrg: [
              {
                value: 0,
                color: '#cc00cc',
              },
              {
                value: 200,
                color: '#0066cc',
              },
              {
                value: 400,
                color: '#009933',
              },
              {
                value: 600,
                color: '#ffff00',
              },
              {
                value: 800,
                color: '#ff0000',
              },
              {
                value: 1000,
                color: '#ffcccc',
              },
            ],
            colormap: [
              {
                value: 0,
                color: '#cc00cc',
              },
              {
                value: 200,
                color: '#0066cc',
              },
              {
                value: 400,
                color: '#009933',
              },
              {
                value: 600,
                color: '#ffff00',
              },
              {
                value: 800,
                color: '#ff0000',
              },
              {
                value: 1000,
                color: '#ffcccc',
              },
            ],
          },
          unit: 'm',
          icon: 'mdi-account-circle',
          hasSetting: false,
        },
        {
          name: 'boundaryLayerThickness',
          models: [
            {
              category: 'surfaceLayerDepth',
              field: 'boundaryLayerThickness',
              subProducts: { hasSub: false },
              name: 'HYCOM',
              longName: 'Hybrid Coordinate Ocean Model',
              description:
                'The HYCOM consortium is a multi-institutional effort sponsored by the National Ocean Partnership Program (NOPP), as part of the U. S. Global Ocean Data Assimilation Experiment (GODAE), to develop and evaluate a data-assimilative hybrid isopycnal-sigma-pressure (generalized) coordinate ocean model (called HYbrid Coordinate Ocean Model or HYCOM). The GODAE objectives of three-dimensional depiction of the ocean state at fine resolution in real time, provision of boundary conditions for coastal and regional models, and provision of oceanic boundary conditions for a global coupled ocean-atmosphere prediction model, are being addressed by a partnership of institutions that represent a broad spectrum of the oceanographic community.',
              link: 'https://www.hycom.org/',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
            {
              category: 'surfaceLayerDepth',
              field: 'boundaryLayerThickness',
              subProducts: { hasSub: false },
              name: 'RTOFS',
              description:
                'The Global Real-Time Ocean Forecast System (Global RTOFS) is based on an eddy resolving 1/12° global HYCOM (HYbrid Coordinates Ocean Model) and is part of a larger national backbone capability of ocean modeling at NWS in a strong partnership with US Navy. The Global RTOFS ocean model became operational 25 October 2011. In 2020 the Global RTOFS ocean model was upgraded to Version 2.0, which introduces a high-resolution ocean data assimilation capability to the forecast system for the first time. Global RTOFS provides predictions for up to eight days of ocean currents, salinity, temperature and sea ice conditions around the world.',
              longName: 'Real-Time Ocean Forecast System',
              link: 'https://polar.ncep.noaa.gov/global/',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -85, maxLat: 85 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
          ],
          colorbar: {
            hasColorbar: true,
            step: 1,
            minOrg: 0,
            toFixed: 0,
            colormapOrg: [
              {
                value: 0,
                color: '#cc00cc',
              },
              {
                value: 200,
                color: '#0066cc',
              },
              {
                value: 400,
                color: '#009933',
              },
              {
                value: 600,
                color: '#ffff00',
              },
              {
                value: 800,
                color: '#ff0000',
              },
              {
                value: 1000,
                color: '#ffcccc',
              },
            ],
            colormap: [
              {
                value: 0,
                color: '#cc00cc',
              },
              {
                value: 200,
                color: '#0066cc',
              },
              {
                value: 400,
                color: '#009933',
              },
              {
                value: 600,
                color: '#ffff00',
              },
              {
                value: 800,
                color: '#ff0000',
              },
              {
                value: 1000,
                color: '#ffcccc',
              },
            ],
          },
          unit: 'm',
          icon: 'mdi-account-circle',
          hasSetting: false,
        },
        {
          name: 'turboclineDepth',
          models: [
            {
              category: 'surfaceLayerDepth',
              field: 'turboclineDepth',
              subProducts: { hasSub: false },
              name: 'CIOPS',
              longName: 'Coastal Ice-Ocean Prediction Systems',
              description:
                'The Coastal Ice Ocean Predicton System (CIOPS) provides a 48 hour ocean and ice forecast over different domains (East, West, Salish Sea) four times a day at 1/36° resolution. A pseudo-analysis component is forced at the ocean boundaries by the Regional Ice Ocean Prediction System (RIOPS) forecasts and spectrally nudged to the RIOPS solution in the deep ocean. Fields from the pseudo-analysis are used to initialize the 00Z forecast, whilst the 06, 12 and 18Z forecasts use a restart files saved at hour 6 from the previous forecast. The atmospheric fluxes for both the pseudo-analysis and forecast components are provided by the High Resolution Deterministic Prediction System (HRDPS) blended both spatially and temporally with either the Global Deterministic Prediction System (GDPS) (for CIOPS-East) or the Regional Deterministic Predicton System (RDPS) (for CIOPS-West) for areas not covered by the HRDPS.',
              link: 'https://eccc-msc.github.io/open-data/msc-data/nwp_ciops/readme_ciops_en/',
              regions: [
                {
                  name: 'east',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -77, maxLon: -37, minLat: 34, maxLat: 55 },
                  availDateTimes: [],
                },
                {
                  name: 'west',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -140, maxLon: -122, minLat: 44, maxLat: 60 },
                  availDateTimes: [],
                },
                {
                  name: 'salishSea',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -127, maxLon: -121, minLat: 47, maxLat: 51 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
          ],
          colorbar: {
            hasColorbar: true,
            step: 1,
            minOrg: 0,
            toFixed: 0,
            colormapOrg: [
              {
                value: 0,
                color: '#cc00cc',
              },
              {
                value: 200,
                color: '#0066cc',
              },
              {
                value: 400,
                color: '#009933',
              },
              {
                value: 600,
                color: '#ffff00',
              },
              {
                value: 800,
                color: '#ff0000',
              },
              {
                value: 1000,
                color: '#ffcccc',
              },
            ],
            colormap: [
              {
                value: 0,
                color: '#cc00cc',
              },
              {
                value: 200,
                color: '#0066cc',
              },
              {
                value: 400,
                color: '#009933',
              },
              {
                value: 600,
                color: '#ffff00',
              },
              {
                value: 800,
                color: '#ff0000',
              },
              {
                value: 1000,
                color: '#ffcccc',
              },
            ],
          },
          unit: 'm',
          icon: 'mdi-account-circle',
          hasSetting: false,
        },
      ],
    },
    // {
    //   name: 'Boundary Layer Thickness',
    //   show: false,
    //   longName: null,
    //   fields: [
    //     {
    //       name: 'boundaryLayer',
    //       directory:'boundaryLayerThickness',
    //       models: [
    //         {
    //           category: 'Boundary Layer Thickness',
    //           field: 'Boundary Layer Thickness',
    //           subProducts: { hasSub: false },
    //           directory: 'HYCOM',
    //           longName: 'Hybrid Coordinate Ocean Model',
    //           link: 'https://www.hycom.org/',
    //           region: 'G',
    //           type:'tile',
    //           depthProperties: {
    //             hasDepth: false,
    //           },
    //           imgBnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
    //           imgBndsZoomed: false,
    //           availDateTimes: [],
    //           hasDateTime: true,
    //         },
    //       ],
    //       colorbar: {
    //         hasColorbar: true,
    //         step: 1,
    //         minOrg: 0,
    //         toFixed: 0,
    //         colormapOrg: [
    //           {
    //             value: 0,
    //             color: '#cc00cc',
    //           },
    //           {
    //             value: 200,
    //             color: '#0066cc',
    //           },
    //           {
    //             value: 400,
    //             color: '#009933',
    //           },
    //           {
    //             value: 600,
    //             color: '#ffff00',
    //           },
    //           {
    //             value: 800,
    //             color: '#ff0000',
    //           },
    //           {
    //             value: 1000,
    //             color: '#ffcccc',
    //           },
    //         ],
    //         colormap: [
    //           {
    //             value: 0,
    //             color: '#cc00cc',
    //           },
    //           {
    //             value: 200,
    //             color: '#0066cc',
    //           },
    //           {
    //             value: 400,
    //             color: '#009933',
    //           },
    //           {
    //             value: 600,
    //             color: '#ffff00',
    //           },
    //           {
    //             value: 800,
    //             color: '#ff0000',
    //           },
    //           {
    //             value: 1000,
    //             color: '#ffcccc',
    //           },
    //         ],
    //       },
    //       unit: 'm',
    //       icon: 'mdi-account-circle',
    //       hasSetting: false,
    //     },
    //   ],
    // },
    {
      type: 'ocean',
      name: 'wave',
      show: true,
      longName: 'wave',
      fields: [
        {
          name: 'combinedWaveHeight',
          models: [
            {
              category: 'wave',
              field: 'combinedWaveHeight',
              name: 'GEFS',
              longName: 'Global Ensemble Forecast System',
              description:
                'The Global Ensemble Forecast System (GEFS) is a weather model created by the National Centers for Environmental Prediction (NCEP) that generates 21 separate forecasts (ensemble members) to address underlying uncertainties in the input data such limited coverage, instruments or observing systems biases, and the limitations of the model itself. GEFS quantifies these uncertainties by generating multiple forecasts, which in turn produce a range of potential outcomes based on differences or perturbations applied to the data after it has been incorporated into the model. Each forecast compensates for a different set of uncertainties.',
              link: 'https://www.ncei.noaa.gov/products/weather-climate-models/global-ensemble-forecast',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
          ],
          colorbar: {
            hasColorbar: true,
            step: 0.1,
            minOrg: 0,
            toFixed: 1,
            colormapOrg: [
              {
                value: 0,
                color: '#cc00cc',
              },
              {
                value: 1,
                color: '#0066cc',
              },
              {
                value: 2,
                color: '#009933',
              },
              {
                value: 5,
                color: '#ffff00',
              },
              {
                value: 10,
                color: '#ff0000',
              },
              {
                value: 20,
                color: '#ffcccc',
              },
            ],
            colormap: [
              {
                value: 0,
                color: '#cc00cc',
              },
              {
                value: 1,
                color: '#0066cc',
              },
              {
                value: 2,
                color: '#009933',
              },
              {
                value: 5,
                color: '#ffff00',
              },
              {
                value: 10,
                color: '#ff0000',
              },
              {
                value: 20,
                color: '#ffcccc',
              },
            ],
          },
          unit: 'm',
          hasSetting: false,
        },
        {
          name: 'swellWaveHeight',
          models: [
            {
              category: 'wave',
              field: 'swellWaveHeight',
              name: 'GEFS',
              longName: 'Global Ensemble Forecast System',
              description:
                'The Global Ensemble Forecast System (GEFS) is a weather model created by the National Centers for Environmental Prediction (NCEP) that generates 21 separate forecasts (ensemble members) to address underlying uncertainties in the input data such limited coverage, instruments or observing systems biases, and the limitations of the model itself. GEFS quantifies these uncertainties by generating multiple forecasts, which in turn produce a range of potential outcomes based on differences or perturbations applied to the data after it has been incorporated into the model. Each forecast compensates for a different set of uncertainties.',
              link: 'https://www.ncei.noaa.gov/products/weather-climate-models/global-ensemble-forecast',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
          ],
          colorbar: {
            hasColorbar: true,
            step: 0.1,
            minOrg: 0,
            toFixed: 1,
            colormapOrg: [
              {
                value: 0,
                color: '#cc00cc',
              },
              {
                value: 1,
                color: '#0066cc',
              },
              {
                value: 2,
                color: '#009933',
              },
              {
                value: 5,
                color: '#ffff00',
              },
              {
                value: 10,
                color: '#ff0000',
              },
              {
                value: 20,
                color: '#ffcccc',
              },
            ],
            colormap: [
              {
                value: 0,
                color: '#cc00cc',
              },
              {
                value: 1,
                color: '#0066cc',
              },
              {
                value: 2,
                color: '#009933',
              },
              {
                value: 5,
                color: '#ffff00',
              },
              {
                value: 10,
                color: '#ff0000',
              },
              {
                value: 20,
                color: '#ffcccc',
              },
            ],
          },
          unit: 'm',
          hasSetting: false,
        },
        {
          name: 'windWaveHeight',
          models: [
            {
              category: 'wave',
              field: 'windWaveHeight',
              name: 'GEFS',
              longName: 'Global Ensemble Forecast System',
              description:
                'The Global Ensemble Forecast System (GEFS) is a weather model created by the National Centers for Environmental Prediction (NCEP) that generates 21 separate forecasts (ensemble members) to address underlying uncertainties in the input data such limited coverage, instruments or observing systems biases, and the limitations of the model itself. GEFS quantifies these uncertainties by generating multiple forecasts, which in turn produce a range of potential outcomes based on differences or perturbations applied to the data after it has been incorporated into the model. Each forecast compensates for a different set of uncertainties.',
              link: 'https://www.ncei.noaa.gov/products/weather-climate-models/global-ensemble-forecast',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
          ],
          colorbar: {
            hasColorbar: true,
            step: 0.1,
            minOrg: 0,
            toFixed: 1,
            colormapOrg: [
              {
                value: 0,
                color: '#cc00cc',
              },
              {
                value: 1,
                color: '#0066cc',
              },
              {
                value: 2,
                color: '#009933',
              },
              {
                value: 5,
                color: '#ffff00',
              },
              {
                value: 10,
                color: '#ff0000',
              },
              {
                value: 20,
                color: '#ffcccc',
              },
            ],
            colormap: [
              {
                value: 0,
                color: '#cc00cc',
              },
              {
                value: 1,
                color: '#0066cc',
              },
              {
                value: 2,
                color: '#009933',
              },
              {
                value: 5,
                color: '#ffff00',
              },
              {
                value: 10,
                color: '#ff0000',
              },
              {
                value: 20,
                color: '#ffcccc',
              },
            ],
          },
          unit: 'm',
          hasSetting: false,
        },

        {
          name: 'swellWavePeriod',
          models: [
            {
              category: 'wave',
              field: 'swellWavePeriod',
              name: 'GEFS',
              longName: 'Global Ensemble Forecast System',
              description:
                'The Global Ensemble Forecast System (GEFS) is a weather model created by the National Centers for Environmental Prediction (NCEP) that generates 21 separate forecasts (ensemble members) to address underlying uncertainties in the input data such limited coverage, instruments or observing systems biases, and the limitations of the model itself. GEFS quantifies these uncertainties by generating multiple forecasts, which in turn produce a range of potential outcomes based on differences or perturbations applied to the data after it has been incorporated into the model. Each forecast compensates for a different set of uncertainties.',
              link: 'https://www.ncei.noaa.gov/products/weather-climate-models/global-ensemble-forecast',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
          ],
          colorbar: {
            hasColorbar: true,
            step: 1,
            minOrg: 0,
            toFixed: 0,
            colormapOrg: [
              {
                value: 0,
                color: '#cc00cc',
              },
              {
                value: 1,
                color: '#0066cc',
              },
              {
                value: 2,
                color: '#009933',
              },
              {
                value: 5,
                color: '#ffff00',
              },
              {
                value: 10,
                color: '#ff0000',
              },
              {
                value: 20,
                color: '#ffcccc',
              },
            ],
            colormap: [
              {
                value: 0,
                color: '#cc00cc',
              },
              {
                value: 1,
                color: '#0066cc',
              },
              {
                value: 2,
                color: '#009933',
              },
              {
                value: 5,
                color: '#ffff00',
              },
              {
                value: 10,
                color: '#ff0000',
              },
              {
                value: 20,
                color: '#ffcccc',
              },
            ],
          },
          unit: 's',
          hasSetting: false,
        },
        {
          name: 'windWavePeriod',
          models: [
            {
              category: 'wave',
              field: 'windWavePeriod',
              name: 'GEFS',
              longName: 'Global Ensemble Forecast System',
              description:
                'The Global Ensemble Forecast System (GEFS) is a weather model created by the National Centers for Environmental Prediction (NCEP) that generates 21 separate forecasts (ensemble members) to address underlying uncertainties in the input data such limited coverage, instruments or observing systems biases, and the limitations of the model itself. GEFS quantifies these uncertainties by generating multiple forecasts, which in turn produce a range of potential outcomes based on differences or perturbations applied to the data after it has been incorporated into the model. Each forecast compensates for a different set of uncertainties.',
              link: 'https://www.ncei.noaa.gov/products/weather-climate-models/global-ensemble-forecast',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
          ],
          colorbar: {
            hasColorbar: true,
            step: 1,
            minOrg: 0,
            toFixed: 0,
            colormapOrg: [
              {
                value: 0,
                color: '#cc00cc',
              },
              {
                value: 1,
                color: '#0066cc',
              },
              {
                value: 2,
                color: '#009933',
              },
              {
                value: 5,
                color: '#ffff00',
              },
              {
                value: 10,
                color: '#ff0000',
              },
              {
                value: 20,
                color: '#ffcccc',
              },
            ],
            colormap: [
              {
                value: 0,
                color: '#cc00cc',
              },
              {
                value: 1,
                color: '#0066cc',
              },
              {
                value: 2,
                color: '#009933',
              },
              {
                value: 5,
                color: '#ffff00',
              },
              {
                value: 10,
                color: '#ff0000',
              },
              {
                value: 20,
                color: '#ffcccc',
              },
            ],
          },
          unit: 's',
          hasSetting: false,
        },
        // {
        //   name: 'Sea State Code',
        //   directory:'SSC',
        //   models: [
        //     {
        //       category: 'Wave',
        //       field: 'SSC',
        //       directory: 'GFS',
        //       longName:
        //         'In oceanography, sea state is the general condition of the free surface on a large body of water, with respect to wind waves and swell, at a certain location and moment.',
        //       link: 'https://en.wikipedia.org/wiki/Sea_state',
        //       region: 'G',
        //       type:'tile',
        //       depthProperties: {
        //         hasDepth: false,
        //       },
        //       imgBnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
        //       imgBndsZoomed: false,
        //       availDateTimes: [],
        //       hasDateTime: true,
        //     },
        //   ],
        //   colorbar: {
        //     hasColorbar: true,
        //     step: 1,
        //     minOrg: 0,
        //     colormapOrg: [
        //       {
        //         value: 0,
        //         color: '#cc00cc',
        //       },
        //       {
        //         value: 1,
        //         color: '#9966ff',
        //       },
        //       {
        //         value: 2,
        //         color: '#3366ff',
        //       },
        //       {
        //         value: 3,
        //         color: '#0099ff',
        //       },
        //       {
        //         value: 4,
        //         color: '#00cc66',
        //       },
        //       {
        //         value: 5,
        //         color: '#66ff33',
        //       },
        //       {
        //         value: 6,
        //         color: '#ffff00',
        //       },
        //       {
        //         value: 7,
        //         color: '#ff6600',
        //       },
        //       {
        //         value: 8,
        //         color: '#cc0000',
        //       },
        //       {
        //         value: 9,
        //         color: '#ffcccc',
        //       },
        //     ],
        //     colormap: [
        //       {
        //         value: 0,
        //         color: '#cc00cc',
        //       },
        //       {
        //         value: 1,
        //         color: '#9966ff',
        //       },
        //       {
        //         value: 2,
        //         color: '#3366ff',
        //       },
        //       {
        //         value: 3,
        //         color: '#0099ff',
        //       },
        //       {
        //         value: 4,
        //         color: '#00cc66',
        //       },
        //       {
        //         value: 5,
        //         color: '#66ff33',
        //       },
        //       {
        //         value: 6,
        //         color: '#ffff00',
        //       },
        //       {
        //         value: 7,
        //         color: '#ff6600',
        //       },
        //       {
        //         value: 8,
        //         color: '#cc0000',
        //       },
        //       {
        //         value: 9,
        //         color: '#ffcccc',
        //       },
        //     ],
        //   },
        //   unit: '',
        //   hasSetting: false,
        // },
      ],
    },
    {
      type: 'ocean',
      name: 'surfaceHeatFlux',
      show: true,
      longName: null,
      fields: [
        {
          name: 'heatFlux',
          models: [
            {
              category: 'surfaceHeatFlux',
              field: 'heatFlux',
              subProducts: { hasSub: false },
              name: 'HYCOM',
              longName: 'Hybrid Coordinate Ocean Model',
              description:
                'The HYCOM consortium is a multi-institutional effort sponsored by the National Ocean Partnership Program (NOPP), as part of the U. S. Global Ocean Data Assimilation Experiment (GODAE), to develop and evaluate a data-assimilative hybrid isopycnal-sigma-pressure (generalized) coordinate ocean model (called HYbrid Coordinate Ocean Model or HYCOM). The GODAE objectives of three-dimensional depiction of the ocean state at fine resolution in real time, provision of boundary conditions for coastal and regional models, and provision of oceanic boundary conditions for a global coupled ocean-atmosphere prediction model, are being addressed by a partnership of institutions that represent a broad spectrum of the oceanographic community.',
              link: 'https://www.hycom.org/',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
          ],
          colorbar: {
            hasColorbar: true,
            step: 1,
            minOrg: -2000,
            colormapOrg: [
              {
                value: -1500,
                color: '#ff00ff',
              },
              {
                value: -1000,
                color: '#0099ff',
              },
              {
                value: -500,
                color: '#33cc33',
              },
              {
                value: 0,
                color: '#ffffff',
              },
              {
                value: 500,
                color: '#ffff00',
              },
              {
                value: 1000,
                color: '#ff6600',
              },
              {
                value: 1500,
                color: '#ff0000',
              },
            ],
            colormap: [
              {
                value: -1500,
                color: '#ff00ff',
              },
              {
                value: -1000,
                color: '#0099ff',
              },
              {
                value: -500,
                color: '#33cc33',
              },
              {
                value: 0,
                color: '#ffffff',
              },
              {
                value: 500,
                color: '#ffff00',
              },
              {
                value: 1000,
                color: '#ff6600',
              },
              {
                value: 1500,
                color: '#ff0000',
              },
            ],
          },
          unit: '<sup>w</sup>&frasl;<sub>m<sup>2</sup></sub>',
          hasSetting: false,
        },
      ],
    },
    {
      type: 'ocean',
      name: 'seaice',
      show: true,
      longName: null,
      fields: [
        {
          name: 'seaiceAreaFraction',
          models: [
            // {
            //   field: 'Seaice',
            //   directory: 'CMC',
            //   longName: 'Global Environmental Multiscale Model',
            //   depthProperties: {
            //     hasDepth: false
            //   },
            //   imgBnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
            //   imgBndsZoomed: false,
            //   min: 0,
            //   max: 100,
            //   availDateTimes: [],
            //   hasDateTime: true,
            //   colorbar: {
            //     hasColorbar: true,
            //     labels: [
            //       { location: 0, label: '100' },
            //       { location: 0.2, label: '80' },
            //       { location: 0.4, label: '60' },
            //       { location: 0.6, label: '40' },
            //       { location: 0.8, label: '20' },
            //       { location: 1, label: '0' }
            //     ],
            //     colormap: [
            //       {
            //         minValue: 0,
            //         maxValue: 100,
            //         // minColor: [255, 255, 255],
            //         // maxColor: [0, 51, 153]
            //         minColor: [102,179,255],
            //         maxColor: [0,51,102]
            //       }
            //     ]
            //   },
            //   unit: '%'
            // },
            {
              category: 'seaice',
              field: 'seaiceAreaFraction',
              subProducts: { hasSub: false },
              name: 'RTOFS',
              description:
                'The Global Real-Time Ocean Forecast System (Global RTOFS) is based on an eddy resolving 1/12° global HYCOM (HYbrid Coordinates Ocean Model) and is part of a larger national backbone capability of ocean modeling at NWS in a strong partnership with US Navy. The Global RTOFS ocean model became operational 25 October 2011. In 2020 the Global RTOFS ocean model was upgraded to Version 2.0, which introduces a high-resolution ocean data assimilation capability to the forecast system for the first time. Global RTOFS provides predictions for up to eight days of ocean currents, salinity, temperature and sea ice conditions around the world.',
              longName: 'Real-Time Ocean Forecast System',
              link: 'https://polar.ncep.noaa.gov/global/',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
            {
              category: 'seaice',
              field: 'seaiceAreaFraction',
              subProducts: { hasSub: false },
              name: 'RIOPS',
              longName: 'Regional Ice Ocean Prediction System',
              link: 'https://eccc-msc.github.io/open-data/msc-data/nwp_riops/readme_riops-datamart-alpha_en/',
              regions: [
                {
                  name: 'North of 30',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: false,
            },
            {
              category: 'seaice',
              field: 'seaiceAreaFraction',
              subProducts: { hasSub: false },
              name: 'Coraltemp',
              longName:
                'Daily Global 5km Satellite Coral Bleaching Heat Stress Monitoring (v3.1)',
              link: 'https://www.ncei.noaa.gov/access/metadata/landing-page/bin/iso?id=gov.noaa.nodc:CRW-5km-HeatStressProducts',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: false,
            },
            {
              category: 'seaice',
              field: 'seaiceAreaFraction',
              subProducts: { hasSub: false },
              name: 'Barents',
              longName: '',
              description:
                "The Barents-2.5 model is a coupled ocean and sea ice model covering the Barents Sea and areas around Svalbard. It is MET Norway's main forecasting model for sea ice in the Barents Sea. The model is based on the METROMS framework which implements the coupling between the ocean component (ROMS) and the sea ice component (CICE). The model employs a regular grid in the horizontal with 2.5km resolution, and an irregular topography-following vertical coordinate system for the ocean consisting of 42 layers, while the ice is modelled in 5 thickness categories, each with 7 vertical layers and a single snow layer on top. The ocean and sea ice is forced by atmospheric fields from MET Norway's in-house 2.5km AROME-Arctic model, a great advantage as the atmosphere forcing is on the same domain and resolution as the ocean and sea ice. Furthermore, boundary conditions comes from TOPAZ4, tides from TPXO tidal model, river runoff climatology from NVE data (mainland Norway) and AHYPE hydrological model (Svalbard+Russia) and the bottom topography is taken from the IBCAO v3 dataset. The model runs a 24 hours analysis for assimilating AMSR2 sea ice concentration from the University of Bremen and then runs a subsequent 66 hours forecast from the produced analysis.",
              link: 'https://thredds.met.no/thredds/fou-hi/barents25.html',
              regions: [
                {
                  name: '',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -18, maxLon: 82, minLat: 60, maxLat: 88 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
          ],
          colorbar: {
            hasColorbar: true,
            minOrg: 0,
            step: 1,
            toFixed: 0,
            colormapOrg: [
              {
                value: 0,
                color: '#66b3ff',
              },
              {
                value: 100,
                color: '#003366',
              },
            ],
            colormap: [
              {
                value: 0,
                color: '#66b3ff',
              },
              {
                value: 100,
                color: '#003366',
              },
            ],
          },
          unit: '%',
          icon: 'mdi-skate',
          hasSetting: false,
        },
        {
          name: 'seaiceThickness',
          models: [
            {
              category: 'seaice',
              field: 'seaiceThickness',
              subProducts: { hasSub: false },
              name: 'RTOFS',
              description:
                'The Global Real-Time Ocean Forecast System (Global RTOFS) is based on an eddy resolving 1/12° global HYCOM (HYbrid Coordinates Ocean Model) and is part of a larger national backbone capability of ocean modeling at NWS in a strong partnership with US Navy. The Global RTOFS ocean model became operational 25 October 2011. In 2020 the Global RTOFS ocean model was upgraded to Version 2.0, which introduces a high-resolution ocean data assimilation capability to the forecast system for the first time. Global RTOFS provides predictions for up to eight days of ocean currents, salinity, temperature and sea ice conditions around the world.',
              longName: 'Real-Time Ocean Forecast System',
              link: 'https://polar.ncep.noaa.gov/global/',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
            {
              category: 'seaice',
              field: 'seaiceThickness',
              subProducts: { hasSub: false },
              name: 'Barents',
              longName: '',
              description:
                "The Barents-2.5 model is a coupled ocean and sea ice model covering the Barents Sea and areas around Svalbard. It is MET Norway's main forecasting model for sea ice in the Barents Sea. The model is based on the METROMS framework which implements the coupling between the ocean component (ROMS) and the sea ice component (CICE). The model employs a regular grid in the horizontal with 2.5km resolution, and an irregular topography-following vertical coordinate system for the ocean consisting of 42 layers, while the ice is modelled in 5 thickness categories, each with 7 vertical layers and a single snow layer on top. The ocean and sea ice is forced by atmospheric fields from MET Norway's in-house 2.5km AROME-Arctic model, a great advantage as the atmosphere forcing is on the same domain and resolution as the ocean and sea ice. Furthermore, boundary conditions comes from TOPAZ4, tides from TPXO tidal model, river runoff climatology from NVE data (mainland Norway) and AHYPE hydrological model (Svalbard+Russia) and the bottom topography is taken from the IBCAO v3 dataset. The model runs a 24 hours analysis for assimilating AMSR2 sea ice concentration from the University of Bremen and then runs a subsequent 66 hours forecast from the produced analysis.",
              link: 'https://thredds.met.no/thredds/fou-hi/barents25.html',
              regions: [
                {
                  name: '',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -18, maxLon: 82, minLat: 60, maxLat: 88 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
            {
              category: 'seaice',
              field: 'seaiceThickness',
              subProducts: { hasSub: false },
              name: 'GEFS',
              longName: 'Global Ensemble Forecast System',
              description:
                'The Global Ensemble Forecast System (GEFS) is a weather model created by the National Centers for Environmental Prediction (NCEP) that generates 21 separate forecasts (ensemble members) to address underlying uncertainties in the input data such limited coverage, instruments or observing systems biases, and the limitations of the model itself. GEFS quantifies these uncertainties by generating multiple forecasts, which in turn produce a range of potential outcomes based on differences or perturbations applied to the data after it has been incorporated into the model. Each forecast compensates for a different set of uncertainties.',
              link: 'https://www.ncei.noaa.gov/products/weather-climate-models/global-ensemble-forecast',
              regions: [
                {
                  name: 'Global',
                  levels: {
                    hasLevels: true,
                    iLevel: 0,
                    values: [2],
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -90, maxLat: 90 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
          ],
          colorbar: {
            hasColorbar: true,
            minOrg: 0,
            step: 0.01,
            toFixed: 0,
            colormapOrg: [
              {
                value: 0,
                color: '#66b3ff',
              },
              {
                value: 5,
                color: '#003366',
              },
            ],
            colormap: [
              {
                value: 0,
                color: '#66b3ff',
              },
              {
                value: 5,
                color: '#003366',
              },
            ],
          },
          unit: '%',
          icon: 'mdi-skate',
          hasSetting: false,
        },
        {
          name: 'seaiceTemperature',
          models: [
            {
              category: 'seaice',
              field: 'seaiceTemperature',
              subProducts: { hasSub: false },
              name: 'RTOFS',
              description:
                'The Global Real-Time Ocean Forecast System (Global RTOFS) is based on an eddy resolving 1/12° global HYCOM (HYbrid Coordinates Ocean Model) and is part of a larger national backbone capability of ocean modeling at NWS in a strong partnership with US Navy. The Global RTOFS ocean model became operational 25 October 2011. In 2020 the Global RTOFS ocean model was upgraded to Version 2.0, which introduces a high-resolution ocean data assimilation capability to the forecast system for the first time. Global RTOFS provides predictions for up to eight days of ocean currents, salinity, temperature and sea ice conditions around the world.',
              longName: 'Real-Time Ocean Forecast System',
              link: 'https://polar.ncep.noaa.gov/global/',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
          ],
          colorbar: {
            hasColorbar: true,
            minOrg: -100,
            step: 1,
            toFixed: 0,
            colormapOrg: [
              {
                value: -45,
                color: '#cc00cc',
              },
              {
                value: -40,
                color: '#ff99ff',
              },
              {
                value: -35,
                color: '#0066cc',
              },
              {
                value: -30,
                color: '#66ffcc',
              },
              {
                value: -25,
                color: '#009933',
              },
              {
                value: -20,
                color: '#ccff66',
              },
              {
                value: -15,
                color: '#ffff00',
              },
              {
                value: -10,
                color: '#ff9933',
              },
              {
                value: -5,
                color: '#ff0000',
              },
              {
                value: 0,
                color: '#ffcccc',
              },
            ],
            colormap: [
              {
                value: -45,
                color: '#cc00cc',
              },
              {
                value: -40,
                color: '#ff99ff',
              },
              {
                value: -35,
                color: '#0066cc',
              },
              {
                value: -30,
                color: '#66ffcc',
              },
              {
                value: -25,
                color: '#009933',
              },
              {
                value: -20,
                color: '#ccff66',
              },
              {
                value: -15,
                color: '#ffff00',
              },
              {
                value: -10,
                color: '#ff9933',
              },
              {
                value: -5,
                color: '#ff0000',
              },
              {
                value: 0,
                color: '#ffcccc',
              },
            ],
          },
          unit: '%',
          icon: 'mdi-skate',
          hasSetting: false,
        },
        {
          name: 'seaiceVelocity',
          models: [
            {
              category: 'seaice',
              field: 'seaiceVelocity',
              subProducts: { hasSub: false },
              name: 'RTOFS',
              description:
                'The Global Real-Time Ocean Forecast System (Global RTOFS) is based on an eddy resolving 1/12° global HYCOM (HYbrid Coordinates Ocean Model) and is part of a larger national backbone capability of ocean modeling at NWS in a strong partnership with US Navy. The Global RTOFS ocean model became operational 25 October 2011. In 2020 the Global RTOFS ocean model was upgraded to Version 2.0, which introduces a high-resolution ocean data assimilation capability to the forecast system for the first time. Global RTOFS provides predictions for up to eight days of ocean currents, salinity, temperature and sea ice conditions around the world.',
              longName: 'Real-Time Ocean Forecast System',
              link: 'https://polar.ncep.noaa.gov/global/',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
            {
              category: 'seaice',
              field: 'seaiceVelocity',
              subProducts: { hasSub: false },
              name: 'Barents',
              longName: '',
              description:
                "The Barents-2.5 model is a coupled ocean and sea ice model covering the Barents Sea and areas around Svalbard. It is MET Norway's main forecasting model for sea ice in the Barents Sea. The model is based on the METROMS framework which implements the coupling between the ocean component (ROMS) and the sea ice component (CICE). The model employs a regular grid in the horizontal with 2.5km resolution, and an irregular topography-following vertical coordinate system for the ocean consisting of 42 layers, while the ice is modelled in 5 thickness categories, each with 7 vertical layers and a single snow layer on top. The ocean and sea ice is forced by atmospheric fields from MET Norway's in-house 2.5km AROME-Arctic model, a great advantage as the atmosphere forcing is on the same domain and resolution as the ocean and sea ice. Furthermore, boundary conditions comes from TOPAZ4, tides from TPXO tidal model, river runoff climatology from NVE data (mainland Norway) and AHYPE hydrological model (Svalbard+Russia) and the bottom topography is taken from the IBCAO v3 dataset. The model runs a 24 hours analysis for assimilating AMSR2 sea ice concentration from the University of Bremen and then runs a subsequent 66 hours forecast from the produced analysis.",
              link: 'https://thredds.met.no/thredds/fou-hi/barents25.html',
              regions: [
                {
                  name: '',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -18, maxLon: 82, minLat: 60, maxLat: 88 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
          ],
          colorbar: {
            hasColorbar: true,
            minOrg: 0,
            step: 1,
            toFixed: 0,
            colormapOrg: [
              {
                value: 0,
                color: '#66b3ff',
              },
              {
                value: 100,
                color: '#003366',
              },
            ],
            colormap: [
              {
                value: 0,
                color: '#66b3ff',
              },
              {
                value: 100,
                color: '#003366',
              },
            ],
          },
          unit: '%',
          icon: 'mdi-skate',
          hasSetting: false,
        },
      ],
    },
    {
      type: 'ocean',
      name: 'chlorophyll',
      show: true,
      longName: null,
      fields: [
        {
          name: 'chlorophyll',
          models: [
            {
              category: 'chlorophyll',
              field: 'chlorophyll',
              subProducts: { hasSub: false },
              name: 'MODIS',
              longName: 'Moderate Resolution Imaging Spectroradiometer',
              link: 'https://modis.gsfc.nasa.gov/data/dataprod/chlor_a.php',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: false,
            },
          ],
          colorbar: {
            hasColorbar: true,
            step: 0.01,
            minOrg: -3,
            toFixed: 0,
            colormapOrg: [
              {
                value: -2,
                color: '#003300',
              },
              {
                value: -1,
                color: '#99ff99',
              },
              {
                value: 0,
                color: '#ffff00',
              },
              {
                value: 1,
                color: '#ff9933',
              },
              {
                value: 2,
                color: '#ff0000',
              },
              {
                value: 3,
                color: '#ffcccc',
              },
            ],
            colormap: [
              {
                value: -2,
                color: '#003300',
              },
              {
                value: -1,
                color: '#99ff99',
              },
              {
                value: 0,
                color: '#ffff00',
              },
              {
                value: 1,
                color: '#ff9933',
              },
              {
                value: 2,
                color: '#ff0000',
              },
              {
                value: 3,
                color: '#ffcccc',
              },
            ],
          },
          unit: 'log <sup>mg</sup>&frasl;<sub>m<sup>3</sup></sub>',
          icon: 'mdi-bacteria',
          hasSetting: false,
        },
      ],
    },

    // --- ATMOSPHERE
    {
      type: 'atmosphere',
      name: 'wind',
      show: true,
      atmosphere: true,
      longName: null,
      fields: [
        {
          name: 'wind',
          models: [
            {
              category: 'wind',
              field: 'wind',
              subProducts: { hasSub: false },
              name: 'GEFS',
              longName: 'Global Ensemble Forecast System',
              description:
                'The Global Ensemble Forecast System (GEFS) is a weather model created by the National Centers for Environmental Prediction (NCEP) that generates 21 separate forecasts (ensemble members) to address underlying uncertainties in the input data such limited coverage, instruments or observing systems biases, and the limitations of the model itself. GEFS quantifies these uncertainties by generating multiple forecasts, which in turn produce a range of potential outcomes based on differences or perturbations applied to the data after it has been incorporated into the model. Each forecast compensates for a different set of uncertainties.',
              link: 'https://www.ncei.noaa.gov/products/weather-climate-models/global-ensemble-forecast',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: true,
                    iLevel: 0,
                    values: [10],
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -90, maxLat: 90 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
            {
              category: 'wind',
              field: 'wind',
              subProducts: { hasSub: false },
              name: 'HRDPS',
              longName: 'High Resolution Deterministic Prediction System',
              description:
                'The Environment Canada High Resolution Deterministic Prediction System is a regional model covering the majority of Canada and some of northern Continental US. For many years, this model was published as an experiment in providing this new data to the public. In December of 2017, HRDPS was changed into the operational category.With several NOAA models covering the contenential USA, and HRDPS covering almost all of Canada, we all now have public domain high resolution coverage for almost all of North America. There are several HRDPS models available. The model supported in LuckGrib is the largest, continental version.',
              link: 'https://luckgrib.com/models/cmc_hrdps/',
              regions: [
                {
                  name: 'west',
                  levels: {
                    hasLevels: true,
                    iLevel: 0,
                    values: [
                      1015, 1000, 985, 970, 950, 925, 900, 875, 850, 800, 750,
                      700, 650, 600, 550, 500, 450, 400, 350, 300, 275, 250,
                      225, 200, 175, 150, 100, 50, 30, 20, 10,
                    ],
                  },
                  bnds: { minLon: -136, maxLon: -108, minLat: 44, maxLat: 57 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
            {
              category: 'wind',
              field: 'wind',
              subProducts: { hasSub: false },
              name: 'Barents',
              longName: '',
              description:
                "The Barents-2.5 model is a coupled ocean and sea ice model covering the Barents Sea and areas around Svalbard. It is MET Norway's main forecasting model for sea ice in the Barents Sea. The model is based on the METROMS framework which implements the coupling between the ocean component (ROMS) and the sea ice component (CICE). The model employs a regular grid in the horizontal with 2.5km resolution, and an irregular topography-following vertical coordinate system for the ocean consisting of 42 layers, while the ice is modelled in 5 thickness categories, each with 7 vertical layers and a single snow layer on top. The ocean and sea ice is forced by atmospheric fields from MET Norway's in-house 2.5km AROME-Arctic model, a great advantage as the atmosphere forcing is on the same domain and resolution as the ocean and sea ice. Furthermore, boundary conditions comes from TOPAZ4, tides from TPXO tidal model, river runoff climatology from NVE data (mainland Norway) and AHYPE hydrological model (Svalbard+Russia) and the bottom topography is taken from the IBCAO v3 dataset. The model runs a 24 hours analysis for assimilating AMSR2 sea ice concentration from the University of Bremen and then runs a subsequent 66 hours forecast from the produced analysis.",
              link: 'https://thredds.met.no/thredds/fou-hi/barents25.html',
              regions: [
                {
                  name: '',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -18, maxLon: 82, minLat: 60, maxLat: 88 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
          ],
          colorbar: {
            hasColorbar: false,
            step: 0.01,
            minOrg: -100,
          },
          unit: '<sup>m</sup>&frasl;<sub>s</sub>',
          icon: 'mdi-sync',
          hasSetting: true,
        },
        {
          name: 'windGust',
          models: [
            {
              category: 'wind',
              field: 'windGust',
              subProducts: { hasSub: false },
              name: 'GEFS',
              longName: 'Global Ensemble Forecast System',
              description:
                'The Global Ensemble Forecast System (GEFS) is a weather model created by the National Centers for Environmental Prediction (NCEP) that generates 21 separate forecasts (ensemble members) to address underlying uncertainties in the input data such limited coverage, instruments or observing systems biases, and the limitations of the model itself. GEFS quantifies these uncertainties by generating multiple forecasts, which in turn produce a range of potential outcomes based on differences or perturbations applied to the data after it has been incorporated into the model. Each forecast compensates for a different set of uncertainties.',
              link: 'https://www.ncei.noaa.gov/products/weather-climate-models/global-ensemble-forecast',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: true,
                    iLevel: 0,
                    values: [10],
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -90, maxLat: 90 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: false,
            },
          ],
          colorbar: {
            hasColorbar: false,
            step: 0.01,
            minOrg: -100,
          },
          unit: '<sup>m</sup>&frasl;<sub>s</sub>',
          icon: 'mdi-sync',
          hasSetting: true,
        },
      ],
    },
    {
      type: 'atmosphere',
      name: 'airTemperature',
      show: true,
      longName: null,
      fields: [
        {
          name: 'airTemperature',
          models: [
            {
              category: 'airTemperature',
              field: 'airTemperature',
              subProducts: { hasSub: false },
              name: 'GEFS',
              longName: 'Global Ensemble Forecast System',
              description:
                'The Global Ensemble Forecast System (GEFS) is a weather model created by the National Centers for Environmental Prediction (NCEP) that generates 21 separate forecasts (ensemble members) to address underlying uncertainties in the input data such limited coverage, instruments or observing systems biases, and the limitations of the model itself. GEFS quantifies these uncertainties by generating multiple forecasts, which in turn produce a range of potential outcomes based on differences or perturbations applied to the data after it has been incorporated into the model. Each forecast compensates for a different set of uncertainties.',
              link: 'https://www.ncei.noaa.gov/products/weather-climate-models/global-ensemble-forecast',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: true,
                    iLevel: 0,
                    values: [2],
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -90, maxLat: 90 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
            {
              category: 'airTemperature',
              field: 'airTemperature',
              subProducts: { hasSub: false },
              name: 'HRDPS',
              longName: 'High Resolution Deterministic Prediction System',
              description:
                'The Environment Canada High Resolution Deterministic Prediction System is a regional model covering the majority of Canada and some of northern Continental US. For many years, this model was published as an experiment in providing this new data to the public. In December of 2017, HRDPS was changed into the operational category.With several NOAA models covering the contenential USA, and HRDPS covering almost all of Canada, we all now have public domain high resolution coverage for almost all of North America. There are several HRDPS models available. The model supported in LuckGrib is the largest, continental version.',
              link: 'https://luckgrib.com/models/cmc_hrdps/',
              regions: [
                {
                  name: 'west',
                  levels: {
                    hasLevels: true,
                    iLevel: 0,
                    values: [
                      1015, 1000, 985, 970, 950, 925, 900, 875, 850, 800, 750,
                      700, 650, 600, 550, 500, 450, 400, 350, 300, 275, 250,
                      225, 200, 175, 150, 100, 50, 30, 20, 10,
                    ],
                  },
                  bnds: { minLon: -136, maxLon: -108, minLat: 44, maxLat: 57 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
          ],
          colorbar: {
            hasColorbar: true,
            colormapOrg: [
              {
                value: -40,
                color: '#cc00cc',
              },
              {
                value: -30,
                color: '#ff99ff',
              },
              {
                value: -20,
                color: '#0066cc',
              },
              {
                value: -10,
                color: '#66ffcc',
              },
              {
                value: 0,
                color: '#009933',
              },
              {
                value: 10,
                color: '#ccff66',
              },
              {
                value: 20,
                color: '#ffff00',
              },
              {
                value: 30,
                color: '#ff9933',
              },
              {
                value: 40,
                color: '#ff0000',
              },
              {
                value: 50,
                color: '#ffcccc',
              },
            ],
            colormap: [
              {
                value: -40,
                color: '#cc00cc',
              },
              {
                value: -30,
                color: '#ff99ff',
              },
              {
                value: -20,
                color: '#0066cc',
              },
              {
                value: -10,
                color: '#66ffcc',
              },
              {
                value: 0,
                color: '#009933',
              },
              {
                value: 10,
                color: '#ccff66',
              },
              {
                value: 20,
                color: '#ffff00',
              },
              {
                value: 30,
                color: '#ff9933',
              },
              {
                value: 40,
                color: '#ff0000',
              },
              {
                value: 50,
                color: '#ffcccc',
              },
            ],
            step: 0.01,
            minOrg: -100,
          },
          unit: 'C',
          icon: 'mdi-sync',
          hasSetting: true,
        },
      ],
    },
    {
      type: 'atmosphere',
      name: 'relativeHumidity',
      show: true,
      longName: null,
      fields: [
        {
          name: 'relativeHumidity',
          models: [
            {
              category: 'relativeHumidity',
              field: 'relativeHumidity',
              subProducts: { hasSub: false },
              name: 'GEFS',
              longName: 'Global Ensemble Forecast System',
              description:
                'The Global Ensemble Forecast System (GEFS) is a weather model created by the National Centers for Environmental Prediction (NCEP) that generates 21 separate forecasts (ensemble members) to address underlying uncertainties in the input data such limited coverage, instruments or observing systems biases, and the limitations of the model itself. GEFS quantifies these uncertainties by generating multiple forecasts, which in turn produce a range of potential outcomes based on differences or perturbations applied to the data after it has been incorporated into the model. Each forecast compensates for a different set of uncertainties.',
              link: 'https://www.ncei.noaa.gov/products/weather-climate-models/global-ensemble-forecast',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: true,
                    iLevel: 0,
                    values: [2],
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -90, maxLat: 90 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
          ],
          colorbar: {
            hasColorbar: true,
            colormapOrg: [
              {
                value: 0,
                color: '#05192C',
              },
              {
                value: 25,
                color: '#D0AE8B',
              },
              {
                value: 50,
                color: '#E8E4E2',
              },
              {
                value: 75,
                color: '#73CCD8',
              },
              {
                value: 100,
                color: '#52B1D2',
              },
            ],
            colormap: [
              {
                value: 0,
                color: '#05192C',
              },
              {
                value: 25,
                color: '#D0AE8B',
              },
              {
                value: 50,
                color: '#E8E4E2',
              },
              {
                value: 75,
                color: '#73CCD8',
              },
              {
                value: 100,
                color: '#52B1D2',
              },
            ],
            step: 1,
            minOrg: 0,
          },
          unit: '%',
          icon: 'mdi-sync',
          hasSetting: false,
        },
      ],
    },
    {
      type: 'atmosphere',
      name: 'pressure',
      show: true,
      longName: null,
      fields: [
        {
          name: 'sealevelPressure',
          models: [
            {
              category: 'pressure',
              field: 'sealevelPressure',
              subProducts: { hasSub: false },
              name: 'GEFS',
              longName: 'Global Ensemble Forecast System',
              description:
                'The Global Ensemble Forecast System (GEFS) is a weather model created by the National Centers for Environmental Prediction (NCEP) that generates 21 separate forecasts (ensemble members) to address underlying uncertainties in the input data such limited coverage, instruments or observing systems biases, and the limitations of the model itself. GEFS quantifies these uncertainties by generating multiple forecasts, which in turn produce a range of potential outcomes based on differences or perturbations applied to the data after it has been incorporated into the model. Each forecast compensates for a different set of uncertainties.',
              link: 'https://www.ncei.noaa.gov/products/weather-climate-models/global-ensemble-forecast',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -90, maxLat: 90 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
          ],
          colorbar: {
            hasColorbar: true,
            colormapOrg: [
              {
                value: 950,
                color: '#0099ff',
              },
              {
                value: 1000,
                color: '#ffffff',
              },
              {
                value: 1050,
                color: '#ff9933',
              },
            ],
            colormap: [
              {
                value: 950,
                color: '#0099ff',
              },
              {
                value: 1000,
                color: '#ffffff',
              },
              {
                value: 1050,
                color: '#ff9933',
              },
            ],
            step: 1,
            minOrg: 900,
            toFixed: 0,
          },
          unit: 'hPa',
          icon: 'mdi-sync',
          hasSetting: false,
        },
        {
          name: 'surfacePressure',
          models: [
            {
              category: 'pressure',
              field: 'surfacePressure',
              subProducts: { hasSub: false },
              name: 'GEFS',
              longName: 'Global Ensemble Forecast System',
              description:
                'The Global Ensemble Forecast System (GEFS) is a weather model created by the National Centers for Environmental Prediction (NCEP) that generates 21 separate forecasts (ensemble members) to address underlying uncertainties in the input data such limited coverage, instruments or observing systems biases, and the limitations of the model itself. GEFS quantifies these uncertainties by generating multiple forecasts, which in turn produce a range of potential outcomes based on differences or perturbations applied to the data after it has been incorporated into the model. Each forecast compensates for a different set of uncertainties.',
              link: 'https://www.ncei.noaa.gov/products/weather-climate-models/global-ensemble-forecast',
              regions: [
                {
                  name: 'global',
                  levels: {
                    hasLevels: false,
                  },
                  bnds: { minLon: -180, maxLon: 180, minLat: -90, maxLat: 90 },
                  availDateTimes: [],
                },
              ],
              iRegion: 0,
              hasDateTime: true,
              active: true,
            },
          ],
          colorbar: {
            hasColorbar: true,
            colormapOrg: [
              {
                value: 950,
                color: '#0099ff',
              },
              {
                value: 1000,
                color: '#ffffff',
              },
              {
                value: 1050,
                color: '#ff9933',
              },
            ],
            colormap: [
              {
                value: 950,
                color: '#0099ff',
              },
              {
                value: 1000,
                color: '#ffffff',
              },
              {
                value: 1050,
                color: '#ff9933',
              },
            ],
            step: 1,
            minOrg: 900,
            toFixed: 0,
          },
          unit: 'hPa',
          icon: 'mdi-sync',
          hasSetting: false,
        },
      ],
    },
    // {
    //   field: 'AIS',
    // show:true,
    //   models: [
    //     {
    //       field: 'AIS',
    //       directory: 'US',
    //       longName: '',
    //       depthProperties: {
    //         hasDepth: false
    //       },
    //       imgBnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
    //       imgBndsZoomed: false,
    //       min: 0,
    //       max: 1000,
    //       availDateTimes: [],
    //       hasDateTime: true,
    //       colorbar: {
    //         hasColorbar: true,
    //         labels: [
    //           { location: 0, label: '1000+' },
    //           { location: 0.3333, label: '10' },
    //           { location: 0.6667, label: '0.1' },
    //           { location: 1, label: '0.001-' }
    //         ],
    //         colormap: [
    //           {
    //             minValue: -3,
    //             maxValue: -1,
    //             minColor: [0, 51, 0],
    //             maxColor: [153, 255, 153]
    //           },
    //           {
    //             minValue: -1,
    //             maxValue: 1,
    //             minColor: [255, 255, 0],
    //             maxColor: [255, 153, 51]
    //           },
    //           {
    //             minValue: 1,
    //             maxValue: 3,
    //             minColor: [255, 0, 0],
    //             maxColor: [255, 204, 204]
    //           }
    //         ]
    //       },
    //       unit: '<sup>mg</sup>&frasl;<sub>m<sup>3</sup></sub>'
    //     }
    //   ],
    //   icon: 'mdi-bacteria',
    //   hasSetting: false
    // },
    // {
    //   field: 'Iceberg',
    //   models: [
    //     {
    //       field: 'Iceberg',
    //       directory: 'NOAA',
    //       longName: 'National Oceanic and Atmospheric Administration',
    //       depthProperties: {
    //         hasDepth: false
    //       },
    //       imgBnds: { minLon: -180, maxLon: 180, minLat: -80, maxLat: 80 },
    //       imgBndsZoomed: false,
    //       // minOrg: 0,
    //       // maxOrg: 1000,
    //       // min: 0,
    //       // max: 1000,
    //       availDateTimes: [],
    //       hasDateTime: false,
    //       colorbar: {
    //         hasColorbar: true,
    //         labels: [
    //           { location: 0.0416667, label: 'Jan' },
    //           { location: 0.125, label: 'Feb' },
    //           { location: 0.2083333, label: 'Mar' },
    //           { location: 0.2916667, label: 'Apr' },
    //           { location: 0.375, label: 'May' },
    //           { location: 0.4583333, label: 'Jun' },
    //           { location: 0.5416667, label: 'Jul' },
    //           { location: 0.625, label: 'Aug' },
    //           { location: 0.7083333, label: 'Sep' },
    //           { location: 0.7916667, label: 'Oct' },
    //           { location: 0.875, label: 'Nov' },
    //           { location: 0.9583333, label: 'Dec' }
    //         ],
    //         colormap: [
    //           {
    //             minValue: 12,
    //             maxValue: 12,
    //             minColor: [255, 153, 51],
    //             maxColor: [255, 153, 51]
    //           },
    //           {
    //             minValue: 11,
    //             maxValue: 11,
    //             minColor: [255, 153, 0],
    //             maxColor: [255, 153, 0]
    //           },
    //           {
    //             minValue: 10,
    //             maxValue: 10,
    //             minColor: [204, 102, 0],
    //             maxColor: [204, 102, 0]
    //           },
    //           {
    //             minValue: 9,
    //             maxValue: 9,
    //             minColor: [51, 204, 51],
    //             maxColor: [51, 204, 51]
    //           },
    //           {
    //             minValue: 8,
    //             maxValue: 8,
    //             minColor: [0, 204, 0],
    //             maxColor: [0, 204, 0]
    //           },
    //           {
    //             minValue: 7,
    //             maxValue: 7,
    //             minColor: [0, 153, 0],
    //             maxColor: [0, 153, 0]
    //           },
    //           {
    //             minValue: 6,
    //             maxValue: 6,
    //             minColor: [255, 102, 204],
    //             maxColor: [255, 102, 204]
    //           },
    //           {
    //             minValue: 5,
    //             maxValue: 5,
    //             minColor: [255, 51, 153],
    //             maxColor: [255, 51, 153]
    //           },
    //           {
    //             minValue: 4,
    //             maxValue: 4,
    //             minColor: [255, 51, 204],
    //             maxColor: [255, 51, 204]
    //           },
    //           {
    //             minValue: 3,
    //             maxValue: 3,
    //             minColor: [0, 153, 255],
    //             maxColor: [0, 153, 255]
    //           },
    //           {
    //             minValue: 2,
    //             maxValue: 2,
    //             minColor: [0, 102, 204],
    //             maxColor: [0, 102, 204]
    //           },
    //           {
    //             minValue: 1,
    //             maxValue: 1,
    //             minColor: [0, 51, 204],
    //             maxColor: [0, 51, 204]
    //           }
    //         ]
    //       }
    //       // unit: ""
    //     }
    //   ],
    //   icon: 'mdi-triangle',
    //   hasSetting: true
    // }
  ],

  NOAAbathymetries: [
    {
      region: 'adak_1_mhw_2009',
      latMin: 51.25,
      latMax: 52.16,
      lonMin: -177.24,
      lonMax: -175.78,
      n: 18,
      min: -4390,
      max: 0,
    },
    {
      region: 'akutan_83_mhhw_2009',
      latMin: 53.61,
      latMax: 54.39,
      lonMin: 193.11,
      lonMax: 194.93,
      n: 6,
      min: -1525,
      max: 0,
    },
    {
      region: 'akutan_8_mhhw_2009',
      latMin: 52.55,
      latMax: 54.41,
      lonMin: 190.37,
      lonMax: 195.03,
      n: 28,
      min: -7074,
      max: 0,
    },
    {
      region: 'arecibo_13_mhw_2007',
      latMin: 18.35,
      latMax: 18.8,
      lonMin: -67.1,
      lonMax: -66.5,
      n: 15,
      min: -3660,
      max: 0,
    },
    {
      region: 'arena_cove_13_mhw_2009',
      latMin: 38.4,
      latMax: 39.4,
      lonMin: -124.43,
      lonMax: -123.43,
      n: 15,
      min: -3753,
      max: 0,
    },
    {
      region: 'atka_1_mhw_2010',
      latMin: 51.59,
      latMax: 52.49,
      lonMin: -175.78,
      lonMax: -172.9,
      n: 18,
      min: -4597,
      max: 0,
    },
    {
      region: 'atka_815_mhhw_2017',
      latMin: 52.071,
      latMax: 52.299,
      lonMin: -174.259,
      lonMax: -174.001,
      n: 7,
      min: -172,
      max: 0,
    },
    {
      region: 'atlantic_city_13_mhw_2007',
      latMin: 38.85,
      latMax: 39.75,
      lonMin: -75.05,
      lonMax: -74.0,
      n: 2,
      min: -49,
      max: 0,
    },
    {
      region: 'bar_harbor_13_navd88_2011',
      latMin: 43.69,
      latMax: 44.69,
      lonMin: -68.7,
      lonMax: -67.63,
      n: 2,
      min: -260,
      max: 0,
    },
    {
      region: 'bermuda_1_msl_2013',
      latMin: 32.17,
      latMax: 32.55,
      lonMin: -65.06,
      lonMax: -64.51,
      n: 16,
      min: -3906,
      max: 0,
    },
    {
      region: 'bermuda_3_msl_2013',
      latMin: 31.5,
      latMax: 33.0,
      lonMin: -65.5,
      lonMax: -64.0,
      n: 20,
      min: -4920,
      max: 0,
    },
    {
      region: 'biloxi_13_mhw_2007',
      latMin: 29.7,
      latMax: 30.6,
      lonMin: -89.3,
      lonMax: -88.3,
      n: 2,
      min: -41,
      max: 0,
    },
    {
      region: 'british_columbia_3_msl_2013',
      latMin: 48.05,
      latMax: 54.2,
      lonMin: -137.45,
      lonMax: -122.2,
      n: 17,
      min: -4266,
      max: 0,
    },
    {
      region: 'cape_hatteras_13_mhw_2006',
      latMin: 34.75,
      latMax: 35.8,
      lonMin: -76.05,
      lonMax: -75.05,
      n: 12,
      min: -2879,
      max: 0,
    },
    {
      region: 'central_california_1_navd88_2010',
      latMin: 37.0,
      latMax: 38.75,
      lonMin: -124.0,
      lonMax: -121.85,
      n: 16,
      min: -3884,
      max: 0,
    },
    {
      region: 'central_florida_13_navd88_2014',
      latMin: 27.27,
      latMax: 28.88,
      lonMin: -80.88,
      lonMax: -79.95,
      n: 2,
      min: -296,
      max: 0,
    },
    {
      region: 'central_oregon_13_navd88_2015',
      latMin: 43.7,
      latMax: 45.14,
      lonMin: -124.63,
      lonMax: -123.81,
      n: 2,
      min: -496,
      max: 0,
    },
    {
      region: 'chenega_815_mhhw_2011',
      latMin: 59.97,
      latMax: 60.19,
      lonMin: -148.17,
      lonMax: -147.89,
      n: 2,
      min: -425,
      max: 0,
    },
    {
      region: 'chignik_13_mhhw_2014',
      latMin: 56.28,
      latMax: 56.36,
      lonMin: -158.58,
      lonMax: -158.34,
      n: 3,
      min: -73,
      max: 0,
    },
    {
      region: 'chignik_1_mhhw_2014',
      latMin: 55.52,
      latMax: 56.44,
      lonMin: -159.58,
      lonMax: -157.98,
      n: 2,
      min: -309,
      max: 0,
    },
    {
      region: 'chiniak_815_mhhw_2015',
      latMin: 57.6,
      latMax: 57.65,
      lonMin: -152.38,
      lonMax: -152.18,
      n: 4,
      min: -85,
      max: 0,
    },
    {
      region: 'cold_bay_815_mhhw_2013',
      latMin: 55.14,
      latMax: 55.26,
      lonMin: -162.78,
      lonMax: -162.58,
      n: 3,
      min: -72,
      max: 0,
    },
    {
      region: 'cold_bay_83_mhhw_2013',
      latMin: 54.7,
      latMax: 55.7,
      lonMin: -163.1,
      lonMax: -162.1,
      n: 6,
      min: -150,
      max: 0,
    },
    {
      region: 'cold_bay_8_mhhw_2013',
      latMin: 53.0,
      latMax: 56.0,
      lonMin: -164.5,
      lonMax: -161.5,
      n: 30,
      min: -7526,
      max: 0,
    },
    {
      region: 'cordova_13_mhw_2010',
      latMin: 60.49,
      latMax: 60.82,
      lonMin: -146.77,
      lonMax: -145.21,
      n: 2,
      min: -411,
      max: 0,
    },
    {
      region: 'cordova_3_mhw_2010',
      latMin: 59.75,
      latMax: 60.82,
      lonMin: -146.77,
      lonMax: -145.21,
      n: 2,
      min: -408,
      max: 0,
    },
    {
      region: 'cordova_815_mhhw_2009',
      latMin: 60.49,
      latMax: 60.75,
      lonMin: 214.07,
      lonMax: 214.51,
    },
    {
      region: 'corpus_christi_13_mhw_2007',
      latMin: 27.3,
      latMax: 28.15,
      lonMin: -97.7,
      lonMax: -96.65,
      n: 3,
      min: -76,
      max: 0,
    },
    {
      region: 'craig_13_mhw_2012',
      latMin: 55.04,
      latMax: 55.81,
      lonMin: -133.91,
      lonMax: -132.88,
      n: 2,
      min: -407,
      max: 0,
    },
    {
      region: 'crescent_city_13_navd88_2010',
      latMin: 41.42,
      latMax: 42.53,
      lonMin: -125.25,
      lonMax: -123.88,
      n: 13,
      min: -3188,
      max: 0,
    },
    {
      region: 'daytona_beach_13_mhw_2007',
      latMin: 28.85,
      latMax: 29.7,
      lonMin: -81.4,
      lonMax: -80.5,
      n: 2,
      min: -37,
      max: 0,
    },
    {
      region: 'destin_13_navd88_2016',
      latMin: 30.0,
      latMax: 30.53,
      lonMin: -86.8,
      lonMax: -86.07,
      n: 5,
      min: -118,
      max: 0,
    },
    {
      region: 'dutch_harbor_1_mhw_2006',
      latMin: 53.5,
      latMax: 54.35,
      lonMin: -167.2,
      lonMax: -165.9,
      n: 7,
      min: -1748,
      max: 0,
    },
    {
      region: 'easter_island_3_isl_2016',
      latMin: -28.5,
      latMax: -25.8,
      lonMin: -111.2,
      lonMax: -107.5,
      n: 16,
      min: -4064,
      max: 0,
    },
    {
      region: 'eastern_canada_3_isl_2015',
      latMin: 41.0,
      latMax: 52.0,
      lonMin: -71.0,
      lonMax: -42.0,
    },
    {
      region: 'elfin_cove_13_mhhw_2012',
      latMin: 58.1,
      latMax: 58.27,
      lonMin: -136.47,
      lonMax: -136.26,
      n: 2,
      min: -334,
      max: 0,
    },
    {
      region: 'elfin_cove_13_mhw_2011',
      latMin: 57.53,
      latMax: 58.67,
      lonMin: -137.27,
      lonMax: -135.97,
      n: 9,
      min: -2234,
      max: 0,
    },
    {
      region: 'eureka_13_navd88_2009',
      latMin: 40.27,
      latMax: 41.42,
      lonMin: -125.01,
      lonMax: -124.0,
      n: 12,
      min: -3070,
      max: 0,
    },
    {
      region: 'fajardo_13_mhw_2007',
      latMin: 18.05,
      latMax: 18.6,
      lonMin: -65.9,
      lonMax: -65.35,
      n: 5,
      min: -1272,
      max: 0,
    },
    {
      region: 'false_pass_815_mhhw_2016',
      latMin: 54.78,
      latMax: 54.9,
      lonMin: -163.47,
      lonMax: -163.25,
      n: 7,
      min: -172,
      max: 0,
    },
    {
      region: 'fort_bragg_13_navd88_2012',
      latMin: 39.38,
      latMax: 40.28,
      lonMin: -125.05,
      lonMax: -123.72,
      n: 13,
      min: -3197,
      max: 0,
    },
    {
      region: 'galapagos_1_isl_2016',
      latMin: -1.98,
      latMax: 1.95,
      lonMin: -92.32,
      lonMax: -87.2,
      n: 16,
      min: -3982,
      max: 0,
    },
    {
      region: 'galveston_13_mhw_2007',
      latMin: 28.85,
      latMax: 29.8,
      lonMin: -95.25,
      lonMax: -94.3,
      n: 2,
      min: -26,
      max: 0,
    },
    {
      region: 'garibaldi_13_navd88_2013',
      latMin: 45.1,
      latMax: 45.9,
      lonMin: -124.5,
      lonMax: -123.7,
      n: 2,
      min: -462,
      max: 0,
    },
    {
      region: 'grenada_1_isl_2017',
      latMin: 11.7,
      latMax: 13.5,
      lonMin: -62.3,
      lonMax: -61.0,
      n: 12,
      min: -3058,
      max: 0,
    },
    {
      region: 'guayama_13_mhw_2007',
      latMin: 17.7,
      latMax: 18.05,
      lonMin: -66.4,
      lonMax: -65.7,
      n: 9,
      min: -2183,
      max: 0,
    },
    {
      region: 'gustavus_815_mhhw_2012',
      latMin: 58.33,
      latMax: 58.49,
      lonMin: -135.97,
      lonMax: -135.54,
      n: 5,
      min: -126,
      max: 0,
    },
    {
      region: 'hanalei_13_mhw_2011',
      latMin: 22.09,
      latMax: 22.66,
      lonMin: -159.91,
      lonMax: -159.09,
      n: 18,
      min: -4596,
      max: 0,
    },
    {
      region: 'hilo_13_mhw_2011',
      latMin: 19.17,
      latMax: 20.26,
      lonMin: -155.47,
      lonMax: -154.46,
      n: 22,
      min: -5627,
      max: 0,
    },
    {
      region: 'hoonah_815_mhhw_2012',
      latMin: 58.07,
      latMax: 58.17,
      lonMin: -135.51,
      lonMax: -135.38,
      n: 7,
      min: -178,
      max: 0,
    },
    {
      region: 'juneau_815_mhhw_2010',
      latMin: 58.03,
      latMax: 58.91,
      lonMin: -135.23,
      lonMax: -133.91,
      n: 3,
      min: -696,
      max: 0,
    },
    {
      region: 'kachemak_bay_13_mhw_2010',
      latMin: 59.32,
      latMax: 59.82,
      lonMin: -152.1,
      lonMax: -150.89,
      n: 7,
      min: -175,
      max: 0,
    },
    {
      region: 'kaneohe_13_mhw_2016',
      latMin: 21.31,
      latMax: 21.51,
      lonMin: -157.835,
      lonMax: -157.649,
      n: 4,
      min: -944,
      max: 0,
    },
    {
      region: 'kauai_13_mhw_2012',
      latMin: 21.55,
      latMax: 22.4,
      lonMin: -160.4,
      lonMax: -159.09,
      n: 18,
      min: -4604,
      max: 0,
    },
    {
      region: 'kawaihae_13_mhw_2011',
      latMin: 19.87,
      latMax: 20.45,
      lonMin: -156.37,
      lonMax: -155.37,
      n: 17,
      min: -4170,
      max: 0,
    },
    {
      region: 'keauhou_13_mhw_2011',
      latMin: 19.22,
      latMax: 19.92,
      lonMin: -156.31,
      lonMax: -155.75,
      n: 19,
      min: -4814,
      max: 0,
    },
    {
      region: 'key_west_13_navd88_2011',
      latMin: 23.98,
      latMax: 25.02,
      lonMin: -82.18,
      lonMax: -81.27,
      n: 5,
      min: -1188,
      max: 0,
    },
    {
      region: 'king_cove_815_mhhw_2013',
      latMin: 55.0,
      latMax: 55.1,
      lonMin: -162.38,
      lonMax: -162.24,
      n: 6,
      min: -146,
      max: 0,
    },
    {
      region: 'king_cove_83_mhhw_2013',
      latMin: 54.58,
      latMax: 55.34,
      lonMin: -162.8,
      lonMax: -161.84,
      n: 7,
      min: -175,
      max: 0,
    },
    {
      region: 'king_cove_8_mhhw_2013',
      latMin: 54.24,
      latMax: 55.5,
      lonMin: -163.8,
      lonMax: -161.8,
      n: 8,
      min: -184,
      max: 0,
    },
    {
      region: 'kodiak_13_mhw_2013',
      latMin: 57.58,
      latMax: 58.0,
      lonMin: -152.8,
      lonMax: -152.0,
      n: 2,
      min: -387,
      max: 0,
    },
    {
      region: 'lahaina_13_mhw_2007',
      latMin: 20.7,
      latMax: 21.1,
      lonMin: -156.9,
      lonMax: -156.55,
      n: 2,
      min: -445,
      max: 0,
    },
    {
      region: 'larsen_bay_815_mhhw_2016',
      latMin: 57.51,
      latMax: 57.59,
      lonMin: -154.15,
      lonMax: -153.9,
      n: 7,
      min: -165,
      max: 0,
    },
    {
      region: 'mariana_trh_6_msl_2012',
      latMin: 10.0,
      latMax: 21.998,
      lonMin: 139.0,
      lonMax: 149.998,
      n: 43,
      min: -10955,
      max: 0,
    },
    {
      region: 'marquesas_islands_3_isl_2017',
      latMin: -11.4,
      latMax: -7.15,
      lonMin: -142.3,
      lonMax: -136.9,
      n: 20,
      min: -5004,
      max: 0,
    },
    {
      region: 'mayaguez_13_mhw_2006',
      latMin: 17.9,
      latMax: 18.6,
      lonMin: -67.6,
      lonMax: -67.1,
      n: 15,
      min: -3750,
      max: 0,
    },
    {
      region: 'mayaguez_13_mhw_2007',
      latMin: 17.9,
      latMax: 18.6,
      lonMin: -67.6,
      lonMax: -67.1,
      n: 15,
      min: -3631,
      max: 0,
    },
    {
      region: 'midway_island_13_mhw_2012',
      latMin: 28.09,
      latMax: 28.42,
      lonMin: -177.57,
      lonMax: -177.16,
      n: 16,
      min: -3866,
      max: 0,
    },
    {
      region: 'midway_island_3_mhw_2012',
      latMin: 27.77,
      latMax: 28.7,
      lonMin: -177.88,
      lonMax: -176.87,
    },
    {
      region: 'mobile_13_navd88_2009',
      latMin: 30.0,
      latMax: 31.0,
      lonMin: -88.3,
      lonMax: -87.65,
      n: 2,
      min: -33,
      max: 0,
    },
    {
      region: 'montauk_13_mhw_2007',
      latMin: 40.6,
      latMax: 41.4,
      lonMin: -72.6,
      lonMax: -71.5,
      n: 5,
      min: -119,
      max: 0,
    },
    {
      region: 'monterey_13_navd88_2012',
      latMin: 35.7,
      latMax: 37.2,
      lonMin: -122.42,
      lonMax: -121.28,
      n: 15,
      min: -3598,
      max: 0,
    },
    {
      region: 'morehead_city_13_navd88_2011',
      latMin: 34.37,
      latMax: 35.57,
      lonMin: -77.27,
      lonMax: -76.0,
      n: 3,
      min: -66,
      max: 0,
    },
    {
      region: 'myrtle_beach_13_mhw_2006',
      latMin: 33.25,
      latMax: 33.95,
      lonMin: -79.2,
      lonMax: -78.4,
      n: 2,
      min: -31,
      max: 0,
    },
    {
      region: 'myrtle_beach_1_mhw_2006',
      latMin: 33.25,
      latMax: 33.95,
      lonMin: -79.2,
      lonMax: -78.4,
      n: 2,
      min: -31,
      max: 0,
    },
    {
      region: 'nantucket_13_mhw_2008',
      latMin: 40.81,
      latMax: 41.71,
      lonMin: -70.67,
      lonMax: -69.49,
      n: 6,
      min: -153,
      max: 0,
    },
    {
      region: 'new_orleans_13_navd88_2010',
      latMin: 29.7,
      latMax: 30.5,
      lonMin: -90.65,
      lonMax: -89.3,
      n: 3,
      min: -69,
      max: 0,
    },
    {
      region: 'nikolski_13_mhhw_2014',
      latMin: 52.89,
      latMax: 53.0,
      lonMin: -168.98,
      lonMax: -168.73,
      n: 4,
      min: -96,
      max: 0,
    },
    {
      region: 'nikolski_1_mhhw_2014',
      latMin: 52.29,
      latMax: 53.19,
      lonMin: -169.66,
      lonMax: -168.09,
      n: 16,
      min: -3892,
      max: 0,
    },
    {
      region: 'niue_3_isl_2016',
      latMin: -20.0,
      latMax: -17.5,
      lonMin: -172.85,
      lonMax: -169.2,
      n: 38,
      min: -9664,
      max: 0,
    },
    {
      region: 'northern_gulf_1_navd88_2010',
      latMin: 28.5,
      latMax: 31.25,
      lonMin: -90.75,
      lonMax: -85.0,
      n: 11,
      min: -2564,
      max: 0,
    },
    {
      region: 'oahu_13_mhw_2011',
      latMin: 21.02,
      latMax: 22.06,
      lonMin: -158.45,
      lonMax: -157.45,
      n: 20,
      min: -4976,
      max: 0,
    },
    {
      region: 'ocean_city_13_mhw_2009',
      latMin: 37.68,
      latMax: 38.87,
      lonMin: -75.58,
      lonMax: -74.71,
      n: 3,
      min: -52,
      max: 0,
    },
    {
      region: 'ouzinkie_815_mhhw_2015',
      latMin: 57.89,
      latMax: 57.94,
      lonMin: -152.54,
      lonMax: -152.47,
      n: 5,
      min: -116,
      max: 0,
    },
    {
      region: 'pago_pago_13_mhw_2009',
      latMin: -14.4,
      latMax: -14.18,
      lonMin: -170.95,
      lonMax: -170.45,
      n: 14,
      min: -3384,
      max: 0,
    },
    {
      region: 'palm_beach_13_navd88_2010',
      latMin: 26.29,
      latMax: 27.31,
      lonMin: -80.36,
      lonMax: -79.42,
      n: 4,
      min: -797,
      max: 0,
    },
    {
      region: 'panama_city_13_navd88_2010',
      latMin: 29.55,
      latMax: 30.5,
      lonMin: -86.1,
      lonMax: -85.2,
      n: 4,
      min: -78,
      max: 0,
    },
    {
      region: 'perryville_ivanof_bay_13_mhhw_2014',
      latMin: 55.7,
      latMax: 56.0,
      lonMin: -159.58,
      lonMax: -159.0,
      n: 6,
      min: -151,
      max: 0,
    },
    {
      region: 'pe_13_mhw_2007', // ponce_13_mhw_2007
      latMin: 17.7,
      latMax: 18.05,
      lonMin: -67.1,
      lonMax: -66.4,
      n: 12,
      min: -2970,
      max: 0,
    },
    {
      region: 'port_alberni_13_navd88_2016',
      latMin: 48.95,
      latMax: 49.28,
      lonMin: -124.9,
      lonMax: -124.78,
      n: 2,
      min: -361,
      max: 0,
    },
    {
      region: 'port_alexander_13_mhw_2011',
      latMin: 55.53,
      latMax: 56.71,
      lonMin: -135.35,
      lonMax: -134.03,
      n: 10,
      min: -2394,
      max: 0,
    },
    {
      region: 'portland_13_mhw_2008',
      latMin: 43.0,
      latMax: 43.99,
      lonMin: -70.74,
      lonMax: -69.63,
      n: 10,
      min: -253,
      max: 0,
    },
    {
      region: 'port_lions_815_mhhw_2016',
      latMin: 57.84,
      latMax: 57.9,
      lonMin: -152.92,
      lonMax: -152.82,
      n: 2,
      min: -43,
      max: 0,
    },
    {
      region: 'port_orford_13_mhw_2008',
      latMin: 42.53,
      latMax: 43.73,
      lonMin: -124.97,
      lonMax: -124.13,
      n: 7,
      min: -1746,
      max: 0,
    },
    {
      region: 'port_san_luis_13_navd88_2011',
      latMin: 34.6,
      latMax: 35.7,
      lonMin: -121.3,
      lonMax: -120.45,
      n: 4,
      min: -903,
      max: 0,
    },
    {
      region: 'port_townsend_13_navd88_2011',
      latMin: 47.91,
      latMax: 48.79,
      lonMin: -123.62,
      lonMax: -122.2,
      n: 2,
      min: -361,
      max: 0,
    },
    {
      region: 'pre_william_sound_83_mhhw_2009',
      latMin: 59.65,
      latMax: 61.35,
      lonMin: 211.23,
      lonMax: 214.67,
      n: 3,
      min: -768,
      max: 0,
    },
    {
      region: 'pre_william_sound_8_mhhw_2009',
      latMin: 58.49,
      latMax: 61.51,
      lonMin: 210.99,
      lonMax: 215.01,
      n: 19,
      min: -4775,
      max: 0,
    },
    {
      region: 'puget_sound_13_navd88_2014',
      latMin: 47.01,
      latMax: 48.19,
      lonMin: -123.18,
      lonMax: -122.16,
      n: 2,
      min: -299,
      max: 0,
    },
    {
      region: 'rarotonga_1_isl_2016',
      latMin: -21.87,
      latMax: -20.68,
      lonMin: -160.42,
      lonMax: -159.08,
      n: 20,
      min: -5059,
      max: 0,
    },
    {
      region: 'san_diego_13_navd88_2012',
      latMin: 32.45,
      latMax: 33.6,
      lonMin: -117.83,
      lonMax: -117.0,
      n: 7,
      min: -1594,
      max: 0,
    },
    {
      region: 'sand_point_13_mhw_2012',
      latMin: 54.7,
      latMax: 55.7,
      lonMin: -160.9,
      lonMax: -159.17,
      n: 10,
      min: -255,
      max: 0,
    },
    {
      region: 'san_frisco_13_navd88_2010',
      latMin: 37.32,
      latMax: 38.48,
      lonMin: -123.3,
      lonMax: -121.85,
      n: 9,
      min: -2170,
      max: 0,
    },
    {
      region: 'san_juan_19_prvd02_2015',
      latMin: 18.38,
      latMax: 18.54,
      lonMin: -66.23,
      lonMax: -65.91,
      n: 4,
      min: -907,
      max: 0,
    },
    {
      region: 'santa_barbara_13_mhw_2008',
      latMin: 33.77,
      latMax: 34.62,
      lonMin: -120.51,
      lonMax: -119.14,
      n: 8,
      min: -1940,
      max: 0,
    },
    {
      region: 'santa_monica_13_navd88_2010',
      latMin: 33.2,
      latMax: 34.2,
      lonMin: -119.14,
      lonMax: -117.8,
      n: 6,
      min: -1458,
      max: 0,
    },
    {
      region: 'savannah_13_mhw_2006',
      latMin: 31.5,
      latMax: 32.45,
      lonMin: -81.35,
      lonMax: -80.35,
      n: 2,
      min: -38,
      max: 0,
    },
    {
      region: 'shemya_1_mhw_2009',
      latMin: 52.27,
      latMax: 53.06,
      lonMin: 172.45,
      lonMax: 174.21,
      n: 16,
      min: -4094,
      max: 0,
    },
    {
      region: 'sitka_13_mhw_2011',
      latMin: 56.78,
      latMax: 57.27,
      lonMin: -135.83,
      lonMax: -135.08,
      n: 2,
      min: -287,
      max: 0,
    },
    {
      region: 'sitka_3_mhw_2011',
      latMin: 56.67,
      latMax: 57.56,
      lonMin: -136.71,
      lonMax: -135.05,
      n: 9,
      min: -2297,
      max: 0,
    },
    {
      region: 'society_islands_3_isl_2016',
      latMin: -19.05,
      latMax: -15.55,
      lonMin: -153.05,
      lonMax: -147.45,
      n: 20,
      min: -5032,
      max: 0,
    },
    {
      region: 'society_islands_leeward_1_isl_2016',
      latMin: -17.1,
      latMax: -16.35,
      lonMin: -151.95,
      lonMax: -150.75,
      n: 16,
      min: -3894,
      max: 0,
    },
    {
      region: 'society_islands_windward_1_isl_2016',
      latMin: -18.05,
      latMax: -17.2,
      lonMin: -150.1,
      lonMax: -148.85,
      n: 16,
      min: -3897,
      max: 0,
    },
    {
      region: 'southeast_alaska_83_mhhw_2010',
      latMin: 54.59,
      latMax: 59.61,
      lonMin: -137.51,
      lonMax: -129.49,
      n: 13,
      min: -3223,
      max: 0,
    },
    {
      region: 'southeast_alaska_8_mhhw_2010',
      latMin: 54.19,
      latMax: 60.01,
      lonMin: -138.21,
      lonMax: -129.19,
      n: 14,
      min: -3465,
      max: 0,
    },
    {
      region: 'south_padre_island_13_navd88_2012',
      latMin: 25.82,
      latMax: 26.86,
      lonMin: -97.65,
      lonMax: -96.8,
      n: 3,
      min: -67,
      max: 0,
    },
    {
      region: 'st_croix_13_mhw_2014',
      latMin: 17.61,
      latMax: 17.88,
      lonMin: -65.04,
      lonMax: -64.4,
      n: 18,
      min: -4595,
      max: 0,
    },
    {
      region: 'st_thomas_st_john_13_mhw_2014',
      latMin: 18.17,
      latMax: 18.48,
      lonMin: -65.15,
      lonMax: -64.64,
      n: 7,
      min: -1701,
      max: 0,
    },
    {
      region: 'taholah_13_mhw_2009',
      latMin: 46.99,
      latMax: 47.65,
      lonMin: -125.3,
      lonMax: -123.7,
      n: 8,
      min: -1874,
      max: 0,
    },
    {
      region: 'tampa_bay_13_navd88_2014',
      latMin: 27.22,
      latMax: 28.26,
      lonMin: -83.41,
      lonMax: -82.37,
      n: 2,
      min: -47,
      max: 0,
    },
    {
      region: 'tatitlek_815_mhhw_2011',
      latMin: 60.81,
      latMax: 60.95,
      lonMin: -146.79,
      lonMax: -146.61,
      n: 2,
      min: -379,
      max: 0,
    },
    {
      region: 'tutuila_13_mhw_2013',
      latMin: -14.4,
      latMax: -14.18,
      lonMin: -170.95,
      lonMax: -170.45,
      n: 14,
      min: -3385,
      max: 0,
    },
    {
      region: 'unalaska_815_mhhw_2012',
      latMin: 53.8,
      latMax: 53.95,
      lonMin: -166.66,
      lonMax: -166.42,
      n: 7,
      min: -173,
      max: 0,
    },
    {
      region: 'usvi_1_mhw_2014',
      latMin: 17.0,
      latMax: 19.0,
      lonMin: -65.15,
      lonMax: -64.0,
      n: 20,
      min: -4939,
      max: 0,
    },
    {
      region: 'virginia_beach_13_mhw_2007',
      latMin: 36.45,
      latMax: 37.5,
      lonMin: -76.6,
      lonMax: -75.4,
      n: 2,
      min: -48,
      max: 0,
    },
    {
      region: 'wake_island_13_mhw_2009',
      latMin: 19.17,
      latMax: 19.4,
      lonMin: 166.47,
      lonMax: 166.82,
      n: 17,
      min: -4248,
      max: 0,
    },
    {
      region: 'wake_island_3_mhw_2009',
      latMin: 18.84,
      latMax: 19.76,
      lonMin: 166.15,
      lonMax: 167.1,
      n: 22,
      min: -5578,
      max: 0,
    },
    {
      region: 'whittier_815_mhhw_2009',
      latMin: 60.75,
      latMax: 60.85,
      lonMin: 211.25,
      lonMax: 211.51,
      n: 2,
      min: -369,
      max: 0,
    },
    {
      region: 'yakutat_815_mhhw_2009',
      latMin: 59.41,
      latMax: 59.67,
      lonMin: 220.07,
      lonMax: 220.43,
      n: 9,
      min: -217,
      max: 0,
    },
    {
      region: 'yakutat_83_mhhw_2009',
      latMin: 59.27,
      latMax: 59.91,
      lonMin: 219.53,
      lonMax: 220.63,
      n: 2,
      min: -265,
      max: 0,
    },
    {
      region: 'yakutat_8_mhhw_2009',
      latMin: 58.89,
      latMax: 60.19,
      lonMin: 219.39,
      lonMax: 221.27,
      n: 2,
      min: -344,
      max: 0,
    },
  ],

  palettes: [
    {
      name: 'thermal',
      colors: [
        '#032333',
        '#072d52',
        '#153377',
        '#32339b',
        '#50389e',
        '#664297',
        '#7a4c91',
        '#8f548c',
        '#a55c86',
        '#bb627d',
        '#d26a6f',
        '#e5745e',
        '#f4834c',
        '#fb983f',
        '#fcaf3c',
        '#f9c842',
        '#f3e14d',
        '#e8fb5b',
      ],
    },
    {
      name: 'haline',
      colors: [
        '#29186c',
        '#2e1c91',
        '#2230a3',
        '#10469a',
        '#0d5792',
        '#17658d',
        '#24728a',
        '#2e7f89',
        '#378c88',
        '#3f9a86',
        '#48a782',
        '#54b57b',
        '#66c271',
        '#80ce64',
        '#a3d75c',
        '#c6de66',
        '#e4e67e',
        '#feef9a',
      ],
    },
    {
      name: 'solar',
      colors: [
        '#331317',
        '#461a1e',
        '#591f23',
        '#6b2424',
        '#7e2a23',
        '#8e331f',
        '#9b3f1a',
        '#a74d16',
        '#b15c13',
        '#ba6c12',
        '#c27c14',
        '#ca8d17',
        '#d09e1d',
        '#d5b025',
        '#dac22d',
        '#ddd537',
        '#e0e940',
        '#e1fe4b',
      ],
    },
    {
      name: 'ice',
      colors: [
        '#030512',
        '#111228',
        '#1f1e3e',
        '#2b2a55',
        '#36356e',
        '#3c4287',
        '#3f509d',
        '#3e61ac',
        '#3f72b4',
        '#4682ba',
        '#5093c0',
        '#5da3c6',
        '#6cb2cc',
        '#7fc2d2',
        '#97d1d9',
        '#b3dfe3',
        '#cfeef0',
        '#ebfdfe',
      ],
    },
    {
      name: 'gray',
      colors: [
        '#000000',
        '#080707',
        '#171717',
        '#262525',
        '#333333',
        '#414040',
        '#4e4e4e',
        '#5c5c5b',
        '#6a6969',
        '#787877',
        '#878686',
        '#969595',
        '#a5a5a4',
        '#b6b5b4',
        '#c7c6c5',
        '#d9d8d7',
        '#ebebea',
        '#fffffe',
      ],
    },
    {
      name: 'deep',
      colors: [
        '#fefecc',
        '#dff3bb',
        '#c0e8ae',
        '#9fdda6',
        '#7fd1a3',
        '#67c4a4',
        '#59b5a4',
        '#50a5a2',
        '#4b96a0',
        '#46879c',
        '#417899',
        '#3e6996',
        '#3e5992',
        '#414988',
        '#403b71',
        '#3a3058',
        '#312541',
        '#271a2c',
      ],
    },
    {
      name: 'dense',
      colors: [
        '#e6f1f1',
        '#cde5e9',
        '#b4d8e4',
        '#9ecbe3',
        '#8bbde3',
        '#7caee4',
        '#749ee5',
        '#738de3',
        '#767bdb',
        '#7869cf',
        '#7958bf',
        '#7747ac',
        '#733896',
        '#6d2b7f',
        '#641f67',
        '#58164e',
        '#481237',
        '#360e24',
      ],
    },
    {
      name: 'algae',
      colors: [
        '#d7fad0',
        '#c4ecba',
        '#b1dfa5',
        '#9ed391',
        '#8ac77e',
        '#74bc6d',
        '#5bb15e',
        '#3da754',
        '#1e9b51',
        '#0a8e4f',
        '#07804b',
        '#0f7346',
        '#156540',
        '#185839',
        '#1a4b31',
        '#193e28',
        '#16311e',
        '#112414',
      ],
    },
    {
      name: 'rainbow',
      colors: [
        '#7f00ff',
        '#612efd',
        '#435cfa',
        '#2586f5',
        '#07abed',
        '#16cbe4',
        '#34e4d8',
        '#52f5cb',
        '#70fdbc',
        '#8efdab',
        '#acf599',
        '#cae486',
        '#e8cb71',
        '#ffab5c',
        '#ff8645',
        '#ff5c2e',
        '#ff2e17',
        '#ff0000',
      ],
    },
    {
      name: 'spectral',
      colors: [
        '#000000',
        '#7a008a',
        '#57009f',
        '#0000c5',
        '#0054dd',
        '#0095dd',
        '#00aaa8',
        '#00a667',
        '#00a600',
        '#00cf00',
        '#00f700',
        '#afff00',
        '#efe900',
        '#ffbd00',
        '#ff5100',
        '#e90000',
        '#cf0000',
        '#cccccc',
      ],
    },
  ],

  // --- NEW ------------------------------------------------------------

  fields: [],
  models: [],

  interDateTime: null,
})

export const mutations = {
  setSelected(state, obj) {
    // if (obj === null) state.selected = null
    // else {
    //   state.selected = state.categories
    //     .filter((c) => c.name === obj.category)[0]
    //     .fields.filter((f) => f.name === obj.field)[0]
    //     .models.filter((m) => m.name === obj.model)[0]
    //   state.selected.iRegion = obj.iRegion
    // }
    state.selected = obj
  },

  setSelectedBathymetry(state, value) {
    state.selectedBathymetry = state.bathymetries.models.filter(
      (bathymetry) => bathymetry.directory === value
    )[0]
  },

  setAvailDateTimes(state, obj) {
    const iModel = state.models.findIndex((m) => m.name === obj.modelName)
    const iField = state.models[iModel].fields.findIndex(
      (f) => f.name === obj.fieldName
    )
    state.models[iModel].fields[iField].availDateTimes = obj.availDateTimes.map(
      (dt) => moment.utc(dt, 'YYYYMMDD_HH')
    )
    state.models[iModel].fields[iField].lastProcessed = obj.lastProcessed

    // const iCategory = state.categories.findIndex(
    //   (c) => c.name === obj.data.category
    // )
    // const iField = state.categories[iCategory].fields.findIndex(
    //   (f) => f.name === obj.data.field
    // )
    // const iModel = state.categories[iCategory].fields[iField].models.findIndex(
    //   (m) => m.name === obj.data.model
    // )

    // state.categories[iCategory].fields[iField].models[iModel].regions[
    //   obj.data.iRegion
    // ].availDateTimes = obj.availDateTimes
    // state.categories[iCategory].fields[iField].models[iModel].regions[
    //   obj.data.iRegion
    // ].lastProcessed = obj.lastProcessed
  },

  setInterDateTime(state, momentObj) {
    state.interDateTime = momentObj
  },

  // setDate(state, value) {
  //   const iRegion = state.selected.iRegion
  //   const dates = state.selected.regions[iRegion].availDateTimes.map(
  //     (d) => d.date
  //   )
  //   if (dates.includes(value)) state.interDate = value
  //   else {
  //     // --- Set the next closest date to the selected one
  //     const futureDates = dates.filter(
  //       (date) => parseInt(date) >= parseInt(value)
  //     )
  //     if (futureDates.length > 0) state.interDate = futureDates[0]
  //     // --- If dates in future available, pick the first one (closest to now)
  //     else state.interDate = dates[dates.length - 1] // --- else, pick the last available date
  //   }
  //   this.commit('layers/setTime', state.interTime)

  //   // state.interDate = value

  //   // --- Check if the current selectedTime is valid
  //   // const times = state.selected.availDateTimes
  //   //   .filter(d => d.date === state.interDate)
  //   //   .map(d => d.time)
  //   // if (!times.includes(state.interTime)) this.commit('layers/setTime', times[0])
  //   // else this.commit('layers/setTime', state.interTime)
  // },

  // setTime(state, value) {
  //   const iRegion = state.selected.iRegion
  //   const times = state.selected.regions[iRegion].availDateTimes
  //     .filter((d) => d.date === state.interDate)
  //     .map((d) => d.time)

  //   if (times.includes(value)) state.interTime = value
  //   else {
  //     // --- Set the next closest time to the selected one
  //     const futureTimes = times.filter(
  //       (time) => parseInt(time) >= parseInt(value)
  //     )
  //     // --- If times in future available, pick the first one (closest to now)
  //     if (futureTimes.length > 0) state.interTime = futureTimes[0]
  //     else state.interTime = times[times.length - 1] // --- else, pick the last available time
  //   }

  //   // if (value !== null) {
  //   //   state.interTime = value
  //   //   this.dispatch('map/redraw')
  //   // }
  // },

  setLevel(state, i) {
    // const iRegion = state.selected.iRegion
    // if (i === -1) i = state.selected.levels.depthLabels.length - 1
    // if (state.selected.depthProperties.iDepth !== i) {
    state.selected.region.levels.iLevel = i
    //   this.dispatch('map/redraw')
    // }
  },

  // --- NEW ------------------------------------------------------------
  setFields(state, array) {
    state.fields = array
  },

  setModels(state, array) {
    state.models = array
  },
}
