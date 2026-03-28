export interface Province {
  th: string;
  en: string;
  coords: [number, number];
}

export const provinces: Province[] = [
  { th: "กรุงเทพมหานคร", en: "Bangkok", coords: [13.7563, 100.5018] },
  { th: "กระบี่", en: "Krabi", coords: [8.0863, 98.9063] },
  { th: "กาญจนบุรี", en: "Kanchanaburi", coords: [14.0227, 99.5328] },
  { th: "กาฬสินธุ์", en: "Kalasin", coords: [16.4315, 103.5059] },
  { th: "กำแพงเพชร", en: "Kamphaeng Phet", coords: [16.4828, 99.5226] },
  { th: "ขอนแก่น", en: "Khon Kaen", coords: [16.4322, 102.8236] },
  { th: "จันทบุรี", en: "Chanthaburi", coords: [12.6113, 102.1039] },
  { th: "ฉะเชิงเทรา", en: "Chachoengsao", coords: [13.6904, 101.0780] },
  { th: "ชลบุรี", en: "Chon Buri", coords: [13.3611, 100.9847] },
  { th: "ชัยนาท", en: "Chai Nat", coords: [15.1851, 100.1251] },
  { th: "ชัยภูมิ", en: "Chaiyaphum", coords: [15.8068, 102.0316] },
  { th: "ชุมพร", en: "Chumphon", coords: [10.4930, 99.1800] },
  { th: "เชียงราย", en: "Chiang Rai", coords: [19.9071, 99.8325] },
  { th: "เชียงใหม่", en: "Chiang Mai", coords: [18.7883, 98.9853] },
  { th: "ตรัง", en: "Trang", coords: [7.5564, 99.6114] },
  { th: "ตราด", en: "Trat", coords: [12.2428, 102.5175] },
  { th: "ตาก", en: "Tak", coords: [16.8840, 99.1259] },
  { th: "นครนายก", en: "Nakhon Nayok", coords: [14.2069, 101.2131] },
  { th: "นครปฐม", en: "Nakhon Pathom", coords: [13.8199, 100.0641] },
  { th: "นครพนม", en: "Nakhon Phanom", coords: [17.3921, 104.7695] },
  { th: "นครราชสีมา", en: "Nakhon Ratchasima", coords: [14.9799, 102.0978] },
  { th: "นครศรีธรรมราช", en: "Nakhon Si Thammarat", coords: [8.4324, 99.9631] },
  { th: "นครสวรรค์", en: "Nakhon Sawan", coords: [15.6931, 100.1225] },
  { th: "นนทบุรี", en: "Nonthaburi", coords: [13.8621, 100.5144] },
  { th: "นราธิวาส", en: "Narathiwat", coords: [6.4254, 101.8253] },
  { th: "น่าน", en: "Nan", coords: [18.7756, 100.7730] },
  { th: "บึงกาฬ", en: "Bueng Kan", coords: [18.3609, 103.6466] },
  { th: "บุรีรัมย์", en: "Buri Ram", coords: [14.9930, 103.1029] },
  { th: "ปทุมธานี", en: "Pathum Thani", coords: [14.0208, 100.5253] },
  { th: "ประจวบคีรีขันธ์", en: "Prachuap Khiri Khan", coords: [11.8126, 99.7957] },
  { th: "ปราจีนบุรี", en: "Prachin Buri", coords: [14.0509, 101.3715] },
  { th: "ปัตตานี", en: "Pattani", coords: [6.8686, 101.2508] },
  { th: "พระนครศรีอยุธยา", en: "Phra Nakhon Si Ayutthaya", coords: [14.3532, 100.5689] },
  { th: "พะเยา", en: "Phayao", coords: [19.1664, 99.9019] },
  { th: "พังงา", en: "Phang Nga", coords: [8.4508, 98.5252] },
  { th: "พัทลุง", en: "Phatthalung", coords: [7.6167, 100.0743] },
  { th: "พิจิตร", en: "Phichit", coords: [16.4413, 100.3487] },
  { th: "พิษณุโลก", en: "Phitsanulok", coords: [16.8211, 100.2659] },
  { th: "เพชรบุรี", en: "Phetchaburi", coords: [13.1119, 99.9395] },
  { th: "เพชรบูรณ์", en: "Phetchabun", coords: [16.4189, 101.1541] },
  { th: "แพร่", en: "Phrae", coords: [18.1446, 100.1413] },
  { th: "ภูเก็ต", en: "Phuket", coords: [7.8804, 98.3923] },
  { th: "มหาสารคาม", en: "Maha Sarakham", coords: [16.1847, 103.3005] },
  { th: "มุกดาหาร", en: "Mukdahan", coords: [16.5424, 104.7233] },
  { th: "แม่ฮ่องสอน", en: "Mae Hong Son", coords: [19.3020, 97.9654] },
  { th: "ยโสธร", en: "Yasothon", coords: [15.7944, 104.1451] },
  { th: "ยะลา", en: "Yala", coords: [6.5414, 101.2803] },
  { th: "ร้อยเอ็ด", en: "Roi Et", coords: [16.0538, 103.6520] },
  { th: "ระนอง", en: "Ranong", coords: [9.9528, 98.6085] },
  { th: "ระยอง", en: "Rayong", coords: [12.6814, 101.2816] },
  { th: "ราชบุรี", en: "Ratchaburi", coords: [13.5283, 99.8134] },
  { th: "ลพบุรี", en: "Lop Buri", coords: [14.7995, 100.6534] },
  { th: "ลำปาง", en: "Lampang", coords: [18.2888, 99.4909] },
  { th: "ลำพูน", en: "Lamphun", coords: [18.5744, 98.9862] },
  { th: "เลย", en: "Loei", coords: [17.4860, 101.7223] },
  { th: "ศรีสะเกษ", en: "Si Sa Ket", coords: [15.1186, 104.3220] },
  { th: "สกลนคร", en: "Sakon Nakhon", coords: [17.1545, 104.1348] },
  { th: "สงขลา", en: "Songkhla", coords: [7.1756, 100.6143] },
  { th: "สตูล", en: "Satun", coords: [6.6238, 100.0673] },
  { th: "สมุทรปราการ", en: "Samut Prakan", coords: [13.5991, 100.5998] },
  { th: "สมุทรสงคราม", en: "Samut Songkhram", coords: [13.4098, 100.0023] },
  { th: "สมุทรสาคร", en: "Samut Sakhon", coords: [13.5475, 100.2746] },
  { th: "สระแก้ว", en: "Sa Kaeo", coords: [13.8241, 102.0645] },
  { th: "สระบุรี", en: "Saraburi", coords: [14.5289, 100.9101] },
  { th: "สิงห์บุรี", en: "Sing Buri", coords: [14.8879, 100.3966] },
  { th: "สุโขทัย", en: "Sukhothai", coords: [17.0068, 99.8232] },
  { th: "สุพรรณบุรี", en: "Suphan Buri", coords: [14.4744, 100.1177] },
  { th: "สุราษฎร์ธานี", en: "Surat Thani", coords: [9.1382, 99.3217] },
  { th: "สุรินทร์", en: "Surin", coords: [14.8818, 103.4936] },
  { th: "หนองคาย", en: "Nong Khai", coords: [17.8783, 102.7420] },
  { th: "หนองบัวลำภู", en: "Nong Bua Lam Phu", coords: [17.2218, 102.4260] },
  { th: "อ่างทอง", en: "Ang Thong", coords: [14.5896, 100.4550] },
  { th: "อำนาจเจริญ", en: "Amnat Charoen", coords: [15.8656, 104.6258] },
  { th: "อุดรธานี", en: "Udon Thani", coords: [17.4156, 102.7872] },
  { th: "อุตรดิตถ์", en: "Uttaradit", coords: [17.6260, 100.0993] },
  { th: "อุทัยธานี", en: "Uthai Thani", coords: [15.3835, 100.0245] },
  { th: "อุบลราชธานี", en: "Ubon Ratchathani", coords: [15.2287, 104.8564] },
];

// Get coordinates for a province (supports both Thai and English names)
export function getProvinceCoords(name: string): [number, number] {
  const lower = name.toLowerCase();
  const match = provinces.find(
    (p) => p.th === name || p.en.toLowerCase() === lower || p.th.includes(name) || name.includes(p.th)
  );
  return match?.coords || [13.7563, 100.5018];
}

// Legacy support: get coordinates by any province string
export function getCoordinates(province: string): [number, number] {
  return getProvinceCoords(province);
}
