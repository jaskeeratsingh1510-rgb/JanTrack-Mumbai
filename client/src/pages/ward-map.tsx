import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map as MapIcon, Info, Layers, Maximize2 } from "lucide-react";

import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with bundlers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const WARD_DATA = [
  // South Mumbai (City)
  {
    id: "A",
    name: "Ward A (Colaba/Fort)",
    coords: [18.9218, 72.8347] as [number, number],
    budgetUrl: "https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Accountant%20(Finance)/Budget/Budget%20Estimate%202025-2026/9-%20Ward%20Wise%20Book%202025-26/4010%20A.pdf",
    subWards: [
      { number: "224-A", name: "Mahatma Phule Market – Churchgate – Museum – Indira Dock" },
      { number: "225-A", name: "Brabourne Stadium, Colaba Market – Gateway of India" },
      { number: "226-A", name: "Sasoon Dock, World Trade Centre, Geeta Nagar" },
      { number: "227-A", name: "R.C. Church – Colaba Dandi – Navy Nagar" }
    ]
  },
  {
    id: "B",
    name: "Ward B (Dongri/Masjid)",
    coords: [18.9568, 72.8365] as [number, number],
    budgetUrl: "https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Accountant%20(Finance)/Budget/Budget%20Estimate%202025-2026/9-%20Ward%20Wise%20Book%202025-26/4020%20B.pdf",
    subWards: [
      { number: "221-B", name: "Imamwada – Dongri" },
      { number: "222-B", name: "Bengalipura – Princess Dock" },
      { number: "223-B", name: "Musafir Khana – Victoria Docks" }
    ]
  },
  {
    id: "C",
    name: "Ward C (Bhuleshwar)",
    coords: [18.9525, 72.8258] as [number, number],
    budgetUrl: "https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Accountant%20(Finance)/Budget/Budget%20Estimate%202025-2026/9-%20Ward%20Wise%20Book%202025-26/4030%20C.pdf",
    subWards: [
      { number: "217-C", name: "Durgadevi Udyan – Madhav Baug – Bhuleshwar" },
      { number: "218-C", name: "Chandanwadi, Chirabazar, Gymkhana Vibhag" },
      { number: "219-C", name: "Mumbadevi – Mulji Jetha Market – Dhobi Talao" },
      { number: "220-C", name: "Khara Talao, Nal Talao, Ghoghari Mohalla" }
    ]
  },
  {
    id: "D",
    name: "Ward D (Grant Road)",
    coords: [18.9633, 72.8122] as [number, number],
    budgetUrl: "https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Accountant%20(Finance)/Budget/Budget%20Estimate%202025-2026/9-%20Ward%20Wise%20Book%202025-26/4040%20D.pdf",
    subWards: [
      { number: "210-D", name: "Bellasis chawls – Navjeevan Society" },
      { number: "211-D", name: "Wellington Sports Club – Bhatia Hospital" },
      { number: "212-D", name: "Mahalaxmi – Air Condition Market – Umar Park" },
      { number: "213-D", name: "Priyadarshani Park – August Kranti Maidan" },
      { number: "214-D", name: "Kamala Nehru Park – Rajbhavan" },
      { number: "215-D", name: "Prarthana Samaj – Opera House" },
      { number: "216-D", name: "Harkisandas N. Hospital – Khetwadi" }
    ]
  },
  {
    id: "E",
    name: "Ward E (Byculla)",
    coords: [18.9750, 72.8333] as [number, number],
    budgetUrl: "https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Accountant%20(Finance)/Budget/Budget%20Estimate%202025-2026/9-%20Ward%20Wise%20Book%202025-26/4050%20E.pdf",
    subWards: [
      { number: "202-E", name: "Veer Jijamata Udyan – Ghodapdeo – Mazgaon Dock (North)" },
      { number: "203-E", name: "Kasturba Hospital – India United Mills" },
      { number: "204-E", name: "Byculla Railway Station – Municipal Colony" },
      { number: "205-E", name: "Nair Hospital – Byculla Fire Brigade" },
      { number: "206-E", name: "Mazgaon Court – Madanpura" },
      { number: "207-E", name: "Anjirwadi, Dockyard – Mazgaon Dock (South)" },
      { number: "208-E", name: "Mastan Talao – J.J. Hospital – Vikrikar Bhavan" },
      { number: "209-E", name: "Kamathipura" }
    ]
  },
  {
    id: "F/N",
    name: "Ward F/North (Matunga)",
    coords: [19.0300, 72.8600] as [number, number],
    budgetUrl: "https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Accountant%20(Finance)/Budget/Budget%20Estimate%202025-2026/9-%20Ward%20Wise%20Book%202025-26/4070%20FN.pdf",
    subWards: [
      { number: "165-F/N", name: "Pratiksha Nagar, Sion" },
      { number: "166-F/N", name: "Salt Pans, Sion Transit Camp" },
      { number: "167-F/N", name: "Lokmanya Tilak Hospital – Shanmukhanand Hall" },
      { number: "168-F/N", name: "Raoli Hill" },
      { number: "169-F/N", name: "C.G.S. Colony, Sector -7" },
      { number: "170-F/N", name: "Antop Hill – C.G.S. Colony" },
      { number: "171-F/N", name: "Sangam Nagar" },
      { number: "172-F/N", name: "Korba Mithagar – Wadala Salt Pans" },
      { number: "173-F/N", name: "Lepers’ Home – B.P.T. Hospital, Colony" },
      { number: "174-F/N", name: "Hindu Colony – Parsi Colony" }
    ]
  },
  {
    id: "F/S",
    name: "Ward F/South (Parel)",
    coords: [19.0000, 72.8400] as [number, number],
    budgetUrl: "https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Accountant%20(Finance)/Budget/Budget%20Estimate%202025-2026/9-%20Ward%20Wise%20Book%202025-26/4060%20FS.pdf",
    subWards: [
      { number: "195-F/S", name: "Ranjeet Studio – Naigaon B.D.D. Chawls" },
      { number: "196-F/S", name: "Naigaum Police Ground – B.P.T. Hospital" },
      { number: "197-F/S", name: "Mahatma Gandhi Vasahat (Hospital) – Bhoiwada" },
      { number: "198-F/S", name: "India United Mills – Nare Park" },
      { number: "199-F/S", name: "K.E.M. Hospital – Raj Kamal Studio – Mahatma Gandhi Hospital" },
      { number: "200-F/S", name: "Veternary Hospital – Abhyuday Nagar" },
      { number: "201-F/S", name: "Cotton Green – Sewri Fort" }
    ]
  },
  {
    id: "G/N",
    name: "Ward G/North (Dadar)",
    coords: [19.0200, 72.8400] as [number, number],
    budgetUrl: "https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Accountant%20(Finance)/Budget/Budget%20Estimate%202025-2026/9-%20Ward%20Wise%20Book%202025-26/4090%20GN.pdf",
    subWards: [
      { number: "175-G/N", name: "Mahim Kala Killa" },
      { number: "176-G/N", name: "Dharavi Transit Camp" },
      { number: "177-G/N", name: "Kakkaiyadevi Temple (Dharavi) – Khambadevi Nagar – Mukund Nagar" },
      { number: "178-G/N", name: "Western India Tanneries" },
      { number: "179-G/N", name: "Mahim Sonapur – Labour Camp" },
      { number: "180-G/N", name: "Estrella Battery Company – Rajarshi Shahu Nagar" },
      { number: "181-G/N", name: "Mahim Creek, Mahim Police Quarters" },
      { number: "182-G/N", name: "Shitaladevi Temple – Hinduja Hospital" },
      { number: "183-G/N", name: "Ruparel College – Matunga Workshop" },
      { number: "184-G/N", name: "Kamgar Krida Kendra – Dadar Railway Station" },
      { number: "185-G/N", name: "Ravindra Natya Mandir – Shivaji Park" }
    ]
  },
  {
    id: "G/S",
    name: "Ward G/South (Worli)",
    coords: [19.0050, 72.8150] as [number, number],
    budgetUrl: "https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Accountant%20(Finance)/Budget/Budget%20Estimate%202025-2026/9-%20Ward%20Wise%20Book%202025-26/4080%20GS.pdf",
    subWards: [
      { number: "186-G/S", name: "Parel S.T. Depot – Western Railway Workshop" },
      { number: "187-G/S", name: "T.V.Centre – Prabhadevi" },
      { number: "188-G/S", name: "Worli Village" },
      { number: "189-G/S", name: "Worli dairy – Sasmira" },
      { number: "190-G/S", name: "Worli B.D.D. Chawls" },
      { number: "191-G/S", name: "Gandhi Nagar – Dawn Mill" },
      { number: "192-G/S", name: "Mahalaxmi Race Course – Nehru Tarangan" },
      { number: "193-G/S", name: "Shanti Nagar – Arthur Road Jail" },
      { number: "194-G/S", name: "Parel – B.D.D. Chawls" }
    ]
  },
  // Western Suburbs
  {
    id: "H/E",
    name: "Ward H/East (Bandra East)",
    coords: [19.0600, 72.8500] as [number, number],
    budgetUrl: "https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Accountant%20(Finance)/Budget/Budget%20Estimate%202025-2026/9-%20Ward%20Wise%20Book%202025-26/4100%20HE.pdf",
    subWards: [
      { number: "81-H/E", name: "Prabhat Colony – Anand Nagar" },
      { number: "82-H/E", name: "Vivekanand Nagar" },
      { number: "83-H/E", name: "University Campus – Dharamashi Colony" },
      { number: "84-H/E", name: "Kalina Village, Santacruz Cantonment" },
      { number: "85-H/E", name: "Bharat Nagar (E)" },
      { number: "86-H/E", name: "T.P.S. – 3 – Santacruz – Ashok Nagar" },
      { number: "87-H/E", name: "Dawari Colony – Khar Rifle Range" },
      { number: "88-H/E", name: "Teacher’s Colony – Jawahar Nagar" },
      { number: "89-H/E", name: "Govt. Colony – Bharat Nagar (W)" },
      { number: "90-H/E", name: "Bandra Terminus – Nirmal Nagar" },
      { number: "91-H/E", name: "Kherwadi" }
    ]
  },
  {
    id: "H/W",
    name: "Ward H/West (Bandra West)",
    coords: [19.0600, 72.8300] as [number, number],
    budgetUrl: "https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Accountant%20(Finance)/Budget/Budget%20Estimate%202025-2026/9-%20Ward%20Wise%20Book%202025-26/4110%20HW.pdf",
    subWards: [
      { number: "92-H/W", name: "Khira Nagar -Muktanand Park" },
      { number: "93-H/W", name: "Vitthaldas Nagar – Madhu Park (Khar West) Saraswat Colony" },
      { number: "94-H/W", name: "Khar Danda – Chuim Village" },
      { number: "95-H/W", name: "Union Park – National College" },
      { number: "96-H/W", name: "Bandra Fort – Pali Market – National Library" },
      { number: "97-H/W", name: "Lilavati Hospital – Bandra Bus Terminus" }
    ]
  },
  {
    id: "K/E",
    name: "Ward K/East (Andheri East)",
    coords: [19.1136, 72.8697] as [number, number],
    budgetUrl: "https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Accountant%20(Finance)/Budget/Budget%20Estimate%202025-2026/9-%20Ward%20Wise%20Book%202025-26/4120%20KE.pdf",
    subWards: [
      { number: "66-K/E", name: "Bandrekar Wadi – Ismail College – Natwar Nagar" },
      { number: "67-K/E", name: "Jogeshwari Caves – Majaswadi" },
      { number: "68-K/E", name: "Shivneri Vasahat – Meghwadi" },
      { number: "69-K/E", name: "Shankarwadi – Sher-E-Punjab Colony" },
      { number: "70-K/E", name: "Squatter’s Colony – Tolani College" },
      { number: "71-K/E", name: "Gundavali Gaonthan (West)" },
      { number: "72-K/E", name: "Gundavali (East) – E.S.I.S. Hospital" },
      { number: "73-K/E", name: "Veravali – M.I.D.C." },
      { number: "74-K/E", name: "Vijay Nagar – Bhavani Nagar" },
      { number: "75-K/E", name: "Sahar Airport – Maroshi Village" },
      { number: "76-K/E", name: "Chakala – Sahar Airport" },
      { number: "77-K/E", name: "Sahar Village – Baman Wada" },
      { number: "78-K/E", name: "M. V. College – Vijay Nagar – Koldongri" },
      { number: "79-K/E", name: "Tejpal Scheme – Paranjape Scheme – Vile Parle (East)" },
      { number: "80-K/E", name: "Vile Parle(E), Telephone Exchange" }
    ]
  },
  {
    id: "K/W",
    name: "Ward K/West (Andheri West)",
    coords: [19.1363, 72.8277] as [number, number],
    budgetUrl: "https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Accountant%20(Finance)/Budget/Budget%20Estimate%202025-2026/9-%20Ward%20Wise%20Book%202025-26/4130%20KW.pdf",
    subWards: [
      { number: "53-K/W", name: "Oshiwara – Bandivli (East)" },
      { number: "54-K/W", name: "Tarapore Garden – Adarsh Nagar" },
      { number: "55-K/W", name: "Swami Samarth Nagar" },
      { number: "56-K/W", name: "Versova (North)" },
      { number: "57-K/W", name: "Amboli Hill" },
      { number: "58-K/W", name: "Sahaji Raje Sports Complex – Malcolm Baug" },
      { number: "59-K/W", name: "Seven Bunglow – Versova (South)" },
      { number: "60-K/W", name: "Manish Nagar – Bhavan’s College" },
      { number: "61-K/W", name: "Gilbert Hill – Andheri Market" },
      { number: "62-K/W", name: "Lallubhai Park – Shri Ram Zarokha" },
      { number: "63-K/W", name: "Bhakti Vedanta Marg – Cooper Hospital" },
      { number: "64-K/W", name: "S.N.D.T. University Campus – Juhu Airport" },
      { number: "65-K/W", name: "Vile Parle (W) – Mithibai College" }
    ]
  },
  {
    id: "P/N",
    name: "Ward P/North (Malad West)",
    coords: [19.1828, 72.8402] as [number, number],
    budgetUrl: "https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Accountant%20(Finance)/Budget/Budget%20Estimate%202025-2026/9-%20Ward%20Wise%20Book%202025-26/4150%20PN.pdf",
    subWards: [
      { number: "29-P/N", name: "Manori – Marve Erangel – Aksa – Daravali Village – Madh Island" },
      { number: "30-P/N", name: "Valnai Village – Kharodi Village Malavani Colony" },
      { number: "31-P/N", name: "Adarsh Dugdhalaya – Evershine Nagar" },
      { number: "32-P/N", name: "Bhadaran Nagar – Mamaledar Wadi" },
      { number: "33-P/N", name: "Pushpa Park" },
      { number: "34-P/N", name: "Tanaji Nagar" },
      { number: "35-P/N", name: "Appa Pada" },
      { number: "36-P/N", name: "Malad Hill Reservoir" },
      { number: "37-P/N", name: "Muncipal colony Malad(East)" },
      { number: "38-P/N", name: "Dhanjiwadi – Narsobawadi – Kokanipada" },
      { number: "39-P/N", name: "Pimpri Pada – Pathanwadi" },
      { number: "40-P/N", name: "Raheja Complex – Dindoshi" },
      { number: "41-P/N", name: "Makrani Pada" },
      { number: "42-P/N", name: "Liberty Garden – Nadiyadwalla Colony" },
      { number: "43-P/N", name: "New Collectors Colony" },
      { number: "44-P/N", name: "New Collector Compound, M.H.B. Colony" }
    ]
  },
  {
    id: "P/S",
    name: "Ward P/South (Goregaon)",
    coords: [19.1663, 72.8526] as [number, number],
    budgetUrl: "https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Accountant%20(Finance)/Budget/Budget%20Estimate%202025-2026/9-%20Ward%20Wise%20Book%202025-26/4140%20PS.pdf",
    subWards: [
      { number: "45-P/S", name: "Sunder Nagar – Piramal Nagar" },
      { number: "46-P/S", name: "Dindoshi – Pandurangwadi" },
      { number: "47-P/S", name: "Aarey Colony (E)" },
      { number: "48-P/S", name: "Nirlon – Krushi Vidyapeeth – Jaiprakash Nagar" },
      { number: "49-P/S", name: "Unnat Nagar – Motilal Nagar No.2 & 3" },
      { number: "50-P/S", name: "Shashtri Nagar – Bangur Nagar" },
      { number: "51-P/S", name: "Motilal Nagar No.1 – B.E.S.T. Bus Depot" },
      { number: "52-P/S", name: "Siddharth Nagar – Jawahar Nagar" }
    ]
  },
  {
    id: "R/C",
    name: "Ward R/Central (Borivali)",
    coords: [19.2381, 72.8523] as [number, number],
    budgetUrl: "https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Accountant%20(Finance)/Budget/Budget%20Estimate%202025-2026/9-%20Ward%20Wise%20Book%202025-26/4180%20RC.pdf",
    subWards: [
      { number: "10-R/C", name: "Daulat Nagar, Nancy Colony" },
      { number: "11-R/C", name: "Bansi Nagar – Tata power House" },
      { number: "12-R/C", name: "Datta Pada" },
      { number: "13-R/C", name: "Rajendra Nagar, Khatav Estate" },
      { number: "14-R/C", name: "Borivali TPS 3 – Kora Kendra" },
      { number: "15-R/C", name: "Eksar – Yogi Nagar" },
      { number: "16-R/C", name: "Chikuwadi – Kanti Park" },
      { number: "17-R/C", name: "Charkop (North), M.H.B. Colony (New)" },
      { number: "8-R/C", name: "Gorai – M.H.B. Colony (Old)" },
      { number: "9-R/C", name: "Govind Nagar" }
    ]
  },
  {
    id: "R/N",
    name: "Ward R/North (Dahisar)",
    coords: [19.2575, 72.8591] as [number, number],
    budgetUrl: "https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Accountant%20(Finance)/Budget/Budget%20Estimate%202025-2026/9-%20Ward%20Wise%20Book%202025-26/4170%20RN.pdf",
    subWards: [
      { number: "1-R/N", name: "Kandarpada – I. C. Colony" },
      { number: "2-R/N", name: "Gaondevi – Dahisar (E)" },
      { number: "3-R/N", name: "Ketkipada – Shailendra Nagar" },
      { number: "4-R/N", name: "Vaishali Nagar" },
      { number: "5-R/N", name: "Ashokvan – Chintamani Nagar" },
      { number: "6-R/N", name: "Ambawadi – Ovari Pada" },
      { number: "7-R/N", name: "Mandapeshwar" }
    ]
  },
  {
    id: "R/S",
    name: "Ward R/South (Kandivali)",
    coords: [19.2045, 72.8376] as [number, number],
    budgetUrl: "https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Accountant%20(Finance)/Budget/Budget%20Estimate%202025-2026/9-%20Ward%20Wise%20Book%202025-26/4160%20RS.pdf",
    subWards: [
      { number: "18-R/S", name: "Charkop (South) – Kandivali (West)" },
      { number: "19-R/S", name: "Charkop Industrial Estate" },
      { number: "20-R/S", name: "Mahavir Nagar – Dhanukar Wadi" },
      { number: "21-R/S", name: "Narwane Sanskrutik Centre – Aarya Chanakya Nagar" },
      { number: "22-R/S", name: "Poisar Village(West) – Kandivali (East)" },
      { number: "23-R/S", name: "Poisar (East), Rajaram Nagar – Ashok Nagar" },
      { number: "24-R/S", name: "Samata Nagar – Dattani Park – Mahindra & Mahindra Company" },
      { number: "25-R/S", name: "Damupada" },
      { number: "26-R/S", name: "Vadarpada Colony – Gautam Nagar" },
      { number: "27-R/S", name: "Devji Bhimji Colony – Paras Nagar" },
      { number: "28-R/S", name: "Irani Wadi – Kandivali (W)" }
    ]
  },
  // Eastern Suburbs
  {
    id: "L",
    name: "Ward L (Kurla)",
    coords: [19.0726, 72.8805] as [number, number],
    budgetUrl: "https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Accountant%20(Finance)/Budget/Budget%20Estimate%202025-2026/9-%20Ward%20Wise%20Book%202025-26/4190%20L.pdf",
    subWards: [
      { number: "150-L", name: "Tungwa Village – Chandivali Village (West)" },
      { number: "151-L", name: "Chandivali Village (East)" },
      { number: "152-L", name: "Mohili Village" },
      { number: "153-L", name: "Kajupada Hill – Asalpha Village" },
      { number: "154-L", name: "Kamani Industries – Sakinaka" },
      { number: "155-L", name: "Jarimari" },
      { number: "156-L", name: "Home Guard Training Centre" },
      { number: "157-L", name: "Wadia Estate – Hall Village – Premier Automobiles" },
      { number: "158-L", name: "Kurla Village – Dayanand Vidyalay" },
      { number: "159-L", name: "Vinoba Bhave Nagar" },
      { number: "160-L", name: "Kurla Terminus – Kamgar Nagar" },
      { number: "161-L", name: "Shikshak Nagar" },
      { number: "162-L", name: "Nehru Nagar – Bhabha Hospital – Takiya" },
      { number: "163-L", name: "Kasai Wada – Everard Nagar" },
      { number: "164-L", name: "Swadeshi Mill- Eye Hospital" }
    ]
  },
  {
    id: "M/E",
    name: "Ward M/East (Mankhurd)",
    coords: [19.0565, 72.9174] as [number, number],
    budgetUrl: "https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Accountant%20(Finance)/Budget/Budget%20Estimate%202025-2026/9-%20Ward%20Wise%20Book%202025-26/4200%20ME.pdf",
    subWards: [
      { number: "129-M/E", name: "Lotus Colony – Rafique Nagar" },
      { number: "130-M/E", name: "Shivaji Nagar No.1" },
      { number: "131-M/E", name: "Shivaji Nagar No.2 – Sanjay Nagar" },
      { number: "132-M/E", name: "Shastri Nagar – Kamla Raman Nagar" },
      { number: "133-M/E", name: "Baiganwadi, P.M.G. Colony" },
      { number: "134-M/E", name: "Mankhurd Village – Mandala Village" },
      { number: "135-M/E", name: "Cheeta Camp" },
      { number: "136-M/E", name: "Anushakti Nagar – (B.A.R.C.) – Trombay" },
      { number: "137-M/E", name: "New Gautam Nagar" },
      { number: "138-M/E", name: "Deonar – Abattoir" },
      { number: "139-M/E", name: "Deonar Village – Mankhurd Childrens’ Home" },
      { number: "140-M/E", name: "R.C.F. Township" },
      { number: "141-M/E", name: "Adarsh Nagar – Hindustan Petroleum – Anik Village" }
    ]
  },
  {
    id: "M/W",
    name: "Ward M/West (Chembur)",
    coords: [19.0522, 72.9005] as [number, number],
    budgetUrl: "https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Accountant%20(Finance)/Budget/Budget%20Estimate%202025-2026/9-%20Ward%20Wise%20Book%202025-26/4210%20MW.pdf",
    subWards: [
      { number: "142-M/W", name: "Anik, Mahul Villages – R.C. F. Company" },
      { number: "143-M/W", name: "Suman Nagar – Sindhi Society" },
      { number: "144-M/W", name: "Siddharth Colony – Basant Park, Golf Club" },
      { number: "145-M/W", name: "Sahakar Nagar" },
      { number: "146-M/W", name: "Subhash Nagar – Beggar’s Home" },
      { number: "147-M/W", name: "Borla (Central) – Ghatla Village" },
      { number: "148-M/W", name: "Jyoti Nagar – Rahul Nagar" },
      { number: "149-M/W", name: "Tilak Nagar – Chedda Nagar" }
    ]
  },
  {
    id: "N",
    name: "Ward N (Ghatkopar)",
    coords: [19.0860, 72.9090] as [number, number],
    budgetUrl: "https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Accountant%20(Finance)/Budget/Budget%20Estimate%202025-2026/9-%20Ward%20Wise%20Book%202025-26/4220%20N.pdf",
    subWards: [
      { number: "117-N", name: "Rahul Nagar" },
      { number: "118-N", name: "Parksite Colony – Vikroli Village" },
      { number: "119-N", name: "Damodar Park – Sanghani Estate" },
      { number: "120-N", name: "Sarvodaya Hospital – Central Government Colony – Jagdusha Nagar" },
      { number: "121-N", name: "Bhim Nagar – Ram Nagar" },
      { number: "122-N", name: "Bhatwadi – Barve Nagar" },
      { number: "123-N", name: "Chirag Nagar – Narayan Nagar" },
      { number: "124-N", name: "Kirol Village – Ramji Ashar School" },
      { number: "125-N", name: "Pant Nagar" },
      { number: "126-N", name: "Ramabai Nagar" },
      { number: "127-N", name: "Garodia Nagar – Somaiya College" },
      { number: "128-N", name: "Kamraj Nagar" }
    ]
  },
  {
    id: "S",
    name: "Ward S (Bhandup)",
    coords: [19.1511, 72.9372] as [number, number],
    budgetUrl: "https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Accountant%20(Finance)/Budget/Budget%20Estimate%202025-2026/9-%20Ward%20Wise%20Book%202025-26/4230%20S.pdf",
    subWards: [
      { number: "104-S", name: "Milind Nagar – Gaondevi Hills" },
      { number: "105-S", name: "Bhandup Village" },
      { number: "106-S", name: "Gaondevi (Bhandup) – Tembipada" },
      { number: "107-S", name: "Nardas Nagar" },
      { number: "108-S", name: "Kokan Nagar – Bhattipada" },
      { number: "109-S", name: "Hanuman Nagar – Farid Nagar" },
      { number: "110-S", name: "Datar colony – C.G.S. Quarters" },
      { number: "111-S", name: "Kanjur Village" },
      { number: "112-S", name: "Kannamwar Nagar" },
      { number: "113-S", name: "Tagore Nagar" },
      { number: "114-S", name: "Hariyali Village – Godrej Colony" },
      { number: "115-S", name: "Eden Bungalows – Tirandaz Village" },
      { number: "116-S", name: "Vihar Lake – Powai Lake – Paspoli village" }
    ]
  },
  {
    id: "T",
    name: "Ward T (Mulund)",
    coords: [19.1726, 72.9565] as [number, number],
    budgetUrl: "https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Accountant%20(Finance)/Budget/Budget%20Estimate%202025-2026/9-%20Ward%20Wise%20Book%202025-26/4240%20T.pdf",
    subWards: [
      { number: "100-T", name: "Topiwala College – Gavan Pada – Mhada Colony" },
      { number: "101-T", name: "Nane Pada – Palm Acers" },
      { number: "102-T", name: "Mulund Central" },
      { number: "103-T", name: "Johnson & Johnson – Sarvodaya Nagar – Nahur Village" },
      { number: "98-T", name: "Mulund Colony – Tulsi Lake" },
      { number: "99-T", name: "Mulund Check Naka – ESIS Hospital" }
    ]
  }
];


