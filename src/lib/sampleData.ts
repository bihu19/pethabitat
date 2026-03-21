import type { Place } from "./types";
import { getCoordinates } from "./provinces";

const rawPlaces = [
  { id: "1", place_type: "Pet Hotel" as const, name: "DOG GARDEN BKK", province: "กรุงเทพฯ", google_maps_url: "https://maps.app.goo.gl/qqw91vRQUyLRXteg6", website_url: "https://www.xn--22cj8c5aib4c1c3cwei.com/", description: "โรงแรมสุนัขที่มีประสบการณ์มากกว่า 9 ปี รับฝากเลี้ยงสุนัขรายวัน-รายเดือน มีห้องแอร์ เพลย์กราวด์ บริการกรูมมิ่ง", pet_fee: "600-1000 บาท/คืน", pet_condition: "check out 12.00-18.00" },
  { id: "2", place_type: "Pet Hotel" as const, name: "THE DOG HOTEL BKK", province: "กรุงเทพฯ", google_maps_url: "https://maps.app.goo.gl/A3KxMUWQjiSed1MS9", website_url: "https://www.facebook.com/thedoghotelbkk/", description: "Dog Hotel, Swimming Pool, Grooming, Spa, Playground, Petshop", pet_fee: "300-600 บาท/คืน", pet_condition: "บริการ PET TAXI รับ-ส่ง" },
  { id: "3", place_type: "Hotel" as const, name: "ไอบิส กรุงเทพ สาทร (Ibis Bangkok Sathorn)", province: "กรุงเทพฯ", google_maps_url: "https://maps.app.goo.gl/YGyFdW2VoxeS7PgeA", website_url: "https://all.accor.com", description: "โรงแรมราคาประหยัดในย่านธุรกิจ เดินทางสะดวกด้วยรถไฟใต้ดินและรถไฟฟ้า", pet_fee: "สัตว์เลี้ยงตัวแรกไม่มีค่าใช้จ่าย ตัวที่สอง 500 บาท", pet_condition: "สูงสุด 2 ตัว น้ำหนักไม่เกิน 10 กก." },
  { id: "4", place_type: "Cafe" as const, name: "Raydus Cafe", province: "สมุทรปราการ", google_maps_url: "https://maps.app.goo.gl/zVHio5dxNh3XTkUGA", website_url: "https://www.siammandarinahotel.com/dine/raydus-cafe/", description: "คาเฟ่สเปเชียลตี้คอฟฟี่และบาร์ที่มีบรรยากาศทันสมัย เปิดทุกวัน 08:00-24:00 น. Pet Friendly Cafe", pet_fee: null, pet_condition: null, pet_friendly: "สามารถพาสัตว์เลี้ยงเข้าได้" },
  { id: "5", place_type: "Cafe" as const, name: "Laloli Cafe", province: "นนทบุรี", google_maps_url: "https://maps.app.goo.gl/3sRBeZJWmau443DN8", website_url: "https://www.facebook.com/lalolicafe", description: "คาเฟ่ธรรมชาติ มีต้นไม้สูงใหญ่ เหมาะแก่การพักผ่อนแบบปิคนิค เป็นมิตรกับสัตว์เลี้ยง", pet_fee: null, pet_condition: null, pet_friendly: "สามารถพาสัตว์เลี้ยงเข้าได้" },
  { id: "6", place_type: "Hospital" as const, name: "โรงพยาบาลสัตว์ กรุงเทพ-นครินทร์", province: "กรุงเทพฯ", google_maps_url: "https://maps.app.goo.gl/bwyqBf2Ws45bso6DA", website_url: "https://www.facebook.com/bangkoknakarinah", description: "โรงพยาบาลสัตว์กรุงเทพ-นครินทร์ (Bangkok-Nakarin Animal Hospital)", pet_fee: null, pet_condition: null },
  { id: "7", place_type: "Clinic" as const, name: "คลินิกรักษาสัตว์เพ็ททูพาร์ค", province: "กรุงเทพฯ", google_maps_url: "https://maps.app.goo.gl/evecHzzaijcNt2iZA", website_url: "https://www.facebook.com/profile.php?id=100086444796130", description: "แพคเกจทำหมันราคาสุดคุ้ม คลินิกรักษาสัตว์เพ็ท ทู พาร์ค", pet_fee: null, pet_condition: null },
  { id: "8", place_type: "Pet Supplier" as const, name: "Dogclub สาขาใกล้รร.สตรีวิทยา2", province: "กรุงเทพฯ", google_maps_url: "https://maps.app.goo.gl/vzXzq8PLEoNd7GKX9", website_url: "https://www.d2petshop.com/", description: "จำหน่ายอาหารสัตว์เลี้ยง อาบน้ำตัดขน ให้คำปรึกษาเกี่ยวกับสัตว์เลี้ยง", pet_fee: null, pet_condition: null },
  { id: "9", place_type: "Hotel" as const, name: "โบตานิค เซอร์วิซรูม อิมแพค", province: "กรุงเทพฯ", google_maps_url: "https://maps.app.goo.gl/muBhuK9m9oDDz4F77", website_url: "http://www.botanicserviceroom.com/", description: "ที่พักใกล้สนามบินดอนเมือง ห้องพักปรับอากาศทันสมัย วิวสวน", pet_fee: "500 บาท/คืน/ตัว", pet_condition: "อนุญาตสุนัขและแมว" },
  { id: "10", place_type: "Pet Supplier" as const, name: "Dream Pet Store", province: "กรุงเทพฯ", google_maps_url: "https://maps.app.goo.gl/o9W5XC3HCRMHH9ZV8", website_url: "https://www.facebook.com/p/DREAM-PET-STORE-100076904790062/", description: "จำหน่ายอาหารและอุปกรณ์สัตว์เลี้ยง", pet_fee: null, pet_condition: null },
  { id: "11", place_type: "Cafe" as const, name: "Paws & Coffee", province: "เชียงใหม่", google_maps_url: null, website_url: null, description: "คาเฟ่น่ารักสำหรับคนรักสัตว์ในเชียงใหม่", pet_fee: null, pet_condition: null, pet_friendly: "Pet Friendly" },
  { id: "12", place_type: "Hospital" as const, name: "โรงพยาบาลสัตว์ เชียงใหม่", province: "เชียงใหม่", google_maps_url: null, website_url: null, description: "โรงพยาบาลสัตว์เชียงใหม่ บริการครบวงจร", pet_fee: null, pet_condition: null },
  { id: "13", place_type: "Hotel" as const, name: "ภูเก็ต เพ็ท เฟรนด์ลี่ รีสอร์ท", province: "ภูเก็ต", google_maps_url: null, website_url: null, description: "รีสอร์ทริมทะเลภูเก็ต พาสัตว์เลี้ยงเข้าพักได้", pet_fee: "800 บาท/คืน", pet_condition: "สุนัขพันธุ์เล็ก-กลาง" },
  { id: "14", place_type: "Pet Hotel" as const, name: "ชลบุรี ด็อก เฮ้าส์", province: "ชลบุรี", google_maps_url: null, website_url: null, description: "รับฝากเลี้ยงสุนัข สระว่ายน้ำ สนามหญ้า", pet_fee: "400-700 บาท/คืน", pet_condition: null },
  { id: "15", place_type: "Cafe" as const, name: "หาดใหญ่ คาเฟ่แมว", province: "หาดใหญ่", google_maps_url: null, website_url: null, description: "คาเฟ่แมวในหาดใหญ่ มีแมวน่ารักมากมาย", pet_fee: null, pet_condition: null, pet_friendly: "Cat Cafe" },
];

export const samplePlaces: Place[] = rawPlaces.map((p, i) => {
  const [lat, lng] = getCoordinates(p.province);
  // Offset slightly so markers don't overlap
  return {
    ...p,
    cover_image: null,
    pet_friendly: (p as any).pet_friendly || null,
    latitude: lat + (Math.random() - 0.5) * 0.05,
    longitude: lng + (Math.random() - 0.5) * 0.05,
    created_at: new Date().toISOString(),
  };
});
