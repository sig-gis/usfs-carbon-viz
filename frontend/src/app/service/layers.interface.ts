import { GeoJsonObject } from "geojson";
import { GeoJSONFeature, Map } from "maplibre-gl";

export interface MapInterface {
    map: Map;
}
export interface LegendItem {
    value: string;
    color: string;
}

export interface Analysis {
    output: AnalisisPajak | AnalisisTataRuang | AnalisisPerizinan;
}

export interface AnalisisPajak {
    type: 'pajak';
    id: number;
    nib: string;
    penggunaan: string;
    tipeHak: string;
    kodeProduk: number;
    tahun: number;
    luas: number;
    namaPemilik: string;
    blok: number;
    pbb: number;
    znt: string;
    nilaiPajak: number;
    nomorBlok: number;
    statusBayar: boolean;
    kodeProv: number;
    kodeKabKot: number;
    kodeKec: number;
    kodeKel: number;
    Prov: number;
    KabKot: number;
    Kec: number;
    Kel: number;
    nop: number;
    lat: number;
    lon: number;
}

export interface AnalisisTataRuang {
    type: 'tataruang';
    id: number;
    landuse: string;
    namaobj: string;
    fcode_polaruang: string;
    polaruang: string;
    kategori: string;
    rules_from_itbx: string;
    lat: number;
    lon: number;
}

export interface AnalisisPerizinan {
    type: 'perizinan';
    id: number;
    nib: string;
    penggunaan: string;
    tipeHak: string;
    kodeProduk: number;
    tahun: number;
    luas: number;
    namaPemilik: string;
    blok: number;
    pbb: number;
    znt: string;
    nilaiPajak: number;
    nomorBlok: number;
    statusBayar: boolean;
    kodeProv: number;
    kodeKabKot: number;
    kodeKec: number;
    kodeKel: number;
    Prov: number;
    KabKot: number;
    Kec: number;
    Kel: number;
    nop: number;
    photo1: string;
    photo2: string;
}

export interface MapConfig {
    style: string;
    cursor: string;
    zoom: [number];
    center: [number, number];
}
export interface ConfigLayer {
    title: string;
    id: string;
    description: string;
    visible: boolean;
    type: string;
    url: string[] | any
    opacity: number;
    group?: string;
    layout?: {
        iconAllowOverlap?: boolean;
        // iconImage?: string[];
        lineJoin?: "round" | "bevel" | "miter";
        lineCap?: "round" | "butt" | "square";
    }
    style?: {
        color?: string;
        width?: number;
    };
    legend?: LegendItem[];
    placed_before?: string;
    eeVisParams?: any;
    //SEMENTAR DI BUAT OPTIONAL
}

export interface AppConfig {
    mapInterface?: MapInterface;
    mapConfig: MapConfig;
    highlight?: ConfigLayer[];
    layers: ConfigLayer[];
    analysis?: Analysis[];
}