export default function WardMap() {
  return (
    <Layout>
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-serif font-bold text-primary mb-4">BMC Ward Map</h1>
            <p className="text-lg text-muted-foreground">
              Explore Mumbai's wards and constituencies. Hover over a marker to see the ward name or click to view details.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Layers className="h-4 w-4" /> Map Layers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Ward Details</label>
                  <p className="text-[10px] text-muted-foreground mb-2">Click a ward to view official MCGM data</p>
                  <div className="grid grid-cols-4 gap-2">
                    {WARD_DATA.map((ward) => (
                      <a
                        key={ward.id}
                        href={`https://dm.mcgm.gov.in/Ward-${ward.id.replace('/', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center px-1 py-1.5 rounded-md bg-secondary/10 hover:bg-primary hover:text-primary-foreground text-xs font-medium transition-colors border border-secondary/20"
                        title={`View Data for ${ward.name}`}
                      >
                        {ward.id}
                      </a>
                    ))}
                  </div>
                </div>


                <div className="space-y-2 pt-4 border-t">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Ward Budgets (2025-26)</label>
                  <p className="text-[10px] text-muted-foreground mb-2">Access official ward-wise budget books</p>
                  <div className="grid grid-cols-4 gap-2">
                    {WARD_DATA.map((ward) => (
                      <a
                        key={ward.id}
                        href={ward.budgetUrl || "https://www.mcgm.gov.in/irj/portal/anonymous/qlBEst2526"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center px-1 py-1.5 rounded-md bg-primary/10 hover:bg-primary hover:text-primary-foreground text-[10px] font-bold transition-colors border border-primary/20"
                        title={`View 2025-26 Budget for ${ward.name}`}
                      >
                        {ward.id}
                      </a>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/5 border-secondary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Info className="h-4 w-4 text-secondary" /> Legend
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-3 h-3 rounded bg-primary"></div>
                  <span>High Spending (&gt;₹50Cr)</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-3 h-3 rounded bg-primary/60"></div>
                  <span>Mid Spending (₹20Cr - ₹50Cr)</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-3 h-3 rounded bg-primary/20"></div>
                  <span>Low Spending (&lt;₹20Cr)</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map Area */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="overflow-hidden border-primary/10 shadow-xl h-[600px] flex flex-col relative z-0">
              <MapContainer
                center={[19.0760, 72.8777]} // Centered on Mumbai
                zoom={11}
                scrollWheelZoom={false}
                className="h-full w-full"
                style={{ height: "100%", width: "100%", zIndex: 0 }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {WARD_DATA.map((ward) => (
                  <Marker key={ward.id} position={ward.coords}>
                    <Tooltip direction="top" offset={[0, -20]} opacity={1} className="min-w-[350px] max-w-[400px]">
                      <div className="p-2 space-y-2">
                        <h3 className="font-bold text-base border-b pb-1 text-primary">{ward.name}</h3>
                        <div className="max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                          <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Electoral Wards & Areas</div>
                          <ul className="space-y-2">
                            {ward.subWards.map((sub, idx) => (
                              <li key={idx} className="bg-muted/30 p-2 rounded-md text-xs">
                                <span className="font-bold text-primary block mb-0.5">{sub.number}</span>
                                <span className="text-muted-foreground">{sub.name}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Tooltip>
                  </Marker>
                ))}
              </MapContainer>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-serif">BMC Total Budget 2025-26</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-2xl font-bold">₹74,427 Cr</div>
                      <div className="text-xs text-muted-foreground">Total Budget</div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Optimal Utilization</Badge>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[44%]"></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-serif">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="text-xl font-bold">24</div>
                    <div className="text-xs text-muted-foreground">Total Wards</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="text-xl font-bold">227</div>
                    <div className="text-xs text-muted-foreground">Corporators</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
