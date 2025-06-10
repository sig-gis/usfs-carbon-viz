import { AppConfig } from './layers.interface';

export const staticConfig: AppConfig = {
    status: {
        screenLoading: true,
        loading: false,
        error: false,
    },
    highlight: [{
        id: "US_States",
        title: "US States Highlight",
        description: "Highlight Layer",
        visible: true,
        type: "highlightLayer",
        url: ["https://api.maptiler.com/tiles/019652dc-9815-7723-bb77-f4b6748047df/{z}/{x}/{y}.pbf?key=TUeJmK9d5lh6wwNUyq6u"],
        opacity: 1.0,
        sourceLayer: "cb_2018_us_state_500k",
        //add size and opacity of layers
    }],
    analysis: [],
    mapConfig: {
        style: "https://api.maptiler.com/maps/winter-v2/style.json?key=TUeJmK9d5lh6wwNUyq6u",
        cursor: "crosshair",
        zoom: [6],
        center: [40.034319079065874, -98.63567370723634],
    },
    layers: [
        {
            id: "burn_probability_2014",
            title: "Burn Probability 2014",
            description: "Annual burn probability for the conterminous United States",
            type: "eeTiles",
            url: [
                "projects/usfs-carbon-viz-test/assets/FSIM/Burn_Probability/BP_2014_BINNED"
                // "projects/usfs-carbon-viz-test/assets/FSIM/Burn_Probability/BP_2014"
            ],
            visible: false,
            group: "fsim",
            opacity: 0.9,
            legend: {
                type: 'graduated',
                title: 'Burn Probability 2014 (%)',
                unit: '%',
                symbols: [
                    { value: '0 ', color: '#ffffff' },   // 0 - White (inside CONUS only)
                    { value: '0-0.0001', color: '#0000ff' },   // 1 - Blue
                    { value: '0.0001-0.0003', color: '#3366ff' },   // 2 - Lighter Blue
                    { value: '0.0003-0.0005', color: '#3399ff' },   // 3 - Light Blue
                    { value: '0.0005-0.001', color: '#008080' },   // 4 - Teal
                    { value: '0.001-0.003', color: '#00ff00' },   // 5 - Lime or Light Green
                    { value: '0.003-0.005', color: '#ccff33' },   // 6 - Light Yellow or Green Yellow
                    { value: '0.005-0.01', color: '#ffff00' },   // 7 - Yellow or Gold
                    { value: '0.01-0.03', color: '#ff9900' },   // 8 - Orange
                    { value: '0.03-0.05', color: '#ff3300' },   // 9 - Orange Red
                    { value: '0.05-0.1', color: '#ff0000' }   // 10 - Red
                ]
            },
            placed_before: "",
            eeVisParams: {
                "bands": ['constant'],
                "min": 0,
                "max": 10,
                "palette": [
                    'ffffff', // 0 - White (inside CONUS only)
                    '0000ff', // 1 - Blue
                    '3366ff', // 2 - Lighter Blue
                    '3399ff', // 3 - Light Blue
                    '008080', // 4 - Teal
                    '00ff00', // 5 - Lime or Light Green
                    'ccff33', // 6 - Light Yellow or Green Yellow
                    'ffff00', // 7 - Yellow or Gold
                    'ff9900', // 8 - Orange
                    'ff3300', // 9 - Orange Red
                    'ff0000'  // 10 - Red
                ]
            }
        },
        {
            id: "fsim_fire_intensity_group",
            title: "Flame Length Probability 2016",
            description: "Flame Length Category",
            type: "layerGroup",
            url: [],
            visible: false,
            group: "fsim",
            opacity: 1.0,
            placed_before: "burn_probability_2014",
            groupLayers: [
                {
                    id: "fire_instensity_level_1",
                    title: "< 2 feet",
                    description: "Flame length probability",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/FSIM/Fire_Intensity_Level/FLP1_2014"],
                    visible: true,
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b1'],
                        "min": 0.001,
                        "max": 1,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                    }
                },
                {
                    id: "fire_instensity_level_2",
                    title: "2-4 feet",
                    description: "Flame length probability",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/FSIM/Fire_Intensity_Level/FLP2_2014"],
                    visible: false,
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b1'],
                        "min": 0.001,
                        "max": 1,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                    }
                },
                {
                    id: "fire_instensity_level_3",
                    title: "4-6 feet",
                    description: "Flame length probability",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/FSIM/Fire_Intensity_Level/FLP3_2014"],
                    visible: false,
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b1'],
                        "min": 0.001,
                        "max": 1,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                    }
                },
                {
                    id: "fire_instensity_level_4",
                    title: "6-8 feet",
                    description: "Flame length probability",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/FSIM/Fire_Intensity_Level/FLP4_2014"],
                    visible: false,
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b1'],
                        "min": 0.001,
                        "max": 1,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                    }
                },
                {
                    id: "fire_instensity_level_5",
                    title: "8-12 feet",
                    description: "Flame length probability",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/FSIM/Fire_Intensity_Level/FLP5_2014"],
                    visible: false,
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b1'],
                        "min": 0.001,
                        "max": 1,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                    }
                },
                {
                    id: "fire_instensity_level_6",
                    title: ">12 feet",
                    description: "Flame length probability",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/FSIM/Fire_Intensity_Level/FLP6_2014"],
                    visible: false,
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b1'],
                        "min": 0.001,
                        "max": 1,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                    }
                }
            ],
            activeLayerId: "fire_instensity_level_1",
            legend: {
                type: 'continuous',
                title: 'Conditional flame length probability for the conterminous United States, circa 2014',
                unit: '%',
                symbols: {
                    minValue: 0,
                    maxValue: 100,
                    palette: ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                }
            }
        },

        {
            id: "climate_change_burn_probability_2014",
            title: "Projected Burn Probability 2047",
            description: "Projected annual burn probability for the conterminous United States, circa 2047",
            type: "eeTiles",
            url: [
                "projects/usfs-carbon-viz-test/assets/Climate_Change_FSIM/Burn_Probability/CC_BP_2040_BINNED"
                // "projects/usfs-carbon-viz-test/assets/Climate_Change_FSIM/Burn_Probability/CC_BP_2040"
            ],
            visible: false,
            group: "fsim_cc",
            opacity: 0.9,
            legend: {
                type: 'graduated',
                title: 'Projected Burn Prob. 2047 (%)',
                unit: '%',
                symbols: [
                    { value: '0 ', color: '#ffffff' },   // 0 - White (inside CONUS only)
                    { value: '0-0.0001', color: '#0000ff' },   // 1 - Blue
                    { value: '0.0001-0.0003', color: '#3366ff' },   // 2 - Lighter Blue
                    { value: '0.0003-0.0005', color: '#3399ff' },   // 3 - Light Blue
                    { value: '0.0005-0.001', color: '#008080' },   // 4 - Teal
                    { value: '0.001-0.003', color: '#00ff00' },   // 5 - Lime or Light Green
                    { value: '0.003-0.005', color: '#ccff33' },   // 6 - Light Yellow or Green Yellow
                    { value: '0.005-0.01', color: '#ffff00' },   // 7 - Yellow or Gold
                    { value: '0.01-0.03', color: '#ff9900' },   // 8 - Orange
                    { value: '0.03-0.05', color: '#ff3300' },   // 9 - Orange Red
                    { value: '0.05-0.1', color: '#ff0000' }   // 10 - Red
                ]
            },
            placed_before: "fire_instensity_level_1",
            eeVisParams: {
                "bands": ['constant'],
                "min": 0,
                "max": 10,
                "palette": [
                    'ffffff', // 0 - White (inside CONUS only)
                    '0000ff', // 1 - Blue
                    '3366ff', // 2 - Lighter Blue
                    '3399ff', // 3 - Light Blue
                    '008080', // 4 - Teal
                    '00ff00', // 5 - Lime or Light Green
                    'ccff33', // 6 - Light Yellow or Green Yellow
                    'ffff00', // 7 - Yellow or Gold
                    'ff9900', // 8 - Orange
                    'ff3300', // 9 - Orange Red
                    'ff0000'  // 10 - Red
                ]
            }
        },
        {
            id: "climate_change_fsim_fire_intensity_group",
            title: "Projected Flame Length Probability circa 2047",
            description: "Flame Length Category",
            type: "layerGroup",
            url: [],
            visible: false,
            group: "fsim_cc",
            opacity: 1.0,
            placed_before: "climate_change_burn_probability_2014",
            groupLayers: [
                {
                    id: "climate_change_fire_instensity_level_1",
                    title: "< 2 feet",
                    description: "Flame length probability",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Climate_Change_FSIM/Fire_Intensity_Level/CC_FLP1_2040"],
                    visible: true,
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b1'],
                        "min": 0.001,
                        "max": 1,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                    }
                },
                {
                    id: "climate_change_fire_instensity_level_2",
                    title: "2-4 feet",
                    description: "Flame length probability",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Climate_Change_FSIM/Fire_Intensity_Level/CC_FLP2_2040"],
                    visible: false,
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b1'],
                        "min": 0.001,
                        "max": 1,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                    }
                },
                {
                    id: "climate_change_fire_instensity_level_3",
                    title: "4-6 feet",
                    description: "Flame length probability",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Climate_Change_FSIM/Fire_Intensity_Level/CC_FLP3_2040"],
                    visible: false,
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b1'],
                        "min": 0.001,
                        "max": 1,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                    }
                },
                {
                    id: "climate_change_fire_instensity_level_4",
                    title: "6-8 feet",
                    description: "Flame length probability",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Climate_Change_FSIM/Fire_Intensity_Level/CC_FLP4_2040"],
                    visible: false,
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b1'],
                        "min": 0.001,
                        "max": 1,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                    }
                },
                {
                    id: "climate_change_fire_instensity_level_5",
                    title: "8-12 feet",
                    description: "Flame length probability",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Climate_Change_FSIM/Fire_Intensity_Level/CC_FLP5_2040"],
                    visible: false,
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b1'],
                        "min": 0.001,
                        "max": 1,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                    }
                },
                {
                    id: "climate_change_fire_instensity_level_6",
                    title: ">12 feet",
                    description: "Flame length probability",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Climate_Change_FSIM/Fire_Intensity_Level/CC_FLP6_2040"],
                    visible: false,
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b1'],
                        "min": 0.001,
                        "max": 1,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                    }
                }
            ],
            activeLayerId: "climate_change_fire_instensity_level_1",
            legend: {
                type: 'continuous',
                title: 'Projected conditional flame length probability for the conterminous United States, circa 2047',
                unit: '%',
                symbols: {
                    minValue: 0,
                    maxValue: 100,
                    palette: ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                }
            }
        },
        {
            id: "carbon_total_initial",
            title: "Total Initial Forest Carbon 2014",
            description: "Calculated by simulating TreeMap stands in the fire and fuels extension to the forest vegetation simulator and extracting the total stand carbon from the carbon table",
            type: "eeTiles",
            url: [
                // "projects/usfs-carbon-viz-test/assets/Carbon/TM_2014_Carbon_TotalInitial"
                "projects/usfs-carbon-viz-test/assets/Carbon/TM_2014_Carbon_TotalInitial_BINNED"
            ],
            visible: false,
            group: "carbon",
            opacity: 0.9,
            placed_before: "climate_change_fire_instensity_level_1",
            legend: {
                type: 'continuous',
                title: 'Initial Forest Carbon 2014',
                unit: 'tons/acre',
                symbols: {
                    minValue: 0,
                    maxValue: 1190,
                    palette: ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
                }
            },
            eeVisParams: {
                "bands": ['b1'],
                "min": 1,
                // "max": 1190,
                // "max": 83.67,
                "max": 18,
                "palette": ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
            }
        },
        {
            id: "carbon_emission_group",
            title: "Total Forest Carbon Emissions by Flame Length 2014",
            description: "Flame Length Category",
            type: "layerGroup",
            url: [],
            visible: true,
            group: "carbon",
            opacity: 1.0,
            placed_before: "carbon_total_initial",
            groupLayers: [
                {
                    id: "carbon_emissions_byfl_1",
                    title: "< 2 feet",
                    description: "Conditional carbon emissions by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Carbon/Emissions/TM2014_Carbon_Emissions"],
                    visible: true,
                    group: "dataAset",
                    opacity: 1,
                    eeVisParams: {
                        "bands": ['b1'],
                        "min": 0,
                        "max": 9.79,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                    }
                },
                {
                    id: "carbon_emissions_byfl_2",
                    title: "2-4 feet",
                    description: "Conditional carbon emissions by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Carbon/Emissions/TM2014_Carbon_Emissions"],
                    visible: false,
                    group: "dataAset",
                    opacity: 1,
                    eeVisParams: {
                        "bands": ['b2'],
                        "min": 0,
                        "max": 11.47,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                    }
                },
                {
                    id: "carbon_emissions_byfl_3",
                    title: "4-6 feet",
                    description: "Conditional carbon emissions by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Carbon/Emissions/TM2014_Carbon_Emissions"],
                    visible: false,
                    group: "dataAset",
                    opacity: 1,
                    eeVisParams: {
                        "bands": ['b3'],
                        "min": 0,
                        "max": 13.49,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                    }
                },
                {
                    id: "carbon_emissions_byfl_4",
                    title: "6-8 feet",
                    description: "Conditional carbon emissions by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Carbon/Emissions/TM2014_Carbon_Emissions"],
                    visible: false,
                    group: "dataAset",
                    opacity: 1,
                    eeVisParams: {
                        "bands": ['b4'],
                        "min": 0,
                        "max": 14.49,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                    }
                },
                {
                    id: "carbon_emissions_byfl_5",
                    title: "8-12 feet",
                    description: "Conditional carbon emissions by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Carbon/Emissions/TM2014_Carbon_Emissions"],
                    visible: false,
                    group: "dataAset",
                    opacity: 1,
                    eeVisParams: {
                        "bands": ['b5'],
                        "min": 0,
                        "max": 17.50,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                    }
                },
                {
                    id: "carbon_emissions_byfl_6",
                    title: ">12 feet",
                    description: "Conditional carbon emissions by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Carbon/Emissions/TM2014_Carbon_Emissions"],
                    visible: false,
                    group: "dataAset",
                    opacity: 1,
                    eeVisParams: {
                        "bands": ['b6'],
                        "min": 0,
                        "max": 17.50,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                    }
                }
            ],
            activeLayerId: "carbon_emissions_byfl_1",
            legend: {
                type: 'continuous',
                title: 'Total Carbon Emissions 2014',
                unit: 'tons/acre',
                symbols: {
                    minValue: 0,
                    maxValue: 61.5,
                    palette: ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                }
            }
        },

        {
            id: "expected_annual_carbon_emissions",
            title: "Expected Annual Forest Carbon Emissions 2014",
            description: "Calculated using the expected carbon emissions framework laid out in the comparative risk assessment framework for wildland fire management (Calkin et al. 2011)",
            type: "eeTiles",
            url: [
                "projects/usfs-carbon-viz-test/assets/Carbon/Emissions/TM2014_Carbon_Emissions"
            ],
            visible: false,
            group: "carbon",
            placed_before: "carbon_emissions_byfl_1",
            opacity: 0.9,
            legend: {
                type: 'continuous',
                title: 'Expected Carbon Emissions 2014 ',
                unit: 'tons/acre',
                symbols: {
                    minValue: 0,
                    maxValue: 14,
                    palette: ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                }
            },
            eeVisParams: {
                "bands": ['b7'],
                "min": 0,
                "max": 0.0078,
                "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
            }
        },



        {
            id: "carbon_remaining_group",
            title: "Total Forest Carbon Remaining by Flame Length 2014",
            description: "Flame Length Category",
            type: "layerGroup",
            url: [],
            visible: false,
            group: "carbon",
            placed_before: "expected_annual_carbon_emissions",
            opacity: 1.0,
            groupLayers: [
                {
                    id: "carbon_remaining_byfl_1",
                    title: "< 2 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Carbon/Remaining/TM2014_Carbon_Remaining_BINNED"],
                    visible: true,
                    group: "dataAset",
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b1'],
                        "min": 0,
                        // "max": 67.69,
                        "max": 17,
                        "palette": ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
                    }
                },
                {
                    id: "carbon_remaining_byfl_2",
                    title: "2-4 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Carbon/Remaining/TM2014_Carbon_Remaining_BINNED"],
                    visible: false,
                    group: "dataAset",
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b2'],
                        "min": 0,
                        // "max": 67.76,
                        "max": 17,
                        "palette": ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
                    }
                },
                {
                    id: "carbon_remaining_byfl_3",
                    title: "4-6 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Carbon/Remaining/TM2014_Carbon_Remaining_BINNED"],
                    visible: false,
                    group: "dataAset",
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b3'],
                        "min": 0,
                        // "max": 67.77,
                        "max": 17,
                        "palette": ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
                    }
                },
                {
                    id: "carbon_remaining_byfl_4",
                    title: "6-8 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Carbon/Remaining/TM2014_Carbon_Remaining_BINNED"],
                    visible: false,
                    group: "dataAset",
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b4'],
                        "min": 0,
                        // "max": 67.68,
                        "max": 17,
                        "palette": ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
                    }
                },
                {
                    id: "carbon_remaining_byfl_5",
                    title: "8-12 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Carbon/Remaining/TM2014_Carbon_Remaining_BINNED"],
                    visible: false,
                    group: "dataAset",
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b5'],
                        "min": 0,
                        // "max": 67.31,
                        "max": 17,
                        "palette": ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
                    }
                },
                {
                    id: "carbon_remaining_byfl_6",
                    title: ">12 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Carbon/Remaining/TM2014_Carbon_Remaining_BINNED"],
                    visible: false,
                    group: "dataAset",
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b6'],
                        "min": 0,
                        // "max": 59.63,
                        "max": 18,
                        "palette": ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
                    }
                }
            ],
            activeLayerId: "carbon_remaining_byfl_1",
            legend: {
                type: 'continuous',
                title: 'Total Carbon Remaining 2014',
                unit: 'tons/acre',
                symbols: {
                    minValue: 0,
                    maxValue: 1172,
                    palette: ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
                }
            }
        },
        {
            id: "expected_carbon_remaining",
            title: "Expected Annual Forest Carbon Remaining 2014",
            description: "Calculated using the expected carbon framework laid out in the comparative risk assessment framework for wildland fire management (Calkin et al. 2011)",
            type: "eeTiles",
            url: [
                "projects/usfs-carbon-viz-test/assets/Carbon/Remaining/TM2014_Carbon_Remaining_BINNED_B7"
            ],
            visible: false,
            group: "carbon",
            opacity: 0.9,
            placed_before: "carbon_remaining_byfl_1",
            legend: {
                type: 'continuous',
                title: 'Expected Carbon Remaining 2014',
                unit: 'tons/acre',
                symbols: {
                    minValue: 0,
                    maxValue: 1190,
                    palette: ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
                }
            },
            eeVisParams: {
                "bands": ['b7'],
                // "min": 0,
                "min": 1,
                // "max": 83.67,
                "max": 18,
                "palette": ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
            }
        },


        {
            id: "carbon_market_initial",
            title: "Total Initial Standing Live and Dead Tree Carbon 2014",
            description: "Calculated by simulating TreeMap stands in the fire and fuels extension to the forest vegetation simulator and extracting the carbon estimates from four poos: aboveground total live, standing dead, aboveground dead, and belowground dead.",
            type: "eeTiles",
            url: [
                "projects/usfs-carbon-viz-backup/assets/CarbonMarket/TM2014_CarbonMarket_Initial_BINNED"
            ],
            visible: false,
            group: "carbon_market",
            opacity: 0.9,
            placed_before: "expected_carbon_remaining",
            legend: {
                type: 'continuous',
                title: 'Initial Forest Carbon 2014',
                unit: 'tons/acre',
                symbols: {
                    minValue: 0,
                    maxValue: 1161,
                    palette: ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
                }
            },
            eeVisParams: {
                "bands": ['b1'],
                // "min": 0,
                // "max": 59.61,
                "min": 0,
                "max": 18,
                "palette": ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
            }
        },
        {
            id: "carbon_market_loss",
            title: "Carbon Loss from Standing Live and Dead Trees by Flame Length 2014",
            description: "Flame Length Category",
            type: "layerGroup",
            url: [],
            visible: false,
            group: "carbon_market",
            opacity: 1.0,
            placed_before: "carbon_market_initial",
            groupLayers: [
                {
                    id: "carbon_market_emissions_byfl_1",
                    title: "< 2 feet",
                    description: "Conditional carbon emissions by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-backup/assets/CarbonMarket/Emissions/TM2014_CarbonMarket_Loss"],
                    visible: false,
                    group: "dataAset",
                    opacity: 1,
                    eeVisParams: {
                        "bands": ['b1'],
                        "min": 0,
                        "max": 0.086,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                    }
                },
                {
                    id: "carbon_market_emissions_byfl_2",
                    title: "2-4 feet",
                    description: "Conditional carbon emissions by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-backup/assets/CarbonMarket/Emissions/TM2014_CarbonMarket_Loss"],
                    visible: false,
                    group: "dataAset",
                    opacity: 1,
                    eeVisParams: {
                        "bands": ['b2'],
                        "min": 0,
                        "max": 0.53,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                    }
                },
                {
                    id: "carbon_market_emissions_byfl_3",
                    title: "4-6 feet",
                    description: "Conditional carbon emissions by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-backup/assets/CarbonMarket/Emissions/TM2014_CarbonMarket_Loss"],
                    visible: false,
                    group: "dataAset",
                    opacity: 1,
                    eeVisParams: {
                        "bands": ['b3'],
                        "min": 0,
                        "max": 1.84,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                    }
                },
                {
                    id: "carbon_market_emissions_byfl_4",
                    title: "6-8 feet",
                    description: "Conditional carbon emissions by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-backup/assets/CarbonMarket/Emissions/TM2014_CarbonMarket_Loss"],
                    visible: false,
                    group: "dataAset",
                    opacity: 1,
                    eeVisParams: {
                        "bands": ['b4'],
                        "min": 0,
                        "max": 2.72,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                    }
                },
                {
                    id: "carbon_market_emissions_byfl_5",
                    title: "8-12 feet",
                    description: "Conditional carbon emissions by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-backup/assets/CarbonMarket/Emissions/TM2014_CarbonMarket_Loss"],
                    visible: false,
                    group: "dataAset",
                    opacity: 1,
                    eeVisParams: {
                        "bands": ['b5'],
                        "min": 0,
                        "max": 3.69,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                    }
                },
                {
                    id: "carbon_market_emissions_byfl_6",
                    title: ">12 feet",
                    description: "Conditional carbon emissions by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-backup/assets/CarbonMarket/Emissions/TM2014_CarbonMarket_Loss"],
                    visible: false,
                    group: "dataAset",
                    opacity: 1,
                    eeVisParams: {
                        "bands": ['b6'],
                        "min": 0,
                        "max": 4.11,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                    }
                }
            ],
            activeLayerId: "carbon_market_emissions_byfl_1",
            legend: {
                type: 'continuous',
                title: 'Calculated by isolating the no-fire and post-fire above and belowground standing tree carbon pools.',
                unit: 'tons/acre',
                symbols: {
                    minValue: 0,
                    maxValue: 40,
                    palette: ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                }
            }
        },

        {
            id: "expected_annual_carbon_market_emissions",
            title: "Expected Annual Carbon Loss from Standing Live and Dead Trees 2014",
            description: "Calculated using the expected carbon emissions framework laid out in the comparative risk assessment framework for wildland fire management (Calkin et al. 2011)",
            type: "eeTiles",
            url: [
                "projects/usfs-carbon-viz-backup/assets/CarbonMarket/Emissions/TM2014_CarbonMarket_Loss"
            ],
            visible: false,
            group: "carbon_market",
            placed_before: "carbon_market_emissions_byfl_1",
            opacity: 0.9,
            legend: {
                type: 'continuous',
                title: 'Expected Annual Carbon Loss from Standing Live and Dead Trees 2014',
                unit: 'tons/acre',
                symbols: {
                    minValue: 0,
                    maxValue: 0.55,
                    palette: ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                }
            },
            eeVisParams: {
                "bands": ['b7'],
                "min": 0,
                "max": 0.0056,
                "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
            }
        },

        {
            id: "carbon_market_remaining_group",
            title: "Remaining Carbon from Standing Live and Dead Trees by Flame Length 2014",
            description: "Flame Length Category",
            type: "layerGroup",
            url: [],
            visible: false,
            group: "carbon_market",
            placed_before: "expected_annual_carbon_emissions",
            opacity: 1.0,
            groupLayers: [
                {
                    id: "carbon_market_remaining_byfl_1",
                    title: "< 2 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-backup/assets/CarbonMarket/Remaining/TM2014_CarbonMarket_Remaining_BINNED"],
                    visible: false,
                    group: "dataAset",
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b1'],
                        "min": 0,
                        // "max": 59.61,
                        "max": 18,
                        "palette": ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
                    }
                },
                {
                    id: "carbon_market_remaining_byfl_2",
                    title: "2-4 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-backup/assets/CarbonMarket/Remaining/TM2014_CarbonMarket_Remaining_BINNED"],
                    visible: false,
                    group: "dataAset",
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b2'],
                        "min": 0,
                        // "max": 59.62,
                        "max": 18,
                        "palette": ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
                    }
                },
                {
                    id: "carbon_market_remaining_byfl_3",
                    title: "4-6 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-backup/assets/CarbonMarket/Remaining/TM2014_CarbonMarket_Remaining_BINNED"],
                    visible: false,
                    group: "dataAset",
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b3'],
                        "min": 0,
                        // "max": 59.60,
                        "max": 18,
                        "palette": ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
                    }
                },
                {
                    id: "carbon_market_remaining_byfl_4",
                    title: "6-8 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-backup/assets/CarbonMarket/Remaining/TM2014_CarbonMarket_Remaining_BINNED"],
                    visible: false,
                    group: "dataAset",
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b4'],
                        "min": 0,
                        // "max": 59.46,
                        "max": 18,
                        "palette": ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
                    }
                },
                {
                    id: "carbon_market_remaining_byfl_5",
                    title: "8-12 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-backup/assets/CarbonMarket/Remaining/TM2014_CarbonMarket_Remaining_BINNED"],
                    visible: false,
                    group: "dataAset",
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b5'],
                        "min": 0,
                        // "max": 59.64,
                        "max": 18,
                        "palette": ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
                    }
                },
                {
                    id: "carbon_market_remaining_byfl_6",
                    title: ">12 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-backup/assets/CarbonMarket/Remaining/TM2014_CarbonMarket_Remaining_BINNED"],
                    visible: false,
                    group: "dataAset",
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b6'],
                        "min": 0,
                        // "max": 59.61,
                        "max": 18,
                        "palette": ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
                    }
                }
            ],
            activeLayerId: "carbon_market_remaining_byfl_1",
            legend: {
                type: 'continuous',
                title: 'Expected Carbon Remaining from Standing Live and Dead Trees 2014',
                unit: 'tons/acre',
                symbols: {
                    minValue: 0,
                    maxValue: 1161,
                    palette: ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
                }
            }
        },
        {
            id: "expected_carbon_market_remaining",
            title: "Expected Annual Carbon Remaining in Standing Live and Dead Trees 2014",
            description: "Calculated using the expected carbon framework laid out in the comparative risk assessment framework for wildland fire management (Calkin et al. 2011)",
            type: "eeTiles",
            url: [
                "projects/usfs-carbon-viz-backup/assets/CarbonMarket/Remaining/TM2014_CarbonMarket_Remaining_BINNED_B7"
            ],
            visible: false,
            group: "carbon_market",
            opacity: 0.9,
            placed_before: "carbon_market_remaining_byfl_1",
            legend: {
                type: 'continuous',
                title: 'Total Carbon Remaining from Standing Live and Dead Trees 2014',
                unit: 'tons/acre',
                symbols: {
                    minValue: 0,
                    maxValue: 1161,
                    palette: ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
                }
            },
            eeVisParams: {
                "bands": ['b7'],
                "min": 0,
                // "max": 59.62,
                "max": 18,
                "palette": ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
            }
        },


        {
            id: "rangeland_total_initial_carbon",
            title: "Total Initial Rangeland Carbon 2014",
            description: "This layer reflects total standing herbaceous carbon, litter, and duff in all pixels, as well as total standing shrub carbon in shrub-dominated pixels",
            type: "eeTiles",
            url: [
                "projects/usfs-carbon-viz-test/assets/Rangeland/rangeland_total_initial_carbon"
            ],
            visible: false,
            group: "rangeland",
            opacity: 0.9,
            legend: {
                type: 'continuous',
                title: 'Total Initial Rangeland Carbon 2014',
                unit: 'tons/acre',
                symbols: {
                    minValue: 0,
                    maxValue: 14.68,
                    palette: ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
                }
            },
            placed_before: "expected_carbon_market_remaining",
            eeVisParams: {
                "bands": ['b1'],
                "min": 0,
                "max": 2.34,
                "palette": ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
            }
        },
        {
            id: "rangeland_total_carbon_remaining",
            title: "Total Conditional Rangeland Carbon Remaining 2014",
            description: "Represents the total remaining rangeland carbon after burning",
            type: "eeTiles",
            url: [
                "projects/usfs-carbon-viz-test/assets/Rangeland/rangeland_total_conditional_carbon_remaining"
            ],
            visible: false,
            group: "rangeland",
            opacity: 0.9,
            legend: {
                type: 'continuous',
                title: 'Total Conditional Carbon Remaining from Rangeland 2014',
                unit: 'tons/acre',
                symbols: {
                    minValue: 0,
                    maxValue: 6.20,
                    // palette: ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
                    palette:  ['4D2610', '5A2E15', '783F1F', 'F9D395', '2B8C52', '0A449E']
                }
            },
            placed_before: "rangeland_total_initial_carbon",
            eeVisParams: {
                "bands": ['b1'],
                "min": 0,
                // "max": 0.45,
                "max": 0.95,
                // "palette": ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
                "palette":  ['4D2610', '5A2E15', '783F1F', 'F9D395', '2B8C52', '0A449E']    
            }
        },
        {
            id: "rangeland_expected_carbon_emission",
            title: "Total Conditional Rangeland Carbon Emission 2014",
            description: "Represents the total rangeland carbon emissions from burning",
            type: "eeTiles",
            url: [
                "projects/usfs-carbon-viz-test/assets/Rangeland/rangeland_total_conditional_carbon_emissions"
            ],
            visible: false,
            group: "rangeland",
            opacity: 0.9,
            legend: {
                type: 'continuous',
                title: 'Total Conditional Rangeland Carbon Emission 2014',
                unit: 'tons/acre',
                symbols: {
                    minValue: 0,
                    maxValue: 11.71,
                    palette: ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                }
            },
            placed_before: "rangeland_total_carbon_remaining",
            eeVisParams: {
                "bands": ['b1'],
                "min": 0,
                // "max": 1.91,
                "max": 1.61,
                "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
            }
        },
        {
            id: "rangeland_expected_annual",
            title: "Total Annual Expected Rangeland Carbon 2014",
            description: "Represents the total expected rangeland carbon after accounting for the amount annually lost in fire.",
            type: "eeTiles",
            url: [
                "projects/usfs-carbon-viz-test/assets/Rangeland/rangeland_annual_expected_carbon"
            ],
            visible: false,
            group: "rangeland",
            opacity: 0.9,
            legend: {
                type: 'continuous',
                title: 'Total Annual Expected Rangeland Carbon 2014',
                unit: 'tons/acre',
                symbols: {
                    minValue: 0,
                    maxValue: 14.68,
                    palette: ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
                }
            },
            placed_before: "rangeland_expected_carbon_emission",
            eeVisParams: {
                "bands": ['b1'],
                "min": 0,
                "max": 2.35,
                "palette": ['3e1f0d', '5a2e15', '783f1f', '97542b', 'b66c3b', 'd1864e', 'e6a062', 'f2ba7a', 'f9d395', 'e1e9a5', 'b4da90', '84c87c', '53b069', '2b8c52', '0a643a', '166e5c', '105a80', '0a449e']
            }
        },
        {
            id: "rangeland_expected_annual_emissions",
            title: "Total Annual Expected Rangeland Carbon Emissions 2014",
            description: "This layer was calculated by multiplying the total carbon lost from burning as simulated in SpatialFOFEM by the annual burn probability of pixels from the circa-2014 FSim simulations.",
            type: "eeTiles",
            url: [
                "projects/usfs-carbon-viz-test/assets/Rangeland/rangeland_annual_expected_carbon_emissions"
            ],
            visible: false,
            group: "rangeland",
            opacity: 0.9,
            legend: {
                type: 'continuous',
                title: 'Total Annual Expected Rangeland Carbon Emissions 2014',
                unit: 'tons/acre',
                symbols: {
                    minValue: 0,
                    maxValue: 1.11,
                    palette: ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                }
            },
            placed_before: "rangeland_total_carbon_remaining",
            eeVisParams: {
                "bands": ['b1'],
                "min": 0,
                "max": 0.011,
                "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
            }
        },
        
        // ...other layers...
    ], 
    adminModeActive: false,
};
