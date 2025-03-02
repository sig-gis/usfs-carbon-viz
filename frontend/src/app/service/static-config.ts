import { AppConfig } from './layers.interface';

export const staticConfig: AppConfig = {
    status: {
        screenLoading: true,
        loading: false,
        error: false,
    },
    highlight: [],
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
                "projects/usfs-carbon-viz-test/assets/FSIM/Burn_Probability/BP_2014"
            ],
            visible: false,
            group: "fsim",
            opacity: 0.9,
            legend: {
                type: 'continuous',
                title: 'Burn Probability 2014',
                unit: '%',
                symbols: {
                    minValue: 0,
                    maxValue: 30,
                    palette: ['fee5d9', 'fcae91', 'fb6a4a', 'de2d26', 'a50f15']
                }
            },
            placed_before: "",
            eeVisParams: {
                "bands": ['b1'],
                "min": 0,
                "max": 0.30,
                "palette": ['fee5d9', 'fcae91', 'fb6a4a', 'de2d26', 'a50f15']
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
                        "palette": ['FFFFFFFF', '990000']
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
                        "palette": ['FFFFFFFF', '990000']
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
                        "palette": ['FFFFFFFF', '990000']
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
                        "palette": ['FFFFFFFF', '990000']
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
                        "palette": ['FFFFFFFF', '990000']
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
                        "palette": ['FFFFFFFF', '990000']
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
                    palette: ['fef0d9', '990000']
                }
            }
        },

        {
            id: "climate_change_burn_probability_2014",
            title: "Projected Burn Probability circa 2047",
            description: "Projected annual burn probability for the conterminous United States, circa 2047",
            type: "eeTiles",
            url: [
                "projects/usfs-carbon-viz-test/assets/Climate_Change_FSIM/Burn_Probability/CC_BP_2040"
            ],
            visible: false,
            group: "fsim_cc",
            opacity: 0.9,
            legend: {
                type: 'continuous',
                title: 'Projected Burn Probability circa 2047',
                unit: '%',
                symbols: {
                    minValue: 0,
                    maxValue: 30,
                    palette: ['fee5d9', 'fcae91', 'fb6a4a', 'de2d26', 'a50f15']
                }
            },
            placed_before: "fire_instensity_level_1",
            eeVisParams: {
                "bands": ['b1'],
                "min": 0,
                "max": 0.30,
                "palette": ['fee5d9', 'fcae91', 'fb6a4a', 'de2d26', 'a50f15']
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
                        "palette": ['FFFFFFFF', 'fdd49e']
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
                        "palette": ['FFFFFFFF', 'fdbb84']
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
                        "palette": ['FFFFFFFF', 'fc8d59']
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
                        "palette": ['FFFFFFFF', 'ef6548']
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
                        "palette": ['FFFFFFFF', 'd7301f']
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
                        "palette": ['FFFFFFFF', '990000']
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
                    palette: ['fef0d9', 'fdd49e', 'fdbb84', 'fc8d59', 'ef6548', 'd7301f', '990000']
                }
            }
        },



        {
            id: "carbon_total_initial",
            title: "Total Initial Forest Carbon 2014",
            description: "Calculated by simulating TreeMap stands in the fire and fuels extension to the forest vegetation simulator and extracting the total stand carbon from the carbon table",
            type: "eeTiles",
            url: [
                "projects/usfs-carbon-viz-test/assets/Carbon/TM_2014_Carbon_TotalInitial"
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
                    maxValue: 200,
                    palette: ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
                }
            },
            eeVisParams: {
                "bands": ['b1'],
                "min": 0,
                "max": 200,
                "palette": ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
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
                        "max": 100,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751']
                    }
                },
                {
                    id: "carbon_emissions_byfl_2",
                    title: "2-4 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Carbon/Emissions/TM2014_Carbon_Emissions"],
                    visible: false,
                    group: "dataAset",
                    opacity: 1,
                    eeVisParams: {
                        "bands": ['b2'],
                        "min": 0,
                        "max": 100,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751']
                    }
                },
                {
                    id: "carbon_emissions_byfl_3",
                    title: "4-6 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Carbon/Emissions/TM2014_Carbon_Emissions"],
                    visible: false,
                    group: "dataAset",
                    opacity: 1,
                    eeVisParams: {
                        "bands": ['b3'],
                        "min": 0,
                        "max": 100,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751']
                    }
                },
                {
                    id: "carbon_emissions_byfl_4",
                    title: "6-8 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Carbon/Emissions/TM2014_Carbon_Emissions"],
                    visible: false,
                    group: "dataAset",
                    opacity: 1,
                    eeVisParams: {
                        "bands": ['b4'],
                        "min": 0,
                        "max": 100,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751']
                    }
                },
                {
                    id: "carbon_emissions_byfl_5",
                    title: "8-12 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Carbon/Emissions/TM2014_Carbon_Emissions"],
                    visible: false,
                    group: "dataAset",
                    opacity: 1,
                    eeVisParams: {
                        "bands": ['b5'],
                        "min": 0,
                        "max": 100,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751']
                    }
                },
                {
                    id: "carbon_emissions_byfl_6",
                    title: ">12 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Carbon/Emissions/TM2014_Carbon_Emissions"],
                    visible: false,
                    group: "dataAset",
                    opacity: 1,
                    eeVisParams: {
                        "bands": ['b6'],
                        "min": 0,
                        "max": 100,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751']
                    }
                }
            ],
            activeLayerId: "carbon_emissions_byfl_1",
            legend: {
                type: 'continuous',
                title: 'Expected Carbon Emissions 2014',
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
                title: 'Total Carbon Emissions 2014',
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
                "max": 0.2,
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
                    url: ["projects/usfs-carbon-viz-test/assets/Carbon/Remaining/TM2014_Carbon_Remaining"],
                    visible: true,
                    group: "dataAset",
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b1'],
                        "min": 0,
                        "max": 200,
                        "palette": ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
                    }
                },
                {
                    id: "carbon_remaining_byfl_2",
                    title: "2-4 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Carbon/Remaining/TM2014_Carbon_Remaining"],
                    visible: false,
                    group: "dataAset",
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b2'],
                        "min": 0,
                        "max": 200,
                        "palette": ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
                    }
                },
                {
                    id: "carbon_remaining_byfl_3",
                    title: "4-6 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Carbon/Remaining/TM2014_Carbon_Remaining"],
                    visible: false,
                    group: "dataAset",
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b3'],
                        "min": 0,
                        "max": 200,
                        "palette": ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
                    }
                },
                {
                    id: "carbon_remaining_byfl_4",
                    title: "6-8 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Carbon/Remaining/TM2014_Carbon_Remaining"],
                    visible: false,
                    group: "dataAset",
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b4'],
                        "min": 0,
                        "max": 200,
                        "palette": ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
                    }
                },
                {
                    id: "carbon_remaining_byfl_5",
                    title: "8-12 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Carbon/Remaining/TM2014_Carbon_Remaining"],
                    visible: false,
                    group: "dataAset",
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b5'],
                        "min": 0,
                        "max": 200,
                        "palette": ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
                    }
                },
                {
                    id: "carbon_remaining_byfl_6",
                    title: ">12 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-test/assets/Carbon/Remaining/TM2014_Carbon_Remaining"],
                    visible: false,
                    group: "dataAset",
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b6'],
                        "min": 0,
                        "max": 200,
                        "palette": ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
                    }
                }
            ],
            activeLayerId: "carbon_remaining_byfl_1",
            legend: {
                type: 'continuous',
                title: 'Expected Carbon Remaining 2014',
                unit: 'tons/acre',
                symbols: {
                    minValue: 0,
                    maxValue: 1172,
                    palette: ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
                }
            }
        },
        {
            id: "expected_carbon_remaining",
            title: "Expected Annual Forest Carbon Remaining 2014",
            description: "Calculated using the expected carbon framework laid out in the comparative risk assessment framework for wildland fire management (Calkin et al. 2011)",
            type: "eeTiles",
            url: [
                "projects/usfs-carbon-viz-test/assets/Carbon/Remaining/TM2014_Carbon_Remaining"
            ],
            visible: false,
            group: "carbon",
            opacity: 0.9,
            placed_before: "carbon_remaining_byfl_1",
            legend: {
                type: 'continuous',
                title: 'Total Carbon Remaining 2014',
                unit: 'tons/acre',
                symbols: {
                    minValue: 0,
                    maxValue: 1190,
                    palette: ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
                }
            },
            eeVisParams: {
                "bands": ['b7'],
                "min": 0,
                "max": 200,
                "palette": ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
            }
        },


        {
            id: "carbon_market_initial",
            title: "Total Initial Standing Live and Dead Tree Carbon 2014",
            description: "Calculated by simulating TreeMap stands in the fire and fuels extension to the forest vegetation simulator and extracting the carbon estimates from four poos: aboveground total live, standing dead, aboveground dead, and belowground dead.",
            type: "eeTiles",
            url: [
                "projects/usfs-carbon-viz-backup/assets/CarbonMarket/TM2014_CarbonMarket_Initial"
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
                    palette: ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
                }
            },
            eeVisParams: {
                "bands": ['b1'],
                "min": 0,
                "max": 200,
                "palette": ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
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
                        "max": 40,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751']
                    }
                },
                {
                    id: "carbon_market_emissions_byfl_2",
                    title: "2-4 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-backup/assets/CarbonMarket/Emissions/TM2014_CarbonMarket_Loss"],
                    visible: false,
                    group: "dataAset",
                    opacity: 1,
                    eeVisParams: {
                        "bands": ['b2'],
                        "min": 0,
                        "max": 40,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751']
                    }
                },
                {
                    id: "carbon_market_emissions_byfl_3",
                    title: "4-6 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-backup/assets/CarbonMarket/Emissions/TM2014_CarbonMarket_Loss"],
                    visible: false,
                    group: "dataAset",
                    opacity: 1,
                    eeVisParams: {
                        "bands": ['b3'],
                        "min": 0,
                        "max": 40,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751']
                    }
                },
                {
                    id: "carbon_market_emissions_byfl_4",
                    title: "6-8 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-backup/assets/CarbonMarket/Emissions/TM2014_CarbonMarket_Loss"],
                    visible: false,
                    group: "dataAset",
                    opacity: 1,
                    eeVisParams: {
                        "bands": ['b4'],
                        "min": 0,
                        "max": 40,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751']
                    }
                },
                {
                    id: "carbon_market_emissions_byfl_5",
                    title: "8-12 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-backup/assets/CarbonMarket/Emissions/TM2014_CarbonMarket_Loss"],
                    visible: false,
                    group: "dataAset",
                    opacity: 1,
                    eeVisParams: {
                        "bands": ['b5'],
                        "min": 0,
                        "max": 40,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751']
                    }
                },
                {
                    id: "carbon_market_emissions_byfl_6",
                    title: ">12 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-backup/assets/CarbonMarket/Emissions/TM2014_CarbonMarket_Loss"],
                    visible: false,
                    group: "dataAset",
                    opacity: 1,
                    eeVisParams: {
                        "bands": ['b6'],
                        "min": 0,
                        "max": 40,
                        "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751']
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
                "max": 0.55,
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
                    url: ["projects/usfs-carbon-viz-backup/assets/CarbonMarket/Remaining/TM2014_CarbonMarket_Remaining"],
                    visible: false,
                    group: "dataAset",
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b1'],
                        "min": 0,
                        "max": 1161,
                        "palette": ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
                    }
                },
                {
                    id: "carbon_market_remaining_byfl_2",
                    title: "2-4 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-backup/assets/CarbonMarket/Remaining/TM2014_CarbonMarket_Remaining"],
                    visible: false,
                    group: "dataAset",
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b2'],
                        "min": 0,
                        "max": 1161,
                        "palette": ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
                    }
                },
                {
                    id: "carbon_market_remaining_byfl_3",
                    title: "4-6 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-backup/assets/CarbonMarket/Remaining/TM2014_CarbonMarket_Remaining"],
                    visible: false,
                    group: "dataAset",
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b3'],
                        "min": 0,
                        "max": 1161,
                        "palette": ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
                    }
                },
                {
                    id: "carbon_market_remaining_byfl_4",
                    title: "6-8 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-backup/assets/CarbonMarket/Remaining/TM2014_CarbonMarket_Remaining"],
                    visible: false,
                    group: "dataAset",
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b4'],
                        "min": 0,
                        "max": 1161,
                        "palette": ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
                    }
                },
                {
                    id: "carbon_market_remaining_byfl_5",
                    title: "8-12 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-backup/assets/CarbonMarket/Remaining/TM2014_CarbonMarket_Remaining"],
                    visible: false,
                    group: "dataAset",
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b5'],
                        "min": 0,
                        "max": 1161,
                        "palette": ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
                    }
                },
                {
                    id: "carbon_market_remaining_byfl_6",
                    title: ">12 feet",
                    description: "Conditional carbon remaining by flame length",
                    type: "eeTiles",
                    url: ["projects/usfs-carbon-viz-backup/assets/CarbonMarket/Remaining/TM2014_CarbonMarket_Remaining"],
                    visible: false,
                    group: "dataAset",
                    opacity: 0.9,
                    eeVisParams: {
                        "bands": ['b6'],
                        "min": 0,
                        "max": 1161,
                        "palette": ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
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
                    palette: ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
                }
            }
        },
        {
            id: "expected_carbon_market_remaining",
            title: "Expected Annual Carbon Remaining in Standing Live and Dead Trees 2014",
            description: "Calculated using the expected carbon framework laid out in the comparative risk assessment framework for wildland fire management (Calkin et al. 2011)",
            type: "eeTiles",
            url: [
                "projects/usfs-carbon-viz-backup/assets/CarbonMarket/Remaining/TM2014_CarbonMarket_Remaining"
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
                    palette: ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
                }
            },
            eeVisParams: {
                "bands": ['b7'],
                "min": 0,
                "max": 200,
                "palette": ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
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
                    maxValue: 1,
                    palette: ['ccffcc', '99e699', '66b266', '338033', '1a661a', '004d00']
                }
            },
            placed_before: "expected_carbon_market_remaining",
            eeVisParams: {
                "bands": ['b1'],
                "min": 0,
                "max": 1,
                "palette": ['ccffcc', '99e699', '66b266', '338033', '1a661a', '004d00']
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
                    maxValue: 1,
                    palette: ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
                }
            },
            placed_before: "rangeland_total_initial_carbon",
            eeVisParams: {
                "bands": ['b1'],
                "min": 0,
                "max": 1,
                "palette": ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
            }
        },
        {
            id: "rangeland_expected_carbon_emission",
            title: "Total Conditional Rangeland Carbon Emission 2014",
            description: "Represents the total rangealnd carbon emissions from burning",
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
                    maxValue: 0.1,
                    palette: ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                }
            },
            placed_before: "rangeland_total_carbon_remaining",
            eeVisParams: {
                "bands": ['b1'],
                "min": 0,
                "max": 0.1,
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
                title: 'Total Conditional Rangeland Carbon Emission 2014',
                unit: 'tons/acre',
                symbols: {
                    minValue: 0,
                    maxValue: 0.1,
                    palette: ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                }
            },
            placed_before: "rangeland_expected_carbon_emission",
            eeVisParams: {
                "bands": ['b1'],
                "min": 0,
                "max": 0.1,
                "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
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
                title: 'Total Conditional Rangeland Carbon Emission 2014',
                unit: 'tons/acre',
                symbols: {
                    minValue: 0,
                    maxValue: 0.1,
                    palette: ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
                }
            },
            placed_before: "rangeland_expected_annual",
            eeVisParams: {
                "bands": ['b1'],
                "min": 0,
                "max": 0.1,
                "palette": ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
            }
        },

        // ...other layers...
    ]
};
